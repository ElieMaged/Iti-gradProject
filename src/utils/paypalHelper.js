// PayPal Helper Utility for Production-Ready Integration

class PayPalHelper {
  constructor() {
    this.isLoaded = false;
    this.isInitializing = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.loadingTimeout = null;
  }

  // Load PayPal SDK with enhanced error handling
  async loadPayPalSDK() {
    if (this.isLoaded) {
      return true;
    }

    if (this.isInitializing) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.isLoaded) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }

    this.isInitializing = true;

    try {
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      // Enhanced debug logging
      console.log('🔍 PayPal Client ID Debug:');
      console.log('- Client ID exists:', !!clientId);
      console.log('- Client ID length:', clientId?.length);
      console.log('- Client ID starts with "YOUR":', clientId?.startsWith('YOUR'));
      console.log('- Client ID is empty string:', clientId === '');
      console.log('- Client ID is placeholder:', clientId === 'YOUR_PAYPAL_CLIENT_ID');
      console.log('- Client ID format check:', this.validateClientIdFormat(clientId));
      
      // Validate client ID
      if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID' || clientId.trim() === '') {
        throw new Error('PayPal Client ID not configured');
      }

      // Additional validation for Client ID format
      if (!this.validateClientIdFormat(clientId)) {
        throw new Error('Invalid PayPal Client ID format');
      }

      // Remove existing scripts to prevent conflicts
      this.removeExistingScripts();

      // Debug the PayPal SDK URL
      const paypalUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons,funding-eligibility&enable-funding=card&merchant-id=narutossj23@yahoo.com`;
      console.log('🔗 PayPal SDK URL:', paypalUrl);
      console.log('📏 URL length:', paypalUrl.length);

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = paypalUrl;
        script.async = true;
        script.defer = true;

        // Set loading timeout
        this.loadingTimeout = setTimeout(() => {
          this.isInitializing = false;
          reject(new Error('PayPal SDK loading timeout'));
        }, 15000); // 15 second timeout

        script.onload = () => {
          clearTimeout(this.loadingTimeout);
          
          // Verify PayPal object is available
          if (window.paypal) {
            this.isLoaded = true;
            this.isInitializing = false;
            console.log('✅ PayPal SDK loaded successfully');
            resolve(true);
          } else {
            this.isInitializing = false;
            reject(new Error('PayPal object not available after script load'));
          }
        };

        script.onerror = (error) => {
          clearTimeout(this.loadingTimeout);
          this.isInitializing = false;
          console.error('❌ PayPal SDK loading error:', error);
          reject(new Error('Failed to load PayPal SDK'));
        };

        document.head.appendChild(script);
      });

    } catch (error) {
      this.isInitializing = false;
      throw error;
    }
  }

  // Validate PayPal Client ID format
  validateClientIdFormat(clientId) {
    if (!clientId) return false;
    
    // PayPal Client IDs are typically long strings with specific patterns
    // They should not be placeholder values and should be at least 20 characters
    if (clientId.length < 20) return false;
    if (clientId.includes('YOUR_') || clientId.includes('PLACEHOLDER')) return false;
    
    // Check for common PayPal Client ID patterns
    // They usually contain alphanumeric characters and hyphens
    const validPattern = /^[A-Za-z0-9_-]+$/;
    return validPattern.test(clientId);
  }

  // Remove existing PayPal scripts to prevent conflicts
  removeExistingScripts() {
    const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
    existingScripts.forEach(script => script.remove());
  }

  // Initialize PayPal button with retry logic
  async initializeButton(containerId, options) {
    if (!this.isLoaded) {
      await this.loadPayPalSDK();
    }

    if (!window.paypal) {
      throw new Error('PayPal SDK not available');
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error('PayPal container not found');
    }

    // Clear existing content
    container.innerHTML = '';

    try {
      const button = window.paypal.Buttons({
        fundingSource: window.paypal.FUNDING.PAYPAL,
        ...options
      });

      if (button.isEligible()) {
        await button.render(`#${containerId}`);
        console.log('✅ PayPal button rendered successfully');
        return true;
      } else {
        container.innerHTML = '<div class="text-center p-4 text-red-500">PayPal is not available for this transaction. Please choose a different payment method.</div>';
        return false;
      }
    } catch (error) {
      console.error('❌ Error rendering PayPal button:', error);
      container.innerHTML = '<div class="text-center p-4 text-red-500">Payment system error. Please refresh the page and try again.</div>';
      throw error;
    }
  }

  // Create order with validation
  createOrder(amount, description, customData = {}) {
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (!description) {
      throw new Error('Order description is required');
    }

    return {
      purchase_units: [{
        amount: {
          value: amount.toFixed(2),
          currency_code: 'USD'
        },
        payee: {
          email_address: 'narutossj23@yahoo.com'
        },
        description: description,
        custom_id: `booking_${Date.now()}`,
        invoice_id: `INV_${Date.now()}`,
        ...customData
      }],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: window.location.origin + '/bookingconfirmation',
        cancel_url: window.location.origin + '/bookingpage'
      }
    };
  }

  // Validate payment response
  validatePaymentResponse(order) {
    if (!order || !order.id) {
      throw new Error('Invalid payment response');
    }

    if (order.status !== 'COMPLETED') {
      throw new Error('Payment was not completed successfully');
    }

    const amount = parseFloat(order.purchase_units[0].amount.value);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid payment amount received');
    }

    return {
      orderId: order.id,
      amount: amount,
      currency: order.purchase_units[0].amount.currency_code,
      payerId: order.payer.payer_id,
      status: order.status,
      captureId: order.purchase_units[0].payments.captures[0]?.id
    };
  }

  // Get user-friendly error message
  getErrorMessage(error) {
    const message = error.message || error.toString();
    
    if (message.includes('popup')) {
      return 'Payment popup was blocked. Please allow popups and try again.';
    }
    
    if (message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'Payment timed out. Please try again.';
    }
    
    if (message.includes('cancelled')) {
      return 'Payment was cancelled. You can try again or choose a different payment method.';
    }
    
    if (message.includes('not configured')) {
      return 'Payment system not configured. Please contact support.';
    }
    
    return 'Payment failed. Please try again.';
  }

  // Check browser compatibility
  checkBrowserCompatibility() {
    const userAgent = navigator.userAgent;
    const isIE = /MSIE|Trident/.test(userAgent);
    const isOldChrome = /Chrome\/([1-9]|[1-5][0-9]|6[0-2])/.test(userAgent);
    const isOldFirefox = /Firefox\/([1-9]|[1-4][0-9]|5[0-9])/.test(userAgent);
    const isOldSafari = /Safari\/([1-9]|[1-4][0-9]|5[0-9])/.test(userAgent);

    if (isIE) {
      return {
        compatible: false,
        message: 'Internet Explorer is not supported. Please use a modern browser.'
      };
    }

    if (isOldChrome || isOldFirefox || isOldSafari) {
      return {
        compatible: true,
        warning: 'You are using an older browser version. For the best experience, please update your browser.'
      };
    }

    return {
      compatible: true,
      message: 'Browser is compatible'
    };
  }

  // Cleanup method
  cleanup() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.removeExistingScripts();
  }
}

// Export singleton instance
export const paypalHelper = new PayPalHelper();
export default PayPalHelper; 