// src/scripts/cart-manager.js - Client-side entry point for cart functionality
import { cartManager } from '/lib/cart.js';

// Make cart manager globally available
window.cartManager = cartManager;
console.log('CartManager loaded and attached to window');

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Initializing cart data...');
    await cartManager.loadCartData();
    console.log('Cart data loaded successfully');

    // Dispatch cart ready event for other components
    document.dispatchEvent(new CustomEvent('cartReady', {
      detail: { cartManager }
    }));
  } catch (error) {
    console.error('Failed to load cart data:', error);
    // Still dispatch ready event even if loading fails
    document.dispatchEvent(new CustomEvent('cartReady', {
      detail: { cartManager }
    }));
  }
});