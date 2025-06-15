// lib/cart.js - Properly converted and fixed Cart Manager

class CartManager {
  static instance = null;

  constructor() {
    this.cartData = null;
    this.cartToken = null;
    this.listeners = [];
    this.apiBaseUrl = 'https://corrison.corrisonapi.com/api/v1';
    this.loadCartToken();
  }

  static getInstance() {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  // Simple token management 
  loadCartToken() {
    try {
      this.cartToken = localStorage.getItem('cart_token');
    } catch (error) {
      console.warn('Failed to load cart token from localStorage:', error);
      this.cartToken = null;
    }
  }

  saveCartToken(token) {
    this.cartToken = token;
    try {
      localStorage.setItem('cart_token', token);
    } catch (error) {
      console.warn('Failed to save cart token to localStorage:', error);
    }
  }

  clearCartToken() {
    this.cartToken = null;
    try {
      localStorage.removeItem('cart_token');
    } catch (error) {
      console.warn('Failed to clear cart token from localStorage:', error);
    }
  }

  // Get auth headers with simple token
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.cartToken) {
      headers['Authorization'] = `Bearer ${this.cartToken}`;
    }

    return headers;
  }

  // Subscribe to cart changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.cartData));
  }

  // Update cart UI state
  updateCartUI(state) {
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    const cartSubtotalElements = document.querySelectorAll('[data-cart-subtotal]');

    if (state === 'loading') {
      cartCountElements.forEach(el => el.textContent = '...');
      return;
    }

    if (state === 'error') {
      cartCountElements.forEach(el => el.textContent = '0');
      cartSubtotalElements.forEach(el => el.textContent = '$0.00');
      return;
    }

    // Success state
    const count = this.cartData?.total_items || 0;
    const subtotal = this.cartData?.subtotal || 0;
    const subtotalNumber = typeof subtotal === 'string' ? parseFloat(subtotal) : subtotal;

    cartCountElements.forEach(el => el.textContent = count.toString());
    cartSubtotalElements.forEach(el => el.textContent = `${subtotalNumber.toFixed(2)}`);
  }

  // Load cart data from API
  async loadCartData() {
    try {
      this.updateCartUI('loading');

      const response = await fetch(`${this.apiBaseUrl}/cart/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.error(`Cart API error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.cartData = data;

      // Save cart token if received
      if (data.token) {
        this.saveCartToken(data.token);
      }

      this.updateCartUI('success');
      this.notifyListeners();
      return this.cartData;

    } catch (error) {
      console.error('Failed to load cart data:', error);
      this.updateCartUI('error');
      return null;
    }
  }

  // Add product to cart - simplified for digital products
  async addToCart(product, quantity = 1) {
    try {
      // Ensure product.id is a number
      const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;

      if (!productId || isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      const requestBody = {
        product: productId,
        quantity: quantity
      };

      console.log('Adding to cart:', requestBody);

      // Use DRF CartItemViewSet.create endpoint
      const response = await fetch(`${this.apiBaseUrl}/items/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add to cart error response:', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Add to cart success:', data);

      // Update cart token if received
      if (data.cart_token) {
        this.saveCartToken(data.cart_token);
      }

      // Reload cart data to get updated state
      await this.loadCartData();

      return {
        success: true,
        message: `${product.name} added to cart`,
        cart_token: data.cart_token,
        item: data,
        cart_data: this.cartData || undefined
      };

    } catch (error) {
      console.error('Failed to add to cart:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add item to cart'
      };
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    try {
      const requestBody = {
        quantity: quantity
      };

      const response = await fetch(`${this.apiBaseUrl}/items/${itemId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
      }

      // Reload cart data
      await this.loadCartData();

      return {
        success: true,
        message: 'Cart updated successfully',
        cart_data: this.cartData || undefined
      };

    } catch (error) {
      console.error('Failed to update cart item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update cart'
      };
    }
  }

  // Remove item from cart
  async removeCartItem(itemId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/items/${itemId}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
      }

      // Reload cart data
      await this.loadCartData();

      return {
        success: true,
        message: 'Item removed from cart',
        cart_data: this.cartData || undefined
      };

    } catch (error) {
      console.error('Failed to remove cart item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove item'
      };
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cart/clear/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
      }

      // Reload cart data
      await this.loadCartData();

      return {
        success: true,
        message: 'Cart cleared successfully',
        cart_data: this.cartData || undefined
      };

    } catch (error) {
      console.error('Failed to clear cart:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear cart'
      };
    }
  }

  // Get current cart data
  getCartData() {
    return this.cartData;
  }

  // Get cart token
  getCartToken() {
    return this.cartToken;
  }

  // Get cart item count
  getItemCount() {
    return this.cartData?.total_items || 0;
  }

  // Get cart subtotal
  getSubtotal() {
    const subtotal = this.cartData?.subtotal || 0;
    return typeof subtotal === 'string' ? parseFloat(subtotal) : subtotal;
  }
}

// Export singleton instance
export const cartManager = CartManager.getInstance();

// Make cart manager globally available
if (typeof window !== 'undefined') {
  window.cartManager = cartManager;
  console.log('CartManager initialized and attached to window');
}
