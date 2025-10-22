// Polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;
window.global = window.global || window;

// Export for use in other modules
export { Buffer };
