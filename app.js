const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const storageKey = 'mediClaveProducts';
const adminSessionKey = 'mediClaveAdminUnlocked';
const adminPassword = 'MediClave2026!';
const whatsappNumber = '27829254918';
const ownerEmail = 'sales@medi-clave.co.za';

const defaultProducts = [
  {
    id: 'jsd-160',
    name: 'JSD 160 Steam Autoclave',
    category: 'Large Autoclaves',
    capacity: '160 L',
    description: 'Hospital-grade saturated steam autoclave for wrapped goods, unwrapped goods, Bowie-Dick testing, and leak testing workflows.',
    image: 'https://mediclave.oraxsdi.com/files/doc/69079.MC_Auto_1_-_2022.png',
  },
  {
    id: 'jsd-400',
    name: 'JSD 400 Steam Autoclave',
    category: 'Large Autoclaves',
    capacity: '400 L',
    description: 'High-capacity CSSD sterilizer with automatic cycle control, vacuum drying, and optional internal steam generator configurations.',
    image: 'https://mediclave.oraxsdi.com/files/doc/69079.MC_Auto_1_-_2022.png',
  },
  {
    id: 'bulk-2000',
    name: 'JSD 2000 Bulk Autoclave',
    category: 'Bulk Autoclaves',
    capacity: '2000 L',
    description: 'Bulk sterilization platform for demanding hospital, industrial, and healthcare waste treatment environments.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'benchtop',
    name: 'Benchtop Steam Sterilizer',
    category: 'Small Autoclaves',
    capacity: 'Tabletop',
    description: 'Compact sterilizer option for dental clinics, laboratories, ophthalmology departments, and smaller clinical spaces.',
    image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'plasma',
    name: 'Laoken Low Temperature Plasma Steriliser',
    category: 'Specialized Equipment',
    capacity: 'Low temperature plasma',
    description: 'Low temperature plasma sterilisation for heat-sensitive instruments and specialized clinical workflows where steam sterilisation is not suitable.',
    image: 'assets/medi-clave-chatbot.png',
  },
  {
    id: 'monitoring',
    name: 'Sterility Monitoring Consumables',
    category: 'Consumables',
    capacity: 'Indicators and controls',
    description: 'Consumables for sterility assurance, traceability, packaging, and cycle monitoring processes.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=82',
  },
];

let products = loadProducts();
let activeCategory = 'All';
let lastChatMessage = '';

const faqReplies = {
  'faq:quote': {
    label: 'Quote request',
    response:
      'For a quotation, please share: product type, chamber capacity or daily load volume, facility type, location, available utilities, required timeline, and whether installation, validation, or service support must be included.',
    whatsapp:
      'Hi Medi-Clave, I would like a quotation. Product/load details: [add details]. Location: [add location]. Timeline: [add timeline].',
  },
  'faq:product-fit': {
    label: 'Product selection',
    response:
      'To match the right sterilizer, we need to know your load type, chamber size requirement, cycle frequency, drying needs, available space, power/steam/water access, and whether you need a small, large, bulk, or specialized unit.',
    whatsapp:
      'Hi Medi-Clave, I need help selecting the correct sterilizer. Load type: [add]. Capacity needed: [add]. Facility type: [add].',
  },
  'faq:service': {
    label: 'Service or maintenance',
    response:
      'For planned service, send the model, serial number if available, site location, current operating condition, last service date, and preferred service date. Photos of the data plate help the team respond faster.',
    whatsapp:
      'Hi Medi-Clave, I need service or maintenance. Model/serial: [add]. Site location: [add]. Preferred date: [add].',
  },
  'faq:repair': {
    label: 'Breakdown or repair',
    response:
      'For a breakdown, send the unit model, fault or alarm message, whether the unit is still operating, urgency, site location, and contact person. Include photos or a short video where possible.',
    whatsapp:
      'Hi Medi-Clave, I have an autoclave breakdown. Fault/alarm: [add]. Model: [add]. Site: [add]. Urgency: [add].',
  },
  'faq:consumables': {
    label: 'Consumables',
    response:
      'For consumables, tell us your sterilizer type and what you need: monitoring indicators, packaging, traceability items, sterility assurance products, or routine CSSD supplies.',
    whatsapp:
      'Hi Medi-Clave, I need consumables. Sterilizer type: [add]. Items required: [monitoring/packaging/traceability/other].',
  },
  'faq:validation': {
    label: 'Validation and compliance',
    response:
      'For validation or compliance support, share the equipment model, facility type, required documentation, test frequency, and whether this is for commissioning, audit preparation, or routine quality control.',
    whatsapp:
      'Hi Medi-Clave, I need validation/compliance support. Equipment: [add]. Facility: [add]. Requirement: [commissioning/audit/routine QC].',
  },
  'faq:installation': {
    label: 'Installation planning',
    response:
      'For installation planning, send the selected equipment, room dimensions, doorway access, electrical supply, water/drainage availability, ventilation needs, and preferred installation date.',
    whatsapp:
      'Hi Medi-Clave, I need installation planning. Equipment: [add]. Site location: [add]. Utilities available: [add].',
  },
  'faq:whatsapp': {
    label: 'WhatsApp handover',
    response:
      'You can continue directly on WhatsApp. The link below will open a prepared message to Medi-Clave at +27 (0)82 925 4918.',
    whatsapp: 'Hi Medi-Clave, I would like assistance with sterilization equipment.',
  },
};

function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function loadProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(stored) || !stored.length) return defaultProducts;

    const currentDefaults = new Map(defaultProducts.map((product) => [product.id, product]));
    return stored.map((product) => (product.id === 'plasma' ? currentDefaults.get('plasma') : product));
  } catch {
    return defaultProducts;
  }
}

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

function isAdminUnlocked() {
  return sessionStorage.getItem(adminSessionKey) === 'true';
}

function setAdminUnlocked(unlocked) {
  const loginForm = $('#adminLoginForm');
  const workspace = $('#adminWorkspace');
  const loginStatus = $('#adminLoginStatus');

  sessionStorage.setItem(adminSessionKey, String(unlocked));
  loginForm.classList.toggle('unlocked', unlocked);
  workspace.classList.toggle('locked', !unlocked);
  workspace.setAttribute('aria-hidden', String(!unlocked));

  if (loginStatus) loginStatus.textContent = unlocked ? '' : 'Admin locked.';
}

function productImageFallback() {
  return 'https://mediclave.oraxsdi.com/files/doc/69079.MC_Auto_1_-_2022.png';
}

function renderFilters() {
  const filterBar = $('#categoryFilters');
  if (!filterBar) return;

  const categories = ['All', ...new Set(products.map((product) => product.category))];
  filterBar.innerHTML = categories
    .map((category) => `<button type="button" class="${category === activeCategory ? 'active' : ''}" data-category="${category}">${category}</button>`)
    .join('');

  $$('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderProducts();
      renderFilters();
    });
  });
}

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image || productImageFallback()}" alt="${product.name}" loading="lazy" onerror="this.src='${productImageFallback()}'">
      </div>
      <div class="product-card-body">
        <span class="tag">${product.category}</span>
        <h3>${product.name}</h3>
        <strong>${product.capacity || 'Specification on request'}</strong>
        <p>${product.description || 'Contact Medi-Clave for product specifications and availability.'}</p>
        <a class="ghost-button" href="${whatsappUrl(`Hi Medi-Clave, I would like more information about ${product.name}.`)}" target="_blank" rel="noreferrer">
          <i data-lucide="message-circle"></i>Ask on WhatsApp
        </a>
      </div>
    </article>
  `;
}

function renderProducts() {
  const grid = $('#productGrid');
  if (!grid) return;

  const visible = activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory);
  grid.innerHTML = visible.map(productCard).join('');
  renderAdminList();
  initIcons();
}

function renderAdminList() {
  const list = $('#adminProductList');
  if (!list) return;

  list.innerHTML = products
    .map(
      (product) => `
        <article class="admin-product-item">
          <img src="${product.image || productImageFallback()}" alt="${product.name}">
          <div>
            <strong>${product.name}</strong>
            <small>${product.category} | ${product.capacity || 'No capacity set'}</small>
            <div class="admin-item-actions">
              <button type="button" data-edit="${product.id}"><i data-lucide="pencil"></i>Edit</button>
              <button type="button" data-delete="${product.id}"><i data-lucide="trash-2"></i>Delete</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  $$('[data-edit]').forEach((button) => button.addEventListener('click', () => editProduct(button.dataset.edit)));
  $$('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteProduct(button.dataset.delete)));
  initIcons();
}

function setProductStatus(message) {
  const status = $('#productStatus');
  if (status) status.textContent = message;
}

function getImageData(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

async function submitProduct(event) {
  event.preventDefault();

  if (!isAdminUnlocked()) {
    setProductStatus('Login required before products can be changed.');
    return;
  }

  const id = $('#productId').value || `product-${Date.now()}`;
  const existing = products.find((product) => product.id === id);
  const uploadedImage = await getImageData($('#productImage').files[0]);
  const product = {
    id,
    name: $('#productName').value.trim(),
    category: $('#productCategory').value,
    capacity: $('#productCapacity').value.trim(),
    description: $('#productDescription').value.trim(),
    image: uploadedImage || existing?.image || productImageFallback(),
  };

  products = existing ? products.map((item) => (item.id === id ? product : item)) : [product, ...products];
  saveProducts();
  event.target.reset();
  $('#productId').value = '';
  setProductStatus(`${product.name} has been saved in this browser.`);
  renderFilters();
  renderProducts();
}

function editProduct(id) {
  if (!isAdminUnlocked()) {
    setProductStatus('Login required before products can be edited.');
    location.hash = '#admin';
    return;
  }

  const product = products.find((item) => item.id === id);
  if (!product) return;

  $('#productId').value = product.id;
  $('#productName').value = product.name;
  $('#productCategory').value = product.category;
  $('#productCapacity').value = product.capacity || '';
  $('#productDescription').value = product.description || '';
  setProductStatus(`Editing ${product.name}. Upload a new image only if you want to replace it.`);
  location.hash = '#admin';
}

function deleteProduct(id) {
  if (!isAdminUnlocked()) {
    setProductStatus('Login required before products can be deleted.');
    return;
  }

  const product = products.find((item) => item.id === id);
  products = products.filter((item) => item.id !== id);
  saveProducts();
  setProductStatus(`${product?.name || 'Product'} has been removed from this browser.`);
  renderFilters();
  renderProducts();
}

function resetProducts() {
  if (!isAdminUnlocked()) {
    setProductStatus('Login required before products can be reset.');
    return;
  }

  products = [...defaultProducts];
  activeCategory = 'All';
  saveProducts();
  setProductStatus('Demo catalogue restored.');
  renderFilters();
  renderProducts();
}

function exportProducts() {
  if (!isAdminUnlocked()) {
    setProductStatus('Login required before product data can be exported.');
    return;
  }

  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'medi-clave-products.json';
  link.click();
  URL.revokeObjectURL(url);
  setProductStatus('Product JSON exported.');
}

function whatsappUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function agentReply(input) {
  const text = input.toLowerCase();

  if (faqReplies[input]) return faqReplies[input].response;

  if (text.includes('quote') || text.includes('price') || text.includes('cost')) {
    return 'For a quote, send the product type, chamber size or daily load volume, location, utilities available, and whether you need installation, validation, or servicing.';
  }

  if (text.includes('service') || text.includes('repair') || text.includes('maintenance')) {
    return 'For service support, share the unit model, fault description, site location, urgency, and contact person. You can continue on WhatsApp and the team can request photos or serial details.';
  }

  if (text.includes('consumable') || text.includes('indicator') || text.includes('packaging')) {
    return 'Medi-Clave can assist with monitoring, packaging, traceability, and sterility assurance consumables. Tell us your sterilizer type and current process.';
  }

  if (text.includes('validation') || text.includes('compliance') || text.includes('audit')) {
    return 'For validation and compliance support, share the equipment model, facility type, documentation required, and whether the request is for commissioning, audit preparation, or routine quality control.';
  }

  if (text.includes('install') || text.includes('delivery') || text.includes('commission')) {
    return 'For installation planning, send the equipment type, room access, site location, available utilities, preferred timeline, and whether commissioning or handover training is needed.';
  }

  if (text.includes('autoclave') || text.includes('sterilizer') || text.includes('steriliser')) {
    return 'Autoclave selection depends on load type, chamber capacity, cycle speed, drying needs, available steam or power, water use, and compliance requirements.';
  }

  return 'I can help with autoclaves, sterilizers, consumables, service, repairs, and product enquiries. For detailed assistance, continue on WhatsApp with Medi-Clave.';
}

function addMessage(text, sender = 'agent') {
  const chatLog = $('#chatLog');
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatLog.append(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function updateWhatsAppHandover() {
  const handover = $('#whatsappHandover');
  const message = lastChatMessage
    ? lastChatMessage
    : 'Hi Medi-Clave, I would like more information about your sterilization equipment.';
  handover.href = whatsappUrl(message);
}

function sendChatMessage(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  const faq = faqReplies[cleanText];
  lastChatMessage = faq?.whatsapp || cleanText;
  addMessage(faq?.label || cleanText, 'user');
  $('#chatInput').value = '';
  updateWhatsAppHandover();

  window.setTimeout(() => {
    addMessage(agentReply(cleanText), 'agent');
  }, 300);
}

function submitChat(event) {
  event.preventDefault();
  sendChatMessage($('#chatInput').value);
}

function openEmailFallback() {
  const name = $('#leadName').value.trim();
  const email = $('#leadEmail').value.trim();
  const phone = $('#leadPhone').value.trim();
  const type = $('#leadType').value;
  const notes = $('#leadNotes').value.trim();
  const subject = encodeURIComponent(`Medi-Clave enquiry: ${type}`);
  const body = encodeURIComponent(
    [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || 'Not supplied'}`, `Product interest: ${type}`, '', 'Message:', notes || 'Not supplied'].join('\n')
  );

  $('#formStatus').textContent = 'Opening your email app with the enquiry details.';
  window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
}

function initNavigation() {
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');

  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initChat() {
  $('#chatToggle').addEventListener('click', () => $('#chatWidget').classList.add('open'));
  $('#chatClose').addEventListener('click', () => $('#chatWidget').classList.remove('open'));
  $('#chatForm').addEventListener('submit', submitChat);
  $$('[data-prompt]').forEach((button) => button.addEventListener('click', () => sendChatMessage(button.dataset.prompt)));
  addMessage('Hi, I am the Medi-Clave Assistant. Choose a topic below or type your question about autoclaves, products, service, repairs, consumables, validation, or installation.');
  updateWhatsAppHandover();
}

function initForms() {
  $('#adminLoginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const suppliedPassword = $('#adminPassword').value;
    const loginStatus = $('#adminLoginStatus');

    if (suppliedPassword === adminPassword) {
      $('#adminPassword').value = '';
      setAdminUnlocked(true);
      setProductStatus('Admin unlocked. You can now upload, edit, delete, and export products.');
      renderAdminList();
      return;
    }

    loginStatus.textContent = 'Incorrect password.';
  });
  $('#adminLogout').addEventListener('click', () => {
    setAdminUnlocked(false);
    $('#productForm').reset();
    $('#productId').value = '';
  });
  $('#productForm').addEventListener('submit', submitProduct);
  $('#resetProducts').addEventListener('click', resetProducts);
  $('#exportProducts').addEventListener('click', exportProducts);
  $('#mailtoFallback').addEventListener('click', openEmailFallback);
  $('#leadForm').addEventListener('submit', () => {
    $('#formStatus').textContent = 'Sending enquiry to Medi-Clave.';
  });
}

initNavigation();
initForms();
initChat();
setAdminUnlocked(isAdminUnlocked());
renderFilters();
renderProducts();
initIcons();
