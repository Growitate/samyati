/**
 * Samyati Razorpay Integration Utility
 * Seamless, secure payment checkout and cryptographic verification
 */

import { API_ENDPOINTS } from '../config/adminConfig';

/**
 * Ensures Razorpay Checkout SDK is loaded in the browser window
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay checkout workflow:
 * 1. Creates an order on the backend (/api/payment/create-order)
 * 2. Launches Razorpay Standard Checkout popup modal
 * 3. On success, verifies the HMAC-SHA256 signature (/api/payment/verify)
 * 4. Triggers callbacks with confirmed booking details
 */
export async function executeRazorpayBookingPayment({
  amount,
  packageId = '',
  packageTitle = 'Samyati Handcrafted Tour',
  destinationName = '',
  travelerName = '',
  travelerEmail = '',
  travelerPhone = '',
  travelDate = '',
  adults = 1,
  children = 0,
  hotelClass = 'deluxe',
  addons = {},
  paymentOption = 'advance',
  totalTripAmount = 0,
  remainingBalance = 0,
  onSuccess = () => {},
  onError = () => {},
  onDismiss = () => {}
}) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
    }

    // Step 1: Create Order on Backend
    const orderRes = await fetch(API_ENDPOINTS.CREATE_ORDER || '/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        packageId,
        packageTitle,
        travelerName,
        travelerEmail,
        travelerPhone,
        travelDate,
        paymentOption
      })
    });

    const orderJson = await orderRes.json();
    if (!orderRes.ok || !orderJson.success) {
      throw new Error(orderJson.message || 'Failed to initialize payment order');
    }

    const { order, keyId } = orderJson;

    // Step 2: Open Razorpay Checkout Modal
    return new Promise((resolve, reject) => {
      const options = {
        key: keyId || 'rzp_test_Td1Eea273FcCNR',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Samyati The World',
        description: `${paymentOption === 'advance' ? '25% Advance Token' : 'Full Payment'} • ${packageTitle}`.substring(0, 255),
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=200&q=80',
        order_id: order.id,
        prefill: {
          name: travelerName || '',
          email: travelerEmail || '',
          contact: travelerPhone || ''
        },
        theme: {
          color: '#059669', // Luxury Emerald Green
          backdrop_color: 'rgba(15, 23, 42, 0.75)'
        },
        modal: {
          ondismiss: () => {
            console.log('[Razorpay] Checkout modal dismissed by user');
            onDismiss();
            resolve({ dismissed: true });
          },
          escape: true,
          animation: true
        },
        notes: {
          packageId,
          travelDate,
          travelerName
        },
        handler: async function (response) {
          try {
            console.log('[Razorpay] Payment completed, verifying signature...', response);

            // Step 3: Verify Payment Signature on Backend
            const verifyRes = await fetch(API_ENDPOINTS.VERIFY_PAYMENT || '/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  packageId,
                  packageTitle,
                  destinationName,
                  guestName: travelerName,
                  guestEmail: travelerEmail,
                  guestPhone: travelerPhone,
                  travelDate,
                  adults,
                  children,
                  hotelClass,
                  addons,
                  paymentOption,
                  amountPaid: amount,
                  totalTripAmount,
                  remainingBalance
                }
              })
            });

            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok || !verifyJson.success) {
              throw new Error(verifyJson.message || 'Payment verification failed');
            }

            console.log('[Razorpay] Verification successful:', verifyJson);
            onSuccess(verifyJson);
            resolve(verifyJson);
          } catch (err) {
            console.error('[Razorpay Verification Error]', err);
            onError(err);
            reject(err);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (failResponse) {
        console.error('[Razorpay Payment Failed]', failResponse.error);
        const errMsg = failResponse.error?.description || 'Payment was unsuccessful or declined by your bank.';
        onError(new Error(errMsg));
        reject(new Error(errMsg));
      });

      rzp.open();
    });
  } catch (err) {
    console.error('[Execute Razorpay Payment Error]', err);
    onError(err);
    throw err;
  }
}
