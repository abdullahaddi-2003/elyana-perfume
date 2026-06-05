// Animated Background Colors
const colorPresets = [
    ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    ['#16213e', '#0f3460', '#2d1b3d', '#0a0e27', '#1a1a2e'],
    ['#1a1a2e', '#2d1b3d', '#0f3460', '#16213e', '#0a0e27'],
    ['#0f3460', '#1a1a2e', '#16213e', '#2d1b3d', '#0a0e27']
];

let colorIndex = 0;
let cartCount = 0;

// Premium Perfume Products
const products = [
    { id: 1, name: 'Midnight Dreams', category: 'men', price: '$89.99', description: 'Bold woody notes with a hint of spice', icon: '🌙' },
    { id: 2, name: 'Rose Garden', category: 'women', price: '$79.99', description: 'Elegant floral blend with top notes of rose', icon: '🌹' },
    { id: 3, name: 'Ocean Breeze', category: 'unisex', price: '$84.99', description: 'Fresh aquatic scent with citrus notes', icon: '🌊' },
    { id: 4, name: 'Lavender Sunset', category: 'women', price: '$74.99', description: 'Soothing lavender with amber undertones', icon: '🌅' },
    { id: 5, name: 'Woody Essence', category: 'men', price: '$92.99', description: 'Deep cedarwood with leather accents', icon: '🌲' },
    { id: 6, name: 'Citrus Rush', category: 'unisex', price: '$69.99', description: 'Vibrant citrus with bergamot base', icon: '🍊' },
    { id: 7, name: 'Vanilla Bliss', category: 'women', price: '$76.99', description: 'Creamy vanilla with white musk', icon: '🍦' },
    { id: 8, name: 'Spice Trail', category: 'men', price: '$94.99', description: 'Exotic spices with warm base notes', icon: '🌶️' },
    { id: 9, name: 'Floral Dreams', category: 'women', price: '$81.99', description: 'Mixed flowers with green notes', icon: '🌸' },
    { id: 10, name: 'Charcoal Musk', category: 'men', price: '$99.99', description: 'Dark musk with smoky undertones', icon: '⚫' },
    { id: 11, name: 'Cherry Blossom', category: 'women', price: '$82.99', description: 'Delicate cherry with floral heart', icon: '🌺' },
    { id: 12, name: 'Fresh Mint', category: 'unisex', price: '$71.99', description: 'Cool mint with herbal base', icon: '🌿' },
];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const newsletterForm = document.getElementById('newsletterForm');
const cartBtn = document.getElementById('cartBtn');
const cartCountEl = document.querySelector('.cart-count');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartCount();
    renderProducts('all');
    setupEventListeners();
});

// Load cart count from localStorage
function loadCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = cartCount;
}

// Function to change background colors dynamically
function changeBackgroundColors() {
    const bgElement = document.querySelector('.animated-bg');
    if (bgElement) {
        colorIndex = (colorIndex + 1) % colorPresets.length;
        const colors = colorPresets[colorIndex];
        const gradient = `linear-gradient(-45deg, ${colors.join(', ')})`;
        bgElement.style.backgroundImage = gradient;
    }
}

// Change colors every 15 seconds
setInterval(changeBackgroundColors, 15000);

// Render products
function renderProducts(category) {
    productGrid.innerHTML = '';

    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    filtered.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.05}s`;
        productCard.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <span class="category-label">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="price">${product.price}</div>
                <button class="add-to-cart-btn" data-product="${product.name}" data-price="${product.price}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add to cart event listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.dataset.product;
            addToCart(productName);
        });
    });
}

// Add to cart functionality
function addToCart(productName) {
    cartCount++;
    cartCountEl.textContent = cartCount;
    cartBtn.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        cartBtn.style.animation = '';
    }, 500);
    
    // Save to localStorage
    const cartItem = { name: productName, quantity: 1 };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItem.price = products.find(p => p.name === productName)?.price || 0;
        cartItem.id = products.find(p => p.name === productName)?.id || 0;
        cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`✨ ${productName} added to cart!`);
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });

    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.dataset.filter;
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === filter) {
                    btn.classList.add('active');
                }
            });
            renderProducts(filter);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

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

    // Newsletter form
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`✨ Thank you for subscribing! Confirmation sent to ${email}`);
        newsletterForm.reset();
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA Button - scroll and render all products
    const ctaBtnEl = document.querySelector('.cta-btn');
    if (ctaBtnEl) {
        ctaBtnEl.addEventListener('click', () => {
            // Set active filter to All Products
            filterBtns.forEach(b => b.classList.remove('active'));
            const allBtn = Array.from(filterBtns).find(b => b.dataset.filter === 'all');
            if (allBtn) allBtn.classList.add('active');

            // Render all products (in case user was on a filtered view)
            renderProducts('all');

            // Scroll to products section
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }


    // Cart button - go to checkout
    cartBtn.addEventListener('click', () => {
        if (cartCount > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty. Please add items before checkout.');
        }
    });
}

// Mouse tracking for background (optional interactive effect)
document.addEventListener('mousemove', (e) => {
    const bgElement = document.querySelector('.animated-bg');
    if (bgElement) {
        const x = (e.clientX / window.innerWidth) * 10;
        const y = (e.clientY / window.innerHeight) * 10;
        bgElement.style.backgroundPosition = `${x}% ${y}%`;
    }
});

// DOM Elements
const productGrid = document.getElementById('productGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const newsletterForm = document.getElementById('newsletterForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    setupEventListeners();
});

// Render products
function renderProducts(category) {
    productGrid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filtered.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <button class="btn btn-secondary">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });

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

    // Newsletter form
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing! Confirmation sent to ${email}`);
        newsletterForm.reset();
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add to Cart buttons
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.product-card')?.querySelector('h3')?.textContent || 
                               this.closest('.featured-card')?.querySelector('h3')?.textContent;
            alert(`${productName} added to cart!`);
        });
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-card, .featured-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
});