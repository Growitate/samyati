import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Image,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Layers,
  Star,
  UploadCloud,
  Upload,
  Check,
  RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS, ADMIN_STORAGE_KEYS } from '../../config/adminConfig';

const PRESET_DESTINATION_IMAGES = {
  kashmir: [
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85'
  ],
  himachal: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
  ],
  kerala: [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85'
  ],
  goa: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
  ],
  rajasthan: [
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85'
  ],
  bali: [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=85'
  ],
  thailand: [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=85'
  ],
  vietnam: [
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85'
  ],
  singapore: [
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85'
  ],
  dubai: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=85'
  ]
};

export default function PackageEditorModal({
  isOpen,
  packageData,
  isNew = false,
  destinations = [],
  onClose,
  onSave,
  onPreview
}) {
  const [activeTab, setActiveTab] = useState('pricing'); // 'pricing' | 'content' | 'images' | 'itinerary' | 'inclusions'
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Image upload states
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    destinationId: 'kashmir',
    destinationName: 'Kashmir',
    category: 'Domestic',
    duration: '5D / 4N',
    price: '₹18,500',
    originalPrice: '₹24,000',
    rating: '4.9',
    reviewsCount: 120,
    image: '',
    description: '',
    itinerary: [],
    inclusions: [],
    exclusions: []
  });

  // Temporary inputs for array additions
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  // Handle local image file upload (via file picker or drag & drop)
  const handleImageFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, AVIF).');
      return;
    }

    // Check size limit (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setImageError(false);
    setUploadedFileName(file.name);

    try {
      // 1. Read as Data URL for immediate local preview
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      // Show immediate client preview
      setFormData(prev => ({ ...prev, image: base64Data }));

      // 2. Upload to server
      const token = sessionStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || localStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || '';
      const res = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: base64Data,
          filename: file.name
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        console.warn('Server upload non-200, preserving base64 image data');
      }
    } catch (err) {
      console.warn('Upload error, retaining local preview:', err.message);
    } finally {
      setUploading(false);
    }
  };

  // Populate form on packageData change
  useEffect(() => {
    if (packageData) {
      setFormData({
        id: packageData.id || '',
        title: packageData.title || '',
        destinationId: packageData.destinationId || 'kashmir',
        destinationName: packageData.destinationName || 'Kashmir',
        category: packageData.category || 'Domestic',
        duration: packageData.duration || '5D / 4N',
        price: packageData.price || '₹0',
        originalPrice: packageData.originalPrice || packageData.price || '₹0',
        rating: String(packageData.rating || '4.9'),
        reviewsCount: Number(packageData.reviewsCount || 0),
        image: packageData.image || '',
        description: packageData.description || '',
        itinerary: Array.isArray(packageData.itinerary)
          ? packageData.itinerary.map(item => ({ ...item }))
          : [],
        inclusions: Array.isArray(packageData.inclusions) ? [...packageData.inclusions] : [],
        exclusions: Array.isArray(packageData.exclusions) ? [...packageData.exclusions] : []
      });
      setImageError(false);
      setUploadError('');
      setUploadedFileName('');
    } else if (isNew) {
      setFormData({
        id: `pkg-${Date.now().toString(36)}`,
        title: '',
        destinationId: destinations[0]?.id || 'kashmir',
        destinationName: destinations[0]?.name || 'Kashmir',
        category: 'Domestic',
        duration: '5D / 4N',
        price: '₹19,999',
        originalPrice: '₹26,000',
        rating: '4.9',
        reviewsCount: 45,
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85',
        description: 'Breathtaking handpicked travel experience curated by Samyati The World.',
        itinerary: [
          { day: 1, title: 'Arrival & Welcome', details: 'Check-in to luxury hotel and evening leisure walk.' },
          { day: 2, title: 'Full Day Sightseeing & Heritage Excursion', details: 'Guided tour of prominent heritage landmarks and scenic spots.' },
          { day: 3, title: 'Departure & Sweet Memories', details: 'Breakfast and private transfer to airport with lifetime memories.' }
        ],
        inclusions: [
          '3-Star / 4-Star Luxury Accommodation',
          'Daily Breakfast & Dinner',
          'Private Cab for all transfers and sightseeing',
          '24/7 Samyati Human Concierge Support'
        ],
        exclusions: [
          'Airfare / Train tickets',
          'Personal expenses, laundry, tips',
          'Entry tickets not mentioned in inclusions'
        ]
      });
      setImageError(false);
      setUploadError('');
      setUploadedFileName('');
    }
  }, [packageData, isNew, destinations]);

  if (!isOpen) return null;

  const handleDestinationChange = (destId) => {
    const dest = destinations.find(d => d.id === destId);
    if (dest) {
      setFormData(prev => ({
        ...prev,
        destinationId: dest.id,
        destinationName: dest.name,
        category: dest.category || prev.category
      }));
    } else {
      setFormData(prev => ({ ...prev, destinationId: destId }));
    }
  };

  // Itinerary Handlers
  const handleAddItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: nextDay, title: `Day ${nextDay} Activity & Exploration`, details: 'Details for this day...' }
      ]
    }));
  };

  const handleUpdateItineraryDay = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleRemoveItineraryDay = (index) => {
    setFormData(prev => {
      const updated = prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, day: idx + 1 }));
      return { ...prev, itinerary: updated };
    });
  };

  // Inclusions & Exclusions Handlers
  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setFormData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, newInclusion.trim()]
    }));
    setNewInclusion('');
  };

  const handleRemoveInclusion = (index) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    setFormData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, newExclusion.trim()]
    }));
    setNewExclusion('');
  };

  const handleRemoveExclusion = (index) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  // Save Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Package title is required.');
      return;
    }

    setSaving(true);
    try {
      if (onSave) {
        await onSave(formData, isNew);
      }
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="editor-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="editor-header">
          <div className="editor-header-left">
            <div className="header-badge">
              <Sparkles size={16} className="text-amber-400" />
              <span>{isNew ? 'CREATE NEW PACKAGE' : 'EDIT PACKAGE'}</span>
            </div>
            <h2 className="editor-title">
              {formData.title || (isNew ? 'New Travel Package' : 'Package Editor')}
            </h2>
            <div className="editor-meta-badges">
              <span className="badge-id">ID: {formData.id}</span>
              <span className={`badge-cat ${formData.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                {formData.category}
              </span>
              <span className="badge-dest">{formData.destinationName}</span>
            </div>
          </div>

          <div className="editor-header-actions">
            {!isNew && onPreview && (
              <button
                type="button"
                className="btn-preview-sm"
                onClick={() => onPreview(formData)}
              >
                <ExternalLink size={14} />
                <span>Preview</span>
              </button>
            )}
            <button className="editor-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="editor-tabs-nav">
          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <DollarSign size={16} />
            <span>Pricing & Essentials</span>
          </button>

          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={16} />
            <span>Content & Description</span>
          </button>

          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <Image size={16} />
            <span>Images & Media</span>
          </button>

          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <Calendar size={16} />
            <span>Itinerary ({formData.itinerary.length} Days)</span>
          </button>

          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'inclusions' ? 'active' : ''}`}
            onClick={() => setActiveTab('inclusions')}
          >
            <CheckCircle2 size={16} />
            <span>Inclusions / Exclusions</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="editor-form-content">
          {/* TAB 1: PRICING & ESSENTIALS */}
          {activeTab === 'pricing' && (
            <div className="tab-pane">
              <div className="pane-grid-2">
                <div className="editor-field full-width">
                  <label>Package Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kashmir Valley Enchantment & Shikara Dreams"
                    required
                  />
                </div>

                <div className="editor-field">
                  <label>Current Price (Selling Price) *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. ₹18,500"
                    required
                  />
                  <span className="field-hint">Format with ₹ or currency symbol</span>
                </div>

                <div className="editor-field">
                  <label>Original / Strikethrough Price</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. ₹24,000"
                  />
                  <span className="field-hint">Shows as crossed out original price</span>
                </div>

                <div className="editor-field">
                  <label>Destination</label>
                  <select
                    value={formData.destinationId}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.flag || '📍'} {d.name} ({d.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="editor-field">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Domestic">Domestic (Desh)</option>
                    <option value="International">International (Videsh)</option>
                  </select>
                </div>

                <div className="editor-field">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 5D / 4N"
                  />
                </div>

                <div className="editor-field">
                  <label>Rating & Reviews Count</label>
                  <div className="rating-inputs-row">
                    <input
                      type="text"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="4.9"
                      style={{ width: '80px' }}
                    />
                    <input
                      type="number"
                      value={formData.reviewsCount}
                      onChange={(e) => setFormData({ ...formData, reviewsCount: Number(e.target.value) })}
                      placeholder="120"
                    />
                    <span className="field-hint">Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & DESCRIPTION */}
          {activeTab === 'content' && (
            <div className="tab-pane">
              <div className="editor-field">
                <label>Package Overview / Full Description</label>
                <textarea
                  rows="6"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the highlights, stays, vibe, and experiences included in this package..."
                ></textarea>
                <span className="field-hint">
                  Detailed copy displayed on the package detail page and summary cards.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES & MEDIA */}
          {activeTab === 'images' && (
            <div className="tab-pane">
              {/* Image Source Mode Selector */}
              <div className="image-mode-selector-bar">
                <button
                  type="button"
                  className={`image-mode-pill ${imageSourceMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setImageSourceMode('upload')}
                >
                  <UploadCloud size={15} />
                  <span>Upload from Device</span>
                </button>

                <button
                  type="button"
                  className={`image-mode-pill ${imageSourceMode === 'url' ? 'active' : ''}`}
                  onClick={() => setImageSourceMode('url')}
                >
                  <ExternalLink size={15} />
                  <span>Image URL</span>
                </button>

                {PRESET_DESTINATION_IMAGES[formData.destinationId] && (
                  <button
                    type="button"
                    className={`image-mode-pill ${imageSourceMode === 'presets' ? 'active' : ''}`}
                    onClick={() => setImageSourceMode('presets')}
                  >
                    <Sparkles size={15} />
                    <span>Curated Presets ({PRESET_DESTINATION_IMAGES[formData.destinationId]?.length || 0})</span>
                  </button>
                )}
              </div>

              {/* Mode 1: Upload from Device (Dropzone) */}
              {imageSourceMode === 'upload' && (
                <div className="upload-dropzone-container">
                  <div
                    className={`image-upload-dropzone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading-state' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFileUpload(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file);
                      }}
                    />

                    {uploading ? (
                      <div className="dropzone-center-content">
                        <div className="spinner-amber"></div>
                        <span className="dropzone-title">Uploading & Optimizing Image...</span>
                        <span className="dropzone-subtitle">Saving to server/public/uploads</span>
                      </div>
                    ) : (
                      <div className="dropzone-center-content">
                        <div className="dropzone-icon-bubble">
                          <UploadCloud size={28} className="text-amber-400" />
                        </div>
                        <span className="dropzone-title">
                          Drag & drop your tour photo here, or <strong className="text-amber-400 underline">browse files</strong>
                        </span>
                        <span className="dropzone-subtitle">
                          Supports high-res JPG, PNG, WEBP, AVIF (up to 15MB)
                        </span>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="upload-error-banner">
                      <AlertCircle size={16} />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {uploadedFileName && !uploadError && (
                    <div className="upload-success-banner">
                      <Check size={16} className="text-emerald-400" />
                      <span>Selected file: <strong>{uploadedFileName}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: External Image URL */}
              {imageSourceMode === 'url' && (
                <div className="editor-field">
                  <label>Primary Package Hero / Card Image URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImageError(false);
                      setUploadedFileName('');
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                  />
                  <span className="field-hint">Paste any accessible public image link (Unsplash, CDN, etc.)</span>
                </div>
              )}

              {/* Mode 3: Curated Presets */}
              {imageSourceMode === 'presets' && PRESET_DESTINATION_IMAGES[formData.destinationId] && (
                <div className="curated-presets-section">
                  <label className="preset-label">
                    <span>Select a photo preset for {formData.destinationName}:</span>
                  </label>
                  <div className="presets-row">
                    {PRESET_DESTINATION_IMAGES[formData.destinationId].map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`preset-thumb ${formData.image === imgUrl ? 'selected' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, image: imgUrl });
                          setImageError(false);
                          setUploadedFileName('');
                        }}
                      >
                        <img src={imgUrl} alt={`Preset ${idx + 1}`} />
                        {formData.image === imgUrl && (
                          <div className="preset-check">✓ Selected</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="image-preview-card">
                <div className="preview-card-header">
                  <span className="preview-label">Active Image Preview</span>
                  {formData.image && (
                    <button
                      type="button"
                      className="btn-clear-image"
                      onClick={() => {
                        setFormData({ ...formData, image: '' });
                        setUploadedFileName('');
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Clear Image</span>
                    </button>
                  )}
                </div>

                <div className="preview-image-container">
                  {formData.image && !imageError ? (
                    <div className="preview-img-wrapper">
                      <img
                        src={formData.image}
                        alt="Package Preview"
                        onError={() => setImageError(true)}
                      />
                      <div className="preview-overlay-info">
                        <span className="img-path-tag" title={formData.image}>
                          {formData.image.startsWith('data:') ? 'Local Base64 Data' : formData.image}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="image-error-state">
                      <AlertCircle size={28} className="text-amber-500" />
                      <span>{imageError ? 'Invalid or broken image URL' : 'No image loaded yet. Upload or select an image above.'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ITINERARY BUILDER */}
          {activeTab === 'itinerary' && (
            <div className="tab-pane">
              <div className="itinerary-header-bar">
                <span>Day-by-Day Travel Schedule</span>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="btn-add-day"
                >
                  <Plus size={14} />
                  <span>Add Day</span>
                </button>
              </div>

              <div className="itinerary-days-list">
                {formData.itinerary.map((dayItem, index) => (
                  <div key={index} className="itinerary-day-box">
                    <div className="day-box-header">
                      <div className="day-badge">Day {dayItem.day || index + 1}</div>
                      <input
                        type="text"
                        className="day-title-input"
                        value={dayItem.title || ''}
                        onChange={(e) => handleUpdateItineraryDay(index, 'title', e.target.value)}
                        placeholder={`Day ${index + 1} Title / Location`}
                      />
                      <button
                        type="button"
                        className="btn-delete-day"
                        onClick={() => handleRemoveItineraryDay(index)}
                        title="Remove Day"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <textarea
                      rows="3"
                      className="day-details-input"
                      value={dayItem.details || ''}
                      onChange={(e) => handleUpdateItineraryDay(index, 'details', e.target.value)}
                      placeholder="Detailed sightseeing, activities, meals, and overnight stay info..."
                    ></textarea>
                  </div>
                ))}

                {formData.itinerary.length === 0 && (
                  <div className="empty-itinerary-state">
                    <Calendar size={32} className="text-slate-500" />
                    <p>No itinerary days added yet. Click "+ Add Day" to create the schedule.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INCLUSIONS & EXCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div className="tab-pane pane-grid-2">
              {/* Inclusions Box */}
              <div className="chip-editor-box">
                <div className="chip-box-title text-emerald-400">
                  <CheckCircle2 size={16} />
                  <span>Package Inclusions ({formData.inclusions.length})</span>
                </div>

                <div className="chip-input-row">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInclusion(); } }}
                    placeholder="e.g. Daily Breakfast & Dinner"
                  />
                  <button type="button" onClick={handleAddInclusion} className="btn-add-chip">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="chips-list">
                  {formData.inclusions.map((item, idx) => (
                    <div key={idx} className="chip-item chip-inc">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveInclusion(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions Box */}
              <div className="chip-editor-box">
                <div className="chip-box-title text-rose-400">
                  <AlertCircle size={16} />
                  <span>Package Exclusions ({formData.exclusions.length})</span>
                </div>

                <div className="chip-input-row">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddExclusion(); } }}
                    placeholder="e.g. Airfare / Train tickets"
                  />
                  <button type="button" onClick={handleAddExclusion} className="btn-add-chip">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="chips-list">
                  {formData.exclusions.map((item, idx) => (
                    <div key={idx} className="chip-item chip-exc">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveExclusion(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="editor-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-save-package"
              disabled={saving}
            >
              {saving ? (
                <span className="spinner-sm"></span>
              ) : (
                <Save size={16} />
              )}
              <span>{saving ? 'Writing to File Database...' : isNew ? 'Create & Save Package' : 'Save Package Updates'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 14, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          overflow-y: auto;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .editor-modal-container {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          width: 100%;
          max-width: 860px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7);
          color: #f8fafc;
          overflow: hidden;
          animation: modalPop 0.25s ease-out;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .editor-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 30px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 23, 42, 0.6);
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 3px 10px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        .editor-title {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px;
          max-width: 600px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .editor-meta-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge-id {
          font-size: 11px;
          font-family: monospace;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
          color: #94a3b8;
        }

        .badge-cat {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .cat-dom { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
        .cat-int { background: rgba(236, 72, 153, 0.15); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.3); }

        .badge-dest {
          font-size: 11px;
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .editor-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-preview-sm {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cbd5e1;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-preview-sm:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .editor-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #94a3b8;
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .editor-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .editor-tabs-nav {
          display: flex;
          background: rgba(10, 15, 30, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
          padding: 4px 20px 0;
          gap: 4px;
        }

        .editor-tab-btn {
          background: none;
          border: none;
          color: #94a3b8;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .editor-tab-btn:hover {
          color: #f1f5f9;
        }

        .editor-tab-btn.active {
          color: #f59e0b;
          border-bottom-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .editor-form-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 30px;
          display: flex;
          flex-direction: column;
        }

        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pane-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .editor-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .editor-field label {
          font-size: 12.5px;
          font-weight: 700;
          color: #cbd5e1;
        }

        .editor-field input,
        .editor-field select,
        .editor-field textarea {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13.5px;
          color: #ffffff;
          outline: none;
          transition: border-color 0.2s;
        }

        .editor-field input:focus,
        .editor-field select:focus,
        .editor-field textarea:focus {
          border-color: #f59e0b;
        }

        .field-hint {
          font-size: 11px;
          color: #64748b;
        }

        .rating-inputs-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .image-mode-selector-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 12px;
          flex-wrap: wrap;
        }

        .image-mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .image-mode-pill:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
        }

        .image-mode-pill.active {
          background: rgba(245, 158, 11, 0.18);
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .upload-dropzone-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .image-upload-dropzone {
          border: 2px dashed rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.03);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-upload-dropzone:hover,
        .image-upload-dropzone.drag-over {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.08);
          transform: translateY(-1px);
        }

        .dropzone-center-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .dropzone-icon-bubble {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .dropzone-title {
          font-size: 13.5px;
          color: #e2e8f0;
          font-weight: 600;
        }

        .dropzone-subtitle {
          font-size: 11.5px;
          color: #94a3b8;
        }

        .spinner-amber {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(245, 158, 11, 0.2);
          border-top-color: #f59e0b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .upload-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 8px 12px;
          color: #fca5a5;
          font-size: 12px;
        }

        .upload-success-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 10px;
          padding: 8px 12px;
          color: #34d399;
          font-size: 12px;
        }

        .image-preview-card {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 14px;
          margin-top: 10px;
        }

        .preview-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .preview-label {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
        }

        .btn-clear-image {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-clear-image:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .preview-image-container {
          width: 100%;
          height: 230px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .preview-img-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .preview-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay-info {
          position: absolute;
          bottom: 8px;
          left: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .img-path-tag {
          font-size: 10.5px;
          color: #94a3b8;
          font-family: monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .image-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 13px;
        }

        .curated-presets-section {
          margin-top: 10px;
        }

        .preset-label {
          font-size: 12px;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 10px;
          display: block;
        }

        .presets-row {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .preset-thumb {
          position: relative;
          width: 120px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          flex-shrink: 0;
          transition: transform 0.15s, border-color 0.15s;
        }

        .preset-thumb:hover {
          transform: translateY(-2px);
          border-color: rgba(245, 158, 11, 0.5);
        }

        .preset-thumb.selected {
          border-color: #f59e0b;
        }

        .preset-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preset-check {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: #f59e0b;
          color: #000;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .itinerary-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 10px;
        }

        .btn-add-day {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .itinerary-days-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .itinerary-day-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 14px;
        }

        .day-box-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .day-badge {
          background: #f59e0b;
          color: #0f172a;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .day-title-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #ffffff;
        }

        .btn-delete-day {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .day-details-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12.5px;
          color: #cbd5e1;
        }

        .empty-itinerary-state {
          text-align: center;
          padding: 30px;
          color: #64748b;
        }

        .chip-editor-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chip-box-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .chip-input-row {
          display: flex;
          gap: 8px;
        }

        .chip-input-row input {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 13px;
          color: #fff;
        }

        .btn-add-chip {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
        }

        .chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .chip-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 600;
        }

        .chip-inc {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        .chip-exc {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .chip-item button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 2px;
          display: flex;
        }

        .editor-footer {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .btn-save-package {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #0f172a;
          border: none;
          padding: 10px 22px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
          transition: all 0.2s;
        }

        .btn-save-package:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }

        .btn-save-package:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (max-width: 640px) {
          .pane-grid-2 { grid-template-columns: 1fr; }
          .editor-modal-container { max-height: 95vh; }
          .editor-tabs-nav { padding: 4px 10px 0; }
          .editor-tab-btn { padding: 10px 12px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
