// PayPal Test Utility for Production Verification

export class PayPalTester {
  constructor() {
    this.testResults = [];
    this.browserInfo = this.getBrowserInfo();
  }

  // Get browser information
  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const browserInfo = {
      userAgent: userAgent,
      isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
      isFirefox: /Firefox/.test(userAgent),
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isEdge: /Edge/.test(userAgent),
      isIE: /MSIE|Trident/.test(userAgent),
      isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent)
    };

    // Get version numbers
    if (browserInfo.isChrome) {
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 'unknown';
    } else if (browserInfo.isFirefox) {
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 'unknown';
    } else if (browserInfo.isSafari) {
      const match = userAgent.match(/Version\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 'unknown';
    }

    return browserInfo;
  }

  // Test PayPal SDK loading
  async testPayPalSDK() {
    const test = {
      name: 'PayPal SDK Loading',
      status: 'pending',
      details: {}
    };

    try {
      // Check if PayPal is already loaded
      if (window.paypal) {
        test.status = 'passed';
        test.details.message = 'PayPal SDK already loaded';
        return test;
      }

      // Test script loading
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID') {
        test.status = 'failed';
        test.details.message = 'PayPal Client ID not configured';
        return test;
      }

      // Simulate script loading
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.async = true;

      const loadPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('PayPal SDK loading timeout'));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeout);
          if (window.paypal) {
            resolve();
          } else {
            reject(new Error('PayPal object not available after script load'));
          }
        };

        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load PayPal script'));
        };
      });

      await loadPromise;
      test.status = 'passed';
      test.details.message = 'PayPal SDK loaded successfully';

    } catch (error) {
      test.status = 'failed';
      test.details.message = error.message;
      test.details.error = error;
    }

    return test;
  }

  // Test browser compatibility
  testBrowserCompatibility() {
    const test = {
      name: 'Browser Compatibility',
      status: 'pending',
      details: {}
    };

    try {
      const { browserInfo } = this;

      if (browserInfo.isIE) {
        test.status = 'failed';
        test.details.message = 'Internet Explorer is not supported';
        test.details.recommendation = 'Please use a modern browser';
      } else if (browserInfo.isMobile) {
        test.status = 'warning';
        test.details.message = 'Mobile browser detected';
        test.details.recommendation = 'PayPal may redirect to app';
      } else if (browserInfo.isChrome && browserInfo.version < 63) {
        test.status = 'warning';
        test.details.message = 'Chrome version may be outdated';
        test.details.recommendation = 'Update Chrome for best experience';
      } else if (browserInfo.isFirefox && browserInfo.version < 57) {
        test.status = 'warning';
        test.details.message = 'Firefox version may be outdated';
        test.details.recommendation = 'Update Firefox for best experience';
      } else {
        test.status = 'passed';
        test.details.message = 'Browser is compatible';
      }

      test.details.browserInfo = browserInfo;

    } catch (error) {
      test.status = 'failed';
      test.details.message = 'Error checking browser compatibility';
      test.details.error = error;
    }

    return test;
  }

  // Test environment configuration
  testEnvironmentConfig() {
    const test = {
      name: 'Environment Configuration',
      status: 'pending',
      details: {}
    };

    try {
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

      const issues = [];

      if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID') {
        issues.push('PayPal Client ID not configured');
      }

      if (issues.length === 0) {
        test.status = 'passed';
        test.details.message = 'Environment variables configured correctly';
      } else {
        test.status = 'failed';
        test.details.message = 'Environment configuration issues found';
        test.details.issues = issues;
      }

    } catch (error) {
      test.status = 'failed';
      test.details.message = 'Error checking environment configuration';
      test.details.error = error;
    }

    return test;
  }

  // Test network connectivity
  async testNetworkConnectivity() {
    const test = {
      name: 'Network Connectivity',
      status: 'pending',
      details: {}
    };

    try {
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID') {
        test.status = 'failed';
        test.details.message = 'PayPal Client ID not configured';
        return test;
      }

      // Test PayPal domain accessibility with proper URL
      const paypalUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      
      try {
        const paypalTest = await fetch(paypalUrl, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        test.status = 'passed';
        test.details.message = 'PayPal servers accessible';
      } catch (fetchError) {
        // If HEAD request fails, try a simple domain check
        try {
          const domainTest = await fetch('https://www.paypal.com', {
            method: 'HEAD',
            mode: 'no-cors'
          });
          
          test.status = 'warning';
          test.details.message = 'PayPal domain accessible, but SDK URL may have issues';
          test.details.recommendation = 'Check Client ID validity and PayPal account status';
        } catch (domainError) {
          test.status = 'failed';
          test.details.message = 'PayPal servers not accessible';
          test.details.recommendation = 'Check internet connection and firewall settings';
        }
      }

    } catch (error) {
      test.status = 'failed';
      test.details.message = 'Network connectivity test failed';
      test.details.error = error;
    }

    return test;
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting PayPal Tests...');
    console.log('Browser Info:', this.browserInfo);

    const tests = [
      this.testEnvironmentConfig(),
      this.testBrowserCompatibility(),
      await this.testNetworkConnectivity(),
      await this.testPayPalSDK()
    ];

    this.testResults = tests;

    // Log results
    console.log('\n📊 Test Results:');
    tests.forEach(test => {
      const status = test.status === 'passed' ? '✅' : 
                    test.status === 'warning' ? '⚠️' : '❌';
      console.log(`${status} ${test.name}: ${test.details.message}`);
      
      if (test.details.error) {
        console.error('   Error:', test.details.error);
      }
      
      if (test.details.recommendation) {
        console.log('   Recommendation:', test.details.recommendation);
      }
    });

    // Summary
    const passed = tests.filter(t => t.status === 'passed').length;
    const warnings = tests.filter(t => t.status === 'warning').length;
    const failed = tests.filter(t => t.status === 'failed').length;

    console.log(`\n📈 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed`);

    if (failed === 0 && warnings === 0) {
      console.log('🎉 All tests passed! PayPal should work correctly.');
    } else if (failed === 0) {
      console.log('⚠️  Tests passed with warnings. PayPal should work but may have issues.');
    } else {
      console.log('❌ Some tests failed. Please fix issues before using PayPal.');
    }

    return {
      tests,
      summary: { passed, warnings, failed },
      browserInfo: this.browserInfo
    };
  }

  // Get test results
  getTestResults() {
    return {
      tests: this.testResults,
      browserInfo: this.browserInfo,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const paypalTester = new PayPalTester();
export default PayPalTester; 