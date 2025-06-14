// src/scripts/cart-init.js
// Global Cart Initialization Script
// This script should be included in the base layout to initialize cart functionality

(function () {
  'use strict';

  // Cart initialization configuration
  const CART_CONFIG = {
    API_BASE_URL: 'https://corrison.corrisonapi.com/api/v1',
    AUTO_LOAD_ON_INIT: true,
    STORAGE_KEY: 'cart_token',
    DEBUG: false
  };

  // Utility function for debugging
  function debug(...args) {
    if (CART_CONFIG.DEBUG) {
      console.log('[Cart Init]', ...args);
    }
  }

  // Initialize cart manager
  function initializeCartManager() {
    debug('Initializing cart manager...');

    // Ensure cart.ts module is loaded
    if (typeof window.cartManager === 'undefined') {
      debug('Cart manager not available, retrying in 100ms...');
      setTimeout(initializeCartManager, 100);
      return;
    }

    debug('Cart manager found, setting up...');

    // Load initial cart data
    if (CART_CONFIG.AUTO_LOAD_ON_INIT) {
      window.cartManager.loadCartData()
        .then(() => {
          debug('Initial cart data loaded successfully');
          notifyCartReady();
        })
        .catch(error => {
          debug('Failed to load initial cart data:', error);
          notifyCartReady(); // Still notify ready even if load fails
        });
    } else {
      notifyCartReady();
    }

    // Set up global cart event listeners
    setupGlobalCartListeners();
  }

  // Notify that cart is ready
  function notifyCartReady() {
    debug('Cart system ready');

    // Dispatch custom event
    const event = new CustomEvent('cartReady', {
      detail: {
        cartManager: window.cartManager,
        config: CART_CONFIG
      }
    });

    document.dispatchEvent(event);

    // Update UI elements
    updateGlobalCartElements();
  }

  // Set up global cart event listeners
  function setupGlobalCartListeners() {
    debug('Setting up global cart listeners...');

    // Listen for cart updates
    window.cartManager.subscribe((cartData) => {
      debug('Cart updated:', cartData);
      updateGlobalCartElements(cartData);
    });

    // Listen for storage changes (cart token updates from other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === CART_CONFIG.STORAGE_KEY && e.newValue !== e.oldValue) {
        debug('Cart token changed in another tab, reloading cart data...');
        window.cartManager.loadCartData();
      }
    });

    // Listen for user authentication changes
    document.addEventListener('authStateChanged', () => {
      debug('Auth state changed, reloading cart data...');
      window.cartManager.loadCartData();
    });
  }

  // Update global cart elements (badges, counts, etc.)
  function updateGlobalCartElements(cartData = null) {
    debug('Updating global cart elements...');

    if (!cartData) {
      cartData = window.cartManager.getCartData();
    }

    // Update cart count badges
    const countBadges = document.querySelectorAll('#cart-count-badge, [data-cart-count]');
    countBadges.forEach(badge => {
      const count = cartData?.item_count || 0;
      badge.textContent = count.toString();

      if (count > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Update cart subtotal displays
    const subtotalElements = document.querySelectorAll('[data-cart-subtotal]');
    subtotalElements.forEach(element => {
      const subtotal = cartData?.subtotal || 0;
      element.textContent = `$${subtotal.toFixed(2)}`;
    });

    // Update cart type indicators
    const typeElements = document.querySelectorAll('[data-cart-type]');
    typeElements.forEach(element => {
      const cartType = cartData?.cart_type;
      if (cartType) {
        element.textContent = cartType === 'digital' ? '📱 Digital' : '📦 Physical';
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });

    // Update checkout button states
    const checkoutButtons = document.querySelectorAll('[data-checkout-button]');
    checkoutButtons.forEach(button => {
      const hasItems = cartData?.item_count > 0;
      button.disabled = !hasItems;

      if (hasItems) {
        button.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        button.classList.add('opacity-50', 'cursor-not-allowed');
      }
    });
  }

  // Set up quick add to cart functionality
  function setupQuickAddToCart() {
    debug('Setting up quick add to cart functionality...');

    // Listen for quick add button clicks
    document.addEventListener('click', async (e) => {
      const button = e.target.closest('[data-quick-add]');
      if (!button) return;

      e.preventDefault();

      const productSlug = button.dataset.productSlug;
      const quantity = parseInt(button.dataset.quantity || '1');

      if (!productSlug || !window.cartManager) return;

      // Get product data (this would need to be available or fetched)
      const productData = getProductData(productSlug);
      if (!productData) {
        console.error('Product data not found for slug:', productSlug);
        return;
      }

      // Add to cart
      const result = await window.cartManager.addToCart(productData, quantity);

      // Show notification
      if (window.showCartNotification) {
        window.showCartNotification(
          result.success ? result.message : 'Failed to add item to cart',
          result.success ? 'success' : 'error'
        );
      }
    });
  }

  // Get product data (placeholder - would need proper implementation)
  function getProductData(slug) {
    // This would typically fetch from a global products cache or API
    // For now, return null to indicate data not available
    return null;
  }

  // Initialize page-specific cart features
  function initializePageSpecificFeatures() {
    const currentPath = window.location.pathname;
    debug('Initializing features for path:', currentPath);

    // Product pages
    if (currentPath.includes('/ecommerce/') && !currentPath.endsWith('/ecommerce')) {
      debug('Product page detected, loading product cart features...');
      loadProductPageFeatures();
    }

    // Cart page
    if (currentPath.includes('/cart')) {
      debug('Cart page detected, loading cart page features...');
      loadCartPageFeatures();
    }

    // Checkout page
    if (currentPath.includes('/checkout')) {
      debug('Checkout page detected, loading checkout features...');
      loadCheckoutPageFeatures();
    }
  }

  // Load product page specific features
  function loadProductPageFeatures() {
    // Wait for product data to be available
    if (typeof window.currentProduct !== 'undefined' && window.addToCart) {
      debug('Product page features ready');
    } else {
      setTimeout(loadProductPageFeatures, 100);
    }
  }

  // Load cart page specific features
  function loadCartPageFeatures() {
    debug('Loading cart page features...');
    // Cart page specific initialization would go here
  }

  // Load checkout page specific features
  function loadCheckoutPageFeatures() {
    debug('Loading checkout page features...');
    // Checkout page specific initialization would go here
  }

  // Main initialization function
  function init() {
    debug('Starting cart initialization...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize cart manager
    initializeCartManager();

    // Set up quick add functionality
    setupQuickAddToCart();

    // Initialize page-specific features
    initializePageSpecificFeatures();

    debug('Cart initialization complete');
  }

  // Start initialization
  init();

  // Export configuration for other scripts
  window.CART_CONFIG = CART_CONFIG;

})();
