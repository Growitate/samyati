import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, ShieldCheck, Database, Layers, Package, FileText, CheckCircle2 } from 'lucide-react';
import { DESTINATIONS, PACKAGES } from '../data/travelData';

export default function AdminPanelModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('destinations');
  const [destinationsList, setDestinationsList] = useState(DESTINATIONS);
  const [packagesList, setPackagesList] = useState(PACKAGES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDestName, setNewDestName] = useState('');
  const [newDestCat, setNewDestCat] = useState('Domestic');

  const handleAddDestination = (e) => {
    e.preventDefault();
    if (!newDestName) return;

    const newDest = {
      id: newDestName.toLowerCase().replace(/\s+/g, '-'),
      name: newDestName,
      category: newDestCat,
      tagline: 'Custom Handpicked Destination',
      flag: newDestCat === 'Domestic' ? '🇮🇳' : '🌐',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      description: 'Newly added destination package curated for Samyati travellers.',
      packagesCount: 4
    };

    setDestinationsList([newDest, ...destinationsList]);
    setNewDestName('');
    setShowAddModal(false);
    alert(`Destination "${newDestName}" added successfully!`);
  };

  const handleDeleteDestination = (id) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      setDestinationsList(destinationsList.filter(d => d.id !== id));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Admin Header */}
        <div className="admin-header">
          <div className="admin-title-flex">
            <ShieldCheck size={24} className="text-emerald-500" />
            <div>
              <h2 className="admin-title">Samyati Admin Dashboard</h2>
              <span className="admin-subtitle">Stage 4 — Independent Destination & Package Management</span>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Top Stats Bar */}
        <div className="admin-stats-bar">
          <div className="admin-stat-card">
            <Layers size={18} className="text-amber-500" />
            <div>
              <span className="stat-label">Destinations</span>
              <strong className="stat-num">{destinationsList.length} (7 Dom + 7 Int)</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <Package size={18} className="text-emerald-500" />
            <div>
              <span className="stat-label">Total Packages</span>
              <strong className="stat-num">{packagesList.length} Packages</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <FileText size={18} className="text-rose-500" />
            <div>
              <span className="stat-label">Lead Offer Requests</span>
              <strong className="stat-num">Live Tracking Active</strong>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs-row">
          <button 
            className={`admin-tab ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <Layers size={16} />
            <span>Destinations ({destinationsList.length})</span>
          </button>

          <button 
            className={`admin-tab ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <Package size={16} />
            <span>Packages ({packagesList.length})</span>
          </button>
        </div>

        {/* Tab 1: Destination Management */}
        {activeTab === 'destinations' && (
          <div className="admin-content-section">
            <div className="table-header-flex">
              <h3 className="sub-heading">Managed Destinations</h3>
              <button onClick={() => setShowAddModal(true)} className="btn-add-sm">
                <Plus size={14} />
                <span>Add Destination</span>
              </button>
            </div>

            {showAddModal && (
              <form onSubmit={handleAddDestination} className="add-dest-form">
                <input
                  type="text"
                  placeholder="Destination Name (e.g. Sikkim)"
                  value={newDestName}
                  onChange={(e) => setNewDestName(e.target.value)}
                  className="admin-input"
                  required
                />
                <select 
                  value={newDestCat} 
                  onChange={(e) => setNewDestCat(e.target.value)}
                  className="admin-select"
                >
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
                <button type="submit" className="btn-save-sm">Save Destination</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel-sm">Cancel</button>
              </form>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Flag</th>
                    <th>Destination Name</th>
                    <th>Category</th>
                    <th>Packages</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinationsList.map((d) => (
                    <tr key={d.id}>
                      <td>{d.flag}</td>
                      <td><strong>{d.name}</strong></td>
                      <td>
                        <span className={`cat-pill ${d.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                          {d.category}
                        </span>
                      </td>
                      <td>{d.packagesCount} Packages</td>
                      <td>
                        <div className="actions-flex">
                          <button className="action-btn text-amber-600" title="Edit" onClick={() => alert(`Editing ${d.name}...`)}>
                            <Edit size={14} />
                          </button>
                          <button className="action-btn text-rose-600" title="Delete" onClick={() => handleDeleteDestination(d.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Package Management */}
        {activeTab === 'packages' && (
          <div className="admin-content-section">
            <div className="table-header-flex">
              <h3 className="sub-heading">Managed Packages (Listing, Pricing & Details)</h3>
              <button onClick={() => alert('New package modal open!')} className="btn-add-sm">
                <Plus size={14} />
                <span>Add Package</span>
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Destination</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packagesList.slice(0, 10).map((pkg) => (
                    <tr key={pkg.id}>
                      <td><strong>{pkg.title}</strong></td>
                      <td>{pkg.destinationName}</td>
                      <td>{pkg.duration}</td>
                      <td><span className="text-emerald-600 font-bold">{pkg.price}</span></td>
                      <td>⭐ {pkg.rating}</td>
                      <td>
                        <div className="actions-flex">
                          <button className="action-btn text-amber-600" onClick={() => alert(`Editing package: ${pkg.title}`)}>
                            <Edit size={14} />
                          </button>
                          <button className="action-btn text-rose-600" onClick={() => setPackagesList(packagesList.filter(p => p.id !== pkg.id))}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="admin-note">* Showing top 10 of {packagesList.length} total active packages in backend store.</p>
            </div>
          </div>
        )}

        <div className="admin-modal-footer">
          <button onClick={onClose} className="btn-pill btn-pill-dark">Close Admin Dashboard</button>
        </div>
      </div>

      <style>{`
        .admin-modal {
          max-width: 800px;
          padding: 30px;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .admin-title-flex {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .admin-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-dark);
        }

        .admin-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }

        .admin-stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-stat-card {
          background: var(--bg-card);
          padding: 14px 18px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          display: block;
        }

        .stat-num {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .admin-tabs-row {
          display: flex;
          gap: 10px;
          border-bottom: 2px solid var(--border-light);
          margin-bottom: 20px;
        }

        .admin-tab {
          border: none;
          background: transparent;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
        }

        .admin-tab.active {
          color: var(--text-dark);
          border-bottom-color: var(--text-dark);
        }

        .table-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .sub-heading {
          font-size: 16px;
          font-weight: 700;
        }

        .btn-add-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--text-dark);
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .add-dest-form {
          display: flex;
          gap: 10px;
          background: var(--bg-pale-yellow);
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .admin-input, .admin-select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 13px;
        }

        .btn-save-sm {
          background: #10b981;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cancel-sm {
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .admin-table-wrapper {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .admin-table th, .admin-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-light);
          text-align: left;
        }

        .cat-pill {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .cat-dom { background: #dbeafe; color: #1e40af; }
        .cat-int { background: #fce7f3; color: #9d174d; }

        .actions-flex {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .admin-note {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 10px;
        }

        .admin-modal-footer {
          margin-top: 24px;
          text-align: right;
        }

        @media (max-width: 600px) {
          .admin-stats-bar { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
