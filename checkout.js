// Animated Background Colors
const colorPresets = [
    ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    ['#16213e', '#0f3460', '#2d1b3d', '#0a0e27', '#1a1a2e'],
    ['#1a1a2e', '#2d1b3d', '#0f3460', '#16213e', '#0a0e27'],
    ['#0f3460', '#1a1a2e', '#16213e', '#2d1b3d', '#0a0e27']
];

let colorIndex = 0;

let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

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
            <div class="item-actions">
                <div class="item-price">pkr ${(item.price * item.quantity).toFixed(2)}</div>
                <button type="button" class="remove-from-cart-btn" data-product-name="${item.name}" style="margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.35); color: #d4af37; cursor: pointer;">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeItemFromCart(btn.dataset.productName);
        });
    });
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // No tax
    const total = subtotal + shippingCost;

    subtotalEl.textContent = `pkr ${subtotal.toFixed(2)}`;
    taxEl.textContent = `pkr 0.00`;
    totalEl.textContent = `pkr ${total.toFixed(2)}`;
}

// Setup event listeners
function normalizeLower(str) {
    return (str ?? '').toString().trim().toLowerCase();
}

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
                shippingCostEl.textContent = 'pkr 15.00';
            } else if (method === 'overnight') {
                shippingCost = 30;
                shippingCostEl.textContent = 'pkr 30.00';
            } else {
                shippingCost = 0;
            shippingCostEl.textContent = 'Free';
            }
            updateOrderSummary();
        });
    });

    // Checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        const cityVal = normalizeLower(document.getElementById('city')?.value);
        const countryVal = normalizeLower(document.getElementById('country')?.value);

        // Only Karachi allowed (case-insensitive)
        if (cityVal && cityVal !== 'karachi') {
            alert('City must be Karachi.');
            e.preventDefault();
            return;
        }

        // Only Pakistan allowed (case-insensitive)
        if (countryVal && countryVal !== 'pakistan') {
            alert('Country must be Pakistan.');
            e.preventDefault();
            return;
        }

        e.preventDefault();
        processCheckout();
    });

    // Continue shopping button
    document.querySelector('.order-summary .checkout-btn:last-of-type').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function removeItemFromCart(productName) {
    const updated = cartItems.filter(item => item.name !== productName);
    cartItems = updated;
    localStorage.setItem('cart', JSON.stringify(cartItems));

    updateCartCountDisplay();
    renderCartItems();
    updateOrderSummary();
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
            method: 'COD'
        },
        items: cartItems,
        orderSummary: {
            subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('pkr', '').trim()),
            shipping: shippingCost,
            tax: 0,
            total: parseFloat(document.getElementById('total').textContent.replace('pkr', '').trim())
        }
    };

    // Save order data
    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Redirect to delivery form
    window.location.href = 'delivery-form.html';
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
