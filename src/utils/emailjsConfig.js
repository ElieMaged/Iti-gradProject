// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: '123321', // This service has Gmail connection issues
  // If the above service doesn't work, try creating a new Gmail service and use its ID here
  templateId: 'template_rn9r37x',
  publicKey: 'kGW9e5lc8iBvIT3Qw'
};

// Initialize EmailJS
export const initEmailJS = () => {
  // You can initialize EmailJS here if needed
  // emailjs.init(EMAILJS_CONFIG.publicKey);
}; 