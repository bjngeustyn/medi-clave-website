const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const storageKey = 'mediClaveProducts';
const whatsappNumber = '27764167150';
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
    name: 'Low Temperature Plasma Sterilizer',
    category: 'Specialized Equipment',
    capacity: 'Low temperature',
    description: 'Hydrogen peroxide plasma sterilization for heat-sensitive instruments and specialized medical workflows.',
    image: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?auto=format&fit=crop&w=900&q=82',
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

function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function loadProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(stored) && stored.length ? stored : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
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
      <img src="${product.image || productImageFallback()}" alt="${product.name}" loading="lazy">
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
  const product = products.find((item) => item.id === id);
  products = products.filter((item) => item.id !== id);
  saveProducts();
  setProductStatus(`${product?.name || 'Product'} has been removed from this browser.`);
  renderFilters();
  renderProducts();
}

function resetProducts() {
  products = [...defaultProducts];
  activeCategory = 'All';
  saveProducts();
  setProductStatus('Demo catalogue restored.');
  renderFilters();
  renderProducts();
}

function exportProducts() {
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

  if (text.includes('quote') || text.includes('price') || text.includes('cost')) {
    return 'For a quote, send the product type, chamber size or daily load volume, location, utilities available, and whether you need installation, validation, or servicing.';
  }

  if (text.includes('service') || text.includes('repair') || text.includes('maintenance')) {
    return 'For service support, share the unit model, fault description, site location, urgency, and contact person. You can continue on WhatsApp and the team can request photos or serial details.';
  }

  if (text.includes('consumable') || text.includes('indicator') || text.includes('packaging')) {
    return 'Medi-Clave can assist with monitoring, packaging, traceability, and sterility assurance consumables. Tell us your sterilizer type and current process.';
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
    ? `Hi Medi-Clave, I need more information. My question was: ${lastChatMessage}`
    : 'Hi Medi-Clave, I would like more information about your sterilization equipment.';
  handover.href = whatsappUrl(message);
}

function sendChatMessage(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  lastChatMessage = cleanText;
  addMessage(cleanText, 'user');
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
  addMessage('Hi, I am the Medi-Clave Assistant. Ask about autoclaves, sterilizers, service, repairs, consumables, or quotes.');
  updateWhatsAppHandover();
}

function initForms() {
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
renderFilters();
renderProducts();
initIcons();
