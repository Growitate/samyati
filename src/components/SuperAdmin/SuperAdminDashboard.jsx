import React, { useState, useMemo } from 'react';
import {
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
  LogOut,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  AlertTriangle,
  Star,
  Clock,
  Sparkles,
  ArrowUpDown,
  FileJson,
  Image as ImageIcon,
  ArrowRight,
  MapPin,
  Check,
  X,
  Plane,
  ArrowUpRight,
  Building2
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
        if (sortBy === 'price-asc') return parsePriceNum(a.price) - parsePriceNum(b.price);
        if (sortBy === 'price-desc') return parsePriceNum(b.price) - parsePriceNum(a.price);
        if (sortBy === 'rating-desc') return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        return 0;
      });
  }, [packages, searchQuery, selectedCategory, selectedDestination, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const domestic = packages.filter(p => p.category === 'Domestic').length;
    const international = packages.filter(p => p.category === 'International').length;
    const destSet = new Set(packages.map(p => p.destinationName || p.destinationId).filter(Boolean));
    return {
      total,
      domestic,
      international,
      destinationsCount: destSet.size || destinations.length
    };
  }, [packages, destinations]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingPackage(null);
    setIsNewPackage(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setIsNewPackage(false);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingPackage(null);
    setIsNewPackage(false);
  };

  const handleSavePackage = async (formData, isNew) => {
    try {
      if (isNew) {
        await createPackage(formData);
        showToast(`Package "${formData.title}" created successfully!`, 'success');
      } else {
        await updatePackage(formData.id, formData);
        showToast(`Package "${formData.title}" updated successfully!`, 'success');
      }
      handleCloseEditor();
    } catch (err) {
      showToast(err.message || 'Failed to save package', 'error');
    }
  };

  const handleDeletePackageConfirm = async () => {
    if (!deleteConfirmPkg) return;
    try {
      await deletePackage(deleteConfirmPkg.id);
      showToast(`Package "${deleteConfirmPkg.title}" deleted from database.`, 'success');
      setDeleteConfirmPkg(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete package', 'error');
    }
  };

  const handleClonePackage = async (pkg) => {
    try {
      const cloned = {
        ...pkg,
        id: `${pkg.id}-copy-${Date.now().toString(36)}`,
        title: `${pkg.title} (Copy)`,
        _createdAt: new Date().toISOString()
      };
      await createPackage(cloned);
      showToast(`Cloned "${pkg.title}" as a new package!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to clone package', 'error');
    }
  };

  const handleDownloadBackup = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalPackages: packages.length,
        destinations,
        packages
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `samyati-packages-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Database backup downloaded successfully!', 'success');
    } catch (err) {
      showToast('Backup export failed', 'error');
    }
  };

  const handleSyncWithCode = async () => {
    try {
      const res = await syncWithCode();
      showToast(res.message || 'Packages re-synchronized with code!', 'success');
    } catch (err) {
      showToast(err.message || 'Sync failed', 'error');
    }
  };

  return (
    <div className="super-admin-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar styled like Samyati Navbar */}
      <header className="super-admin-header">
        <div className="header-left">
          <div className="brand-logo-wrap">
            <img
              src="/Logo (2).png"
              alt="Samyati The World"
              className="brand-logo-img"
              onError={(e) => { e.target.src = '/samyati-logo.png'; }}
            />
          </div>
          <div className="header-title-block">
            <div className="header-title-row">
              <span className="admin-brand-name">
                Control <span className="accent-serif">Vault</span>
              </span>
              <span className="db-live-pill">
                <span className="live-dot"></span>
                <span>File Database Active</span>
              </span>
            </div>
            <p className="admin-subtitle"><code>server/data/packages.json</code> • {packages.length} Curated Packages</p>
          </div>
        </div>

        {/* Center Pill Capsule Navigation matching Website */}
        <div className="nav-center-links">
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedDestination('All'); }}
            className={`nav-link-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          >
            All ({packages.length})
          </button>
          <button
            onClick={() => setSelectedCategory('Domestic')}
            className={`nav-link-btn ${selectedCategory === 'Domestic' ? 'active' : ''}`}
          >
            🇮🇳 Desh ({stats.domestic})
          </button>
          <button
            onClick={() => setSelectedCategory('International')}
            className={`nav-link-btn ${selectedCategory === 'International' ? 'active' : ''}`}
          >
            ✈️ Videsh ({stats.international})
          </button>
          <button
            onClick={handleOpenCreate}
            className="nav-link-btn btn-nav-create"
            title="Create a new package"
          >
            <Plus size={14} />
            <span>Add Package</span>
          </button>
        </div>

        <div className="header-actions">
          {onNavigateToSite && (
            <button
              onClick={onNavigateToSite}
              className="btn-pill-white"
              title="Return to customer-facing website"
            >
              <span>Live Website</span>
              <ArrowUpRight size={14} />
            </button>
          )}

          <button
            onClick={handleDownloadBackup}
            className="btn-pill-white"
            title="Download JSON file database backup"
          >
            <Download size={14} />
            <span>Backup</span>
          </button>

          <button
            onClick={handleSyncWithCode}
            className="btn-pill-white"
            title="Sync any new packages added in code"
          >
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>

          <button
            onClick={onLogout}
            className="btn-logout-pill"
            title="Lock session & Logout"
          >
            <LogOut size={13} />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="super-admin-main">
        {/* Banner Section matching Samyati Hero / Eyebrow typography */}
        <section className="vault-welcome-banner">
          <div className="vault-banner-inner">
            <div className="eyebrow-pill mb-2">
              <span className="star-accent">✦</span>
              <span>RESTRICTED SUPER ADMIN CONTROL VAULT</span>
              <span className="star-accent">✦</span>
            </div>
            <h2 className="section-h2">
              <span className="h2-line">Package Catalog & <span className="accent-serif">Galleries</span></span>
            </h2>
            <p className="vault-main-desc">
              Curate, edit, and publish all 75 travel packages stored in your file-based database. Edit primary hero photos, upload multi-image galleries, customize 3★/4★/5★ pricing tiers, and configure day-by-day itineraries.
            </p>
          </div>
        </section>

        {/* Statistics Cards Row */}
        <section className="stats-cards-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-wrap icon-amber">
              <Package size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-label">Total Packages in DB</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrap icon-emerald">
              <Layers size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-num">{stats.domestic}</span>
              <span className="stat-label">Domestic Tours (Desh)</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrap icon-blue">
              <ExternalLink size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-num">{stats.international}</span>
              <span className="stat-label">International Tours (Videsh)</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrap icon-rose">
              <MapPin size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-num">{stats.destinationsCount}</span>
              <span className="stat-label">Active Destinations</span>
            </div>
          </div>
        </section>

        {/* Section Divider Header with Flight Trace matching Desh / Videsh */}
        <div className="desh-section-header">
          <div className="header-title-flex">
            <span className="star-accent">✦</span>
            <h2 className="desh-section-heading">LIVE CATALOG PACKAGES</h2>
            <span className="star-accent">✦</span>
          </div>

          <div className="flight-path-decoration">
            <svg viewBox="0 0 120 30" className="flight-line-svg">
              <path d="M5,25 Q60,-5 115,20" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <Plane size={14} className="flight-plane-icon" />
          </div>
        </div>

        {/* Filter and Search Bar Card */}
        <section className="admin-filters-card">
          <div className="search-input-wrap">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder="Search by package title, destination, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filters-group-row">
            {/* Category Pills matching website filter-pill-group */}
            <div className="filter-pill-group" role="tablist">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
              >
                All Packages ({packages.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Domestic')}
                className={`filter-btn ${selectedCategory === 'Domestic' ? 'active' : ''}`}
              >
                🇮🇳 Desh ({stats.domestic})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('International')}
                className={`filter-btn ${selectedCategory === 'International' ? 'active' : ''}`}
              >
                ✈️ Videsh ({stats.international})
              </button>
            </div>

            {/* Destination Dropdown */}
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="admin-select-field"
            >
              <option value="All">All Destinations ({destinations.length})</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.name || d.id}>
                  {d.flag || '📍'} {d.name}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="admin-select-field"
            >
              <option value="default">Sort by: Default Catalog</option>
              <option value="title-asc">Sort: Title (A-Z)</option>
              <option value="price-asc">Sort: Price (Lowest First)</option>
              <option value="price-desc">Sort: Price (Highest First)</option>
              <option value="rating-desc">Sort: Rating (Highest First)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`btn-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Card View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table List View"
              >
                <TableIcon size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Results Counter & Active Filter Strip */}
        <div className="results-counter-bar">
          <span className="results-count-text">
            Showing <strong>{filteredPackages.length}</strong> of {packages.length} packages
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {selectedDestination !== 'All' && ` • ${selectedDestination}`}
          </span>
        </div>

        {/* Packages Grid View */}
        {viewMode === 'grid' && (
          <div className="packages-card-grid">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="pkg-luxury-card">
                {/* Photo & Badge Wrapper */}
                <div className="pkg-photo-container">
                  <img
                    src={pkg.image || 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=85'}
                    alt={pkg.title}
                    className="pkg-photo-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=85';
                    }}
                  />
                  <div className="photo-top-badges">
                    <span className="category-tag-pill">
                      {pkg.category === 'Domestic' ? '🇮🇳 Domestic' : '✈️ International'}
                    </span>
                    <span className="rating-badge">
                      <Star size={11} className="star-icon" />
                      <span>{pkg.rating || '4.9'}</span>
                    </span>
                  </div>

                  <div className="photo-bottom-badges">
                    <span className="badge-destination">
                      <MapPin size={11} />
                      <span>{pkg.destinationName}</span>
                    </span>
                    {Array.isArray(pkg.gallery) && pkg.gallery.length > 0 && (
                      <span className="badge-gallery-count" title={`${pkg.gallery.length} photos in gallery`}>
                        <ImageIcon size={11} />
                        <span>{pkg.gallery.length} Photos</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body matching website */}
                <div className="pkg-card-body">
                  <div className="pkg-header-line">
                    <h3 className="pkg-title" title={pkg.title}>{pkg.title}</h3>
                  </div>

                  <p className="pkg-description-preview">
                    {pkg.description || 'Curated luxury package with stays, transfers and sightseeing.'}
                  </p>

                  {/* Hotel Tiers & Duration Meta Pills */}
                  <div className="pkg-meta-tags-row">
                    <span className="itinerary-pill">
                      <Clock size={11} />
                      <span>{pkg.duration}</span>
                    </span>
                    {Array.isArray(pkg.hotelPricingOptions) && pkg.hotelPricingOptions.length > 0 && (
                      <span className="hotel-tiers-pill" title="Hotel pricing options available">
                        <Building2 size={11} className="text-gold" />
                        <span>{pkg.hotelPricingOptions.length} Hotel Tiers</span>
                      </span>
                    )}
                  </div>

                  <div className="card-divider"></div>

                  <div className="pkg-pricing-strip">
                    <div className="price-col">
                      <span className="price-label">Starting From</span>
                      <div className="price-flex">
                        <strong className="main-price-val">{pkg.price}</strong>
                        {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
                          <span className="strike-price-val">{pkg.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pkg-card-actions">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="btn-action btn-edit"
                      title="Edit package content, images & pricing"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setPreviewingPackage(pkg)}
                      className="btn-action btn-preview"
                      title="Live Customer Preview"
                    >
                      <ExternalLink size={14} />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleClonePackage(pkg)}
                      className="btn-action btn-clone"
                      title="Duplicate package"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmPkg(pkg)}
                      className="btn-action btn-delete"
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
          <div className="admin-table-card">
            <table className="packages-luxury-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Package Title & ID</th>
                  <th>Destination</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Starting Price</th>
                  <th>Rating</th>
                  <th>Gallery</th>
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
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <div className="table-pkg-title-cell">
                        <strong>{pkg.title}</strong>
                        <code>{pkg.id}</code>
                      </div>
                    </td>
                    <td>{pkg.destinationName}</td>
                    <td>
                      <span className={`badge-category-sm ${pkg.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                        {pkg.category}
                      </span>
                    </td>
                    <td>{pkg.duration}</td>
                    <td>
                      <strong className="table-price">{pkg.price}</strong>
                    </td>
                    <td>
                      <div className="table-rating">
                        <Star size={12} className="star-fill" />
                        <span>{pkg.rating || '4.9'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="table-gallery-tag">
                        <ImageIcon size={11} />
                        <span>{Array.isArray(pkg.gallery) ? pkg.gallery.length : 0}</span>
                      </span>
                    </td>
                    <td>{Array.isArray(pkg.itinerary) ? pkg.itinerary.length : 0}d</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions-cell">
                        <button
                          onClick={() => handleOpenEdit(pkg)}
                          className="table-btn btn-table-edit"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setPreviewingPackage(pkg)}
                          className="table-btn btn-table-preview"
                          title="Preview"
                        >
                          <ExternalLink size={13} />
                        </button>
                        <button
                          onClick={() => handleClonePackage(pkg)}
                          className="table-btn btn-table-clone"
                          title="Clone"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmPkg(pkg)}
                          className="table-btn btn-table-delete"
                          title="Delete"
                        >
                          <Trash2 size={13} />
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
            <Package size={42} className="text-slate-400" />
            <h3>No packages match your search filters</h3>
            <p>Try clearing your search query or selecting a different category or destination.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDestination('All'); }}
              className="btn-clear-filters"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Package Editor Modal */}
      {isEditorOpen && (
        <PackageEditorModal
          isOpen={isEditorOpen}
          packageData={editingPackage}
          isNew={isNewPackage}
          destinations={destinations}
          onClose={handleCloseEditor}
          onSave={handleSavePackage}
          onPreview={(pkg) => setPreviewingPackage(pkg)}
        />
      )}

      {/* Package Sandbox Live Preview Modal */}
      {previewingPackage && (
        <PackagePreviewModal
          isOpen={Boolean(previewingPackage)}
          packageData={previewingPackage}
          onClose={() => setPreviewingPackage(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmPkg && (
        <div className="delete-modal-backdrop" onClick={() => setDeleteConfirmPkg(null)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-circle">
              <Trash2 size={24} className="text-rose-500" />
            </div>
            <h3 className="delete-modal-title">Delete Travel Package?</h3>
            <p className="delete-modal-desc">
              Are you sure you want to permanently delete <strong>"{deleteConfirmPkg.title}"</strong> (ID: <code>{deleteConfirmPkg.id}</code>)?
              This will remove it from <code>server/data/packages.json</code> and live website catalogs immediately.
            </p>
            <div className="delete-modal-actions">
              <button
                onClick={() => setDeleteConfirmPkg(null)}
                className="btn-cancel-delete"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePackageConfirm}
                className="btn-confirm-delete"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES matching Samyati Design System */}
      <style>{`
        .super-admin-layout {
          min-height: 100vh;
          background-color: #fefce8;
          color: #141613;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding-bottom: 80px;
        }

        /* Toast Notification */
        .admin-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 20000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);
          animation: toastSlide 0.3s ease-out;
        }

        @keyframes toastSlide {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-success {
          background: #0f172a;
          color: #fef08a;
          border: 1px solid rgba(212, 175, 55, 0.4);
        }

        .toast-error {
          background: #7f1d1d;
          color: #fef2f2;
          border: 1px solid #ef4444;
        }

        /* Header matching Samyati Navbar */
        .super-admin-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding-top: 10px;
          padding-bottom: 10px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding-left: 32px;
          padding-right: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo-wrap {
          display: flex;
          align-items: center;
        }

        .brand-logo-img {
          height: 52px;
          width: auto;
          max-width: 220px;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.18));
          display: block;
        }

        .header-title-block {
          display: flex;
          flex-direction: column;
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-brand-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: #141613;
          margin: 0;
          line-height: 1;
        }

        .accent-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          color: #d97706;
        }

        .db-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .db-live-pill code {
          color: #15803d;
          font-family: monospace;
          font-size: 10.5px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
        }

        .admin-subtitle {
          font-size: 11.5px;
          color: #64748b;
          margin: 3px 0 0;
          font-weight: 500;
        }

        /* Center Luxury Pill Capsule Navigation */
        .nav-center-links {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 4px 6px;
          border-radius: 9999px;
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.06),
            0 2px 6px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .nav-link-btn:hover {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.06);
        }

        .nav-link-btn.active {
          color: #ffffff;
          background: #0f172a;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.2);
          font-weight: 700;
        }

        .btn-nav-create {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
          font-weight: 700;
        }

        .btn-nav-create:hover {
          background: #fde68a;
          color: #78350f;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-pill-white {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          padding: 7px 15px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .btn-pill-white:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .btn-logout-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout-pill:hover {
          background: #fecaca;
        }

        /* Main Container */
        .super-admin-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 24px 0;
        }

        /* Welcome Banner */
        .vault-welcome-banner {
          text-align: center;
          margin-bottom: 28px;
        }

        .vault-banner-inner {
          max-width: 760px;
          margin: 0 auto;
        }

        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #92400e;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 5px 16px;
          border-radius: 9999px;
        }

        .mb-2 { margin-bottom: 10px; }

        .star-accent {
          color: #d97706;
          font-size: 11px;
        }

        .section-h2 {
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 10px 0;
        }

        .section-h2 .accent-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: 1.15em;
          color: #d97706;
          vertical-align: baseline;
          padding: 0 0.05em;
          display: inline-block;
        }

        .vault-main-desc {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .vault-main-desc code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          color: #0f172a;
          font-family: monospace;
          font-size: 12px;
        }

        /* Stats Cards */
        .stats-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .admin-stat-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px 22px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .admin-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
        }

        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-amber { background: #fef3c7; color: #d97706; }
        .icon-emerald { background: #dcfce7; color: #15803d; }
        .icon-blue { background: #e0f2fe; color: #0369a1; }
        .icon-rose { background: #ffe4e6; color: #e11d48; }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          margin-top: 2px;
        }

        /* Section Divider with Flight Path Trace */
        .desh-section-header {
          position: relative;
          text-align: center;
          margin: 28px 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-title-flex {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .desh-section-heading {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #475569;
          text-transform: uppercase;
        }

        .flight-path-decoration {
          position: absolute;
          right: 24px;
          top: -8px;
          display: flex;
          align-items: center;
        }

        .flight-line-svg {
          width: 80px;
          height: 24px;
        }

        .flight-plane-icon {
          color: #92400e;
          transform: rotate(15deg);
          margin-left: -6px;
        }

        /* Filter Card */
        .admin-filters-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 18px 22px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input-field {
          width: 100%;
          padding: 13px 40px 13px 44px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input-field:focus {
          background: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12);
        }

        .btn-clear-search {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
        }

        .filters-group-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* Filter Pills matching website filter-pill-group */
        .filter-pill-group {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }

        .filter-btn {
          border: none;
          background: transparent;
          padding: 7px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-btn.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .admin-select-field {
          padding: 8px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          outline: none;
          cursor: pointer;
        }

        .admin-select-field:focus {
          border-color: #d97706;
        }

        .view-mode-toggle {
          display: flex;
          align-items: center;
          gap: 2px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 3px;
          border-radius: 8px;
        }

        .btn-view-toggle {
          width: 32px;
          height: 30px;
          border-radius: 6px;
          border: none;
          background: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-view-toggle.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        /* Results Counter */
        .results-counter-bar {
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .results-count-text {
          font-size: 13px;
          color: #64748b;
        }

        .results-count-text strong {
          color: #0f172a;
        }

        /* Package Cards Grid matching Website */
        .packages-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .pkg-luxury-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .pkg-luxury-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);
        }

        .pkg-photo-container {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .pkg-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .pkg-luxury-card:hover .pkg-photo-img {
          transform: scale(1.06);
        }

        .photo-top-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .category-tag-pill {
          background: #ffffff;
          color: #0f172a;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .rating-badge {
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star-icon {
          color: #f59e0b;
          fill: #f59e0b;
        }

        .photo-bottom-badges {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .badge-destination {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(6px);
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 9999px;
        }

        .badge-gallery-count {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(254, 252, 232, 0.9);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #92400e;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
        }

        /* Card Content */
        .pkg-card-body {
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .pkg-header-line {
          margin-bottom: 8px;
        }

        .pkg-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pkg-description-preview {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pkg-meta-tags-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .itinerary-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 9px;
          border-radius: 9999px;
        }

        .hotel-tiers-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: #92400e;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 3px 9px;
          border-radius: 9999px;
        }

        .card-divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 12px 0 14px;
        }

        .pkg-pricing-strip {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .price-col {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .price-flex {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .main-price-val {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .strike-price-val {
          font-size: 12px;
          color: #94a3b8;
          text-decoration: line-through;
        }


        /* Card Action Buttons */
        .pkg-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit {
          background: #0f172a;
          color: #ffffff;
          flex: 1;
        }

        .btn-edit:hover {
          background: #1e293b;
        }

        .btn-preview {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #334155;
          flex: 1;
        }

        .btn-preview:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-clone {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #64748b;
          width: 34px;
          height: 34px;
          padding: 0;
        }

        .btn-clone:hover {
          background: #e0f2fe;
          color: #0284c7;
          border-color: #bae6fd;
        }

        .btn-delete {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #64748b;
          width: 34px;
          height: 34px;
          padding: 0;
        }

        .btn-delete:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fecaca;
        }

        /* Table View */
        .admin-table-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .packages-luxury-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .packages-luxury-table th {
          padding: 14px 18px;
          background: #f8fafc;
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .packages-luxury-table td {
          padding: 12px 18px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13.5px;
          color: #334155;
          vertical-align: middle;
        }

        .packages-luxury-table tr:hover {
          background: #fefce8;
        }

        .table-pkg-thumb {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
        }

        .table-pkg-title-cell {
          display: flex;
          flex-direction: column;
          max-width: 280px;
        }

        .table-pkg-title-cell strong {
          color: #0f172a;
          font-size: 13.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .table-pkg-title-cell code {
          font-size: 10.5px;
          color: #94a3b8;
          font-family: monospace;
        }

        .badge-category-sm {
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .table-price {
          color: #0f172a;
          font-weight: 700;
        }

        .table-rating {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          font-size: 12.5px;
          color: #92400e;
        }

        .table-gallery-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
        }

        .table-actions-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .table-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .table-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        /* Empty State */
        .admin-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          margin-top: 20px;
        }

        .admin-empty-state h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 14px 0 6px;
        }

        .admin-empty-state p {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 16px;
        }

        .btn-clear-filters {
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Delete Confirmation Modal */
        .delete-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(6px);
          z-index: 10002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .delete-modal-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 32px 28px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(15, 23, 42, 0.18);
          animation: popIn 0.25s ease-out;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .delete-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .delete-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .delete-modal-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.55;
          margin: 0 0 24px;
        }

        .delete-modal-desc strong {
          color: #0f172a;
        }

        .delete-modal-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel-delete {
          flex: 1;
          padding: 11px 16px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }

        .btn-confirm-delete {
          flex: 1;
          padding: 11px 16px;
          background: #dc2626;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }

        .btn-confirm-delete:hover {
          background: #b91c1c;
        }

        @media (max-width: 1080px) {
          .packages-card-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 720px) {
          .super-admin-header { padding: 12px 16px; flex-direction: column; align-items: flex-start; }
          .header-actions { width: 100%; flex-wrap: wrap; }
          .packages-card-grid { grid-template-columns: 1fr; }
          .stats-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
