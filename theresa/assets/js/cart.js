
class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('therezVivaCart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
        
        // Initialize modal if it exists
        if (document.getElementById('cartModal')) {
            this.updateCartModal();
        }
    }

    // Add item to cart
    addToCart(productId, productName, productPrice, productImage) {
        // Convert price to number if it's a string
        const price = typeof productPrice === 'string' 
            ? parseFloat(productPrice.replace(/[^0-9.-]+/g, ''))
            : parseFloat(productPrice);
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: price,
                image: productImage || './assets/img/menu/default.jpg',
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal(); // IMPORTANT: Update modal after adding
        this.showAddToCartAnimation(productName);
        
        return this.cart;
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartModal();
            this.updateCartCount();
        }
    }

    // Get cart items
    getCart() {
        return this.cart;
    }

    // Get cart subtotal (without tax)
    getCartSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart tax
    getCartTax() {
        const subtotal = this.getCartSubtotal();
        return subtotal * 0.075; // 7.5% tax
    }

    // Get cart total (with tax, no delivery fee)
    getCartTotal() {
        return this.getCartSubtotal() + this.getCartTax();
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
        
        // Show empty cart message
        this.showNotification('Cart cleared successfully!', 'success');
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('therezVivaCart', JSON.stringify(this.cart));
    }

    // Update cart count display
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // Show add to cart animation
    showAddToCartAnimation(productName) {
        // Remove any existing animation
        const existingAnim = document.querySelector('.add-to-cart-animation');
        if (existingAnim) {
            existingAnim.remove();
        }
        
        // Create animation element
        const animation = document.createElement('div');
        animation.className = 'add-to-cart-animation';
        animation.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            ${productName} added to cart!
        `;
        
        document.body.appendChild(animation);
        
        // Remove after animation
        setTimeout(() => {
            if (animation.parentNode) {
                animation.parentNode.removeChild(animation);
            }
        }, 2500);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Update cart modal content - Ensure calculations match checkout
    updateCartModal() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartSubtotalElement = document.getElementById('cartSubtotal');
        const cartTaxElement = document.getElementById('cartTax');
        const cartTotalElement = document.getElementById('cartTotal');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartSummary = document.getElementById('cartSummary');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (!cartItemsContainer) {
            console.log('Cart items container not found');
            return;
        }
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="bi bi-cart-x empty-cart-icon"></i>
                    <h3 class="text-light">Your cart is empty</h3>
                    <p class="text-light">Add items from our delicious menu!</p>
                </div>
            `;
            if (cartSummary) cartSummary.classList.add('d-none');
            if (clearCartBtn) clearCartBtn.style.display = 'none';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }
        
        // Show cart items
        let itemsHTML = '';
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            
            itemsHTML += `
                <div class="cart-item d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3">
                    <div class="cart-item-details me-3">
                        <h5 class="cart-item-title">${item.name}</h5>
                        <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                    </div>
                    <div class="quantity-controls me-3">
                        <button class="quantity-btn" onclick="cartSystem.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartSystem.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total ms-auto me-3">
                        <h5 class="cart-item-price">₦${itemTotal.toLocaleString()}</h5>
                    </div>
                    <button class="remove-btn" onclick="cartSystem.removeFromCart('${item.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        });
        
        // Use the same calculation methods as getCartTotal()
        const subtotal = this.getCartSubtotal();
        const tax = this.getCartTax();
        const total = this.getCartTotal();
        
        cartItemsContainer.innerHTML = itemsHTML;
        
        // Update totals if elements exist
        if (cartSubtotalElement) cartSubtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
        if (cartTaxElement) cartTaxElement.textContent = `₦${tax.toLocaleString()}`;
        if (cartTotalElement) cartTotalElement.textContent = `₦${total.toLocaleString()}`;
        
        // Store cart data for checkout page
        this.saveCartDataForCheckout();
        
        // Show summary and buttons
        if (cartSummary) {
            cartSummary.classList.remove('d-none');
            cartSummary.style.display = 'block';
        }
        if (clearCartBtn) clearCartBtn.style.display = 'block';
        if (checkoutBtn) checkoutBtn.style.display = 'block';
    }

    // Save cart data specifically for checkout page
    saveCartDataForCheckout() {
        const checkoutData = {
            subtotal: this.getCartSubtotal(),
            tax: this.getCartTax(),
            total: this.getCartTotal(),
            items: this.cart,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        console.log('Checkout data saved:', checkoutData);
    }

    // Get checkout data (for checkout page)
    getCheckoutData() {
        const savedData = localStorage.getItem('checkoutData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Fallback to current cart if no saved data
        return {
            subtotal: this.getCartSubtotal(),
            tax: this.getCartTax(),
            total: this.getCartTotal(),
            items: this.cart
        };
    }

    // Setup event listeners for add to cart buttons
    setupEventListeners() {
        // Handle add to cart button clicks
        document.addEventListener('click', (e) => {
            // Check if clicked element is an add-to-cart button or inside one
            const button = e.target.closest('.add-to-cart-btn');
            
            if (button) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = button.dataset.id;
                const productName = button.dataset.name;
                const productPrice = button.dataset.price;
                
                // Get product image from the parent menu item
                const menuItem = button.closest('.menu-item');
                let productImage = './assets/img/menu/default.jpg';
                
                if (menuItem) {
                    const imgElement = menuItem.querySelector('img');
                    if (imgElement) {
                        productImage = imgElement.src;
                    }
                }
                
                console.log('Adding to cart:', { productId, productName, productPrice, productImage });
                this.addToCart(productId, productName, productPrice, productImage);
            }
        });
        
        // Listen for modal show event to refresh cart
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('show.bs.modal', () => {
                this.updateCartModal();
            });
        }
    }
}

// Initialize cart system immediately
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart system
    window.cartSystem = new CartSystem();
    
    // Make sure cart count is updated on page load
    cartSystem.updateCartCount();
    
    // Check if there's a cart in localStorage
    const cart = JSON.parse(localStorage.getItem('therezVivaCart')) || [];
    console.log('Cart on load:', cart);
    
    // Initialize cart modal if it exists
    if (document.getElementById('cartModal')) {
        cartSystem.updateCartModal();
    }
});

// Global functions for button onclick events
function addToCartFromButton(element) {
    const productId = element.dataset.id;
    const productName = element.dataset.name;
    const productPrice = element.dataset.price;
    
    // Get product image
    const menuItem = element.closest('.menu-item');
    let productImage = './assets/img/menu/default.jpg';
    if (menuItem) {
        const imgElement = menuItem.querySelector('img');
        if (imgElement) {
            productImage = imgElement.src;
        }
    }
    
    if (window.cartSystem) {
        window.cartSystem.addToCart(productId, productName, productPrice, productImage);
    }
}