// PayPal Diagnostic Script
// Run this with: node paypal-diagnostic.js

import https from 'https';
import http from 'http';

class PayPalDiagnostic {
    constructor() {
        this.clientId = 'AZ1lQZr90x4Wet1AtiWhxNi-0s1K7U3I7K7RSfq3xgb7S7tQP5Z3sHHtQPd1bbqG4m_p7R1Nj1bHv8zA';
        this.results = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
        this.results.push({ timestamp, type, message });
    }

    async testClientIdFormat() {
        this.log('Testing Client ID format...');
        
        if (!this.clientId) {
            this.log('Client ID is not configured', 'error');
            return false;
        }

        // Check format
        const isValidFormat = /^[A-Za-z0-9_-]+$/.test(this.clientId);
        const isLongEnough = this.clientId.length >= 20;
        const isNotPlaceholder = !this.clientId.includes('YOUR_') && !this.clientId.includes('PLACEHOLDER');

        this.log(`Client ID length: ${this.clientId.length} characters`);
        this.log(`Format validation: ${isValidFormat ? 'Valid' : 'Invalid'}`);
        this.log(`Length validation: ${isLongEnough ? 'Valid' : 'Invalid'}`);
        this.log(`Placeholder check: ${isNotPlaceholder ? 'Valid' : 'Invalid'}`);

        if (isValidFormat && isLongEnough && isNotPlaceholder) {
            this.log('Client ID format is valid', 'success');
            return true;
        } else {
            this.log('Client ID format is invalid', 'error');
            return false;
        }
    }

    async testPayPalDomain() {
        this.log('Testing PayPal domain accessibility...');
        
        return new Promise((resolve) => {
            const req = https.request('https://www.paypal.com', { method: 'HEAD' }, (res) => {
                this.log(`PayPal domain response: ${res.statusCode} ${res.statusMessage}`, 'success');
                resolve(res.statusCode === 200);
            });

            req.on('error', (error) => {
                this.log(`PayPal domain error: ${error.message}`, 'error');
                resolve(false);
            });

            req.setTimeout(10000, () => {
                this.log('PayPal domain request timeout', 'error');
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }

    async testPayPalSDK() {
        this.log('Testing PayPal SDK URL...');
        
        const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD&intent=capture`;
        this.log(`SDK URL: ${sdkUrl}`);
        
        return new Promise((resolve) => {
            const req = https.request(sdkUrl, { method: 'HEAD' }, (res) => {
                this.log(`PayPal SDK response: ${res.statusCode} ${res.statusMessage}`);
                
                if (res.statusCode === 200) {
                    this.log('PayPal SDK URL is accessible', 'success');
                    resolve(true);
                } else if (res.statusCode === 400) {
                    this.log('PayPal SDK returned 400 Bad Request - Client ID may be invalid', 'error');
                    resolve(false);
                } else if (res.statusCode === 403) {
                    this.log('PayPal SDK returned 403 Forbidden - Client ID may be restricted', 'error');
                    resolve(false);
                } else {
                    this.log(`PayPal SDK returned unexpected status: ${res.statusCode}`, 'warning');
                    resolve(false);
                }
            });

            req.on('error', (error) => {
                this.log(`PayPal SDK error: ${error.message}`, 'error');
                resolve(false);
            });

            req.setTimeout(10000, () => {
                this.log('PayPal SDK request timeout', 'error');
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }

    async testPayPalAPI() {
        this.log('Testing PayPal API endpoints...');
        
        const endpoints = [
            'https://api.paypal.com/v1/oauth2/token',
            'https://api.sandbox.paypal.com/v1/oauth2/token'
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await this.makeRequest(endpoint, 'POST');
                this.log(`${endpoint}: ${response.statusCode}`, response.statusCode === 200 ? 'success' : 'warning');
            } catch (error) {
                this.log(`${endpoint}: ${error.message}`, 'error');
            }
        }
    }

    makeRequest(url, method = 'GET') {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: {
                    'User-Agent': 'PayPal-Diagnostic/1.0'
                }
            };

            const client = urlObj.protocol === 'https:' ? https : http;
            const req = client.request(options, (res) => {
                resolve({ statusCode: res.statusCode, statusMessage: res.statusMessage });
            });

            req.on('error', reject);
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    analyzeClientId() {
        this.log('Analyzing Client ID characteristics...');
        
        // Check for common patterns
        const patterns = {
            sandbox: /sandbox|test|sb-/i,
            live: /live|prod|live-/i,
            format: /^[A-Za-z0-9_-]+$/,
            length: this.clientId.length
        };

        this.log(`Client ID length: ${patterns.length} characters`);
        this.log(`Format matches expected pattern: ${patterns.format.test(this.clientId)}`);
        this.log(`Contains sandbox indicators: ${patterns.sandbox.test(this.clientId)}`);
        this.log(`Contains live indicators: ${patterns.live.test(this.clientId)}`);

        // Analyze character distribution
        const chars = this.clientId.split('');
        const charCount = {};
        chars.forEach(char => {
            charCount[char] = (charCount[char] || 0) + 1;
        });

        this.log(`Unique characters: ${Object.keys(charCount).length}`);
        this.log(`Most common character: ${Object.entries(charCount).sort((a, b) => b[1] - a[1])[0]?.join(':') || 'N/A'}`);
    }

    async runDiagnostics() {
        this.log('Starting PayPal diagnostics...');
        this.log(`Client ID: ${this.clientId.substring(0, 10)}...${this.clientId.substring(this.clientId.length - 10)}`);
        
        console.log('\n' + '='.repeat(60));
        
        // Run all tests
        await this.testClientIdFormat();
        console.log();
        
        this.analyzeClientId();
        console.log();
        
        await this.testPayPalDomain();
        console.log();
        
        await this.testPayPalSDK();
        console.log();
        
        await this.testPayPalAPI();
        console.log();
        
        // Summary
        console.log('='.repeat(60));
        this.log('Diagnostic Summary:');
        
        const errors = this.results.filter(r => r.type === 'error').length;
        const warnings = this.results.filter(r => r.type === 'warning').length;
        const successes = this.results.filter(r => r.type === 'success').length;
        
        this.log(`Total tests: ${this.results.length}`);
        this.log(`Errors: ${errors}`);
        this.log(`Warnings: ${warnings}`);
        this.log(`Successes: ${successes}`);
        
        if (errors === 0) {
            this.log('All tests passed! PayPal should work correctly.', 'success');
        } else {
            this.log('Some tests failed. Please check the issues above.', 'error');
        }
        
        return {
            results: this.results,
            summary: { errors, warnings, successes, total: this.results.length }
        };
    }
}

// Run diagnostics
async function main() {
    const diagnostic = new PayPalDiagnostic();
    await diagnostic.runDiagnostics();
}

// Run diagnostics
main().catch(console.error); 