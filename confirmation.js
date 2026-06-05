// Animated Background Colors
const colorPresets = [
    ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    ['#16213e', '#0f3460', '#2d1b3d', '#0a0e27', '#1a1a2e'],
    ['#1a1a2e', '#2d1b3d', '#0f3460', '#16213e', '#0a0e27'],
    ['#0f3460', '#1a1a2e', '#16213e', '#2d1b3d', '#0a0e27']
];

let colorIndex = 0;

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();
    displayOrderConfirmation();
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

// Display order confirmation
function displayOrderConfirmation() {
    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('lastOrder'));

    if (!orderData) {
        // No order found, show error
        document.querySelector('.success-message').innerHTML = `
            <div class="success-icon">❌</div>
            <h1>No Order Found</h1>
            <p>It seems there's no recent order. Please go back and complete your purchase.</p>
        `;
        return;
    }

    // Generate order number if it doesn't exist
    const orderNumber = orderData.orderNumber || 'ELY-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Format current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Populate order details
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('orderDate').textContent = dateString;
    
    // Check if this is from new delivery form or old checkout
    if (orderData.customer.name) {
        // New format (from delivery form)
        document.getElementById('customerName').textContent = orderData.customer.name;
        const fullAddress = `${orderData.customer.address}, ${orderData.customer.city} ${orderData.customer.postalCode}`;
        document.getElementById('shippingAddress').textContent = fullAddress;
    } else {
        // Old format (from checkout)
        document.getElementById('customerName').textContent = `${orderData.customer.firstName} ${orderData.customer.lastName}`;
        const fullAddress = `${orderData.shipping.address}, ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipcode}, ${orderData.shipping.country}`;
        document.getElementById('shippingAddress').textContent = fullAddress;
    }

    // Display order items
    const orderItemsContainer = document.getElementById('orderItems');
    if (orderData.items && orderData.items.length > 0) {
        orderData.items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            <span class="item-price">PKR ${(item.price * item.quantity).toFixed(2)}</span>

            `;
            orderItemsContainer.appendChild(itemRow);
        });
    }

    // Display perfume details if from delivery form
    if (orderData.perfume) {
        const perfumeRow = document.createElement('div');
        perfumeRow.className = 'item-row';
        perfumeRow.innerHTML = `
            <span class="item-name">${orderData.perfume.name} (${orderData.perfume.size})</span>
            <span class="item-qty">x1</span>
            <span class="item-price">PKR ${parseFloat(orderData.perfume.price).toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(perfumeRow);
    }

    // Display summary
    if (orderData.orderSummary) {
        // Old format
                document.getElementById('confirmSubtotal').textContent = `pkr ${orderData.orderSummary.subtotal.toFixed(2)}`;
        document.getElementById('confirmShipping').textContent = orderData.orderSummary.shipping === 0 ? 'Free' : `pkr ${orderData.orderSummary.shipping.toFixed(2)}`;
        document.getElementById('confirmTax').textContent = `pkr ${orderData.orderSummary.tax.toFixed(2)}`;
        document.getElementById('confirmTotal').textContent = `pkr ${orderData.orderSummary.total.toFixed(2)}`;
    } else if (orderData.totalAmount) {
        // New format
        document.getElementById('confirmSubtotal').textContent = `PKR ${orderData.totalAmount.toFixed(2)}`;
        document.getElementById('confirmShipping').textContent = 'Free';
        document.getElementById('confirmTax').textContent = 'Included';
        document.getElementById('confirmTotal').textContent = `PKR ${orderData.totalAmount.toFixed(2)}`;
    }

    // Clear localStorage
    localStorage.removeItem('lastOrder');
    localStorage.removeItem('orderConfirmed');
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
