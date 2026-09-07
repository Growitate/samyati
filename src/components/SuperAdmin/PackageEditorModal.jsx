import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  Star,
  UploadCloud,
  Check,
  Building2,
  Tag,
  Eye,
  RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS, ADMIN_STORAGE_KEYS } from '../../config/adminConfig';

const PRESET_DESTINATION_IMAGES = {
  kashmir: [
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85'
  ],
  himachal: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=85'
  ],
  kerala: [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
  ],
  goa: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85'
  ],
  rajasthan: [
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85'
  ],
  bali: [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
  ],
  thailand: [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85'
  ],
  vietnam: [
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85'
  ],
  dubai: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=85',
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

  // Cover image upload states
  const [coverSourceMode, setCoverSourceMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadCoverError, setUploadCoverError] = useState('');
  const [dragOverCover, setDragOverCover] = useState(false);
  const coverFileInputRef = useRef(null);

  // Gallery upload states
  const [gallerySourceMode, setGallerySourceMode] = useState('upload'); // 'upload' | 'url'
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadGalleryError, setUploadGalleryError] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const galleryFileInputRef = useRef(null);

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
    gallery: [],
    hotelPricingOptions: [],
    description: '',
    itinerary: [],
    inclusions: [],
    exclusions: []
  });

  // Temporary inputs for arrays
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newHighlightText, setNewHighlightText] = useState({});

  // Populate form on packageData change
  useEffect(() => {
    if (packageData) {
      const pDest = packageData.destinationId || 'kashmir';
      const defaultPool = PRESET_DESTINATION_IMAGES[pDest] || PRESET_DESTINATION_IMAGES.kashmir;
      const initialGallery = Array.isArray(packageData.gallery) && packageData.gallery.length > 0
        ? [...packageData.gallery]
        : (packageData.image ? [packageData.image, ...defaultPool.slice(0, 3)] : defaultPool);

      const initialHotels = Array.isArray(packageData.hotelPricingOptions) && packageData.hotelPricingOptions.length > 0
        ? packageData.hotelPricingOptions.map(h => ({ ...h }))
        : [
            { hotelName: '03 Star Hotel', price2Pax: 'INR 17,000', price4Pax: 'INR 12,400' },
            { hotelName: '04 Star Hotel', price2Pax: 'INR 22,500', price4Pax: 'INR 16,800' },
            { hotelName: '05 Star Hotel', price2Pax: 'INR 35,000', price4Pax: 'INR 28,000' }
          ];

      setFormData({
        id: packageData.id || '',
        title: packageData.title || '',
        destinationId: packageData.destinationId || 'kashmir',
        destinationName: packageData.destinationName || 'Kashmir',
        category: packageData.category || 'Domestic',
        duration: packageData.duration || '5D / 4N',
        price: packageData.price || '₹18,500',
        originalPrice: packageData.originalPrice || packageData.price || '₹24,000',
        rating: String(packageData.rating || '4.9'),
        reviewsCount: Number(packageData.reviewsCount || 120),
        image: packageData.image || initialGallery[0] || '',
        gallery: initialGallery,
        hotelPricingOptions: initialHotels,
        description: packageData.description || '',
        itinerary: Array.isArray(packageData.itinerary)
          ? packageData.itinerary.map(item => ({
              ...item,
              highlights: Array.isArray(item.highlights) ? [...item.highlights] : []
            }))
          : [],
        inclusions: Array.isArray(packageData.inclusions) ? [...packageData.inclusions] : [],
        exclusions: Array.isArray(packageData.exclusions) ? [...packageData.exclusions] : []
      });
      setImageError(false);
      setUploadCoverError('');
      setUploadGalleryError('');
    } else if (isNew) {
      const firstDest = destinations[0] || { id: 'kashmir', name: 'Kashmir', category: 'Domestic' };
      const pool = PRESET_DESTINATION_IMAGES[firstDest.id] || PRESET_DESTINATION_IMAGES.kashmir;
      setFormData({
        id: `pkg-${Date.now().toString(36)}`,
        title: '',
        destinationId: firstDest.id,
        destinationName: firstDest.name,
        category: firstDest.category || 'Domestic',
        duration: '5D / 4N',
        price: '₹19,999',
        originalPrice: '₹26,000',
        rating: '4.9',
        reviewsCount: 45,
        image: pool[0] || '',
        gallery: [...pool],
        hotelPricingOptions: [
          { hotelName: '03 Star Hotel', price2Pax: 'INR 19,999', price4Pax: 'INR 15,500' },
          { hotelName: '04 Star Hotel', price2Pax: 'INR 26,500', price4Pax: 'INR 21,000' },
          { hotelName: '05 Star Luxury', price2Pax: 'INR 38,000', price4Pax: 'INR 31,000' }
        ],
        description: 'Breathtaking handpicked luxury travel experience curated exclusively by Samyati The World.',
        itinerary: [
          { day: 1, title: 'Arrival & Welcome', description: 'Arrival at destination, private transfer to hotel, check-in, and evening leisure.', details: 'Arrival and check-in.', highlights: ['Private Airport Pickup', 'Luxury Resort Check-in', 'Welcome Dinner'] },
          { day: 2, title: 'Full Day Sightseeing & Culture Tour', description: 'Guided exploration of prominent landmarks, heritage points, and scenic spots.', details: 'Full day excursion.', highlights: ['Guided City Tour', 'Heritage Landmarks', 'Scenic Views'] },
          { day: 3, title: 'Departure with Lifetime Memories', description: 'Breakfast at hotel, check-out, and private transfer to airport with sweet memories.', details: 'Transfer to departure point.', highlights: ['Breakfast & Check-out', 'Private Airport Drop'] }
        ],
        inclusions: [
          '3-Star / 4-Star Luxury Resort Accommodation',
          'Daily Gourmet Breakfast & Dinner',
          'Dedicated Private AC Vehicle for all transfers & tours',
          '24x7 Samyati Personal Concierge & Trip Assistance'
        ],
        exclusions: [
          'Flight / Train tickets to and from destination',
          'Personal shopping, laundry, tips and camera permits',
          'Any entrance fees or activities not mentioned in inclusions'
        ]
      });
      setImageError(false);
      setUploadCoverError('');
      setUploadGalleryError('');
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

  // --- IMAGE UPLOAD HANDLERS ---
  const uploadFileToServer = async (file) => {
    const token = sessionStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || localStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || '';
    const reader = new FileReader();
    const base64Data = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

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
      return data.url;
    }
    // Fallback to client base64 preview
    return base64Data;
  };

  // Single cover image upload
  const handleCoverFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadCoverError('Please select a valid image file (JPG, PNG, WEBP, AVIF).');
      return;
    }
    setUploadingCover(true);
    setUploadCoverError('');
    try {
      const url = await uploadFileToServer(file);
      setFormData(prev => {
        const nextGallery = prev.gallery.includes(url) ? prev.gallery : [url, ...prev.gallery];
        return { ...prev, image: url, gallery: nextGallery };
      });
      setImageError(false);
    } catch (err) {
      setUploadCoverError('Failed to upload image: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Multiple gallery images upload
  const handleGalleryFilesUpload = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      setUploadGalleryError('Please select valid image files.');
      return;
    }

    setUploadingGallery(true);
    setUploadGalleryError('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadFileToServer(file);
        uploadedUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls]
      }));
    } catch (err) {
      setUploadGalleryError('Failed to upload some gallery photos: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const url = newGalleryUrl.trim();
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.includes(url) ? prev.gallery : [...prev.gallery, url]
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => {
      const removed = prev.gallery[index];
      const nextGallery = prev.gallery.filter((_, i) => i !== index);
      let nextCover = prev.image;
      if (nextCover === removed) {
        nextCover = nextGallery[0] || '';
      }
      return { ...prev, gallery: nextGallery, image: nextCover };
    });
  };

  const handleSetAsCover = (imgUrl) => {
    setFormData(prev => ({ ...prev, image: imgUrl }));
    setImageError(false);
  };

  const handleMoveGalleryImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= formData.gallery.length) return;
    setFormData(prev => {
      const copy = [...prev.gallery];
      const item = copy.splice(fromIdx, 1)[0];
      copy.splice(toIdx, 0, item);
      return { ...prev, gallery: copy };
    });
  };

  // --- HOTEL TIER PRICING HANDLERS ---
  const handleAddHotelTier = () => {
    const tierNum = formData.hotelPricingOptions.length + 3;
    setFormData(prev => ({
      ...prev,
      hotelPricingOptions: [
        ...prev.hotelPricingOptions,
        {
          hotelName: `0${tierNum} Star Hotel`,
          price2Pax: 'INR 25,000',
          price4Pax: 'INR 19,000'
        }
      ]
    }));
  };

  const handleUpdateHotelTier = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.hotelPricingOptions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, hotelPricingOptions: updated };
    });
  };

  const handleRemoveHotelTier = (index) => {
    setFormData(prev => ({
      ...prev,
      hotelPricingOptions: prev.hotelPricingOptions.filter((_, i) => i !== index)
    }));
  };

  // --- ITINERARY HANDLERS ---
  const handleAddItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: nextDay,
          title: `Day ${nextDay} Sightseeing & Experience`,
          description: `Full day exploration of scenic highlights and transfers.`,
          details: `Day ${nextDay} sightseeing.`,
          highlights: ['Guided Tour', 'Scenic Sightseeing', 'Resort Stay']
        }
      ]
    }));
  };

  const handleUpdateItineraryDay = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'description') updated[index].details = value;
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

  const handleAddDayHighlight = (dayIndex) => {
    const text = (newHighlightText[dayIndex] || '').trim();
    if (!text) return;
    setFormData(prev => {
      const updated = [...prev.itinerary];
      const currHighlights = Array.isArray(updated[dayIndex].highlights) ? [...updated[dayIndex].highlights] : [];
      updated[dayIndex] = { ...updated[dayIndex], highlights: [...currHighlights, text] };
      return { ...prev, itinerary: updated };
    });
    setNewHighlightText(prev => ({ ...prev, [dayIndex]: '' }));
  };

  const handleRemoveDayHighlight = (dayIndex, hIdx) => {
    setFormData(prev => {
      const updated = [...prev.itinerary];
      const currHighlights = Array.isArray(updated[dayIndex].highlights) ? [...updated[dayIndex].highlights] : [];
      updated[dayIndex] = {
        ...updated[dayIndex],
        highlights: currHighlights.filter((_, i) => i !== hIdx)
      };
      return { ...prev, itinerary: updated };
    });
  };

  // --- INCLUSIONS / EXCLUSIONS ---
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

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Package title is required.');
      return;
    }
    if (!formData.price.trim()) {
      alert('Starting price is required.');
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
    <div className="editor-modal-backdrop" onClick={onClose}>
      <div className="editor-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="editor-header">
          <div className="header-left-group">
            <div className="header-eyebrow">
              <Sparkles size={14} className="text-gold" />
              <span>{isNew ? 'CREATE NEW PACKAGE' : 'EDIT PACKAGE'}</span>
            </div>
            <h2 className="editor-pkg-title">
              {formData.title || (isNew ? 'New Travel Package' : 'Package Editor')}
            </h2>
            <div className="header-meta-tags">
              <span className="id-tag">ID: <code>{formData.id}</code></span>
              <span className={`cat-tag ${formData.category === 'Domestic' ? 'cat-dom' : 'cat-int'}`}>
                {formData.category}
              </span>
              <span className="dest-tag">{formData.destinationName}</span>
            </div>
          </div>

          <div className="header-right-actions">
            {onPreview && (
              <button
                type="button"
                className="btn-modal-preview"
                onClick={() => onPreview(formData)}
                title="Preview this package in customer view"
              >
                <Eye size={15} />
                <span>Live Preview</span>
              </button>
            )}

            <button className="btn-close-modal" onClick={onClose} title="Close Editor">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="editor-tabs-bar">
          <button
            type="button"
            className={`editor-tab-item ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <DollarSign size={15} />
            <span>Pricing & Hotel Tiers</span>
          </button>

          <button
            type="button"
            className={`editor-tab-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={15} />
            <span>Content & Details</span>
          </button>

          <button
            type="button"
            className={`editor-tab-item ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <ImageIcon size={15} />
            <span>Images & Gallery ({formData.gallery.length})</span>
          </button>

          <button
            type="button"
            className={`editor-tab-item ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <Calendar size={15} />
            <span>Itinerary ({formData.itinerary.length} Days)</span>
          </button>

          <button
            type="button"
            className={`editor-tab-item ${activeTab === 'inclusions' ? 'active' : ''}`}
            onClick={() => setActiveTab('inclusions')}
          >
            <CheckCircle2 size={15} />
            <span>Inclusions & Exclusions</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="editor-form-wrapper">
          {/* TAB 1: PRICING & HOTEL TIERS */}
          {activeTab === 'pricing' && (
            <div className="tab-section-pane">
              <div className="form-grid-2">
                <div className="form-field full-span">
                  <label>Package Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kashmir 06 Days Itinerary Srinagar to Srinagar"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Selling Price (Starting at) *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. ₹18,500"
                    required
                  />
                  <span className="field-subtext">Base price shown on cards & hero</span>
                </div>

                <div className="form-field">
                  <label>Original / Strikethrough Price</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. ₹24,000"
                  />
                  <span className="field-subtext">Shown crossed-out to highlight discount</span>
                </div>

                <div className="form-field">
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

                <div className="form-field">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Domestic">Domestic (Desh)</option>
                    <option value="International">International (Videsh)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 5D / 4N"
                  />
                </div>

                <div className="form-field">
                  <label>Rating & Reviews Count</label>
                  <div className="rating-inputs-flex">
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
                    <span className="field-subtext">Reviews</span>
                  </div>
                </div>
              </div>

              {/* HOTEL PRICING OPTIONS BREAKDOWN */}
              <div className="hotel-pricing-box">
                <div className="hotel-box-header">
                  <div className="hotel-header-title">
                    <Building2 size={18} className="text-gold" />
                    <div>
                      <h4>Hotel & Room Category Pricing Tiers</h4>
                      <p>Guest tier pricing breakdown displayed on the live package detail calculator.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddHotelTier}
                    className="btn-add-hotel-tier"
                  >
                    <Plus size={14} />
                    <span>Add Tier</span>
                  </button>
                </div>

                <div className="hotel-tiers-list">
                  {formData.hotelPricingOptions.map((tier, idx) => (
                    <div key={idx} className="hotel-tier-row">
                      <div className="tier-col-name">
                        <label>Hotel Category</label>
                        <input
                          type="text"
                          value={tier.hotelName || ''}
                          onChange={(e) => handleUpdateHotelTier(idx, 'hotelName', e.target.value)}
                          placeholder="e.g. 04 Star Deluxe"
                        />
                      </div>

                      <div className="tier-col-price">
                        <label>2 Pax Price</label>
                        <input
                          type="text"
                          value={tier.price2Pax || ''}
                          onChange={(e) => handleUpdateHotelTier(idx, 'price2Pax', e.target.value)}
                          placeholder="INR 22,500"
                        />
                      </div>

                      <div className="tier-col-price">
                        <label>4 Pax Price</label>
                        <input
                          type="text"
                          value={tier.price4Pax || ''}
                          onChange={(e) => handleUpdateHotelTier(idx, 'price4Pax', e.target.value)}
                          placeholder="INR 16,800"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveHotelTier(idx)}
                        className="btn-remove-tier"
                        title="Delete Tier"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  {formData.hotelPricingOptions.length === 0 && (
                    <div className="hotel-empty-state">
                      <Building2 size={24} className="text-slate-400" />
                      <span>No custom hotel pricing tiers defined. Click "+ Add Tier" above.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & DESCRIPTION */}
          {activeTab === 'content' && (
            <div className="tab-section-pane">
              <div className="form-field full-span">
                <label>Tour Overview & Narrative Description *</label>
                <textarea
                  rows="7"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the journey experience, highlights, stays, destinations covered, and authentic consultant insights..."
                  required
                ></textarea>
                <span className="field-subtext">
                  Shown prominently on the package detail page and summary cards.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES & GALLERY (CRITICAL USER REQUIREMENT) */}
          {activeTab === 'images' && (
            <div className="tab-section-pane">
              {/* SECTION 1: PRIMARY COVER PHOTO */}
              <div className="images-sub-section">
                <div className="sub-section-title">
                  <ImageIcon size={17} className="text-gold" />
                  <h4>Primary Cover Image</h4>
                  <span className="section-pill-tag">Shown on cards and hero banner</span>
                </div>

                {/* Source Mode Pills */}
                <div className="image-mode-pills-row">
                  <button
                    type="button"
                    className={`mode-pill ${coverSourceMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setCoverSourceMode('upload')}
                  >
                    <UploadCloud size={14} />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    className={`mode-pill ${coverSourceMode === 'url' ? 'active' : ''}`}
                    onClick={() => setCoverSourceMode('url')}
                  >
                    <ExternalLink size={14} />
                    <span>Image URL</span>
                  </button>

                  {PRESET_DESTINATION_IMAGES[formData.destinationId] && (
                    <button
                      type="button"
                      className={`mode-pill ${coverSourceMode === 'presets' ? 'active' : ''}`}
                      onClick={() => setCoverSourceMode('presets')}
                    >
                      <Sparkles size={14} />
                      <span>Presets ({PRESET_DESTINATION_IMAGES[formData.destinationId]?.length})</span>
                    </button>
                  )}
                </div>

                {/* Mode: Dropzone */}
                {coverSourceMode === 'upload' && (
                  <div className="dropzone-box">
                    <div
                      className={`upload-dropzone ${dragOverCover ? 'drag-over' : ''} ${uploadingCover ? 'uploading' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOverCover(true); }}
                      onDragLeave={() => setDragOverCover(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverCover(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleCoverFileUpload(file);
                      }}
                      onClick={() => coverFileInputRef.current?.click()}
                    >
                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCoverFileUpload(file);
                        }}
                      />

                      {uploadingCover ? (
                        <div className="dropzone-content">
                          <span className="spinner-gold"></span>
                          <strong>Uploading & Saving Image...</strong>
                          <span>Saved to <code>public/uploads</code></span>
                        </div>
                      ) : (
                        <div className="dropzone-content">
                          <UploadCloud size={32} className="text-gold" />
                          <strong>Drag & drop a photo, or <u className="text-gold">browse files</u></strong>
                          <span>Supports JPG, PNG, WEBP, AVIF (Max 15MB)</span>
                        </div>
                      )}
                    </div>

                    {uploadCoverError && (
                      <div className="upload-error-tag">
                        <AlertCircle size={14} />
                        <span>{uploadCoverError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode: URL */}
                {coverSourceMode === 'url' && (
                  <div className="form-field">
                    <label>Cover Photo URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImageError(false);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                )}

                {/* Mode: Presets */}
                {coverSourceMode === 'presets' && PRESET_DESTINATION_IMAGES[formData.destinationId] && (
                  <div className="presets-gallery-row">
                    {PRESET_DESTINATION_IMAGES[formData.destinationId].map((imgUrl, i) => (
                      <div
                        key={i}
                        className={`preset-thumb-card ${formData.image === imgUrl ? 'active' : ''}`}
                        onClick={() => handleSetAsCover(imgUrl)}
                      >
                        <img src={imgUrl} alt={`Preset ${i + 1}`} />
                        {formData.image === imgUrl && (
                          <div className="selected-overlay">
                            <Check size={14} />
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cover Preview Card */}
                {formData.image && (
                  <div className="cover-preview-card">
                    <div className="cover-img-wrap">
                      <img
                        src={formData.image}
                        alt="Cover Preview"
                        onError={() => setImageError(true)}
                      />
                      <div className="cover-badge-tag">Current Cover Image</div>
                    </div>
                    <div className="cover-info-wrap">
                      <span className="cover-url-text" title={formData.image}>{formData.image}</span>
                      <button
                        type="button"
                        className="btn-clear-cover"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        <Trash2 size={13} />
                        <span>Remove Cover</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: TOUR PHOTO GALLERY (CRITICAL USER REQUIREMENT) */}
              <div className="images-sub-section gallery-section">
                <div className="sub-section-title">
                  <Layers size={17} className="text-gold" />
                  <h4>Tour Photo Gallery ({formData.gallery.length} Photos)</h4>
                  <span className="section-pill-tag">Displayed on live package detail carousel</span>
                </div>

                {/* Gallery Upload Controls */}
                <div className="gallery-upload-controls">
                  <div className="upload-gallery-buttons">
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleGalleryFilesUpload(e.target.files)}
                    />

                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="btn-upload-gallery-files"
                      disabled={uploadingGallery}
                    >
                      {uploadingGallery ? (
                        <>
                          <span className="spinner-gold-sm"></span>
                          <span>Uploading Photos...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} />
                          <span>Upload Photos from Device (Multiple)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Add URL Row */}
                  <div className="add-url-gallery-row">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Paste photo URL to add to gallery..."
                      className="gallery-url-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="btn-add-url-btn"
                    >
                      <Plus size={15} />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  {uploadGalleryError && (
                    <div className="upload-error-tag">
                      <AlertCircle size={14} />
                      <span>{uploadGalleryError}</span>
                    </div>
                  )}
                </div>

                {/* Gallery Thumbnails Grid */}
                <div className="gallery-cards-grid">
                  {formData.gallery.map((imgUrl, idx) => {
                    const isCover = formData.image === imgUrl;
                    return (
                      <div key={idx} className={`gallery-photo-card ${isCover ? 'is-cover' : ''}`}>
                        <div className="gallery-thumb-wrap">
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=400&q=75';
                            }}
                          />
                          <span className="photo-idx-badge">#{idx + 1}</span>
                          {isCover && (
                            <span className="cover-gold-badge">★ Cover</span>
                          )}
                        </div>

                        <div className="gallery-photo-actions">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(imgUrl)}
                              className="btn-action-small btn-set-cover"
                              title="Set as Cover Photo"
                            >
                              Make Cover
                            </button>
                          )}

                          <div className="move-buttons-flex">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, idx - 1)}
                              disabled={idx === 0}
                              className="btn-action-small"
                              title="Move Left"
                            >
                              <ArrowLeft size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, idx + 1)}
                              disabled={idx === formData.gallery.length - 1}
                              className="btn-action-small"
                              title="Move Right"
                            >
                              <ArrowRight size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="btn-action-small btn-del-photo"
                            title="Delete photo from gallery"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {formData.gallery.length === 0 && (
                    <div className="empty-gallery-state">
                      <ImageIcon size={32} className="text-slate-400" />
                      <h4>No Gallery Photos Yet</h4>
                      <p>Upload photos from your computer or paste image links above to create a rich tour gallery.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ITINERARY BUILDER */}
          {activeTab === 'itinerary' && (
            <div className="tab-section-pane">
              <div className="itinerary-pane-header">
                <div>
                  <h4>Day-by-Day Tour Itinerary ({formData.itinerary.length} Days)</h4>
                  <p>Detailed daily route, activities, stay details, and highlights.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="btn-add-day-pill"
                >
                  <Plus size={14} />
                  <span>Add Day</span>
                </button>
              </div>

              <div className="itinerary-cards-list">
                {formData.itinerary.map((dayItem, index) => (
                  <div key={index} className="itinerary-day-card">
                    <div className="itinerary-card-top">
                      <span className="day-badge-number">Day {dayItem.day || index + 1}</span>
                      <input
                        type="text"
                        value={dayItem.title || ''}
                        onChange={(e) => handleUpdateItineraryDay(index, 'title', e.target.value)}
                        placeholder={`Day ${index + 1} Title (e.g. Arrival in Srinagar + Shikara Ride)`}
                        className="day-title-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(index)}
                        className="btn-remove-day"
                        title="Delete Day"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="day-card-body">
                      <label>Day Narrative Description</label>
                      <textarea
                        rows="3"
                        value={dayItem.description || dayItem.details || ''}
                        onChange={(e) => handleUpdateItineraryDay(index, 'description', e.target.value)}
                        placeholder="Detail the morning excursion, transfer routes, sightseeing stops, meal plans, and resort overnight..."
                        className="day-desc-input"
                      ></textarea>

                      {/* Day Highlights Tags */}
                      <div className="day-highlights-wrapper">
                        <label>Day Highlights & Sightseeing Tags</label>
                        <div className="highlights-chips-list">
                          {Array.isArray(dayItem.highlights) && dayItem.highlights.map((tag, hIdx) => (
                            <span key={hIdx} className="highlight-tag-pill">
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDayHighlight(index, hIdx)}
                                className="btn-remove-tag"
                              >
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="add-highlight-tag-row">
                          <input
                            type="text"
                            value={newHighlightText[index] || ''}
                            onChange={(e) => setNewHighlightText({ ...newHighlightText, [index]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddDayHighlight(index);
                              }
                            }}
                            placeholder="Type highlight tag (e.g. Shikara Ride on Dal Lake)..."
                          />
                          <button
                            type="button"
                            onClick={() => handleAddDayHighlight(index)}
                            className="btn-add-tag-pill"
                          >
                            <Plus size={13} />
                            <span>Add Tag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.itinerary.length === 0 && (
                  <div className="empty-itinerary-state">
                    <Calendar size={32} className="text-slate-400" />
                    <h4>No Itinerary Days Defined</h4>
                    <p>Click "+ Add Day" above to start building the day-by-day itinerary.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INCLUSIONS & EXCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div className="tab-section-pane form-grid-2">
              {/* Inclusions Box */}
              <div className="inclusions-card-box">
                <div className="inc-box-header text-emerald-700">
                  <CheckCircle2 size={17} />
                  <h4>Package Inclusions ({formData.inclusions.length})</h4>
                </div>

                <div className="chip-add-input-row">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclusion();
                      }
                    }}
                    placeholder="e.g. Daily Breakfast & Dinner at Resorts"
                  />
                  <button type="button" onClick={handleAddInclusion} className="btn-add-chip-pill">
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div className="chips-list-wrap">
                  {formData.inclusions.map((item, idx) => (
                    <div key={idx} className="chip-item-pill chip-inclusion">
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveInclusion(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions Box */}
              <div className="inclusions-card-box">
                <div className="inc-box-header text-rose-700">
                  <AlertCircle size={17} />
                  <h4>Package Exclusions ({formData.exclusions.length})</h4>
                </div>

                <div className="chip-add-input-row">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExclusion();
                      }
                    }}
                    placeholder="e.g. Airfare / Train tickets to destination"
                  />
                  <button type="button" onClick={handleAddExclusion} className="btn-add-chip-pill">
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div className="chips-list-wrap">
                  {formData.exclusions.map((item, idx) => (
                    <div key={idx} className="chip-item-pill chip-exclusion">
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

          {/* Form Footer Actions */}
          <div className="editor-modal-footer">
            <button
              type="button"
              className="btn-footer-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-footer-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="btn-spinner-sm"></span>
                  <span>Writing to File Database...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isNew ? 'Create & Save Package' : 'Save Package Updates'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL STYLES matching Samyati Design System */}
      <style>{`
        .editor-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .editor-modal-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.22);
          width: 100%;
          max-width: 980px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: #141613;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.97) translateY(14px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Header */
        .editor-header {
          padding: 20px 28px;
          background: #fefce8;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #92400e;
          background: #fef3c7;
          padding: 3px 10px;
          border-radius: 9999px;
          margin-bottom: 6px;
        }

        .text-gold { color: #d97706; }

        .editor-pkg-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          font-weight: 700;
          color: #141613;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .header-meta-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .id-tag {
          font-size: 11px;
          color: #64748b;
        }

        .id-tag code {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: #334155;
        }

        .cat-tag {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .cat-dom { background: #0f172a; color: #ffffff; }
        .cat-int { background: #d97706; color: #ffffff; }

        .dest-tag {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-modal-preview {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 8px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-modal-preview:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .btn-close-modal {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-close-modal:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        /* Tabs Bar matching Website filter-pill-group */
        .editor-tabs-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 24px;
          overflow-x: auto;
        }

        .editor-tab-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          background: transparent;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .editor-tab-item:hover {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.05);
        }

        .editor-tab-item.active {
          color: #ffffff;
          background: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        /* Form Content */
        .editor-form-wrapper {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex-grow: 1;
        }

        .tab-section-pane {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .full-span {
          grid-column: 1 / -1;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 12.5px;
          font-weight: 700;
          color: #1e293b;
        }

        .form-field input, .form-field select, .form-field textarea {
          width: 100%;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 13.5px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
          background: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12);
        }

        .field-subtext {
          font-size: 11.5px;
          color: #64748b;
        }

        .rating-inputs-flex {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Hotel Pricing Box */
        .hotel-pricing-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 16px;
          padding: 18px 20px;
          margin-top: 8px;
        }

        .hotel-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .hotel-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hotel-header-title h4 {
          font-size: 14.5px;
          font-weight: 800;
          color: #92400e;
          margin: 0 0 2px;
        }

        .hotel-header-title p {
          font-size: 12px;
          color: #b45309;
          margin: 0;
        }

        .btn-add-hotel-tier {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #fde68a;
          color: #92400e;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-add-hotel-tier:hover {
          background: #fef3c7;
        }

        .hotel-tiers-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hotel-tier-row {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: #ffffff;
          border: 1px solid #fde68a;
          padding: 12px 16px;
          border-radius: 12px;
        }

        .tier-col-name { flex: 2; }
        .tier-col-price { flex: 1.5; }

        .tier-col-name label, .tier-col-price label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          display: block;
          margin-bottom: 4px;
        }

        .tier-col-name input, .tier-col-price input {
          width: 100%;
          padding: 8px 10px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
        }

        .btn-remove-tier {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hotel-empty-state {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          color: #94a3b8;
          font-size: 13px;
          justify-content: center;
        }

        /* Images Sub Section */
        .images-sub-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sub-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sub-section-title h4 {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .section-pill-tag {
          font-size: 11px;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .image-mode-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }

        .mode-pill.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .upload-dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 14px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .upload-dropzone:hover, .upload-dropzone.drag-over {
          border-color: #d97706;
          background: #fefce8;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .dropzone-content strong {
          font-size: 13.5px;
          color: #0f172a;
        }

        .dropzone-content span {
          font-size: 12px;
          color: #64748b;
        }

        .upload-error-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc2626;
          font-size: 12px;
          margin-top: 8px;
        }

        .presets-gallery-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0;
        }

        .preset-thumb-card {
          width: 110px;
          height: 75px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .preset-thumb-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preset-thumb-card.active {
          border-color: #d97706;
        }

        .selected-overlay {
          position: absolute;
          inset: 0;
          background: rgba(217, 119, 6, 0.85);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        /* Cover Preview Card */
        .cover-preview-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 12px;
        }

        .cover-img-wrap {
          width: 90px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .cover-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-badge-tag {
          position: absolute;
          bottom: 2px;
          left: 2px;
          background: rgba(15, 23, 42, 0.8);
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .cover-info-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          gap: 12px;
        }

        .cover-url-text {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 480px;
        }

        .btn-clear-cover {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Gallery Section */
        .gallery-section {
          background: #fafaf9;
          border: 1px solid #e7e5e4;
        }

        .gallery-upload-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .upload-gallery-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-upload-gallery-files {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0f172a;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }

        .btn-upload-gallery-files:hover {
          background: #1e293b;
        }

        .add-url-gallery-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gallery-url-input {
          flex: 1;
          padding: 9px 12px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
        }

        .btn-add-url-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-add-url-btn:hover {
          background: #f8fafc;
        }

        /* Gallery Grid */
        .gallery-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 10px;
        }

        .gallery-photo-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
        }

        .gallery-photo-card.is-cover {
          border-color: #d97706;
          box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
        }

        .gallery-thumb-wrap {
          width: 100%;
          height: 110px;
          position: relative;
          background: #e2e8f0;
        }

        .gallery-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-idx-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .cover-gold-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #d97706;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .gallery-photo-actions {
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          gap: 4px;
        }

        .btn-action-small {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 6px;
          padding: 3px 6px;
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-action-small:hover:not(:disabled) {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .btn-action-small:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .btn-del-photo {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fecaca;
        }

        .btn-del-photo:hover {
          background: #dc2626 !important;
          color: #ffffff !important;
        }

        .btn-set-cover {
          color: #d97706;
          background: #fef3c7;
          border-color: #fde68a;
        }

        .move-buttons-flex {
          display: flex;
          gap: 3px;
        }

        .empty-gallery-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 32px;
          color: #94a3b8;
        }

        .empty-gallery-state h4 {
          color: #334155;
          margin: 8px 0 4px;
        }

        /* Itinerary Cards */
        .itinerary-pane-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .itinerary-pane-header h4 {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .itinerary-pane-header p {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .btn-add-day-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0f172a;
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }

        .itinerary-cards-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .itinerary-day-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .itinerary-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .day-badge-number {
          background: #0f172a;
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          flex-shrink: 0;
        }

        .day-title-input {
          flex: 1;
          padding: 8px 12px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          outline: none;
        }

        .btn-remove-day {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .day-card-body label {
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
        }

        .day-desc-input {
          width: 100%;
          padding: 8px 12px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }

        .day-highlights-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 10px;
        }

        .highlights-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .highlight-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fefce8;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 11.5px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .btn-remove-tag {
          background: none;
          border: none;
          color: #92400e;
          cursor: pointer;
          padding: 0;
          display: flex;
        }

        .add-highlight-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .add-highlight-tag-row input {
          flex: 1;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12px;
          outline: none;
        }

        .btn-add-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Inclusions & Exclusions */
        .inclusions-card-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .inc-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .inc-box-header h4 {
          font-size: 14px;
          font-weight: 800;
          margin: 0;
        }

        .chip-add-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chip-add-input-row input {
          flex: 1;
          padding: 9px 12px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
        }

        .btn-add-chip-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .chips-list-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 280px;
          overflow-y: auto;
        }

        .chip-item-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
        }

        .chip-item-pill button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: inherit;
        }

        .chip-inclusion {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .chip-exclusion {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #9f1239;
        }

        /* Footer */
        .editor-modal-footer {
          padding: 16px 28px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-footer-cancel {
          padding: 10px 18px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }

        .btn-footer-cancel:hover {
          background: #f1f5f9;
        }

        .btn-footer-save {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
          transition: all 0.2s ease;
        }

        .btn-footer-save:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-1px);
        }

        .btn-footer-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-gold {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(217, 119, 6, 0.25);
          border-top-color: #d97706;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinner-gold-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-spinner-sm {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .editor-modal-card { max-height: 98vh; border-radius: 16px; }
          .form-grid-2 { grid-template-columns: 1fr; }
          .gallery-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .hotel-tier-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </div>
  );
}
