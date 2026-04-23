#!/bin/bash

# TaxMate Database Backup Script
# Creates automated backups of MongoDB database to AWS S3
# Usage: ./scripts/backup-database.sh [backup-type] [retention-days]

set -euo pipefail

# Configuration
BACKUP_TYPE="${1:-full}"  # full, incremental, or daily
RETENTION_DAYS="${2:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
LOG_DIR="./logs"
LOG_FILE="${LOG_DIR}/backup_${TIMESTAMP}.log"

# MongoDB Configuration
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_DB="${MONGO_DB:-taxmate}"
MONGO_URI="${MONGODB_URI:-mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}}"

# AWS S3 Configuration
AWS_BUCKET="${AWS_BACKUP_BUCKET:-taxmate-backups}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCESS_KEY="${AWS_ACCESS_KEY_ID:-}"
AWS_SECRET_KEY="${AWS_SECRET_ACCESS_KEY:-}"

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize logging
mkdir -p "${BACKUP_DIR}" "${LOG_DIR}"

log() {
    local level="$1"
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}" | tee -a "${LOG_FILE}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}" | tee -a "${LOG_FILE}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}" | tee -a "${LOG_FILE}"
}

# Validate prerequisites
validate_prerequisites() {
    log "INFO" "Validating prerequisites..."
    
    # Check if mongodump is available
    if ! command -v mongodump &> /dev/null; then
        log_error "mongodump not found. Please install MongoDB tools."
        exit 1
    fi
    
    # Check MongoDB connection
    if ! mongosh --eval "db.adminCommand('ping')" "${MONGO_URI}" &> /dev/null; then
        log_error "Cannot connect to MongoDB at ${MONGO_HOST}:${MONGO_PORT}"
        exit 1
    fi
    
    log_success "Prerequisites validated"
}

# Create backup
create_backup() {
    local backup_name="${BACKUP_TYPE}_${TIMESTAMP}"
    local backup_path="${BACKUP_DIR}/${backup_name}"
    
    log "INFO" "Creating ${BACKUP_TYPE} backup: ${backup_name}"
    
    # Create dump directory
    mkdir -p "${backup_path}"
    
    # Perform mongodump
    if mongodump --uri="${MONGO_URI}" --out="${backup_path}" 2>&1 | tee -a "${LOG_FILE}"; then
        log_success "Database backup created: ${backup_path}"
        
        # Get backup size
        local backup_size=$(du -sh "${backup_path}" | cut -f1)
        log "INFO" "Backup size: ${backup_size}"
        
        # Create backup metadata
        create_backup_metadata "${backup_path}" "${backup_name}" "${backup_size}"
        
        echo "${backup_path}"
    else
        log_error "Failed to create database backup"
        exit 1
    fi
}

# Create backup metadata
create_backup_metadata() {
    local backup_path="$1"
    local backup_name="$2"
    local backup_size="$3"
    local metadata_file="${backup_path}.metadata.json"
    
    cat > "${metadata_file}" << EOF
{
  "backup_name": "${backup_name}",
  "backup_type": "${BACKUP_TYPE}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "database": "${MONGO_DB}",
  "host": "${MONGO_HOST}",
  "port": "${MONGO_PORT}",
  "backup_size": "${backup_size}",
  "hostname": "$(hostname)",
  "user": "$(whoami)"
}
EOF
    
    log "INFO" "Metadata saved: ${metadata_file}"
}

# Compress backup
compress_backup() {
    local backup_path="$1"
    local backup_name=$(basename "${backup_path}")
    local compressed_file="${BACKUP_DIR}/${backup_name}.tar.gz"
    
    log "INFO" "Compressing backup..."
    
    if tar -czf "${compressed_file}" -C "${BACKUP_DIR}" "${backup_name}" 2>&1 | tee -a "${LOG_FILE}"; then
        log_success "Backup compressed: ${compressed_file}"
        
        # Remove uncompressed backup
        rm -rf "${backup_path}"
        
        echo "${compressed_file}"
    else
        log_error "Failed to compress backup"
        exit 1
    fi
}

# Upload to S3
upload_to_s3() {
    local file_path="$1"
    local file_name=$(basename "${file_path}")
    
    if [ -z "${AWS_ACCESS_KEY}" ] || [ -z "${AWS_SECRET_KEY}" ]; then
        log_warning "AWS credentials not configured. Skipping S3 upload."
        return 0
    fi
    
    log "INFO" "Uploading backup to S3: s3://${AWS_BUCKET}/${file_name}"
    
    # Configure AWS CLI
    export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY}"
    export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_KEY}"
    
    if aws s3 cp "${file_path}" "s3://${AWS_BUCKET}/backups/${file_name}" \
        --region "${AWS_REGION}" \
        --storage-class GLACIER \
        --metadata "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ),database=${MONGO_DB}" \
        2>&1 | tee -a "${LOG_FILE}"; then
        log_success "Backup uploaded to S3"
    else
        log_error "Failed to upload backup to S3"
        return 1
    fi
}

# Clean up old backups
cleanup_old_backups() {
    log "INFO" "Cleaning up backups older than ${RETENTION_DAYS} days..."
    
    # Remove local old backups
    find "${BACKUP_DIR}" -name "*.tar.gz" -type f -mtime +${RETENTION_DAYS} -exec rm {} \; 2>/dev/null || true
    find "${BACKUP_DIR}" -name "*.metadata.json" -type f -mtime +${RETENTION_DAYS} -exec rm {} \; 2>/dev/null || true
    
    # Remove S3 old backups if AWS is configured
    if [ -n "${AWS_ACCESS_KEY}" ] && [ -n "${AWS_SECRET_KEY}" ]; then
        export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY}"
        export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_KEY}"
        
        aws s3 ls "s3://${AWS_BUCKET}/backups/" --region "${AWS_REGION}" | \
        while read -r date time size filename; do
            file_date=$(date -d "${date}" +%s)
            cutoff_date=$(date -d "${RETENTION_DAYS} days ago" +%s)
            
            if [ "${file_date}" -lt "${cutoff_date}" ]; then
                aws s3 rm "s3://${AWS_BUCKET}/backups/${filename}" --region "${AWS_REGION}" 2>/dev/null || true
            fi
        done
    fi
    
    log_success "Old backups cleaned up"
}

# Generate backup report
generate_report() {
    local report_file="${LOG_DIR}/backup_report_${TIMESTAMP}.md"
    
    cat > "${report_file}" << EOF
# Database Backup Report

## Backup Information
- **Date**: $(date)
- **Backup Type**: ${BACKUP_TYPE}
- **Database**: ${MONGO_DB}
- **Host**: ${MONGO_HOST}:${MONGO_PORT}
- **Retention**: ${RETENTION_DAYS} days

## Status
✓ Backup completed successfully

## Backups
$(ls -lh ${BACKUP_DIR}/*.tar.gz 2>/dev/null | awk '{print "- " $9 " (" $5 ")"}')

## Next Steps
- Monitor S3 storage
- Test restore procedures monthly
- Review retention policies quarterly

---
Generated: $(date)
EOF
    
    log_success "Report generated: ${report_file}"
}

# Main execution
main() {
    log "INFO" "Starting TaxMate database backup process..."
    log "INFO" "Backup Type: ${BACKUP_TYPE}"
    log "INFO" "Retention: ${RETENTION_DAYS} days"
    
    validate_prerequisites
    
    local backup_path=$(create_backup)
    local compressed_file=$(compress_backup "${backup_path}")
    
    upload_to_s3 "${compressed_file}"
    cleanup_old_backups
    generate_report
    
    log_success "Backup process completed successfully!"
    log "INFO" "Backup location: ${compressed_file}"
}

# Error handling
trap 'log_error "Script interrupted"; exit 1' INT TERM

main "$@"
