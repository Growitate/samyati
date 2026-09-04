import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, MapPin, CheckCircle2, XCircle, Calendar, Sparkles, ShieldCheck, PhoneCall, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Share2, Star, Send, Image as ImageIcon, Check, Building2, Utensils, Car, Compass, CreditCard, QrCode, Users, Lock, Download, Printer, Plus, Minus, ArrowRight, MessageSquare, Wallet, Tag } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { scrollTo } from '../smoothScroll';

export default function PackageDetailPage({ packageData, onBack, onOpenOfferModal }) {
  const { packages: PACKAGES } = usePackages();
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Inquiry States
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Direct Booking & Payment Gateway States
  const [bookingStep, setBookingStep] = useState(1); // 1: Customize, 2: Details, 3: Payment
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hotelClass, setHotelClass] = useState('deluxe'); // 'standard', 'deluxe', 'luxury'
  const [addons, setAddons] = useState({
    privateCar: false,
    candleDinner: false,
    photoPass: false
  });

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState(null);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMsg({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }

    if (code === 'SAMYATI10') {
      const disc = Math.round(parseNum(packageData.price) * 0.10 * adults);
      setAppliedCoupon({ code: 'SAMYATI10', discountAmount: disc, label: '10% OFF' });
      setCouponMsg({ type: 'success', text: `Success! SAMYATI10 applied (Saved ₹${disc.toLocaleString('en-IN')})` });
    } else if (code === 'EARLYBIRD') {
      const disc = 1500;
      setAppliedCoupon({ code: 'EARLYBIRD', discountAmount: disc, label: '₹1,500 OFF' });
      setCouponMsg({ type: 'success', text: 'Success! EARLYBIRD applied (Saved ₹1,500)' });
    } else if (code === 'WELCOME500') {
      const disc = 500;
      setAppliedCoupon({ code: 'WELCOME500', discountAmount: disc, label: '₹500 OFF' });
      setCouponMsg({ type: 'success', text: 'Success! WELCOME500 applied (Saved ₹500)' });
    } else {
      setAppliedCoupon(null);
      setCouponMsg({ type: 'error', text: 'Invalid coupon. Try SAMYATI10, EARLYBIRD, or WELCOME500.' });
    }
  };

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentOption, setPaymentOption] = useState('advance'); // 'advance' (25%), 'full' (100%)
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay', 'phonepe', 'paytm'
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [isDirectBookingModalOpen, setIsDirectBookingModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Mobile Swiping Gallery States & Handlers
  const [mobileActiveImg, setMobileActiveImg] = useState(0);
  const mobileSliderRef = React.useRef(null);

  const handleMobileSliderScroll = () => {
    if (mobileSliderRef.current) {
      const { scrollLeft, clientWidth } = mobileSliderRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        setMobileActiveImg(index);
      }
    }
  };

  const scrollToMobileSlide = (index) => {
    if (mobileSliderRef.current) {
      const clientWidth = mobileSliderRef.current.clientWidth;
      mobileSliderRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth'
      });
      setMobileActiveImg(index);
    }
  };

  const handlePrevMobileSlide = (e) => {
    e.stopPropagation();
    if (mobileActiveImg > 0) {
      scrollToMobileSlide(mobileActiveImg - 1);
    }
  };

  const handleNextMobileSlide = (e) => {
    e.stopPropagation();
    if (mobileActiveImg < galleryImages.length - 1) {
      scrollToMobileSlide(mobileActiveImg + 1);
    }
  };

  useEffect(() => {
    scrollTo(0, { immediate: true });
  }, [packageData]);

  // Parse numeric price safely if price comes as a string e.g. "₹17,900" or 17900
  const parseNum = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^0-9]/g, '');
      return cleaned ? parseInt(cleaned, 10) : 15400;
    }
    return 15400;
  };

  const finalPrice = parseNum(packageData.price);
  const originalPrice = packageData.originalPrice ? parseNum(packageData.originalPrice) : Math.round(finalPrice * 1.35);
  const savings = originalPrice - finalPrice;
  const discountPercent = Math.round((savings / originalPrice) * 100);

  // Dynamic Live Price Calculation Logic
  const baseAdultPrice = finalPrice;
  const baseChildPrice = Math.round(finalPrice * 0.65);
  const hotelUpgradePerAdult = hotelClass === 'deluxe' ? 2500 : hotelClass === 'luxury' ? 6000 : 0;
  const totalHotelUpgrade = hotelUpgradePerAdult * adults;
  const addonsTotal = (addons.privateCar ? 2500 : 0) + (addons.candleDinner ? 3500 : 0) + (addons.photoPass ? 1500 : 0);

  const couponDiscountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const rawTripSubtotal = (baseAdultPrice * adults) + (baseChildPrice * children) + totalHotelUpgrade + addonsTotal;
  const fullPayDiscount = paymentOption === 'full' ? Math.round(rawTripSubtotal * 0.05) : 0;
  const netTripTotal = Math.max(0, rawTripSubtotal - couponDiscountAmount - fullPayDiscount);

  const advanceTokenAmount = Math.round(netTripTotal * 0.25);
  const amountPayableNow = paymentOption === 'advance' ? advanceTokenAmount : netTripTotal;
  const remainingBalance = paymentOption === 'advance' ? (netTripTotal - advanceTokenAmount) : 0;

  const handleExecutePayment = (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !guestEmail) {
      setBookingStep(2);
      alert('Please complete your Guest Contact Details before proceeding to payment.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomId = 'SAM-' + Math.floor(100000 + Math.random() * 900000);
      setBookingId(randomId);
      setBookingSuccessModal(true);
    }, 1200);
  };

  // Dedicated gallery fallback mapper returning 5 dummy images per destination keyword
  const getDestinationGallery = (destName = '', pkgCategory = '', mainImg = '') => {
    const dest = (destName || '').toLowerCase();

    if (dest.includes('kashmir') || dest.includes('sonmarg') || dest.includes('gulmarg') || dest.includes('srinagar') || dest.includes('pahalgam')) {
      return [
        'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('himachal') || dest.includes('manali') || dest.includes('shimla') || dest.includes('kasol') || dest.includes('spiti')) {
      return [
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1605649487212-47bdab06cf6f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('kerala') || dest.includes('munnar') || dest.includes('alleppey') || dest.includes('wayanad')) {
      return [
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('udaipur') || dest.includes('jaisalmer')) {
      return [
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('goa')) {
      return [
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('ladakh') || dest.includes('leh')) {
      return [
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('bali')) {
      return [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('dubai')) {
      return [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('switzerland') || dest.includes('alps')) {
      return [
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1573108037344-934e892c90c7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('vietnam') || dest.includes('hanoi') || dest.includes('da nang') || dest.includes('halong') || dest.includes('saigon') || dest.includes('hoi an')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('sri lanka') || dest.includes('colombo') || dest.includes('kandy') || dest.includes('bentota')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('kazakhstan') || dest.includes('almaty') || dest.includes('charyn') || dest.includes('kolsai')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('uzbekistan') || dest.includes('tashkent') || dest.includes('samarkand') || dest.includes('bukhara')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('georgia') || dest.includes('tbilisi') || dest.includes('kazbegi') || dest.includes('gudauri')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('malaysia') || dest.includes('kuala lumpur') || dest.includes('genting') || dest.includes('langkawi')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
      ];
    }
    if (dest.includes('dubai') || dest.includes('uae') || dest.includes('burj')) {
      return [
        mainImg || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ];
    }

    const baseImg = mainImg || packageData.image || 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85';
    return [
      baseImg,
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ];
  };

  const galleryImages = (packageData.gallery && packageData.gallery.length >= 5)
    ? packageData.gallery
    : getDestinationGallery(packageData.destinationName || packageData.title, packageData.category, packageData.image);

  // Dynamic 5 Package-Specific FAQs Mapper
  const getPackageFaqs = (pkg) => {
    if (pkg.faqs && pkg.faqs.length >= 4) return pkg.faqs;

    const dest = (pkg.destinationName || pkg.title || '').toLowerCase();

    if (dest.includes('kashmir') || dest.includes('gulmarg') || dest.includes('srinagar') || dest.includes('pahalgam') || dest.includes('dharamshala') || dest.includes('dalhousie') || dest.includes('himachal')) {
      return [
        {
          q: `Is snow guaranteed during the ${pkg.title} tour?`,
          a: `Snow is typically present from December through March in high-altitude zones like Gulmarg Phase 2, Khajjiar meadows, and Solang Valley. During spring & summer, you will enjoy pleasant weather, blooming valleys, and lush pine forests.`
        },
        {
          q: `Are Gondola / Cable Car passes and pony rides included in this package?`,
          a: `Private cab transfers, 4★ hotel stays, and breakfast & dinner are pre-included. Gondola cable car passes or local pony rides can be pre-arranged via your Samyati concierge to skip long ticket queues.`
        },
        {
          q: `Is this package suitable for senior citizens and families with children?`,
          a: `Yes! All inter-city transfers and sightseeing are conducted by private chauffeur-driven AC vehicles. Our drivers pace the itinerary comfortably for families, kids, and senior citizens.`
        },
        {
          q: `What heavy woolens or shoes should we pack for ${pkg.destinationName || 'this trip'}?`,
          a: `Heavy woolens, thermal innerwear, snow jackets, and waterproof boots are recommended between November and March. Light jackets and cardigans are sufficient for summer months (April to August).`
        },
        {
          q: `Can we customize the stay duration or upgrade to 5-Star luxury resorts?`,
          a: `100% yes! You can add extra days in Dharamshala/Srinagar, upgrade to 5-Star luxury mountain resorts, or request a romantic candlelit dinner setup through your personal trip concierge.`
        }
      ];
    }

    if (dest.includes('kerala') || dest.includes('munnar') || dest.includes('alleppey') || dest.includes('wayanad')) {
      return [
        {
          q: `What is included in the private Alleppey Houseboat stay for ${pkg.title}?`,
          a: `The houseboat stay includes a private deluxe bedroom with attached bath, AC operating overnight, and all meals (authentic traditional Kerala lunch, evening tea with hot snacks, dinner, and breakfast).`
        },
        {
          q: `How far are Munnar tea plantations from Cochin Airport?`,
          a: `Cochin Airport to Munnar is a scenic 3.5-hour drive past Cheeyappara & Valara waterfalls. Your private chauffeur-driven AC vehicle will pick you up directly from the airport terminal.`
        },
        {
          q: `Is vegetarian / Jain food available during the Kerala tour?`,
          a: `Yes! All partner boutique resorts and houseboats offer dedicated vegetarian and Jain meal options alongside traditional Keralite delicacies upon request.`
        },
        {
          q: `What is the best season to book this ${pkg.duration} Kerala package?`,
          a: `September to March offers pleasant cool weather ideal for sightseeing. June to August monsoon months are popular for Ayurveda treatments and misty green scenery.`
        },
        {
          q: `Can we add Ayurvedic spa massages or Kathakali dance shows?`,
          a: `Yes! Your driver can escort you to licensed authentic Ayurveda spa centers and evening Kathakali / Kalaripayattu cultural performance centers.`
        }
      ];
    }

    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('udaipur') || dest.includes('jaisalmer')) {
      return [
        {
          q: `Does the Jaisalmer desert itinerary include camel safari & Swiss tent stay?`,
          a: `Yes! For desert packages, we arrange private Swiss luxury tents at Sam Sand Dunes complete with camel safari, sunset dune bashing, folk Rajasthani dance, and gala dinner.`
        },
        {
          q: `Are monument entry tickets included in this ${pkg.title} package?`,
          a: `Sightseeing transfers by private AC car and hotel stays are fully included. Monument tickets (Amer Fort, City Palace, Lake Pichola boat) can be pre-purchased via your concierge to bypass queues.`
        },
        {
          q: `What is the distance between Jaipur, Jodhpur, and Udaipur?`,
          a: `Jaipur to Jodhpur is ~5.5 hours drive, and Jodhpur to Udaipur is ~4.5 hours drive via Ranakpur Jain Temple. All drives are made in private AC sedans/SUVs with halts.`
        },
        {
          q: `Are royal heritage palace hotels available for upgrade?`,
          a: `Yes! You can upgrade your package stay to iconic heritage havelis or palace resorts like Taj Lake Palace, Chhatra Sagar, or Oberoi Udaivilas upon request.`
        },
        {
          q: `What is the best time of year to explore Rajasthan?`,
          a: `October to March brings sunny days and cool evenings (12°C - 25°C), perfect for exploring forts, palaces, and desert camps.`
        }
      ];
    }

    if (dest.includes('bali') || dest.includes('thailand') || dest.includes('dubai') || dest.includes('maldives') || dest.includes('switzerland')) {
      return [
        {
          q: `Do Indian passport holders need a visa for ${pkg.destinationName || 'this destination'}?`,
          a: `${dest.includes('bali') || dest.includes('thailand') ? 'Visa on Arrival (VoA) or eVisa is available with minimal documentation.' : dest.includes('maldives') ? 'Free 30-Day Visa on Arrival is granted to all Indian travelers.' : 'Tourist eVisa processing takes 3-5 working days. Samyati visa team will assist with all documentation.'}`
        },
        {
          q: `Are international flights included or can Samyati book them for us?`,
          a: `Package prices cover land transfers, luxury resort stays, and guided excursions. Flight tickets can be added at live airline rates through your Samyati trip designer.`
        },
        {
          q: `Can we request Indian food / vegetarian meals in ${pkg.destinationName || 'international stays'}?`,
          a: `Yes! We curate hotels located near top-rated authentic Indian restaurants and arrange breakfast spreads with Indian & international options.`
        },
        {
          q: `What currency should we carry for local expenses in ${pkg.destinationName || 'the destination'}?`,
          a: `We recommend carrying USD or credit cards, or exchanging local currency at recommended counters upon arrival. Your private driver will guide you to reliable forex counters.`
        },
        {
          q: `Is travel insurance provided with this international package?`,
          a: `Comprehensive travel & medical insurance can be bundled into your booking with 1-click protection via our partner insurers.`
        }
      ];
    }

    return [
      {
        q: `What is included in the ${pkg.title} package price?`,
        a: `This package covers premium 4★/5★ accommodation (${pkg.duration}), daily breakfast and dinner, private chauffeur transfers for all airport pickups and sightseeing, and 24/7 concierge support.`
      },
      {
        q: `Can we customize the day-by-day itinerary for ${pkg.title}?`,
        a: `Yes! Every Samyati package is 100% customizable. You can extend your stay, add custom sightseeing points, or upgrade room categories during consultation.`
      },
      {
        q: `What is the booking deposit and payment schedule?`,
        a: `You can lock in your dates today with just a 25% advance token amount. The remaining 75% balance is due 7 days prior to your travel departure date.`
      },
      {
        q: `What happens if we need to reschedule or cancel our trip?`,
        a: `We offer 100% flexible rescheduling up to 10 days before travel. Cancellations made 15+ days prior to travel receive full refund / credit options under Samyati Shield.`
      },
      {
        q: `Will we have a dedicated human concierge during the trip?`,
        a: `Yes! From the moment you land until departure, you will have a dedicated personal concierge on WhatsApp/Call to assist with driver updates, dining recommendations, and emergency help.`
      }
    ];
  };

  const packageFaqs = getPackageFaqs(packageData);

  // Rich Detailed Itinerary Dummy Data matching exact reference screenshots
  const itineraryDays = (packageData.itinerary && packageData.itinerary.length >= 4) ? packageData.itinerary.map(item => ({
    ...item,
    description: item.description || item.details || `Welcome to ${packageData.destinationName || 'your destination'}. Enjoy guided sightseeing, handpicked luxury resort stays, and private vehicle transfers.`
  })) : [
    {
      day: 1,
      title: `Arrival in Srinagar & Local Sightseeing`,
      description: `Welcome to Srinagar, the Lake City. On arrival at Srinagar Airport/Railway station, begin your tour of Kashmir. You will be transferred to the Hotel. Proceed on a city tour visiting the Shankar Acharya Temple situated on the highest hill of Srinagar, the famous Mughal Gardens (Chashmashahi, Pari Mahal, Nishat & Shalimar). These gardens were Mughal Emperor's concept of Paradise and today these are popular picnic spots. Visit Tulip Garden (if open), Hazratbal Dargah, and Hari Parbat. Overnight stay in hotel.`,
      highlights: ['Airport Pickup & Hotel Check-in', 'Shankaracharya Temple', 'Mughal Gardens Tour', 'Hazratbal Dargah']
    },
    {
      day: 2,
      title: `Sonmarg Excursion`,
      description: `After breakfast, proceed for a full-day excursion to Sonamarg, the "Meadow of Gold". Enjoy scenic drives along the Sindh River with breathtaking views of snow-capped mountains and alpine valleys. Optional pony ride or walk to Thajiwas Glacier where snow remains round the year. Return to Srinagar hotel in the evening for dinner and overnight stay.`,
      highlights: ['Sindh River Scenic Drive', 'Thajiwas Glacier Visit', 'Golden Alpine Meadows']
    },
    {
      day: 3,
      title: `Pahalgam Excursion`,
      description: `After breakfast, check out and drive towards Pahalgam, the "Valley of Shepherds". En route visit saffron fields at Pampore and Avantipur ruins. Upon arrival, explore Betaab Valley, Aru Valley, and Chandanwari by local union cabs. Enjoy a peaceful walk along the Lidder River. Overnight stay at Pahalgam resort.`,
      highlights: ['Pampore Saffron Fields', 'Betaab Valley & Aru Valley', 'Lidder River Walk']
    },
    {
      day: 4,
      title: `Gulmarg Excursion & Houseboat Stay`,
      description: `After breakfast, proceed to Gulmarg, the "Meadow of Flowers". Experience the famous Gulmarg Gondola cable car ride (Phase 1 & Phase 2) offering breathtaking 360-degree views of Apharwat snow peaks. Later in the evening, transfer back to Srinagar for a romantic overnight stay in a luxury traditional Dal Lake houseboat.`,
      highlights: ['Gulmarg Gondola Ride', 'Apharwat Snow Peak', 'Dal Lake Houseboat Stay', 'Shikara Sunset Cruise']
    },
    {
      day: 5,
      title: `Departure from Srinagar`,
      description: `After breakfast at the houseboat, enjoy a complimentary morning Shikara ride on Dal Lake. Check out and transfer to Srinagar Airport/Railway Station for your onward journey, carrying with you the peace of the lakes, the freshness of the valleys, and the unforgettable magic of Kashmir.`,
      highlights: ['Morning Shikara Cruise', 'Souvenir Shopping', 'Airport Departure Transfer']
    }
  ];

  // Stays & Accommodations Dummy Data
  const stayAccommodations = [
    {
      name: 'The Grand Heritage Resort & Spa',
      rating: '5 Star Luxury',
      location: 'Prime Scenic Ridge',
      amenities: ['Free Wi-Fi', 'Infinity Pool', 'Buffet Breakfast & Dinner', 'Spa & Wellness'],
      image: galleryImages[1] || packageData.image
    },
    {
      name: 'Pristine Alpine Chalet & Lake View Stays',
      rating: 'Boutique Luxury',
      location: 'Lakeside Valley',
      amenities: ['Private Balcony', 'Campfire Lounge', 'Organic Dining', '24/7 Butler Service'],
      image: galleryImages[2] || packageData.image
    }
  ];

  // Dynamic destination trail description generator
  const getTrailDescription = (destName = '') => {
    const dest = (destName || '').toLowerCase();

    if (dest.includes('bali')) {
      return `Your journey begins in Bali, the Island of Gods, where emerald rice terraces, sacred sea temples, and serene tropical beaches welcome you. Spend your first day exploring Ubud's cultural heart, including monkey forests and artisan craft villages. Next, travel to Kelingking Beach and Nusa Penida's breathtaking T-Rex cliff viewpoints. Continue your island getaway with a luxury beach resort stay in Seminyak, romantic sunset dinners, and traditional Kecak fire dance performances. The trip ends with unforgettable memories of tropical paradise.`;
    }
    if (dest.includes('ladakh') || dest.includes('leh')) {
      return `Your journey begins in Leh, high in the Himalayas, where clear blue skies, ancient monasteries, and dramatic mountain passes welcome you. Spend your first day acclimating and exploring local markets. The next day takes you over Khardung La Pass (5,359m) to Nubra Valley for double-hump camel rides. Continue to Pangong Tso Lake to witness ever-changing shades of blue and camp under starry night skies before returning to Leh with cherished memories.`;
    }
    if (dest.includes('himachal') || dest.includes('manali') || dest.includes('shimla')) {
      return `Your journey begins in Shimla and Manali, surrounded by snow-capped Himalayan peaks, pine forests, and roaring rivers. Explore Solang Valley snow sports, Kasol river trails, and historic temples before returning home refreshed by alpine air.`;
    }
    if (dest.includes('kerala') || dest.includes('munnar') || dest.includes('alleppey')) {
      return `Your journey begins in Munnar's mist-covered tea gardens and spice plantations. Travel to Alleppey for a private luxury houseboat cruise along palm-fringed backwaters and relax on Kovalam's golden beaches.`;
    }
    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('udaipur')) {
      return `Your journey begins in Jaipur's royal Pink City, exploring historic hill forts and grand palaces. Visit Udaipur's romantic lake palaces and Jaisalmer's golden desert sand dunes under starry skies.`;
    }
    if (dest.includes('dubai')) {
      return `Your journey begins in Dubai, the futuristic city of gold. Marvel at Burj Khalifa views, experience thrilling 4x4 desert dune bashing, Palm Jumeirah luxury yachting, and world-class shopping.`;
    }
    if (dest.includes('switzerland') || dest.includes('alps')) {
      return `Your journey begins in Zurich and Lucerne, surrounded by snow-capped Alpine peaks, glacial lakes, and historic wooden bridges. Ride the Glacier Express panoramic train and visit Jungfraujoch - Top of Europe.`;
    }

    return `Your journey begins in Srinagar, the heart of Kashmir, where calm waters, blooming gardens, and mountain views welcome you into the valley. Spend your first day exploring the spiritual and scenic corners of the city, including Shankaracharya Temple, the famous Mughal Gardens, Hazratbal Dargah, Hari Parbat, and the seasonal beauty of the Tulip Garden, if open. The next day takes you to Sonamarg, the "Meadow of Gold," where the Sindh River flows through breathtaking alpine landscapes and snow-kissed views create a picture-perfect mountain retreat. Continue your Kashmir experience with a full-day excursion to Pahalgam, known as the "Valley of Shepherds," passing through saffron fields, ancient ruins, apple valleys, pine forests, and the soothing Lidder stream. Your fourth day unfolds in Gulmarg, one of Kashmir's most loved hill stations, famous for its meadows, golf course, winter charm, scenic viewpoints, and optional Gondola ride. The trip ends with beautiful memories as you return from Srinagar, carrying with you the peace of the lakes, the freshness of the valleys, and the unforgettable magic of Kashmir.`;
  };

  // Related tours (3 items)
  const relatedTours = PACKAGES.filter(p => p.id !== packageData.id).slice(0, 3);

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    const el = document.getElementById(id);
    if (el) {
      scrollTo(el, { offset: -120 });
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onOpenOfferModal(`Inquiry: ${packageData.title} (${inquiryName})`);
    }, 800);
  };

  return (
    <div className="package-detail-page-full">
      {/* 1. TOP HEADER & BREADCRUMBS BLOCK */}
      <div className="pkg-page-top-header">
        <div className="container max-w-content">
          <div className="top-nav-bar-row">
            <button onClick={onBack} className="btn-top-back">
              <ArrowLeft size={16} />
              <span>Back to Packages</span>
            </button>
          </div>

          <h1 className="pkg-main-headline">{packageData.title}</h1>
        </div>
      </div>

      {/* 2. PHOTO GALLERY (DESKTOP GRID + MOBILE TOUCH SWIPE CAROUSEL) */}
      <div className="container max-w-content pkg-gallery-container">
        {/* Desktop 5-Photo Grid View (visible > 768px) */}
        <div className="pkg-gallery-grid pkg-gallery-grid-desktop">
          <div className="gallery-main-item" onClick={() => { setLightboxIndex(0); setIsLightboxOpen(true); }}>
            <img
              src={galleryImages[0]}
              alt="Featured Main View"
              className="gallery-img-fit"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85'; }}
            />
          </div>
          <div className="gallery-side-grid">
            <div className="gallery-side-item" onClick={() => { setLightboxIndex(1); setIsLightboxOpen(true); }}>
              <img
                src={galleryImages[1]}
                alt="Gallery Detail 1"
                className="gallery-img-fit"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80'; }}
              />
            </div>
            <div className="gallery-side-item" onClick={() => { setLightboxIndex(2); setIsLightboxOpen(true); }}>
              <img
                src={galleryImages[2]}
                alt="Gallery Detail 2"
                className="gallery-img-fit"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'; }}
              />
            </div>
            <div className="gallery-side-item" onClick={() => { setLightboxIndex(3); setIsLightboxOpen(true); }}>
              <img
                src={galleryImages[3]}
                alt="Gallery Detail 3"
                className="gallery-img-fit"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'; }}
              />
            </div>
            <div className="gallery-side-item photo-overlay-item" onClick={() => { setLightboxIndex(4); setIsLightboxOpen(true); }}>
              <img
                src={galleryImages[4] || galleryImages[0]}
                alt="Gallery Detail 4"
                className="gallery-img-fit"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'; }}
              />
              <div className="view-more-photos-overlay">
                <ImageIcon size={18} />
                <span>View All 5 Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Interactive Sideways Swiping Carousel Slider */}
        <div className="pkg-gallery-mobile-wrapper">
          <div
            className="pkg-gallery-mobile-slider"
            ref={mobileSliderRef}
            onScroll={handleMobileSliderScroll}
          >
            {galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="mobile-slide-item"
                onClick={() => { setLightboxIndex(idx); setIsLightboxOpen(true); }}
              >
                <img
                  src={imgUrl}
                  alt={`Destination view ${idx + 1}`}
                  className="mobile-slide-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85'; }}
                />
              </div>
            ))}
          </div>

          {/* Floating Top-Right Image Index Badge (e.g. "1 / 5") */}
          <div className="mobile-gallery-counter-pill">
            <ImageIcon size={13} />
            <span>{mobileActiveImg + 1} / {galleryImages.length}</span>
          </div>

          {/* Floating Bottom-Left "View All 5 Photos" Pill */}
          <button
            className="mobile-view-all-pill"
            onClick={() => { setLightboxIndex(mobileActiveImg); setIsLightboxOpen(true); }}
          >
            <ImageIcon size={15} />
            <span>View All {galleryImages.length} Photos</span>
          </button>

          {/* Overlay Navigation Chevrons for Mobile (Tap or Swipe) */}
          {mobileActiveImg > 0 && (
            <button
              className="mobile-slider-nav-btn prev"
              onClick={handlePrevMobileSlide}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {mobileActiveImg < galleryImages.length - 1 && (
            <button
              className="mobile-slider-nav-btn next"
              onClick={handleNextMobileSlide}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Segmented Progress Bar Indicators at Bottom */}
          <div className="mobile-gallery-progress-bar">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                className={`progress-segment ${mobileActiveImg === idx ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); scrollToMobileSlide(idx); }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. SUB-NAV STICKY BAR */}
      <div className="pkg-subnav-sticky-bar">
        <div className="container max-w-content flex items-center justify-between">
          <div className="subnav-tabs-list">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => scrollToSection('overview-section', 'overview')}>
              Overview
            </button>
            <button className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => scrollToSection('itinerary-section', 'itinerary')}>
              Itinerary
            </button>
            <button className={`tab-btn ${activeTab === 'inclusions' ? 'active' : ''}`} onClick={() => scrollToSection('inclusions-section', 'inclusions')}>
              Inclusions & Exclusions
            </button>
            <button className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`} onClick={() => scrollToSection('faq-section', 'faqs')}>
              Package FAQs
            </button>
            <button className={`tab-btn ${activeTab === 'inquiry' ? 'active' : ''}`} onClick={() => scrollToSection('inquiry-section', 'inquiry')}>
              Custom Inquiry
            </button>
          </div>

          <div className="pkg-top-quick-price">
            <span className="price-label">Starting From</span>
            <strong className="price-val">₹{finalPrice.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* 4. MAIN 2-COLUMN SECTION GRID (LEFT CONTENT / RIGHT STICKY BOOKING CARD) */}
      <div className="container max-w-content pkg-body-container">
        <div className="pkg-two-col-layout">
          {/* LEFT COLUMN: OVERVIEW, ITINERARY, INCLUSIONS, STAYS, INQUIRY FORM */}
          <div className="pkg-left-main-col">
            {/* Overview Section */}
            <div id="overview-section" className="detail-card-box">
              <h2 className="card-box-title text-xl font-bold">Overview</h2>
              <p className="card-box-paragraph leading-relaxed text-slate-700 font-normal text-[14px] mb-4">
                Step into the breathtaking charm of <strong>{packageData.destinationName || 'this destination'}</strong>. This <strong>{packageData.duration || '5 Days'}</strong> handcrafted journey is designed for travellers seeking a perfectly paced getaway — featuring handpicked luxury accommodations, seamless private transfers, curated sightseeing, and 24/7 dedicated concierge support.
              </p>

              <div className="chips-feature-row">
                <span className="feature-chip"><ShieldCheck size={14} className="text-emerald-600" /> 100% Customized Trips</span>
                <span className="feature-chip"><Sparkles size={14} className="text-amber-500" /> Handpicked Luxury Stays</span>
                <span className="feature-chip"><CheckCircle2 size={14} className="text-blue-600" /> Private Vehicles & Transfers</span>
                <span className="feature-chip"><PhoneCall size={14} className="text-purple-600" /> 24/7 Human Support</span>
              </div>
            </div>

            {/* A Beautiful Trail Across Destination (Itinerary Section Matching Image 2) */}
            <div id="itinerary-section" className="detail-card-box">
              <div className="itinerary-pill-badge mb-3">
                <span>Itinerary</span>
              </div>

              <div className="trail-header-row flex items-center justify-between w-full mb-4">
                <h2 className="trail-section-title text-2xl font-bold text-slate-900 m-0 p-0">
                  A Beautiful Trail Across {packageData.destinationName || 'Kashmir'}
                </h2>

                {/* Guaranteed 100% Visible Blue Toggle Switch Widget */}
                <div
                  onClick={() => setIsExpandAll(!isExpandAll)}
                  className="toggle-rhs-widget"
                >
                  <span className="toggle-label-text">
                    {isExpandAll ? 'Collapse all' : 'Expand all'}
                  </span>
                  <div className={`blue-toggle-pill-switch ${isExpandAll ? 'active' : ''}`}>
                    <div className="blue-toggle-knob"></div>
                  </div>
                </div>
              </div>



              {/* Continuous Vertical Dashed Timeline List matching reference screenshot */}
              <div className="itinerary-timeline-wrapper relative pl-2">
                {/* Vertical Dashed Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-slate-300 z-0"></div>

                <div className="itinerary-accordion-list relative z-10 flex flex-col gap-0">
                  {itineraryDays.map((dayItem, idx) => {
                    const isOpen = isExpandAll || idx === activeDayIdx;
                    const isFirstOrLast = idx === 0 || idx === itineraryDays.length - 1;

                    return (
                      <div key={idx} className={`accordion-day-item border-b border-slate-100 last:border-b-0 py-2.5 ${isOpen ? 'open' : ''}`}>
                        <div
                          className="day-accordion-header flex items-center gap-3.5 cursor-pointer py-2 hover:bg-slate-50/50 rounded-lg px-2 transition-colors"
                          onClick={() => {
                            if (isExpandAll) {
                              setIsExpandAll(false);
                              setActiveDayIdx(idx);
                            } else {
                              setActiveDayIdx(activeDayIdx === idx ? -1 : idx);
                            }
                          }}
                        >
                          {/* Custom Blue Location Pin & Circle Icon Matching Screenshot */}
                          <div className="blue-icon-marker flex-shrink-0 z-10 bg-white p-0.5">
                            {isFirstOrLast ? (
                              <div className="w-8 h-8 rounded-full bg-[#1677ff] text-white flex items-center justify-center shadow-sm">
                                <MapPin size={16} className="fill-white stroke-white" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-[#1677ff] bg-white flex items-center justify-center mx-2"></div>
                            )}
                          </div>

                          <h3 className="day-accordion-title text-[15.5px] font-bold text-slate-900 flex-1 tracking-tight">
                            Day 0{dayItem.day} : {dayItem.title}
                          </h3>

                          <div className="text-slate-400">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="day-accordion-content pl-14 pr-4 pb-4 pt-1">
                            {(() => {
                              const dayPoints = Array.isArray(dayItem.points) && dayItem.points.length > 0
                                ? dayItem.points
                                : (dayItem.description || dayItem.details || '')
                                    .split(/(?<=[.!?])\s+|\r?\n/)
                                    .map(s => s.trim().replace(/^[-•*]\s*/, ''))
                                    .filter(s => s.length > 0);

                              return dayPoints.length > 0 ? (
                                <ul className="day-points-bullet-list list-disc pl-5 my-2 space-y-1.5 text-[14px] text-slate-700">
                                  {dayPoints.map((pt, i) => (
                                    <li key={i} className="leading-relaxed">
                                      {pt}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="day-accordion-desc text-[14px] text-slate-600 leading-relaxed">{dayItem.description}</p>
                              );
                            })()}
                            {dayItem.highlights && dayItem.highlights.length > 0 && (
                              <div className="day-hl-tags-wrapper flex gap-2 flex-wrap mt-3">
                                {dayItem.highlights.map((hl, i) => (
                                  <span key={i} className="hl-item-tag text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">✦ {hl}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Includes / Excludes Section matching reference screenshot */}
            <div id="inclusions-section" className="detail-card-box">
              <h2 className="card-box-title">Includes / Excludes</h2>

              <div className="includes-excludes-grid">
                <div className="includes-col-box">
                  <h3 className="sub-box-heading text-emerald-800">✓ What's Included</h3>
                  <ul className="check-list-items">
                    {(packageData.inclusions && packageData.inclusions.length > 0) ? (
                      packageData.inclusions.map((item, idx) => (
                        <li key={idx}><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> {item}</li>
                      ))
                    ) : (
                      <>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> Accommodation in handpicked 4★/5★ luxury resorts & hotels</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> Daily buffet breakfast & chef's special dinner</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> Private AC sedan / SUV transfers & sightseeing</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> Airport / Railway station pickup & drop</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> All driver allowances, toll, & parking charges</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> Inner line permits & wildlife entry permits</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> Complimentary welcome drinks & mineral water bottles</li>
                        <li><CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" /> 24/7 dedicated human concierge assistance on trip</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="excludes-col-box">
                  <h3 className="sub-box-heading text-rose-800">✕ Exclusions</h3>
                  <ul className="cross-list-items">
                    {(packageData.exclusions && packageData.exclusions.length > 0) ? (
                      packageData.exclusions.map((item, idx) => (
                        <li key={idx}><XCircle size={15} className="text-rose-600 flex-shrink-0" /> {item}</li>
                      ))
                    ) : (
                      <>
                        <li><XCircle size={15} className="text-rose-600 flex-shrink-0" /> Airfare / Train tickets unless explicitly requested</li>
                        <li><XCircle size={15} className="text-rose-600 flex-shrink-0" /> Personal expenses, laundry, and driver tips</li>
                        <li><XCircle size={15} className="text-rose-600 flex-shrink-0" /> Monument entry tickets & camera permits</li>
                        <li><XCircle size={15} className="text-rose-600 flex-shrink-0" /> Optional adventure activities (zipline, rafting, ATV)</li>
                        <li><XCircle size={15} className="text-rose-600 flex-shrink-0" /> Travel insurance & medical emergency expenses</li>
                        <li><XCircle size={15} className="text-rose-600 flex-shrink-0" /> Anything not explicitly mentioned under Inclusions</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Hotel Options & Pricing Matrix (if present in package) */}
            {packageData.hotelPricingOptions && packageData.hotelPricingOptions.length > 0 && (
              <div className="detail-card-box">
                <h2 className="card-box-title">Hotel Categories & Package Pricing</h2>
                <p className="card-box-paragraph" style={{ marginBottom: '16px' }}>Rates are per person based on double sharing occupancy and total group PAX size.</p>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '14px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                        <th style={{ padding: '12px 16px', fontWeight: '700' }}>Hotel Name & Category</th>
                        <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'center' }}>02 PAX Rate</th>
                        <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'center' }}>04 PAX Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageData.hotelPricingOptions.map((opt, idx) => {
                        const formatHotelType = (name) => {
                          if (!name) return 'Standard Hotel';
                          const lower = name.toLowerCase();
                          if (lower.includes('5 star') || lower.includes('5-star') || lower.includes('05 star') || lower.includes('05-star')) {
                            if (lower.includes('villa')) return '05 Star Hotel & Private Pool Villa';
                            return '05 Star Hotel';
                          }
                          if (lower.includes('4 star') || lower.includes('4-star') || lower.includes('04 star') || lower.includes('04-star')) {
                            if (lower.includes('villa')) return '04 Star Hotel & Private Pool Villa';
                            return '04 Star Hotel';
                          }
                          if (lower.includes('3 star') || lower.includes('3-star') || lower.includes('03 star') || lower.includes('03-star')) {
                            if (lower.includes('villa')) return '03 Star Hotel & Private Pool Villa';
                            return '03 Star Hotel';
                          }
                          return name;
                        };

                        return (
                          <tr key={idx} style={{
                            borderBottom: '1px solid #e2e8f0',
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                          }}>
                            <td style={{ padding: '14px 16px' }}>
                              <strong style={{ color: '#0f172a', display: 'block', fontSize: '15px' }}>{formatHotelType(opt.hotelName)}</strong>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700', color: '#0284c7' }}>
                              {opt.price2Pax} / person
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700', color: '#16a34a' }}>
                              {opt.price4Pax} / person
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick Quote Inquiry Form Block */}
            <div id="inquiry-section" className="detail-card-box form-card-box">
              <h2 className="card-box-title">Get a Free Custom Price Quote</h2>
              <p className="form-sub-text">Prefer a custom phone consultation first? Fill in your details and our specialist will connect in 30 mins.</p>

              {isSubmitted ? (
                <div className="form-success-alert">
                  <Check size={20} className="text-emerald-600 mr-2" />
                  <span>Thank you! Your quote request for <strong>{packageData.title}</strong> has been submitted. Our team is contacting you shortly!</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="inquiry-form-grid">
                  <div className="form-group-full">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-half">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-half">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-half">
                    <label>Travel Date</label>
                    <input
                      type="date"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-full">
                    <label>Special Requests or Customizations</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need luxury 5-star hotel upgrade, honeymoon cake, private boat ride..."
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      className="form-input textarea"
                    />
                  </div>

                  <button type="submit" className="btn-pro-submit-form">
                    <Send size={15} />
                    <span>GET MY FREE QUOTE</span>
                  </button>
                </form>
              )}
            </div>

            {/* 5 Package-Specific FAQs Accordion Section */}
            <div id="faq-section" className="detail-card-box faq-card-box">
              <div className="faq-box-header">
                <span className="faq-eyebrow-pill">Got Questions?</span>
                <h2 className="card-box-title">Frequently Asked Questions</h2>
                <p className="card-box-paragraph">Everything you need to know about booking <strong>{packageData.title}</strong>.</p>
              </div>

              <div className="package-faq-accordion-list">
                {packageFaqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div key={idx} className={`pkg-faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="pkg-faq-question-btn"
                        onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      >
                        <span className="faq-q-text">{faq.q}</span>
                        <span className="faq-toggle-icon">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pkg-faq-answer-body">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD & RELATED TOURS */}
          <div className="pkg-right-sticky-col">
            {/* Professional Booking Form Card */}
            <div className="sticky-booking-card-v2">
              {discountPercent > 0 && (
                <div className="discount-pill-tag">
                  {discountPercent}% OFF
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onOpenOfferModal) {
                    onOpenOfferModal(packageData.title);
                  } else {
                    setIsDirectBookingModalOpen(true);
                  }
                }}
                className="booking-form-wrapper"
              >
                <div className="card-pricing-block">
                  <span className="orig-price-strike">
                    Starting From <del>₹{(originalPrice * adults).toLocaleString('en-IN')}</del>
                  </span>

                  <div className="final-price-large">
                    ₹{netTripTotal.toLocaleString('en-IN')}
                    <span className="per-person-sub"> / total ({adults + children} {adults + children === 1 ? 'person' : 'people'})</span>
                  </div>

                  {(savings > 0 || couponDiscountAmount > 0) && (
                    <span className="savings-green-pill">
                      Total Savings: ₹{((savings * adults) + couponDiscountAmount).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>


                {/* Field 2: Choose Travel Date */}
                <div className="form-field-group">
                  <label className="form-field-label">
                    <Calendar size={15} className="field-icon-amber" />
                    <span>Choose Travel Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="booking-date-input"
                  />
                </div>


                {/* Request Button */}
                <button
                  type="submit"
                  className="btn-pro-instant-book"
                >
                  REQUEST A QUOTE →
                </button>
              </form>

              <div className="trust-guarantee-list">
                <div className="tg-item">
                  <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>100% Customization & Free Cancellation</span>
                </div>
                <div className="tg-item">
                  <PhoneCall size={15} className="text-blue-600 flex-shrink-0" />
                  <span>24/7 Human Concierge Assistance</span>
                </div>
              </div>
            </div>

            {/* You Might Also Like / Related Tours Widget */}
            <div className="related-tours-card">
              <h3 className="related-tours-heading">You Might Also Like</h3>

              <div className="related-tours-list">
                {relatedTours.map((tour) => (
                  <div key={tour.id} className="related-tour-item" onClick={() => onOpenOfferModal(tour.title)}>
                    <img src={tour.image} alt={tour.title} className="related-tour-thumb" />
                    <div className="related-tour-info">
                      <h4 className="related-tour-title">{tour.title}</h4>
                      <div className="related-tour-meta">
                        <span>{tour.duration || '5 Days'}</span> • <strong className="text-dark font-extrabold">₹{(tour.price || 12900).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECT PACKAGE BOOKING & INSTANT PAYMENT MODAL */}
      {isDirectBookingModalOpen && (
        <div className="booking-modal-overlay">
          <div className="direct-booking-main-modal">
            {/* Modal Top Bar Header */}
            <div className="db-modal-top-header">
              <div className="db-header-info">
                <div className="db-badge">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>DIRECT ONLINE RESERVATION</span>
                </div>
                <h2 className="db-title">{packageData.title}</h2>
              </div>
              <button
                onClick={() => setIsDirectBookingModalOpen(false)}
                className="btn-modal-close-x"
              >
                ✕
              </button>
            </div>

            {/* 3-Step Wizard Navigation Bar */}
            <div className="booking-step-tabs">
              <div
                className={`step-tab-btn ${bookingStep === 1 ? 'active' : ''} ${bookingStep > 1 ? 'completed' : ''}`}
                onClick={() => setBookingStep(1)}
              >
                <span className="step-num">1</span>
                <span className="step-label">Customize Trip</span>
              </div>
              <div className="step-tab-line"></div>
              <div
                className={`step-tab-btn ${bookingStep === 2 ? 'active' : ''} ${bookingStep > 2 ? 'completed' : ''}`}
                onClick={() => setBookingStep(2)}
              >
                <span className="step-num">2</span>
                <span className="step-label">Guest Details</span>
              </div>
              <div className="step-tab-line"></div>
              <div
                className={`step-tab-btn ${bookingStep === 3 ? 'active' : ''}`}
                onClick={() => {
                  if (!guestName || !guestPhone) {
                    alert('Please complete Guest Details first.');
                    setBookingStep(2);
                  } else {
                    setBookingStep(3);
                  }
                }}
              >
                <span className="step-num">3</span>
                <span className="step-label">Instant Payment</span>
              </div>
            </div>

            {/* STEP 1: CUSTOMIZE TRIP CONTROLS */}
            {bookingStep === 1 && (
              <div className="booking-step-content step-1-fade">
                <div className="customize-grid">
                  {/* Date Picker & Guest Counters Row */}
                  <div className="cust-block">
                    <label className="cust-label"><Calendar size={15} /> Select Travel Start Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="cust-date-input"
                    />
                  </div>

                  <div className="cust-block">
                    <label className="cust-label"><Users size={15} /> Number of Travelers</label>
                    <div className="counter-row-group">
                      <div className="counter-item">
                        <span className="counter-title">Adults (12+ yrs)</span>
                        <div className="counter-controls">
                          <button onClick={() => setAdults(Math.max(1, adults - 1))} className="btn-cnt"><Minus size={14} /></button>
                          <span className="cnt-val">{adults}</span>
                          <button onClick={() => setAdults(adults + 1)} className="btn-cnt"><Plus size={14} /></button>
                        </div>
                      </div>

                      <div className="counter-item">
                        <span className="counter-title">Children (5-11 yrs)</span>
                        <div className="counter-controls">
                          <button onClick={() => setChildren(Math.max(0, children - 1))} className="btn-cnt"><Minus size={14} /></button>
                          <span className="cnt-val">{children}</span>
                          <button onClick={() => setChildren(children + 1)} className="btn-cnt"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Tier Radio Selector */}
                  <div className="cust-block full-col">
                    <label className="cust-label"><Building2 size={15} /> Choose Resort & Stay Category</label>
                    <div className="hotel-tier-grid">
                      <div
                        className={`hotel-tier-card ${hotelClass === 'standard' ? 'selected' : ''}`}
                        onClick={() => setHotelClass('standard')}
                      >
                        <div className="tier-badge">4★ Standard</div>
                        <div className="tier-name">Premium Heritage Hotel</div>
                        <div className="tier-price">Included</div>
                      </div>

                      <div
                        className={`hotel-tier-card ${hotelClass === 'deluxe' ? 'selected' : ''}`}
                        onClick={() => setHotelClass('deluxe')}
                      >
                        <div className="tier-badge popular">Most Popular</div>
                        <div className="tier-name">Luxury 4★ Plus Resort</div>
                        <div className="tier-price">+₹2,500 / guest</div>
                      </div>

                      <div
                        className={`hotel-tier-card ${hotelClass === 'luxury' ? 'selected' : ''}`}
                        onClick={() => setHotelClass('luxury')}
                      >
                        <div className="tier-badge gold">5★ Ultra Luxury</div>
                        <div className="tier-name">5★ Palace / Chalet Resort</div>
                        <div className="tier-price">+₹6,000 / guest</div>
                      </div>
                    </div>
                  </div>

                  {/* Optional Addons Checkboxes */}
                  <div className="cust-block full-col">
                    <label className="cust-label">✦ Optional Trip Add-ons & Experiences</label>
                    <div className="addons-checkbox-grid">
                      <label className={`addon-chip-card ${addons.privateCar ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={addons.privateCar}
                          onChange={(e) => setAddons({ ...addons, privateCar: e.target.checked })}
                        />
                        <Car size={16} />
                        <div className="addon-info">
                          <span className="addon-title">Private Airport AC SUV Transfer</span>
                          <span className="addon-cost">+₹2,500</span>
                        </div>
                      </label>

                      <label className={`addon-chip-card ${addons.candleDinner ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={addons.candleDinner}
                          onChange={(e) => setAddons({ ...addons, candleDinner: e.target.checked })}
                        />
                        <Utensils size={16} />
                        <div className="addon-info">
                          <span className="addon-title">Romantic Candlelit Dinner</span>
                          <span className="addon-cost">+₹3,500</span>
                        </div>
                      </label>

                      <label className={`addon-chip-card ${addons.photoPass ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={addons.photoPass}
                          onChange={(e) => setAddons({ ...addons, photoPass: e.target.checked })}
                        />
                        <Compass size={16} />
                        <div className="addon-info">
                          <span className="addon-title">Pro Drone Photography Pass</span>
                          <span className="addon-cost">+₹1,500</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="step-action-row">
                  <div className="live-subtotal-box">
                    <span className="sub-lbl">Estimated Trip Total ({adults} Adults{children > 0 ? `, ${children} Children` : ''})</span>
                    <span className="sub-price">₹{rawTripSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <button onClick={() => setBookingStep(2)} className="btn-step-next">
                    <span>Enter Guest Details</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GUEST DETAILS FORM */}
            {bookingStep === 2 && (
              <div className="booking-step-content step-2-fade">
                <div className="guest-form-grid">
                  <div className="form-group-full">
                    <label>Lead Traveler Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-half">
                    <label>WhatsApp Contact Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-half">
                    <label>Email Address for E-Voucher <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group-full">
                    <label>Special Requests or Dietary Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Pure Jain / Vegetarian food preference, ground floor room, anniversary arrangements..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="form-input textarea"
                    />
                  </div>
                </div>

                <div className="step-action-row">
                  <button onClick={() => setBookingStep(1)} className="btn-step-back">
                    ← Back to Customize
                  </button>

                  <button
                    onClick={() => {
                      if (!guestName || !guestPhone || !guestEmail) {
                        alert('Please fill out Name, Phone, and Email.');
                        return;
                      }
                      setBookingStep(3);
                    }}
                    className="btn-step-next"
                  >
                    <span>Proceed to Payment</span>
                    <Lock size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DIRECT PAYMENT GATEWAY */}
            {bookingStep === 3 && (
              <div className="booking-step-content step-3-fade">
                {/* Payment Deposit Option Toggle Cards */}
                <div className="payment-deposit-selector">
                  <div
                    className={`deposit-option-card ${paymentOption === 'advance' ? 'selected' : ''}`}
                    onClick={() => setPaymentOption('advance')}
                  >
                    <div className="dep-radio">
                      <div className="radio-dot" />
                    </div>
                    <div className="dep-info">
                      <span className="dep-badge">Token Deposit</span>
                      <h4 className="dep-title">Pay 25% Advance to Lock Rates</h4>
                      <p className="dep-desc">Pay ₹{advanceTokenAmount.toLocaleString('en-IN')} now to confirm dates. Remaining balance (₹{remainingBalance.toLocaleString('en-IN')}) due 7 days before travel.</p>
                    </div>
                    <div className="dep-amount">₹{advanceTokenAmount.toLocaleString('en-IN')}</div>
                  </div>

                  <div
                    className={`deposit-option-card ${paymentOption === 'full' ? 'selected' : ''}`}
                    onClick={() => setPaymentOption('full')}
                  >
                    <div className="dep-radio">
                      <div className="radio-dot" />
                    </div>
                    <div className="dep-info">
                      <span className="dep-badge extra-discount">Extra 5% Discount</span>
                      <h4 className="dep-title">Pay 100% Full Amount Now</h4>
                      <p className="dep-desc">Save an additional ₹{fullPayDiscount.toLocaleString('en-IN')} instantly on your total booking price.</p>
                    </div>
                    <div className="dep-amount highlight">₹{netTripTotal.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {/* Payment Mode Selector Tabs */}
                <div className="payment-gateway-container">
                  <h3 className="gateway-title"><Lock size={15} className="text-emerald-600 inline mr-1.5" /> Select Secure Bank Payment Method</h3>

                  <div className="gateway-tabs-row">
                    <button
                      className={`gw-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <QrCode size={16} />
                      <span>UPI / QR Code</span>
                    </button>

                    <button
                      className={`gw-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={16} />
                      <span>Credit / Debit Card</span>
                    </button>

                    <button
                      className={`gw-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <Wallet size={16} />
                      <span>Net Banking / EMI</span>
                    </button>
                  </div>

                  {/* Mode 1: UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="upi-payment-box">
                      <p className="gw-instructions">Scan QR Code or pay directly using any UPI App:</p>

                      <div className="upi-apps-row">
                        <button
                          className={`upi-app-chip ${selectedUpiApp === 'gpay' ? 'active' : ''}`}
                          onClick={() => setSelectedUpiApp('gpay')}
                        >
                          Google Pay
                        </button>
                        <button
                          className={`upi-app-chip ${selectedUpiApp === 'phonepe' ? 'active' : ''}`}
                          onClick={() => setSelectedUpiApp('phonepe')}
                        >
                          PhonePe
                        </button>
                        <button
                          className={`upi-app-chip ${selectedUpiApp === 'paytm' ? 'active' : ''}`}
                          onClick={() => setSelectedUpiApp('paytm')}
                        >
                          Paytm UPI
                        </button>
                      </div>

                      <div className="qr-simulated-container">
                        <div className="qr-code-box">
                          <QrCode size={110} className="text-slate-800" />
                        </div>
                        <div className="vpa-info">
                          <span className="vpa-label">Merchant VPA ID:</span>
                          <strong className="vpa-id">samyati@icici</strong>
                          <span className="vpa-sub font-semibold text-emerald-600 mt-1 block">✓ Verified Instant Booking Gateway</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: CARD */}
                  {paymentMethod === 'card' && (
                    <div className="card-payment-form">
                      <div className="form-group-full">
                        <label>Card Number</label>
                        <input type="text" placeholder="4532 •••• •••• 8942" className="form-input" defaultValue="4532 8912 3456 8942" />
                      </div>
                      <div className="form-group-half">
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM / YY" className="form-input" defaultValue="08 / 28" />
                      </div>
                      <div className="form-group-half">
                        <label>CVV / CVC</label>
                        <input type="password" maxLength={4} placeholder="•••" className="form-input" defaultValue="894" />
                      </div>
                    </div>
                  )}

                  {/* Mode 3: NETBANKING */}
                  {paymentMethod === 'netbanking' && (
                    <div className="netbanking-box">
                      <label className="text-xs font-bold text-slate-700 block mb-2">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="form-input"
                      >
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Summary & Execute Button */}
                <div className="payment-summary-block">
                  <div className="summary-line">
                    <span>Base Trip Total ({adults} Adults{children > 0 ? `, ${children} Children` : ''})</span>
                    <span>₹{rawTripSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {fullPayDiscount > 0 && (
                    <div className="summary-line green">
                      <span>100% Full Payment Discount (5%)</span>
                      <span>-₹{fullPayDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="summary-line total-due">
                    <span>AMOUNT TO PAY NOW</span>
                    <span className="due-amount">₹{amountPayableNow.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      handleExecutePayment(e);
                      setIsDirectBookingModalOpen(false);
                    }}
                    disabled={isProcessing}
                    className="btn-pay-now-gold"
                  >
                    {isProcessing ? (
                      <span>Processing Bank Payment...</span>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>PAY ₹{amountPayableNow.toLocaleString('en-IN')} & BOOK INSTANTLY</span>
                      </>
                    )}
                  </button>

                  <div className="security-badges-row">
                    <span>🔒 256-Bit Bank Grade SSL Encrypted</span>
                    <span>🛡️ 100% Flexible Refund Assurance</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* INSTANT BOOKING E-VOUCHER MODAL */}
      {bookingSuccessModal && (
        <div className="booking-modal-overlay">
          <div className="booking-voucher-modal">
            <div className="voucher-header">
              <div className="voucher-success-badge">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <h2 className="voucher-h2">Booking Confirmed!</h2>
              <p className="voucher-sub">Your payment has been successfully processed via Samyati Secure Gateway.</p>
              <div className="voucher-ref-pill">Booking ID: {bookingId}</div>
            </div>

            <div className="voucher-body-card">
              <h3 className="v-pkg-title">{packageData.title}</h3>
              <div className="v-details-grid">
                <div className="v-item">
                  <span className="v-lbl">Traveler Name:</span>
                  <strong className="v-val">{guestName}</strong>
                </div>
                <div className="v-item">
                  <span className="v-lbl">Travel Start Date:</span>
                  <strong className="v-val">{travelDate}</strong>
                </div>
                <div className="v-item">
                  <span className="v-lbl">Travelers:</span>
                  <strong className="v-val">{adults} Adults{children > 0 ? `, ${children} Children` : ''}</strong>
                </div>
                <div className="v-item">
                  <span className="v-lbl">Hotel Class:</span>
                  <strong className="v-val text-amber-700 font-bold uppercase">{hotelClass} Resort</strong>
                </div>
                <div className="v-item">
                  <span className="v-lbl">Amount Paid Now:</span>
                  <strong className="v-val text-emerald-600 font-extrabold text-base">₹{amountPayableNow.toLocaleString('en-IN')} ({paymentOption === 'advance' ? '25% Advance Token' : '100% Paid'})</strong>
                </div>
                {remainingBalance > 0 && (
                  <div className="v-item">
                    <span className="v-lbl">Remaining Balance:</span>
                    <strong className="v-val text-slate-700">₹{remainingBalance.toLocaleString('en-IN')} (Due 7 days before trip)</strong>
                  </div>
                )}
              </div>

              <div className="voucher-concierge-callout">
                <PhoneCall size={18} className="text-amber-600 flex-shrink-0" />
                <div>
                  <span className="c-title">Assigned Concierge: <strong>Aniket Shrivastava</strong></span>
                  <span className="c-sub block text-xs text-slate-600">Your concierge will reach out within 15 minutes to coordinate pickup & voucher copies.</span>
                </div>
              </div>
            </div>

            <div className="voucher-action-row">
              <button
                onClick={() => window.print()}
                className="btn-v-print"
              >
                <Printer size={15} />
                <span>Print Receipt & E-Voucher</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://wa.me/919876543210?text=Hi%20Samyati%20Team!%20I%20just%20booked%20${encodeURIComponent(packageData.title)}%20(ID:%20${bookingId}).`, '_blank');
                }}
                className="btn-v-whatsapp"
              >
                <MessageSquare size={15} />
                <span>WhatsApp Concierge</span>
              </button>

              <button
                onClick={() => setBookingSuccessModal(false)}
                className="btn-v-close"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-IMAGE FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="lightbox-modal-backdrop" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            <button className="btn-lightbox-close" onClick={() => setIsLightboxOpen(false)}>
              <X size={22} />
            </button>

            <div className="lightbox-main-stage">
              <button
                className="btn-lightbox-nav prev"
                onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)}
              >
                <ChevronLeft size={24} />
              </button>

              <img
                src={galleryImages[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1}`}
                className="lightbox-active-img"
              />

              <button
                className="btn-lightbox-nav next"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryImages.length)}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="lightbox-counter-bar">
              <span>Photo {lightboxIndex + 1} of {galleryImages.length}</span>
            </div>

            <div className="lightbox-thumbs-row">
              {galleryImages.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`lightbox-thumb-item ${lightboxIndex === idx ? 'active' : ''}`}
                  onClick={() => setLightboxIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM ADVENTUROUS FLOATING BANNER */}
      <div className="bottom-adventurous-banner">
        <div className="container max-w-content">
          <div className="adventurous-card-box">
            <div className="adventurous-left">
              <div className="adventurous-thumb-wrapper">
                <img src={galleryImages[0]} alt="Adventure" className="adventurous-thumb" />
                <div className="thumb-sparkle-badge">✦</div>
              </div>
              <div>
                <h3 className="adventurous-title">Start your Adventurous Trip with Samyati The World</h3>
                <p className="adventurous-sub">Handcrafted itineraries, luxury stays, and 24/7 dedicated support.</p>
              </div>
            </div>

            <button onClick={() => onOpenOfferModal()} className="btn-pro-plan-now">
              <span>PLAN NOW</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .package-detail-page-full {
          min-height: 100vh;
          background-color: #fefce8;
          padding-bottom: 0;
        }

        .max-w-content {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Top Header */
        .pkg-page-top-header {
          background: linear-gradient(180deg, #fefce8 0%, #f1f5f9 100%);
          padding-top: 125px;
          padding-bottom: 28px;
          border-bottom: 1px solid #e2e8f0;
        }

        .top-nav-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .btn-top-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          font-size: 12.5px;
          font-weight: 700;
          padding: 7px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .btn-top-back:hover {
          background: #fefce8;
          border-color: #94a3b8;
          transform: translateX(-2px);
        }

        .top-breadcrumbs {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 500;
        }

        .top-breadcrumbs span.active {
          color: #0f172a;
          font-weight: 700;
        }

        .pkg-main-headline {
          font-size: clamp(28px, 3.8vw, 44px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        /* Gallery Grid */
        .pkg-gallery-container {
          padding-top: 24px;
          margin-bottom: 24px;
        }

        .pkg-gallery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          height: 420px;
          border-radius: 20px;
          overflow: hidden;
        }

        .gallery-main-item {
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          background: #0f172a;
          cursor: pointer;
        }

        .gallery-side-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 10px;
          height: 100%;
          min-height: 0;
        }

        .gallery-main-item,
        .gallery-side-item {
          position: relative;
          min-height: 0;
          height: 100%;
          overflow: hidden;
          border-radius: 12px;
          background: #0f172a;
          cursor: pointer;
        }

        /* Mobile Swiping Gallery Carousel Styles */
        .pkg-gallery-mobile-wrapper {
          display: none;
          position: relative;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          background: #0f172a;
          touch-action: pan-y pinch-zoom;
        }

        .pkg-gallery-mobile-slider {
          display: flex;
          width: 100%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .pkg-gallery-mobile-slider::-webkit-scrollbar {
          display: none;
        }

        .mobile-slide-item {
          flex: 0 0 100%;
          width: 100%;
          height: 320px;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
          cursor: pointer;
        }

        .mobile-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mobile-gallery-counter-pill {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .mobile-view-all-pill {
          position: absolute;
          bottom: 22px;
          left: 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          transition: all 0.2s ease;
        }

        .mobile-view-all-pill:active {
          transform: scale(0.96);
          background: rgba(15, 23, 42, 0.95);
        }

        .mobile-slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .mobile-slider-nav-btn.prev {
          left: 10px;
        }

        .mobile-slider-nav-btn.next {
          right: 10px;
        }

        .mobile-slider-nav-btn:active {
          transform: translateY(-50%) scale(0.92);
          background: #ffffff;
        }

        .mobile-gallery-progress-bar {
          position: absolute;
          bottom: 8px;
          left: 14px;
          right: 14px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .progress-segment {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.45);
          border-radius: 9999px;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .progress-segment.active {
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }

        /* Package FAQ Accordion Section */
        .faq-card-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 28px;
        }

        .faq-box-header {
          margin-bottom: 24px;
        }

        .faq-eyebrow-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b45309;
          background: #fef3c7;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        .itinerary-pill-badge {
          display: inline-flex;
          align-items: center;
          background: #f1f5f9;
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
          padding: 5px 16px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          letter-spacing: -0.01em;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .package-faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pkg-faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          background: #fefce8;
          transition: all 0.2s ease;
        }

        .pkg-faq-item.open {
          background: #ffffff;
          border-color: #f59e0b;
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.08);
        }

        .pkg-faq-question-btn {
          width: 100%;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .faq-q-text {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
        }

        .faq-toggle-icon {
          color: #d97706;
          flex-shrink: 0;
        }

        .pkg-faq-answer-body {
          padding: 0 20px 18px 20px;
          border-top: 1px solid #f1f5f9;
          margin-top: 4px;
          padding-top: 14px;
        }

        .pkg-faq-answer-body p {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
        }

        .gallery-img-fit {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gallery-side-item:hover .gallery-img-fit,
        .gallery-main-item:hover .gallery-img-fit {
          transform: scale(1.04);
        }

        .view-more-photos-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        /* 5-Image Fullscreen Lightbox Modal */
        .lightbox-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lightbox-content-box {
          position: relative;
          max-width: 960px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .btn-lightbox-close {
          position: absolute;
          top: -45px;
          right: 0;
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-lightbox-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .lightbox-main-stage {
          position: relative;
          width: 100%;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-active-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .btn-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .btn-lightbox-nav.prev { left: 16px; }
        .btn-lightbox-nav.next { right: 16px; }

        .btn-lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: translateY(-50%) scale(1.08);
        }

        .lightbox-counter-bar {
          margin-top: 14px;
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .lightbox-thumbs-row {
          display: flex;
          gap: 12px;
          margin-top: 14px;
        }

        .lightbox-thumb-item {
          width: 64px;
          height: 48px;
          object-fit: cover;
          border-radius: 8px;
          opacity: 0.5;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .lightbox-thumb-item.active {
          opacity: 1;
          border-color: #f59e0b;
          transform: scale(1.08);
        }

        .lightbox-thumb-item:hover {
          opacity: 0.85;
        }

        /* Subnav Sticky Bar */
        .pkg-subnav-sticky-bar {
          position: sticky;
          top: 80px;
          z-index: 40;
          background: #ffffff;
          border-y: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          padding: 12px 0;
          margin-bottom: 30px;
        }

        .subnav-tabs-list {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active, .tab-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          font-weight: 700;
        }

        .pkg-top-quick-price {
          display: flex;
          align-items: baseline;
          gap: 6px;
          font-size: 13px;
        }

        .price-val {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        /* Layout Grid */
        .pkg-two-col-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 30px;
          align-items: start;
          padding-bottom: 60px;
        }

        .detail-card-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          border: 1px solid #f1f5f9;
        }

        .trail-header-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          margin-bottom: 16px !important;
        }

        .trail-section-title {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 22px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          line-height: 1.2 !important;
        }

        .toggle-rhs-widget {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          cursor: pointer !important;
          user-select: none !important;
          margin-left: auto !important;
          flex-shrink: 0 !important;
        }

        .toggle-label-text {
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #64748b !important;
          transition: color 0.2s ease !important;
        }

        .toggle-rhs-widget:hover .toggle-label-text {
          color: #0f172a !important;
        }

        .blue-toggle-pill-switch {
          display: flex !important;
          align-items: center !important;
          width: 46px !important;
          height: 24px !important;
          border-radius: 9999px !important;
          padding: 2px !important;
          background-color: #cbd5e1 !important;
          transition: background-color 0.3s ease !important;
          cursor: pointer !important;
        }

        .blue-toggle-pill-switch.active {
          background-color: #1677ff !important;
        }

        .blue-toggle-knob {
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          background-color: #ffffff !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          transform: translateX(0) !important;
        }

        .blue-toggle-pill-switch.active .blue-toggle-knob {
          transform: translateX(22px) !important;
        }

        .card-box-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .card-box-paragraph {
          font-size: 15px;
          color: #475569;
          line-height: 1.65;
          margin-bottom: 18px;
        }

        .chips-feature-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fefce8;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .badge-days-count {
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
        }

        /* Accordion Days */
        .itinerary-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .accordion-day-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .day-accordion-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #ffffff;
          cursor: pointer;
        }

        .day-number-pill {
          background: #0f172a;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .day-accordion-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          flex: 1;
        }

        .day-accordion-content {
          padding: 0 20px 20px 20px;
          background: #fafafa;
          border-top: 1px solid #f1f5f9;
        }

        .day-accordion-desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          padding-top: 14px;
        }

        .day-points-bullet-list {
          list-style-type: disc;
          padding-left: 20px;
          margin-top: 10px;
          margin-bottom: 8px;
        }

        .day-points-bullet-list li {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 6px;
        }

        .day-hl-tags-wrapper {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .hl-item-tag {
          font-size: 11.5px;
          font-weight: 600;
          color: #b45309;
          background: #fffbeb;
          padding: 4px 10px;
          border-radius: 6px;
        }

        /* Includes Excludes */
        .includes-excludes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .includes-col-box {
          background: #dcfce7;
          border-radius: 14px;
          padding: 20px;
          border: 1.5px solid #86efac;
        }

        .excludes-col-box {
          background: #fee2e2;
          border-radius: 14px;
          padding: 20px;
          border: 1.5px solid #fca5a5;
        }

        .sub-box-heading {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .check-list-items, .cross-list-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .check-list-items li, .cross-list-items li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13.5px;
          color: #334155;
          line-height: 1.4;
        }

        /* Stays Section Cards */
        .stays-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .stay-card-item {
          display: flex;
          gap: 14px;
          background: #fefce8;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px;
          align-items: center;
        }

        .stay-card-img {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .stay-rating-badge {
          background: #fde047;
          color: #141613;
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .stay-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 2px;
        }

        .stay-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .stay-amenities-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .stay-am-chip {
          font-size: 10px;
          font-weight: 600;
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Quote Form Card */
        .form-card-box {
          background: #ffffff;
          border: 1px solid #fed7aa;
        }

        .form-sub-text {
          font-size: 13.5px;
          color: #64748b;
          margin-bottom: 20px;
        }

        .inquiry-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group-full {
          grid-column: span 2;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group-half {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .inquiry-form-grid label {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .form-input {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13.5px;
          font-family: var(--font-sans);
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
        }

        .form-input.textarea {
          resize: vertical;
        }

        .btn-pro-submit-form {
          grid-column: span 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 14px;
          font-weight: 700;
          padding: 13px 24px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.2);
          margin-top: 6px;
        }

        .btn-pro-submit-form:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
        }

        .form-success-alert {
          display: flex;
          align-items: center;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
        }

        /* Sticky Right Column Booking Card Matching Reference */
        .pkg-right-sticky-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 140px;
        }

        .sticky-booking-card-v2 {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
          position: relative;
        }

        .discount-pill-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #ff4d4d;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .card-pricing-block {
          margin-bottom: 20px;
        }

        .orig-price-strike {
          display: block;
          font-size: 12px;
          color: #94a3b8;
        }

        .orig-price-strike del {
          color: #ef4444;
        }

        .final-price-large {
          font-size: 34px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          margin-top: 2px;
        }

        .savings-green-pill {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          color: #10b981;
          margin-top: 4px;
        }

        /* Form Controls Styling */
        .booking-form-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .per-person-sub {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          display: block;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #1e293b;
        }

        .field-icon-amber {
          color: #d97706;
          flex-shrink: 0;
        }

        .people-selector-box {
          background: #fefce8;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .people-counter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .people-counter-row.border-top {
          border-top: 1px dashed #cbd5e1;
          padding-top: 8px;
        }

        .people-counter-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
        }

        .counter-controls-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cnt-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e293b;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cnt-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .cnt-val {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          min-width: 20px;
          text-align: center;
        }

        .booking-date-input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: #fefce8;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .booking-date-input:focus {
          background: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }

        .coupon-input-wrapper {
          display: flex;
          gap: 8px;
        }

        .coupon-text-field {
          flex: 1;
          height: 42px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: #fefce8;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .coupon-text-field:focus {
          background: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }

        .btn-apply-coupon {
          padding: 0 16px;
          height: 42px;
          border-radius: 12px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-apply-coupon:hover {
          background: #1e293b;
        }

        .coupon-status-msg {
          font-size: 11.5px;
          font-weight: 700;
          margin-top: 4px;
        }

        .coupon-status-msg.success {
          color: #059669;
        }

        .coupon-status-msg.error {
          color: #e11d48;
        }

        .coupon-hint-text {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .coupon-hint-text span {
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          text-decoration: underline;
        }

        .coupon-hint-text span:hover {
          color: #d97706;
        }

        .sticky-amount-due-highlight {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .due-lbl {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
        }

        .due-val {
          font-size: 16px;
          font-weight: 900;
          color: #0f172a;
        }

        .btn-pro-instant-book {
          width: 100%;
          height: 48px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
        }

        .btn-pro-instant-book:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3);
        }

        .btn-pro-get-quote-sub {
          width: 100%;
          height: 44px;
          background: #ffffff;
          color: #334155;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .btn-pro-get-quote-sub:hover {
          background: #fefce8;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .trust-guarantee-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .tg-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }

        /* Related Tours Widget */
        .related-tours-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
        }

        .related-tours-heading {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .related-tours-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .related-tour-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .related-tour-item:hover {
          background: #fefce8;
        }

        .related-tour-thumb {
          width: 54px;
          height: 54px;
          border-radius: 8px;
          object-fit: cover;
        }

        .related-tour-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-tour-meta {
          font-size: 11.5px;
          color: #64748b;
        }

        /* Bottom Adventurous Floating Card Banner */
        .bottom-adventurous-banner {
          padding: 40px 0 50px;
          background-color: #fefce8;
        }

        .adventurous-card-box {
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 24px;
          padding: 32px 40px;
          color: #ffffff;
          box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .adventurous-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .adventurous-thumb-wrapper {
          position: relative;
          width: 72px;
          height: 72px;
          flex-shrink: 0;
        }

        .adventurous-thumb {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .thumb-sparkle-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #d97706;
          color: #ffffff;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .adventurous-title {
          font-size: clamp(17px, 2vw, 22px);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .adventurous-sub {
          font-size: 13.5px;
          color: #cbd5e1;
          font-weight: 500;
        }

        .btn-pro-plan-now {
          background: #ffffff;
          color: #0f172a;
          border: none;
          font-size: 13.5px;
          font-weight: 800;
          padding: 13px 28px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-pro-plan-now:hover {
          background: #fefce8;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
          color: #b45309;
        }

        @media (max-width: 990px) {
          .pkg-two-col-layout {
            grid-template-columns: 1fr;
          }
          .pkg-gallery-grid-desktop {
            display: none !important;
          }
          .pkg-gallery-mobile-wrapper {
            display: block !important;
          }
          .pkg-gallery-container {
            padding-top: 14px;
            margin-bottom: 16px;
          }
          .subnav-tabs-list {
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .subnav-tabs-list::-webkit-scrollbar {
            display: none;
          }
          .stays-cards-grid {
            grid-template-columns: 1fr;
          }
          .pkg-right-sticky-col {
            position: static;
          }
          .includes-excludes-grid {
            grid-template-columns: 1fr;
          }
          .inquiry-form-grid {
            grid-template-columns: 1fr;
          }
          .form-group-full, .form-group-half, .btn-pro-submit-form {
            grid-column: span 1;
          }
          .bottom-adventurous-banner .container {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .btn-pro-plan-now {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 600px) {
          .pkg-page-top-header {
            padding-top: 105px;
            padding-bottom: 20px;
          }
          .top-nav-bar-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .detail-card-box {
            padding: 20px 16px;
            border-radius: 16px;
          }
          .card-box-title {
            font-size: 19px !important;
          }
          .trail-section-title {
            font-size: 18px !important;
          }
          .gallery-main-item {
            height: 210px;
          }
          .gallery-side-grid {
            height: 85px;
            gap: 8px;
          }
        }
        /* INSTANT DIRECT BOOKING & PAYMENT STYLES */
        .instant-booking-card-box {
          border: 2px solid #fef08a;
          box-shadow: 0 12px 36px rgba(217, 119, 6, 0.08);
          position: relative;
          overflow: hidden;
          background: #ffffff;
        }

        .booking-card-header {
          margin-bottom: 24px;
        }

        .booking-header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fffbe6;
          border: 1px solid #fef08a;
          color: #b45309;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 4px 14px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        /* 3-Step Wizard Nav */
        .booking-step-tabs {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fefce8;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 8px 16px;
          margin-bottom: 28px;
        }

        .step-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 6px 12px;
          border-radius: 10px;
        }

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #cbd5e1;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-tab-btn.active {
          color: #0f172a;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .step-tab-btn.active .step-num {
          background: #d97706;
          color: #ffffff;
        }

        .step-tab-btn.completed .step-num {
          background: #10b981;
          color: #ffffff;
        }

        .step-tab-line {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 10px;
        }

        /* Step 1 Customize Grid */
        .customize-grid {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .cust-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cust-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cust-date-input {
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          background: #fefce8;
          color: #0f172a;
          transition: all 0.2s ease;
        }
        .cust-date-input:focus {
          border-color: #d97706;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12);
        }

        .counter-row-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .counter-item {
          background: #fefce8;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .counter-title {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .counter-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-cnt {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-cnt:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .cnt-val {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          min-width: 18px;
          text-align: center;
        }

        /* Hotel Tier Cards */
        .hotel-tier-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .hotel-tier-card {
          border: 1.5px solid #e2e8f0;
          background: #fefce8;
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .hotel-tier-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .hotel-tier-card.selected {
          background: #fffbe6;
          border-color: #d97706;
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.15);
        }

        .tier-badge {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 4px;
        }
        .tier-badge.popular {
          color: #d97706;
        }
        .tier-badge.gold {
          color: #b45309;
        }

        .tier-name {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .tier-price {
          font-size: 12px;
          font-weight: 700;
          color: #d97706;
        }

        /* Addon Chips */
        .addons-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .addon-chip-card {
          border: 1.5px solid #e2e8f0;
          background: #fefce8;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .addon-chip-card.checked {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .addon-info {
          display: flex;
          flex-direction: column;
        }

        .addon-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #1e293b;
        }

        .addon-cost {
          font-size: 11.5px;
          font-weight: 800;
          color: #2563eb;
        }

        /* Step Action Row */
        .step-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .live-subtotal-box {
          display: flex;
          flex-direction: column;
        }

        .sub-lbl {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .sub-price {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .btn-step-next {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 14px;
          font-weight: 800;
          padding: 14px 26px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
        }
        .btn-step-next:hover {
          background: #1e293b;
          transform: translateY(-2px);
        }

        .btn-step-back {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          font-size: 13.5px;
          font-weight: 700;
          padding: 12px 22px;
          border-radius: 9999px;
          cursor: pointer;
        }

        /* Guest Form */
        .guest-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Deposit Selector Cards */
        .payment-deposit-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .deposit-option-card {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          cursor: pointer;
          background: #fefce8;
          transition: all 0.25s ease;
          position: relative;
        }
        .deposit-option-card.selected {
          border-color: #d97706;
          background: #fffbe6;
          box-shadow: 0 4px 18px rgba(217, 119, 6, 0.15);
        }

        .dep-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .deposit-option-card.selected .dep-radio {
          border-color: #d97706;
        }
        .deposit-option-card.selected .radio-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d97706;
        }

        .dep-info {
          flex: 1;
        }

        .dep-badge {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #d97706;
          background: #fef3c7;
          padding: 2px 8px;
          border-radius: 6px;
          display: inline-block;
          margin-bottom: 4px;
        }
        .dep-badge.extra-discount {
          background: #dcfce7;
          color: #15803d;
        }

        .dep-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .dep-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
        }

        .dep-amount {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          flex-shrink: 0;
        }
        .dep-amount.highlight {
          color: #166534;
        }

        /* Gateway Container */
        .payment-gateway-container {
          background: #fefce8;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 22px;
          margin-bottom: 24px;
        }

        .gateway-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .gateway-tabs-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .gw-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gw-tab-btn.active {
          border-color: #0f172a;
          background: #0f172a;
          color: #ffffff;
        }

        .gw-instructions {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 12px;
        }

        .upi-apps-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .upi-app-chip {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
        }
        .upi-app-chip.active {
          background: #d97706;
          color: #ffffff;
          border-color: #d97706;
        }

        .qr-simulated-container {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
        }

        .qr-code-box {
          padding: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .vpa-label {
          font-size: 12px;
          color: #64748b;
          display: block;
        }

        .vpa-id {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        /* Summary Block */
        .payment-summary-block {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 22px;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 10px;
        }
        .summary-line.green {
          color: #16a34a;
          font-weight: 700;
        }
        .summary-line.total-due {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          padding-top: 10px;
          border-top: 1.5px dashed #cbd5e1;
          margin-top: 10px;
        }
        .due-amount {
          color: #d97706;
          font-size: 24px;
        }

        .btn-pay-now-gold {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #0f172a;
          color: #ffffff;
          border: 1px solid #1e293b;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
          margin-top: 16px;
        }
        .btn-pay-now-gold:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.35);
        }

        .security-badges-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 14px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }

        .sticky-amount-due-highlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fefce8;
          border: 1.5px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 12px;
        }
        .due-lbl { font-size: 12.5px; font-weight: 700; color: #475569; }
        .due-val { font-size: 16px; font-weight: 800; color: #0f172a; }

        .btn-pro-instant-book {
          width: 100%;
          display: block;
          text-align: center;
          background: #0f172a;
          color: #ffffff;
          border: 1px solid #1e293b;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 14px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.2);
          margin-bottom: 8px;
        }
        .btn-pro-instant-book:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.3);
        }

        .btn-pro-get-quote-sub {
          width: 100%;
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 12.5px;
          font-weight: 700;
          padding: 9px;
          border-radius: 9999px;
          cursor: pointer;
        }

        /* Direct Booking Modal */
        .direct-booking-main-modal {
          background: #ffffff;
          border-radius: 32px;
          max-width: 820px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 40px;
          box-shadow: 0 25px 75px rgba(15, 23, 42, 0.4);
          position: relative;
          border-top: 5px solid #d97706;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .db-modal-top-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e2e8f0;
        }

        .db-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%);
          border: 1px solid #fef08a;
          color: #b45309;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 5px 16px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        .db-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .btn-modal-close-x {
          background: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          font-size: 16px;
          font-weight: 800;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-modal-close-x:hover {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          transform: rotate(90deg);
        }

        /* VOUCHER MODAL */
        .booking-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .booking-voucher-modal {
          background: #ffffff;
          border-radius: 28px;
          max-width: 580px;
          width: 100%;
          padding: 36px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
        }

        .voucher-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .voucher-success-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .voucher-h2 {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
        }

        .voucher-sub {
          font-size: 13.5px;
          color: #64748b;
          margin-top: 4px;
        }

        .voucher-ref-pill {
          display: inline-block;
          background: #0f172a;
          color: #fef08a;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 4px 14px;
          border-radius: 9999px;
          margin-top: 10px;
        }

        .voucher-body-card {
          background: #fefce8;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .v-pkg-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }

        .v-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .v-item {
          display: flex;
          flex-direction: column;
        }

        .v-lbl {
          font-size: 11.5px;
          color: #64748b;
        }

        .v-val {
          font-size: 13.5px;
          color: #0f172a;
        }

        .voucher-concierge-callout {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fffbe6;
          border: 1px solid #fef08a;
          border-radius: 12px;
          padding: 12px 14px;
          margin-top: 16px;
        }

        .c-title {
          font-size: 13px;
          color: #78350f;
        }

        .voucher-action-row {
          display: flex;
          gap: 10px;
        }

        .btn-v-print, .btn-v-whatsapp, .btn-v-close {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          padding: 12px;
          border-radius: 9999px;
          cursor: pointer;
          border: none;
        }

        .btn-v-print {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
        }

        .btn-v-whatsapp {
          background: #25d366;
          color: #ffffff;
        }

        .btn-v-close {
          background: #0f172a;
          color: #ffffff;
        }

        @media (max-width: 990px) {
          .hotel-tier-grid, .addons-checkbox-grid, .payment-deposit-selector, .counter-row-group {
            grid-template-columns: 1fr;
          }
          .gateway-tabs-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .detail-card-box {
            padding: 18px 16px !important;
            border-radius: 16px !important;
            margin-bottom: 18px !important;
          }
          .chips-feature-row {
            gap: 6px 10px !important;
            flex-wrap: wrap !important;
          }
          .feature-chip {
            padding: 6px 12px !important;
            font-size: 11.5px !important;
            border-radius: 9999px !important;
          }
        }
      `}</style>
    </div>
  );
}
