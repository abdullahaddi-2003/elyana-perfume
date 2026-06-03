// Animated Background Colors
const colorPresets = [
    ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    ['#16213e', '#0f3460', '#2d1b3d', '#0a0e27', '#1a1a2e'],
    ['#1a1a2e', '#2d1b3d', '#0f3460', '#16213e', '#0a0e27'],
    ['#0f3460', '#1a1a2e', '#16213e', '#2d1b3d', '#0a0e27']
];

let colorIndex = 0;

// Sample cart data (in real app, this would come from localStorage or server)
let cartItems = JSON.parse(localStorage.getItem('cart')) || [
    { id: 1, name: 'Midnight Dreams', price: 89.99, quantity: 1 },
    { id: 2, name: 'Rose Garden', price: 79.99, quantity: 1 },
    { id: 3, name: 'Ocean Breeze', price: 84.99, quantity: 1 }
];

let shippingCost = 0;

// DOM Elements
const cartItemsContainer = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const shippingCostEl = document.getElementById('shippingCost');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutForm = document.getElementById('checkoutForm');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const shippingRadios = document.querySelectorAll('input[name="shipping"]');
const cartBtn = document.getElementById('cartBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();
    renderCartItems();
    updateOrderSummary();
    setupEventListeners();
    changeBackgroundColors();
});

// Update cart count display
function updateCartCountDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Function to change background colors dynamically
function changeBackgroundColors() {
    const bgElement = document.querySelector('.animated-bg');
    if (bgElement) {
        colorIndex = (colorIndex + 1) % colorPresets.length;
        const colors = colorPresets[colorIndex];
        const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;
        bgElement.style.backgroundImage = gradient;
    }
}

// Change colors every 15 seconds
setInterval(changeBackgroundColors, 15000);

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Shipping method change
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const method = e.target.value;
            if (method === 'express') {
                shippingCost = 15;
                shippingCostEl.textContent = '$15.00';
            } else if (method === 'overnight') {
                shippingCost = 30;
                shippingCostEl.textContent = '$30.00';
            } else {
                shippingCost = 0;
                shippingCostEl.textContent = 'Free';
            }
            updateOrderSummary();
        });
    });

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    });

    // Format expiry date
    const expiryInput = document.getElementById('expiry');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Format CVV
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });

    // Checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processCheckout();
    });

    // Continue shopping button
    document.querySelector('.order-summary .checkout-btn:last-of-type').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Process checkout
function processCheckout() {
    // Get form data
    const formData = new FormData(checkoutForm);
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipcode: formData.get('zipcode'),
            country: formData.get('country'),
            method: formData.get('shipping')
        },
        payment: {
            method: formData.get('paymentMethod'),
            cardName: formData.get('cardName'),
            cardNumber: formData.get('cardNumber').replace(/\s/g, '').slice(-4),
            expiry: formData.get('expiry')
        },
        items: cartItems,
        orderSummary: {
            subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
            shipping: shippingCost,
            tax: parseFloat(document.getElementById('tax').textContent.replace('$', '')),
            total: parseFloat(document.getElementById('total').textContent.replace('$', ''))
        }
    };

    // Save order data
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    localStorage.setItem('orderConfirmed', 'true');

    // Clear cart
    localStorage.removeItem('cart');

    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
}

// Mouse tracking for background
document.addEventListener('mousemove', (e) => {
    const bgElement = document.querySelector('.animated-bg');
    if (bgElement) {
        const x = (e.clientX / window.innerWidth) * 10;
        const y = (e.clientY / window.innerHeight) * 10;
        bgElement.style.backgroundPosition = `${x}% ${y}%`;
    }
});
