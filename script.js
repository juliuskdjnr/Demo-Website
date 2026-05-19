/* ============================================================
   script.js — Nexus Tech Landing Page
   How JS links to HTML:
     In index.html (bottom of <body>) → <script src="script.js"></script>
   Placing it at the BOTTOM ensures all HTML elements exist
   before this script tries to find them.
   ============================================================ */
const products = [
  {
    id: 1,
    name: "KD Pro Display 4K",
    category: "display",
    price: "$649",
    emoji: "🖥️",
    description: "27\" OLED panel with 144Hz refresh rate and Delta-E < 1 colour accuracy. Perfect for creators.",
    fullDesc: "The KD Pro Display 4K delivers studio-grade colour in a sleek aluminium chassis. Features USB-C 90W charging, KVM switch, and VESA compatibility. A complete workstation upgrade."
  },
  {
    id: 2,
    name: "KD ANC Headphones",
    category: "audio",
    price: "$199",
    emoji: "🎧",
    description: "40dB active noise cancellation, 30h battery, premium leather ear cups.",
    fullDesc: "Block out the world with 40dB ANC and lose yourself in studio-quality audio. The KD ANC headphones fold flat, include a carry case, and connect to 3 devices simultaneously."
  },
  {
    id: 3,
    name: "Mechanical Keyboard Pro",
    category: "input",
    price: "$129",
    emoji: "⌨️",
    description: "TKL layout, hot-swap sockets, per-key RGB. Compatible with Mac & Windows.",
    fullDesc: "Hot-swappable switches let you customise your typing feel without soldering. Ships with Gateron Red switches and includes a switch puller. USB-C braided cable included."
  },
  {
    id: 4,
    name: "KD Phone 15 Ultra",
    category: "mobile",
    price: "$999",
    emoji: "📱",
    description: "6.7\" AMOLED, 200MP camera system, 5000mAh battery, 100W charging.",
    fullDesc: "Engineered for power users. The KD Phone 15 Ultra packs a Snapdragon 8 Gen 3 chip, satellite connectivity, and IP68 water resistance. Ships with a 100W charger in the box."
  },
  {
    id: 5,
    name: "Precision Mouse X1",
    category: "input",
    price: "$79",
    emoji: "🖱️",
    description: "26,000 DPI optical sensor, 8 programmable buttons, 2.4GHz wireless.",
    fullDesc: "Designed for precision. The X1 uses a HERO 25K sensor with zero smoothing, acceleration, or filtering at any DPI level. Lightweight polycarbonate shell at just 61g."
  },
  {
    id: 6,
    name: "USB-C Hub Pro 12-in-1",
    category: "accessories",
    price: "$59",
    emoji: "🔌",
    description: "Dual 4K HDMI, 100W PD, SD/MicroSD, 3×USB-A, Ethernet, 3.5mm audio.",
    fullDesc: "Turn one USB-C port into a full workstation. The Hub Pro 12-in-1 supports dual monitor output, 4K@60Hz, and simultaneously charges your laptop at 100W. Aluminum housing dissipates heat efficiently."
  },
  {
    id: 7,
    name: "Studio Webcam 4K",
    category: "accessories",
    price: "$149",
    emoji: "📷",
    description: "4K@60fps, auto-framing AI, dual noise-cancelling mics, HDR support.",
    fullDesc: "Built-in AI keeps you centred automatically during calls. The wide-angle lens captures your whole workspace, while dual mics filter keyboard clicks and background noise. Works with any conferencing app."
  },
  {
    id: 8,
    name: "KD Buds Pro",
    category: "audio",
    price: "$89",
    emoji: "🎵",
    description: "True wireless, IPX5 water resistant, 8h battery + 32h case, spatial audio.",
    fullDesc: "KD Buds Pro fit securely for workouts and stay connected up to 30m. Transparency mode lets you hear your surroundings without removing the buds. Wireless charging case included."
  },
  {
    id: 9,
    name: "Curved Gaming Monitor",
    category: "display",
    price: "$449",
    emoji: "🖥️",
    description: "32\" 1440p VA panel, 165Hz, 1ms MPRT, FreeSync Premium Pro.",
    fullDesc: "The 1500R curve wraps your field of view for maximum immersion. Variable refresh rate eliminates screen tearing across AMD and NVIDIA cards. Includes tilt, swivel, and height adjustment stand."
  }
];

// STATE — variables that track what's happening at runtime 

let cartCount       = 0;
let activeFilter    = 'all';
let searchQuery     = '';
let currentProductId = null;

/* 
   DOM REFERENCES
   Grab each element once and store it in a variable.
   Much faster than calling getElementById every time.
*/
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const themeToggle  = document.getElementById('themeToggle');
const searchInput  = document.getElementById('searchInput');
const productsGrid = document.getElementById('productsGrid');
const noResults    = document.getElementById('noResults');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const cartBtn      = document.getElementById('cartBtn');
const cartCountEl  = document.getElementById('cartCount');
const contactForm  = document.getElementById('contactForm');
const toast        = document.getElementById('toast');

/* 
   FEATURE 1: DARK / LIGHT MODE TOGGLE
   Adds/removes .light-mode on <body>.
   CSS variables in style.css handle all colour changes.
*/
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

/* 
   MOBILE HAMBURGER MENU
   Toggles .open class on the nav list and button.
*/
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a nav link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/*
   RENDER PRODUCTS
   Builds a card for each product and injects it into the DOM.
   Re-runs whenever the search text or filter changes.
*/
function renderProducts() {
  // Filter array: keep only products that match BOTH filter AND search
  const filtered = products.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) ||
                          p.description.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Remove previously rendered cards
  productsGrid.querySelectorAll('.product-card').forEach(card => card.remove());

  // Show "no results" text if nothing matched
  noResults.style.display = filtered.length === 0 ? 'block' : 'none';

  // Create and insert a card for each matching product
  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    card.innerHTML = `
      <span class="card-category">${product.category}</span>
      <div class="card-image">${product.emoji}</div>
      <div class="card-body">
        <h3 class="card-name">${product.name}</h3>
        <p class="card-description">${product.description}</p>
        <div class="card-footer">
          <span class="card-price">${product.price}</span>
          <button class="card-btn view-btn">View More</button>
        </div>
      </div>
    `;

    // Clicking the card opens the detail modal
    card.addEventListener('click', () => openModal(product.id));

    productsGrid.insertBefore(card, noResults);
  });
}

/*
   FEATURE 2: LIVE SEARCH
   Fires on every keystroke inside the search box.
*/
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderProducts();
});

/*
   FEATURE: FILTER BY CATEGORY
   Uses event delegation — one listener on the parent
   instead of one listener per button.
*/
document.querySelector('.filter-bar').addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;

  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');

  activeFilter = e.target.dataset.filter; // reads data-filter="..." attribute
  renderProducts();
});

/*
   FEATURE: PRODUCT DETAIL MODAL
   openModal() fills the modal with the selected product,
   then makes it visible via CSS class toggle.
*/
function openModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentProductId = productId;

  document.getElementById('modalIcon').textContent  = product.emoji;
  document.getElementById('modalName').textContent  = product.name;
  document.getElementById('modalPrice').textContent = product.price;
  document.getElementById('modalDesc').textContent  = product.fullDesc;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // stop background from scrolling
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  currentProductId = null;
}

modalClose.addEventListener('click', closeModal);

// Click on the dark overlay (outside the modal box) → close
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Press Escape key → close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/*
   FEATURE 3: ADD TO CART COUNTER
*/
function addToCart() {
  cartCount++;
  cartCountEl.textContent = cartCount;
  cartCountEl.classList.add('visible'); // show red badge

  // Animate the cart button briefly
  cartBtn.style.transform = 'scale(1.15)';
  setTimeout(() => { cartBtn.style.transform = ''; }, 200);

  closeModal();
}

document.getElementById('modalAddBtn').addEventListener('click', addToCart);

/*
   CONTACT FORM VALIDATION
   Runs on submit. Shows inline error messages for
   any fields that fail validation.
*/

// Adds/removes .error on input and shows/hides the error message span
function setError(inputId, errorId, condition) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (condition) {
    input.classList.add('error');
    error.classList.add('show');
    return false; // invalid
  } else {
    input.classList.remove('error');
    error.classList.remove('show');
    return true;  // valid
  }
}

// Regex check: must have text @ text . text
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the default page-reload

  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const message = document.getElementById('formMessage').value.trim();

  const nameOk    = setError('formName',    'nameError',    name === '');
  const emailOk   = setError('formEmail',   'emailError',   !isValidEmail(email));
  const messageOk = setError('formMessage', 'messageError', message.length < 10);

  if (nameOk && emailOk && messageOk) {
    contactForm.reset();
    showToast();
  }
});

// Live error clearing — removes the red border as the user types
['formName', 'formEmail', 'formMessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    this.classList.remove('error');
    const errEl = document.getElementById(id.replace('form', '').toLowerCase() + 'Error');
    if (errEl) errEl.classList.remove('show');
  });
});

/*
   TOAST NOTIFICATION
   Slides in then disappears after 3.5 seconds.
*/
function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/*
   INITIAL RENDER
   Build product cards on page load.
*/
renderProducts();