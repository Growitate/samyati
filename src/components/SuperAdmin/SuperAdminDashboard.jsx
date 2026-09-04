import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Package,
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Download,
  Upload,
  LogOut,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  AlertTriangle,
  Star,
  Clock,
  Sparkles,
  ArrowUpDown,
  FileJson
} from 'lucide-react';
import { usePackages } from '../../context/PackageContext';
import { ADMIN_STORAGE_KEYS } from '../../config/adminConfig';
import PackageEditorModal from './PackageEditorModal';
import PackagePreviewModal from './PackagePreviewModal';

export default function SuperAdminDashboard({ onLogout, onNavigateToSite }) {
  const {
    packages,
    destinations,
    lastSync,
    loading,
    updatePackage,
    createPackage,
    deletePackage,
    syncWithCode,
    resetToDefault,
    refreshPackages
  } = usePackages();

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'title-asc' | 'price-asc' | 'price-desc' | 'rating-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [editingPackage, setEditingPackage] = useState(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [previewingPackage, setPreviewingPackage] = useState(null);
  const [deleteConfirmPkg, setDeleteConfirmPkg] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to parse price number from string like '₹18,500'
  const parsePriceNum = (priceStr) => {
    if (!priceStr) return 0;
    const num = String(priceStr).replace(/[^0-9]/g, '');
    return num ? parseInt(num, 10) : 0;
  };

  // Filtered and Sorted Packages
  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (pkg.title || '').toLowerCase().includes(q);
          const matchDest = (pkg.destinationName || '').toLowerCase().includes(q);
          const matchId = (pkg.id || '').toLowerCase().includes(q);
          const matchDesc = (pkg.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDest && !matchId && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && pkg.category !== selectedCategory) {
          return false;
        }

        // Destination filter
        if (selectedDestination !== 'All') {
          const pDestId = (pkg.destinationId || '').toLowerCase().replace(/\s+/g, '-');
          const pDestName = (pkg.destinationName || '').toLowerCase().replace(/\s+/g, '-');
          const target = selectedDestination.toLowerCase().replace(/\s+/g, '-');
          if (pDestId !== target && pDestName !== target) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
        if (sortBy === 'title-desc') return (b.title || '').localeCompare(a.title || '');
        if (sortBy === 'price-asc') return parsePriceNum(a.price) - parsePriceNum(b.price);
        if (sortBy === 'price-desc') return parsePriceNum(b.price) - parsePriceNum(a.price);
        if (sortBy === 'rating-desc') return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
        return 0;
      });
  }, [packages, searchQuery, selectedCategory, selectedDestination, sortBy]);

  // Metrics calculations
  const domesticCount = useMemo(() => packages.filter(p => p.category === 'Domestic').length, [packages]);
  const internationalCount = useMemo(() => packages.filter(p => p.category === 'International').length, [packages]);
  const avgPrice = useMemo(() => {
    if (!packages.length) return '₹0';
    const sum = packages.reduce((acc, p) => acc + parsePriceNum(p.price), 0);
    return `₹${Math.round(sum / packages.length).toLocaleString('en-IN')}`;
  }, [packages]);

  // Handlers
  const handleOpenNew = () => {
    setEditingPackage(null);
    setIsNewPackage(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setIsNewPackage(false);
    setIsEditorOpen(true);
  };

  const handleClonePackage = async (pkg) => {
    try {
      const cloned = {
        ...pkg,
        id: `pkg-${Date.now().toString(36)}`,
        title: `${pkg.title} (Copy)`,
        _createdAt: new Date().toISOString()
      };
      await createPackage(cloned);
      showToast(`Cloned package "${cloned.title}" saved to file database.`);
    } catch (err) {
      showToast(`Clone failed: ${err.message}`, 'error');
    }
  };

  const handleSavePackage = async (data, isNew) => {
    try {
      if (isNew) {
        await createPackage(data);
        showToast(`Created new package "${data.title}" successfully!`);
      } else {
        await updatePackage(data.id, data);
        showToast(`Updated package "${data.title}" in file database.`);
      }
      setIsEditorOpen(false);
    } catch (err) {
      showToast(`Save failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmPkg) return;
    try {
      await deletePackage(deleteConfirmPkg.id);
      showToast(`Deleted package "${deleteConfirmPkg.title}" from file database.`);
      setDeleteConfirmPkg(null);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const handleSyncWithCode = async () => {
    try {
      const res = await syncWithCode();
      showToast(res.message || 'Synchronized database with code packages.');
    } catch (err) {
      showToast(`Sync failed: ${err.message}`, 'error');
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify({ packages, destinations, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `samyati-packages-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Database JSON exported successfully.');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.packages)) {
          for (const pkg of parsed.packages) {
            await createPackage(pkg);
          }
          showToast(`Imported ${parsed.packages.length} packages into database.`);
        } else {
          showToast('Invalid backup JSON format.', 'error');
        }
      } catch (err) {
        showToast(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="super-admin-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast toast-${toast.type}`}>
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Main Navigation Header */}
      <header className="super-admin-header">
        <div className="header-brand-flex">
          <div className="brand-shield-icon">
            <ShieldCheck size={26} className="text-gold" />
          </div>
          <div>
            <div className="header-brand-title">
              <span>Samyati Super Admin Vault</span>
              <span className="db-status-pill">
                <span className="live-dot"></span>
                <span>File DB: <code>server/data/packages.json</code></span>
              </span>
            </div>
            <span className="header-subtitle">
              Central Package & Pricing Control Engine • Auto-Seeding & Sync Active
            </span>
          </div>
        </div>

        <div className="header-action-group">
          <button
            onClick={handleSyncWithCode}
            className="btn-header-action"
            title="Auto-merge any new packages added to code"
          >
            <RefreshCw size={14} />
            <span>Sync with Code</span>
          </button>

          <button
            onClick={handleExportJson}
            className="btn-header-action"
            title="Download full database JSON backup"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>

          <label className="btn-header-action cursor-pointer" title="Import JSON packages">
            <Upload size={14} />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              style={{ display: 'none' }}
            />
          </label>

          <button
            onClick={onNavigateToSite}
            className="btn-header-action btn-site-view"
          >
            <ExternalLink size={14} />
            <span>View Public Site</span>
          </button>

          <button
            onClick={onLogout}
            className="btn-header-action btn-logout"
            title="End Vault Session"
          >
            <LogOut size={14} />
            <span>Exit Vault</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="super-admin-main container-fluid">
        {/* Top Stats Row */}
        <section className="admin-metrics-row">
          <div className="metric-card">
            <div className="metric-icon-wrap icon-amber">
              <Package size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Managed Packages</span>
              <div className="metric-value-flex">
                <strong className="metric-number">{packages.length}</strong>
                <span className="metric-badge">
                  {domesticCount} Desh • {internationalCount} Videsh
                </span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-blue">
              <Layers size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Covered Destinations</span>
              <div className="metric-value-flex">
                <strong className="metric-number">{destinations.length}</strong>
                <span className="metric-subtext">Active Regions</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-emerald">
              <Sparkles size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Average Package Price</span>
              <div className="metric-value-flex">
                <strong className="metric-number text-emerald-400">{avgPrice}</strong>
                <span className="metric-subtext">Across all tours</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-purple">
              <FileJson size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">File Database Sync</span>
              <div className="metric-value-flex">
                <strong className="metric-status text-emerald-400">Synced & Protected</strong>
                <span className="metric-subtext">Atomic File Writes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Filter Bar */}
        <section className="admin-toolbar-card">
          <div className="toolbar-top-flex">
            {/* Search Input */}
            <div className="admin-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search packages by title, destination, ID, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            {/* Right Action: Add New Package */}
            <button onClick={handleOpenNew} className="btn-add-primary">
              <Plus size={16} />
              <span>Add New Package</span>
            </button>
          </div>

          {/* Filters and View Toggles */}
          <div className="toolbar-bottom-flex">
            {/* Category Pills */}
            <div className="category-pills-flex">
              {['All', 'Domestic', 'International'].map((cat) => (
                <button
                  key={cat}
                  className={`cat-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' ? 'All Packages' : cat === 'Domestic' ? 'Desh (Domestic)' : 'Videsh (International)'}
                  <span className="cat-count">
                    {cat === 'All'
                      ? packages.length
                      : cat === 'Domestic'
                      ? domesticCount
                      : internationalCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Destination Selector */}
            <div className="filter-select-group">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="admin-filter-select"
              >
                <option value="All">All Destinations ({destinations.length})</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.flag} {d.name} ({d.category})
                  </option>
                ))}
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="admin-filter-select"
              >
                <option value="default">Default Order</option>
                <option value="title-asc">Title (A to Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest</option>
              </select>

              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid Card View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Data Table View"
                >
                  <TableIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Counter */}
        <div className="results-count-bar">
          <span>
            Showing <strong>{filteredPackages.length}</strong> of <strong>{packages.length}</strong> total packages
          </span>
          {searchQuery && (
            <span className="search-tag-active">Filtering for: "{searchQuery}"</span>
          )}
        </div>

        {/* Packages Grid View */}
        {viewMode === 'grid' && (
          <div className="packages-grid">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="pkg-admin-card">
                {/* Image Thumbnail */}
                <div className="pkg-card-media">
                  <img
                    src={pkg.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                    alt={pkg.title}
                  />
                  <span className={`pkg-cat-pill ${pkg.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                    {pkg.category}
                  </span>
                  <div className="pkg-rating-badge">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span>{pkg.rating}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pkg-card-body">
                  <div className="pkg-dest-line">
                    <span>📍 {pkg.destinationName}</span>
                    <span className="pkg-duration-pill"><Clock size={11} /> {pkg.duration}</span>
                  </div>

                  <h3 className="pkg-card-title" title={pkg.title}>
                    {pkg.title}
                  </h3>

                  <p className="pkg-card-desc">
                    {pkg.description || 'No detailed description.'}
                  </p>

                  <div className="pkg-card-pricing-row">
                    <div>
                      <span className="price-tag-sub">Starting Price</span>
                      <div className="price-tag-flex">
                        <strong className="price-current">{pkg.price}</strong>
                        {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
                          <span className="price-original">{pkg.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <span className="itinerary-count-badge">
                      {Array.isArray(pkg.itinerary) ? pkg.itinerary.length : 0} Days
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="pkg-card-actions">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="card-action-btn btn-edit"
                      title="Edit package content, pricing & images"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setPreviewingPackage(pkg)}
                      className="card-action-btn btn-preview"
                      title="Preview live customer view"
                    >
                      <ExternalLink size={14} />
                    </button>

                    <button
                      onClick={() => handleClonePackage(pkg)}
                      className="card-action-btn btn-clone"
                      title="Duplicate / Clone package"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmPkg(pkg)}
                      className="card-action-btn btn-delete"
                      title="Delete package"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Packages Table View */}
        {viewMode === 'table' && (
          <div className="admin-table-container">
            <table className="packages-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title & ID</th>
                  <th>Destination</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Days</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <img
                        src={pkg.image}
                        alt=""
                        className="table-pkg-thumb"
                      />
                    </td>
                    <td>
                      <div className="table-pkg-title">
                        <strong>{pkg.title}</strong>
                        <code>{pkg.id}</code>
                      </div>
                    </td>
                    <td>{pkg.destinationName}</td>
                    <td>
                      <span className={`cat-pill ${pkg.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                        {pkg.category}
                      </span>
                    </td>
                    <td>{pkg.duration}</td>
                    <td>
                      <div className="table-price-cell">
                        <strong className="text-emerald-400">{pkg.price}</strong>
                        {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
                          <span className="text-slate-500 line-through text-xs">{pkg.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td>⭐ {pkg.rating}</td>
                    <td>{Array.isArray(pkg.itinerary) ? pkg.itinerary.length : 0}D</td>
                    <td>
                      <div className="table-actions-flex">
                        <button
                          onClick={() => handleOpenEdit(pkg)}
                          className="table-action-icon text-amber-400"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewingPackage(pkg)}
                          className="table-action-icon text-blue-400"
                          title="Preview"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleClonePackage(pkg)}
                          className="table-action-icon text-emerald-400"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmPkg(pkg)}
                          className="table-action-icon text-rose-400"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredPackages.length === 0 && (
          <div className="admin-empty-state">
            <Package size={48} className="text-slate-600" />
            <h3>No matching packages found</h3>
            <p>Try refining your search query or category filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDestination('All'); }}
              className="btn-reset-filters"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Package Editor Modal */}
      <PackageEditorModal
        isOpen={isEditorOpen}
        packageData={editingPackage}
        isNew={isNewPackage}
        destinations={destinations}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSavePackage}
        onPreview={(pkg) => setPreviewingPackage(pkg)}
      />

      {/* Package Preview Modal */}
      <PackagePreviewModal
        isOpen={Boolean(previewingPackage)}
        packageData={previewingPackage}
        onClose={() => setPreviewingPackage(null)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmPkg && (
        <div className="delete-modal-backdrop" onClick={() => setDeleteConfirmPkg(null)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-circle">
              <AlertTriangle size={32} className="text-rose-500" />
            </div>
            <h3>Delete Package Confirmation</h3>
            <p>
              Are you sure you want to permanently delete <strong>"{deleteConfirmPkg.title}"</strong> (ID: <code>{deleteConfirmPkg.id}</code>)?
              This will update <code>server/data/packages.json</code> immediately.
            </p>
            <div className="delete-modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirmPkg(null)}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .super-admin-layout {
          min-height: 100vh;
          background: #090d16;
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding-bottom: 60px;
        }

        .admin-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 20000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-success {
          background: #064e3b;
          color: #34d399;
          border: 1px solid #059669;
        }

        .toast-error {
          background: #7f1d1d;
          color: #fca5a5;
          border: 1px solid #dc2626;
        }

        .super-admin-header {
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(16px);
        }

        .header-brand-flex {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-shield-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(16, 185, 129, 0.2));
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-gold { color: #f59e0b; }

        .header-brand-title {
          font-size: 19px;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .db-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .db-status-pill code {
          color: #6ee7b7;
          font-size: 10.5px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
        }

        .header-subtitle {
          font-size: 12px;
          color: #94a3b8;
          display: block;
          margin-top: 2px;
        }

        .header-action-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-header-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-header-action:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .btn-site-view {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.3);
          color: #f59e0b;
        }

        .btn-site-view:hover {
          background: rgba(245, 158, 11, 0.25);
          color: #fbbf24;
        }

        .btn-logout {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #ffffff;
        }

        .super-admin-main {
          max-width: 1440px;
          margin: 0 auto;
          padding: 28px 32px 0;
        }

        /* Metrics Row */
        .admin-metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .metric-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .icon-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

        .metric-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .metric-value-flex {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .metric-number {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .metric-badge {
          font-size: 11px;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .metric-subtext {
          font-size: 11.5px;
          color: #94a3b8;
        }

        .metric-status {
          font-size: 14px;
          font-weight: 700;
        }

        /* Toolbar */
        .admin-toolbar-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toolbar-top-flex {
          display: flex;
          gap: 16px;
        }

        .admin-search-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #64748b;
        }

        .admin-search-input {
          width: 100%;
          background: rgba(10, 15, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 12px 40px 12px 44px;
          font-size: 14px;
          color: #ffffff;
          outline: none;
        }

        .admin-search-input:focus {
          border-color: #f59e0b;
        }

        .clear-search-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
        }

        .btn-add-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #0f172a;
          border: none;
          border-radius: 14px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
          transition: transform 0.2s;
        }

        .btn-add-primary:hover {
          transform: translateY(-1px);
        }

        .toolbar-bottom-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .category-pills-flex {
          display: flex;
          gap: 8px;
        }

        .cat-filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .cat-filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
        }

        .cat-filter-btn.active {
          background: #f59e0b;
          color: #0f172a;
          border-color: #f59e0b;
        }

        .cat-count {
          background: rgba(0, 0, 0, 0.2);
          padding: 1px 6px;
          border-radius: 9999px;
          font-size: 11px;
        }

        .filter-select-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-filter-select {
          background: rgba(10, 15, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 13px;
          color: #cbd5e1;
          outline: none;
        }

        .view-mode-toggle {
          display: flex;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 3px;
        }

        .view-toggle-btn {
          background: none;
          border: none;
          color: #64748b;
          padding: 6px 10px;
          border-radius: 7px;
          cursor: pointer;
          display: flex;
        }

        .view-toggle-btn.active {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .results-count-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 18px;
        }

        .search-tag-active {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          padding: 2px 10px;
          border-radius: 9999px;
          font-size: 11.5px;
        }

        /* Packages Grid */
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .pkg-admin-card {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }

        .pkg-admin-card:hover {
          transform: translateY(-3px);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .pkg-card-media {
          position: relative;
          height: 180px;
          width: 100%;
          background: #000;
        }

        .pkg-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pkg-cat-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          backdrop-filter: blur(8px);
        }

        .cat-dom { background: rgba(59, 130, 246, 0.85); color: #fff; }
        .cat-int { background: rgba(236, 72, 153, 0.85); color: #fff; }

        .pkg-rating-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pkg-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pkg-dest-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .pkg-duration-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .pkg-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 42px;
        }

        .pkg-card-desc {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .pkg-card-pricing-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 14px;
        }

        .price-tag-sub {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          display: block;
        }

        .price-tag-flex {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .price-current {
          font-size: 18px;
          font-weight: 800;
          color: #34d399;
        }

        .price-original {
          font-size: 12px;
          color: #64748b;
          text-decoration: line-through;
        }

        .itinerary-count-badge {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .pkg-card-actions {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 6px;
        }

        .card-action-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s;
        }

        .btn-edit {
          background: #f59e0b;
          color: #0f172a;
          font-weight: 700;
        }

        .btn-edit:hover {
          background: #fbbf24;
        }

        .btn-preview {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }

        .btn-preview:hover {
          background: rgba(59, 130, 246, 0.25);
        }

        .btn-clone {
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
        }

        .btn-clone:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        /* Table View */
        .admin-table-container {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow-x: auto;
        }

        .packages-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .packages-table th, .packages-table td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-align: left;
        }

        .packages-table th {
          background: rgba(0, 0, 0, 0.3);
          color: #94a3b8;
          font-size: 11.5px;
          text-transform: uppercase;
        }

        .table-pkg-thumb {
          width: 48px;
          height: 36px;
          object-fit: cover;
          border-radius: 6px;
        }

        .table-pkg-title {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .table-pkg-title code {
          font-size: 10.5px;
          color: #64748b;
        }

        .table-price-cell {
          display: flex;
          flex-direction: column;
        }

        .table-actions-flex {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .table-action-icon {
          background: rgba(255, 255, 255, 0.06);
          border: none;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
        }

        .table-action-icon:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .admin-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 20px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .btn-reset-filters {
          background: #f59e0b;
          color: #0f172a;
          border: none;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 12px;
        }

        /* Delete Confirmation Modal */
        .delete-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10002;
          padding: 20px;
        }

        .delete-modal-card {
          background: #0f172a;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 24px;
          padding: 32px;
          max-width: 460px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
        }

        .delete-icon-circle {
          width: 64px;
          height: 64px;
          background: rgba(239, 68, 68, 0.12);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .delete-modal-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 10px;
        }

        .delete-modal-card p {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0 0 24px;
        }

        .delete-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-confirm-delete {
          background: #ef4444;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .admin-metrics-row { grid-template-columns: repeat(2, 1fr); }
          .super-admin-header { flex-direction: column; align-items: flex-start; gap: 14px; padding: 16px 20px; }
          .header-action-group { width: 100%; overflow-x: auto; padding-bottom: 4px; }
        }

        @media (max-width: 640px) {
          .admin-metrics-row { grid-template-columns: 1fr; }
          .toolbar-top-flex { flex-direction: column; }
          .super-admin-main { padding: 16px 14px 0; }
        }
      `}</style>
    </div>
  );
}
