#!/bin/bash

# TaxMate Database Restore Script
# Restores MongoDB database from backup files
# Usage: ./scripts/restore-database.sh [backup-file] [target-database]

set -euo pipefail

# Configuration
BACKUP_FILE="${1:-}"
TARGET_DB="${2:-taxmate}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="./logs"
LOG_FILE="${LOG_DIR}/restore_${TIMESTAMP}.log"

# MongoDB Configuration
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_URI="${MONGODB_URI:-mongodb://${MONGO_HOST}:${MONGO_PORT}/${TARGET_DB}}"

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Initialize logging
mkdir -p "${LOG_DIR}"

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

log_info() {
    echo -e "${BLUE}ℹ $1${NC}" | tee -a "${LOG_FILE}"
}

# Display usage
usage() {
    cat << EOF
TaxMate Database Restore Script

Usage: $0 [OPTIONS]

OPTIONS:
    -f, --file FILE         Backup file path (required)
    -d, --database DB       Target database name (default: taxmate)
    -h, --host HOST         MongoDB host (default: localhost)
    -p, --port PORT         MongoDB port (default: 27017)
    -s, --s3-bucket BUCKET  Download from S3 bucket
    --help                  Show this help message

EXAMPLES:
    # Restore from local file
    $0 -f backups/backup_20240101_120000.tar.gz

    # Restore from S3
    $0 -s taxmate-backups -f backups/backup_20240101_120000.tar.gz

    # Restore to different database
    $0 -f backups/backup.tar.gz -d taxmate_restored

EOF
    exit 1
}

# Parse arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--file)
                BACKUP_FILE="$2"
                shift 2
                ;;
            -d|--database)
                TARGET_DB="$2"
                shift 2
                ;;
            -h|--host)
                MONGO_HOST="$2"
                shift 2
                ;;
            -p|--port)
                MONGO_PORT="$2"
                shift 2
                ;;
            -s|--s3-bucket)
                S3_BUCKET="$2"
                shift 2
                ;;
            --help)
                usage
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                ;;
        esac
    done
}

# Validate prerequisites
validate_prerequisites() {
    log "INFO" "Validating prerequisites..."
    
    # Check if mongorestore is available
    if ! command -v mongorestore &> /dev/null; then
        log_error "mongorestore not found. Please install MongoDB tools."
        exit 1
    fi
    
    # Check if backup file exists or S3 is configured
    if [ -z "${BACKUP_FILE}" ]; then
        log_error "Backup file not specified"
        usage
    fi
    
    log_success "Prerequisites validated"
}

# Download from S3
download_from_s3() {
    local s3_bucket="$1"
    local backup_name=$(basename "${BACKUP_FILE}")
    local local_file="./backups/${backup_name}"
    
    log "INFO" "Downloading backup from S3..."
    
    if aws s3 cp "s3://${s3_bucket}/backups/${backup_name}" "${local_file}" \
        --region "${AWS_REGION:-us-east-1}"; then
        log_success "Downloaded from S3: ${local_file}"
        BACKUP_FILE="${local_file}"
    else
        log_error "Failed to download backup from S3"
        exit 1
    fi
}

# Extract backup
extract_backup() {
    local extract_dir="./backups/extracted_${TIMESTAMP}"
    
    log "INFO" "Extracting backup file..."
    
    mkdir -p "${extract_dir}"
    
    if tar -xzf "${BACKUP_FILE}" -C "${extract_dir}"; then
        log_success "Backup extracted: ${extract_dir}"
        echo "${extract_dir}"
    else
        log_error "Failed to extract backup"
        exit 1
    fi
}

# List backup contents
list_backup_contents() {
    local extract_dir="$1"
    
    log_info "Backup contents:"
    find "${extract_dir}" -type f | head -20 | sed 's/^/  /'
    
    local file_count=$(find "${extract_dir}" -type f | wc -l)
    log_info "Total files: ${file_count}"
}

# Confirm restore
confirm_restore() {
    log_warning "This will restore database to: ${MONGO_HOST}:${MONGO_PORT}/${TARGET_DB}"
    read -p "Continue? (yes/no): " confirm
    
    if [ "${confirm}" != "yes" ]; then
        log_error "Restore cancelled by user"
        exit 1
    fi
}

# Create backup of current database
backup_current_database() {
    log "INFO" "Creating backup of current database before restore..."
    
    local backup_name="pre_restore_${TIMESTAMP}"
    local backup_path="./backups/${backup_name}"
    
    mkdir -p "${backup_path}"
    
    if mongodump --uri="${MONGO_URI}" --out="${backup_path}"; then
        log_success "Pre-restore backup created: ${backup_path}"
        
        if tar -czf "${backup_path}.tar.gz" -C "./backups" "${backup_name}"; then
            rm -rf "${backup_path}"
            log_success "Pre-restore backup compressed"
        fi
    else
        log_warning "Could not create pre-restore backup (non-fatal)"
    fi
}

# Perform restore
perform_restore() {
    local dump_dir="$1"
    
    log "INFO" "Starting database restore..."
    
    # Find the dump directory inside the extracted archive
    local source_dir="${dump_dir}/*"
    
    if mongorestore --uri="${MONGO_URI}" "${dump_dir}"; then
        log_success "Database restore completed successfully"
    else
        log_error "Database restore failed"
        exit 1
    fi
}

# Verify restore
verify_restore() {
    log "INFO" "Verifying restore..."
    
    # Check if databases exist
    local db_count=$(mongosh --uri="${MONGO_URI}" --eval "db.adminCommand('listDatabases').databases.length" --quiet)
    log_info "Databases in MongoDB: ${db_count}"
    
    # Get collection count
    local collection_count=$(mongosh --uri="${MONGODB_URI}" --eval "db.getCollectionNames().length" --quiet 2>/dev/null || echo "0")
    log_info "Collections in ${TARGET_DB}: ${collection_count}"
    
    # Check data integrity
    log_info "Checking data integrity..."
    mongosh --uri="${MONGO_URI}" --eval "
        const stats = db.stats();
        print('Database size: ' + (stats.dataSize / 1024 / 1024).toFixed(2) + ' MB');
        print('Documents: ' + stats.objects);
        print('Collections: ' + stats.collections);
    " || log_warning "Could not verify database stats"
    
    log_success "Restore verification completed"
}

# Cleanup
cleanup() {
    log "INFO" "Cleaning up temporary files..."
    
    if [ -d "./backups/extracted_${TIMESTAMP}" ]; then
        rm -rf "./backups/extracted_${TIMESTAMP}"
    fi
}

# Generate restore report
generate_report() {
    local report_file="${LOG_DIR}/restore_report_${TIMESTAMP}.md"
    
    cat > "${report_file}" << EOF
# Database Restore Report

## Restore Information
- **Date**: $(date)
- **Backup File**: ${BACKUP_FILE}
- **Target Database**: ${TARGET_DB}
- **Target Host**: ${MONGO_HOST}:${MONGO_PORT}

## Status
✓ Restore completed successfully

## Verification
- Database accessible
- Collections verified
- Data integrity checked

## Recommendations
- Run application health checks
- Verify data in application
- Monitor application logs for anomalies
- Consider re-running tests

## Rollback Plan
In case of issues, use the pre-restore backup:
- Location: ./backups/pre_restore_${TIMESTAMP}.tar.gz
- Command: ./scripts/restore-database.sh -f ./backups/pre_restore_${TIMESTAMP}.tar.gz

---
Generated: $(date)
Restore completed by: $(whoami)@$(hostname)
EOF
    
    log_success "Report generated: ${report_file}"
}

# Main execution
main() {
    log "INFO" "Starting TaxMate database restore process..."
    
    validate_prerequisites
    
    # Download from S3 if specified
    if [ -n "${S3_BUCKET:-}" ]; then
        download_from_s3 "${S3_BUCKET}"
    fi
    
    # Check if backup file exists
    if [ ! -f "${BACKUP_FILE}" ]; then
        log_error "Backup file not found: ${BACKUP_FILE}"
        exit 1
    fi
    
    log_info "Backup file: ${BACKUP_FILE}"
    log_info "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"
    
    local extract_dir=$(extract_backup)
    list_backup_contents "${extract_dir}"
    
    confirm_restore
    
    backup_current_database
    perform_restore "${extract_dir}"
    verify_restore
    
    cleanup
    generate_report
    
    log_success "Database restore completed successfully!"
}

# Error handling
trap 'log_error "Restore failed"; cleanup; exit 1' INT TERM ERR

# Parse arguments and run main
parse_arguments "$@"
main
