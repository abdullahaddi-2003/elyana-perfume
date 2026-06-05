// Configuration
const WHATSAPP_BUSINESS_NUMBER = '+923312514960';

// Animated Background Colors
const colorPresets = [
    ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    ['#16213e', '#0f3460', '#2d1b3d', '#0a0e27', '#1a1a2e'],
    ['#1a1a2e', '#2d1b3d', '#0f3460', '#16213e', '#0a0e27'],
    ['#0f3460', '#1a1a2e', '#16213e', '#2d1b3d', '#0a0e27']
];

let colorIndex = 0;

// DOM Elements
const deliveryForm = document.getElementById('deliveryForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const submitBtn = document.getElementById('submitBtn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const cartBtn = document.getElementById('cartBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();
    loadOrderPreview();
    setupEventListeners();
    changeBackgroundColors();
    preFillCustomerData();
});

// Update cart count display
function updateCartCountDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Load order preview
function loadOrderPreview() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p style="color: rgba(255, 255, 255, 0.8);">Your cart is empty</p>';
        return;
    }

    let totalPrice = 0;
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const itemRow = document.createElement('div');
        itemRow.className = 'preview-item';
        itemRow.innerHTML = `
            <div>
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                    <span>Qty: ${item.quantity}</span>
                </div>
            </div>
            <div class="item-price">PKR ${itemTotal.toFixed(2)}</div>
        `;
        orderItemsContainer.appendChild(itemRow);
    });

    // Add total
    const totalRow = document.createElement('div');
    totalRow.className = 'preview-item';
    totalRow.style.borderTop = '1px solid rgba(212, 175, 55, 0.3)';
    totalRow.style.marginTop = '10px';
    totalRow.style.paddingTop = '10px';
    totalRow.innerHTML = `
        <div class="item-name">Total:</div>
        <div class="item-price">PKR ${totalPrice.toFixed(2)}</div>
    `;
    orderItemsContainer.appendChild(totalRow);
}

// Pre-fill customer data from checkout
function preFillCustomerData() {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (lastOrder && lastOrder.customer) {
        document.getElementById('custName').value = `${lastOrder.customer.firstName} ${lastOrder.customer.lastName}`;
        document.getElementById('custPhone').value = lastOrder.customer.phone;
        document.getElementById('address').value = lastOrder.shipping.address || '';
        document.getElementById('city').value = lastOrder.shipping.city || '';
        document.getElementById('postalCode').value = lastOrder.shipping.zipcode || '';
    }
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

    // Form submission
    deliveryForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!deliveryForm.checkValidity()) {
        showError('Please fill in all required fields');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    loadingSpinner.style.display = 'block';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    try {
        // Get form data
        const formData = {
            custName: document.getElementById('custName').value,
            custPhone: document.getElementById('custPhone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            additionalInfo: document.getElementById('additionalInfo').value,
            perfumeName: document.getElementById('perfumeName').value,
            perfumeSize: document.getElementById('perfumeSize').value,
            perfumePrice: document.getElementById('perfumePrice').value
        };

        // Get cart data
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Prepare WhatsApp message
        const whatsappMessage = prepareWhatsAppMessage(formData, cart);

        // Send to WhatsApp
        await sendToWhatsApp(whatsappMessage);

        // Save order data
        saveOrderData(formData, cart);

        // Show success message
        showSuccess('Order submitted successfully! Redirecting to confirmation...');

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred while processing your order. Please try again.');
        submitBtn.disabled = false;
        loadingSpinner.style.display = 'none';
    }
}

// Prepare WhatsApp message
function prepareWhatsAppMessage(formData, cart) {
    let message = `🎉 *NEW ORDER FROM ELYANA* 🎉\n\n`;
    message += `📦 *ORDER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `👤 *Customer Name:* ${formData.custName}\n`;
    message += `📱 *Phone:* ${formData.custPhone}\n`;
    message += `📍 *Address:* ${formData.address}, ${formData.city} ${formData.postalCode}\n`;
    
    if (formData.additionalInfo) {
        message += `📝 *Special Instructions:* ${formData.additionalInfo}\n`;
    }
    
    message += `\n🌸 *PERFUME ORDER*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Name:* ${formData.perfumeName}\n`;
    message += `*Size:* ${formData.perfumeSize}\n`;
    message += `*Price:* PKR ${parseFloat(formData.perfumePrice).toFixed(2)}\n`;
    
    message += `\n💳 *PAYMENT METHOD*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Cash on Delivery (COD)*\n`;
    
    message += `\n📦 *CART ITEMS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    let totalAmount = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        message += `${index + 1}. ${item.name} x${item.quantity} = PKR ${itemTotal.toFixed(2)}\n`;
    });
    
    message += `\n*Total Amount: PKR ${totalAmount.toFixed(2)}*\n`;
    message += `\n✅ Payment: COD (Cash on Delivery)`;
    
    return message;
}

// Send to WhatsApp Business
async function sendToWhatsApp(message) {
    // Method 1: Using WhatsApp Web API (client-side redirect)
    // This will open WhatsApp Web or the WhatsApp app
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp Web URL format
    const whatsappURL = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new window
    const whatsappWindow = window.open(whatsappURL, '_blank');
    
    if (!whatsappWindow) {
        throw new Error('Unable to open WhatsApp. Please check your WhatsApp installation.');
    }
    
    // Wait for the window to open and then close it after a delay
    // The actual sending will be handled by WhatsApp
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check if the window is closed or redirect back
            if (whatsappWindow.closed || !whatsappWindow) {
                resolve();
            } else {
                // Give user time to send the message
                resolve();
            }
        }, 1000);
    });
}

// Save order data
function saveOrderData(formData, cart) {
    const orderData = {
        customer: {
            name: formData.custName,
            phone: formData.custPhone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            additionalInfo: formData.additionalInfo
        },
        perfume: {
            name: formData.perfumeName,
            size: formData.perfumeSize,
            price: parseFloat(formData.perfumePrice)
        },
        payment: 'COD',
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toISOString()
    };

    // Generate order number
    const orderNumber = 'ELY-' + Date.now();
    orderData.orderNumber = orderNumber;

    // Save to localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    localStorage.setItem('orderConfirmed', 'true');

    // Clear cart
    localStorage.removeItem('cart');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
