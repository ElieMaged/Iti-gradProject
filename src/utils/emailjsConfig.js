// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '123321',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_rn9r37x',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'kGW9e5lc8iBvIT3Qw'
};

// Initialize EmailJS
export const initEmailJS = () => {
  // You can initialize EmailJS here if needed
  // emailjs.init(EMAILJS_CONFIG.publicKey);
}; 