// src/lib/cart.ts
// Cart Management Module with Digital/Physical Type Enforcement

export interface Product {
  slug: string;
  name: string;
  price: number;
  sale_price?: number;
  main_image?: string;
  featured_image?: string;
  product_type: "digital" | "physical";
  category?: { name: string; slug: string };
  is_active: boolean;
  stock_qty?: number;
  in_stock?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: any;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartData {
  cart_token: string;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  cart_type: "digital" | "physical" | null;
  has_digital_items: boolean;
  has_physical_items: boolean;
  is_digital_only: boolean;
  requires_shipping: boolean;
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  cart_token?: string;
  item?: CartItem;
  cart_data?: CartData;
}

export class CartManager {
  private static instance: CartManager;
  private apiBaseUrl = "https://corrison.corrisonapi.com/api/v1";
  private cartToken: string | null = null;
  private cartData: CartData | null = null;
  private listeners: Array<(cartData: CartData) => void> = [];

  constructor() {
    this.loadCartToken();
  }

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  // Subscribe to cart changes
  subscribe(listener: (cartData: CartData) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of cart changes
  private notifyListeners(): void {
    if (this.cartData) {
      this.listeners.forEach(listener => listener(this.cartData!));
    }
  }

  // Load cart token from localStorage or create new one
  private loadCartToken(): void {
    try {
      this.cartToken = localStorage.getItem('cart_token');
    } catch (error) {
      console.warn('Failed to load cart token from localStorage:', error);
    }
  }

  // Save cart token to localStorage
  private saveCartToken(token: string): void {
    try {
      this.cartToken = token;
      localStorage.setItem('cart_token', token);
    } catch (error) {
      console.warn('Failed to save cart token to localStorage:', error);
    }
  }

  // Get authorization headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.cartToken) {
      headers['Authorization'] = `Bearer ${this.cartToken}`;
    }

    return headers;
  }

  // Load cart data from API
  async loadCartData(): Promise<CartData | null> {
    try {
      this.updateCartUI('loading');

      const response = await fetch(`${this.apiBaseUrl}/cart/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Transform API response to CartData format
      this.cartData = {
        cart_token: data.cart_token || this.cartToken || '',
        items: data.items || [],
        item_count: data.item_count || 0,
        subtotal: data.subtotal || 0,
        cart_type: this.determineCartType(data.items || []),
        has_digital_items: data.has_digital_items || false,
        has_physical_items: data.has_physical_items || false,
        is_digital_only: data.is_digital_only || false,
        requires_shipping: data.requires_shipping || false,
      };

      // Save token if received
      if (data.cart_token) {
        this.saveCartToken(data.cart_token);
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

  // Determine cart type based on items
  private determineCartType(items: CartItem[]): "digital" | "physical" | null {
    if (items.length === 0) return null;

    const hasDigital = items.some(item => item.product.product_type === 'digital');
    const hasPhysical = items.some(item => item.product.product_type === 'physical');

    if (hasDigital && !hasPhysical) return 'digital';
    if (hasPhysical && !hasDigital) return 'physical';

    // This shouldn't happen with our enforcement, but fallback
    return items[0].product.product_type;
  }

  // Add product to cart with type enforcement
  async addToCart(product: Product, quantity: number = 1): Promise<AddToCartResponse> {
    try {
      // First check if cart type allows this product
      if (this.cartData && this.cartData.items.length > 0) {
        const currentCartType = this.cartData.cart_type;

        if (currentCartType && currentCartType !== product.product_type) {
          const currentTypeLabel = currentCartType === 'digital' ? 'digital products' : 'physical products';
          const newTypeLabel = product.product_type === 'digital' ? 'digital product' : 'physical product';

          return {
            success: false,
            message: `Cannot mix product types. Your cart currently contains ${currentTypeLabel}. Please checkout first or remove existing items to add this ${newTypeLabel}.`
          };
        }
      }

      // Check stock for physical products
      if (product.product_type === 'physical') {
        if (!product.in_stock || (product.stock_qty && product.stock_qty < quantity)) {
          return {
            success: false,
            message: 'Not enough stock available'
          };
        }
      }

      const response = await fetch(`${this.apiBaseUrl}/cart/add/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          product_slug: product.slug,
          quantity: quantity,
          cart_token: this.cartToken
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

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
        item: data.item,
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
  async updateCartItem(itemId: string, quantity: number): Promise<AddToCartResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cart/update/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity,
          cart_token: this.cartToken
        }),
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
  async removeCartItem(itemId: string): Promise<AddToCartResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cart/remove/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          item_id: itemId,
          cart_token: this.cartToken
        }),
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
  async clearCart(): Promise<AddToCartResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cart/clear/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          cart_token: this.cartToken
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Reset local cart data
      this.cartData = {
        cart_token: this.cartToken || '',
        items: [],
        item_count: 0,
        subtotal: 0,
        cart_type: null,
        has_digital_items: false,
        has_physical_items: false,
        is_digital_only: false,
        requires_shipping: false,
      };

      this.updateCartUI('success');
      this.notifyListeners();

      return {
        success: true,
        message: 'Cart cleared successfully',
        cart_data: this.cartData
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
  getCartData(): CartData | null {
    return this.cartData;
  }

  // Get cart item count
  getItemCount(): number {
    return this.cartData?.item_count || 0;
  }

  // Get cart subtotal
  getSubtotal(): number {
    return this.cartData?.subtotal || 0;
  }

  // Update cart UI elements
  private updateCartUI(state: 'loading' | 'success' | 'error'): void {
    const countBadge = document.getElementById('cart-count-badge');
    const loadingEl = document.getElementById('cart-loading');
    const emptyEl = document.getElementById('cart-empty');
    const itemsEl = document.getElementById('cart-items');
    const errorEl = document.getElementById('cart-error');

    // Hide all states first
    [loadingEl, emptyEl, itemsEl, errorEl].forEach(el => {
      el?.classList.add('hidden');
    });

    switch (state) {
      case 'loading':
        loadingEl?.classList.remove('hidden');
        break;

      case 'success':
        if (this.cartData && this.cartData.item_count > 0) {
          itemsEl?.classList.remove('hidden');
          this.renderCartItems();

          // Update count badge
          if (countBadge) {
            countBadge.textContent = this.cartData.item_count.toString();
            countBadge.classList.remove('hidden');
          }
        } else {
          emptyEl?.classList.remove('hidden');

          // Hide count badge
          countBadge?.classList.add('hidden');
        }
        break;

      case 'error':
        errorEl?.classList.remove('hidden');
        countBadge?.classList.add('hidden');
        break;
    }
  }

  // Render cart items in dropdown
  private renderCartItems(): void {
    const itemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const cartTypeIndicator = document.getElementById('cart-type-indicator');
    const cartTypeIcon = document.getElementById('cart-type-icon');
    const cartTypeText = document.getElementById('cart-type-text');

    if (!this.cartData || !itemsList) return;

    // Render items
    itemsList.innerHTML = this.cartData.items.map(item => `
      <div class="flex items-center p-3 border-b border-gray-100 last:border-b-0">
        <img 
          src="${item.product.main_image || item.product.featured_image || 'https://via.placeholder.com/60x60/e5e7eb/6b7280?text=No+Image'}" 
          alt="${item.product.name}"
          class="w-12 h-12 object-cover rounded"
        >
        <div class="flex-1 ml-3">
          <h4 class="text-sm font-medium text-gray-900 line-clamp-1">${item.product.name}</h4>
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-gray-500">Qty: ${item.quantity}</span>
            <span class="text-sm font-semibold text-gray-900">$${item.total_price.toFixed(2)}</span>
          </div>
        </div>
        <button 
          onclick="window.cartManager.removeCartItem('${item.id}')" 
          class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `).join('');

    // Update subtotal
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.cartData.subtotal.toFixed(2)}`;
    }

    // Update cart type indicator
    if (this.cartData.cart_type && cartTypeIndicator && cartTypeIcon && cartTypeText) {
      const isDigital = this.cartData.cart_type === 'digital';

      cartTypeIcon.textContent = isDigital ? '📱' : '📦';
      cartTypeText.textContent = isDigital ? 'Digital items only' : 'Physical items only';

      cartTypeIndicator.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDigital ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`;
      cartTypeIndicator.classList.remove('hidden');
    }
  }

  // Show cart type warning
  showCartTypeWarning(productType: 'digital' | 'physical'): void {
    if (!this.cartData || this.cartData.items.length === 0) return;

    const currentType = this.cartData.cart_type;
    if (currentType && currentType !== productType) {
      const currentTypeLabel = currentType === 'digital' ? 'digital products' : 'physical products';
      const newTypeLabel = productType === 'digital' ? 'digital product' : 'physical product';

      // Show toast notification or modal
      this.showNotification(
        `Cannot mix product types. Your cart currently contains ${currentTypeLabel}. Please checkout first or remove existing items to add this ${newTypeLabel}.`,
        'warning'
      );
    }
  }

  // Show notification (simple implementation)
  private showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
          'bg-yellow-500 text-black'
      }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 5000);
  }
}

// Global cart manager instance
declare global {
  interface Window {
    cartManager: CartManager;
  }
}

// Initialize cart manager
if (typeof window !== 'undefined') {
  window.cartManager = CartManager.getInstance();
}