import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClientDashboard.css';

/**
 * Client Dashboard Component
 * For CAs to manage clients and their tax reports
 */
const ClientDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    panNumber: '',
    businessType: 'Salaried',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Fetch clients on component mount
   */
  useEffect(() => {
    fetchClients();
  }, [filterStatus]);

  /**
   * Fetch clients from backend
   */
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/clients', {
        params: {
          status: filterStatus,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle add/edit client form submission
   */
  const handleSubmitClient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      let response;
      if (editMode && selectedClient) {
        response = await axios.put(`/api/clients/${selectedClient._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post('/api/clients', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        setSuccess(editMode ? 'Client updated successfully' : 'Client created successfully');
        setShowAddModal(false);
        setEditMode(false);
        resetForm();
        fetchClients();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save client');
    }
  };

  /**
   * Delete client
   */
  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await axios.delete(`/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.data.success) {
        setSuccess('Client deleted successfully');
        fetchClients();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete client');
    }
  };

  /**
   * Open edit modal
   */
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormData({
      clientName: client.clientName,
      email: client.email,
      phone: client.phone || '',
      panNumber: client.panNumber || '',
      businessType: client.businessType,
      notes: client.notes || '',
    });
    setEditMode(true);
    setShowAddModal(true);
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      panNumber: '',
      businessType: 'Salaried',
      notes: '',
    });
    setSelectedClient(null);
  };

  /**
   * Clear messages after 3 seconds
   */
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="client-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📋 Client Management Dashboard</h1>
        <p>Manage your clients and their tax calculations</p>
      </div>

      {/* Messages */}
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {/* Controls */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search clients by name, email, or PAN"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchClients} className="search-btn">
            🔍 Search
          </button>
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="active">Active Clients</option>
            <option value="inactive">Inactive Clients</option>
            <option value="archived">Archived Clients</option>
          </select>
        </div>

        <button onClick={() => {
          resetForm();
          setEditMode(false);
          setShowAddModal(true);
        }} className="btn btn-primary">
          ➕ Add New Client
        </button>
      </div>

      {/* Clients List */}
      <div className="clients-container">
        {loading ? (
          <div className="loading">
            <p>Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <p>No clients found</p>
            <button onClick={() => setShowAddModal(true)} className="btn btn-secondary">
              Create your first client
            </button>
          </div>
        ) : (
          <div className="clients-grid">
            {clients.map((client) => (
              <div key={client._id} className="client-card">
                <div className="client-header">
                  <h3>{client.clientName}</h3>
                  <span className={`status-badge ${client.status}`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </div>

                <div className="client-details">
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{client.phone}</span>
                    </div>
                  )}
                  {client.panNumber && (
                    <div className="detail-row">
                      <span className="label">PAN:</span>
                      <span className="value">{client.panNumber}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Business Type:</span>
                    <span className="value">{client.businessType}</span>
                  </div>
                </div>

                {client.calculations && client.calculations.length > 0 && (
                  <div className="calculations-info">
                    📊 {client.calculations.length} calculation(s)
                  </div>
                )}

                <div className="client-actions">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editMode ? '✏️ Edit Client' : '➕ Add New Client'}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClient} className="client-form">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })
                  }
                  className="form-input"
                  placeholder="e.g., ABCDE1234F"
                />
              </div>

              <div className="form-group">
                <label>Business Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                  className="form-input"
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Business">Business</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  rows="3"
                  placeholder="Add any notes about the client..."
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update Client' : 'Create Client'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
