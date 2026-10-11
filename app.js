(() => {
  const page = document.body.dataset.page;
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });

  const products = [
    { id: 'socket', name: 'Matt black double socket', category: 'Wiring accessories', price: 18.50, description: 'A sample finish for a home renovation.', colour: '#edf0ec' },
    { id: 'downlight', name: 'Fire-rated LED downlight', category: 'Indoor lighting', price: 24.00, description: 'A clean recessed light for interiors.', colour: '#f3efe6' },
    { id: 'flood', name: 'Outdoor LED floodlight', category: 'Outdoor lighting', price: 42.00, description: 'A practical outdoor lighting option.', colour: '#ebf1f2' },
    { id: 'lamp', name: 'Warm white GU10 bulb · 6 pack', category: 'Bulbs', price: 19.50, description: 'Everyday replacement lamps in a multipack.', colour: '#f4f0e7' },
    { id: 'cable', name: 'Twin & earth cable · 100 m', category: 'Cable & containment', price: 89.00, description: 'A core material for electrical installations.', colour: '#eaf1ee' },
    { id: 'breaker', name: 'Type B MCB · 32 A', category: 'Safety & protection', price: 12.80, description: 'Circuit protection for qualified installers.', colour: '#edf0f4' },
    { id: 'alarm', name: 'Interlinked smoke alarm', category: 'Safety & protection', price: 38.00, description: 'A sample safety item for the range.', colour: '#f2f0e9' },
    { id: 'tester', name: 'Socket tester', category: 'Tools & testing', price: 21.00, description: 'Compact test equipment for electricians.', colour: '#ecf1ec' },
    { id: 'trunk', name: 'Mini trunking · 3 m', category: 'Cable & containment', price: 7.50, description: 'A neat route for surface cabling.', colour: '#edf1f3' },
    { id: 'flex', name: 'LED flex strip · 5 m', category: 'LED flex', price: 34.00, description: 'Flexible lighting for display or detail.', colour: '#f2ede4' },
    { id: 'heater', name: 'Compact electric panel heater', category: 'Heaters', price: 98.00, description: 'A slim sample heater for home spaces.', colour: '#f3eee8' },
    { id: 'switch', name: 'Brushed chrome plate switch', category: 'Wiring accessories', price: 14.00, description: 'An understated decorative wall plate.', colour: '#e9eef0' },
    { id: 'solar', name: 'Compact solar panel kit', category: 'Solar & energy', price: 679.00, description: 'An illustrative home energy product.', colour: '#eaf1ee' }
  ];
  const services = [
    { name: 'EICRs & electrical certificates', group: 'Testing & compliance', description: 'Electrical installation condition reports and certificate enquiries for domestic, commercial and industrial properties.' },
    { name: 'Inspection & testing', group: 'Testing & compliance', description: 'A route for electrical inspection, testing and follow-up work.' },
    { name: 'PAT testing', group: 'Testing & compliance', description: 'Portable appliance testing for organisations managing electrical equipment.' },
    { name: 'Landlord certificates', group: 'Testing & compliance', description: 'Electrical certificate enquiries for rented properties and landlords.' },
    { name: 'Fire alarm systems', group: 'Fire & safety', description: 'Installation, testing and maintenance enquiries for fire alarm systems.' },
    { name: 'Emergency lighting', group: 'Fire & safety', description: 'Supply, installation, servicing and testing enquiries.' },
    { name: 'CCTV systems', group: 'Fire & safety', description: 'CCTV installation enquiries tailored to the site.' },
    { name: 'Electrical installation & rewires', group: 'Electrical work', description: 'Domestic, commercial and industrial installations, including full or part rewires.' },
    { name: 'Planned maintenance & repairs', group: 'Electrical work', description: 'Planned upkeep and responsive repair enquiries.' },
    { name: 'EV charger installation', group: 'Energy & building', description: 'Home and business charger installation enquiries.' },
    { name: 'Solar installations', group: 'Energy & building', description: 'Solar panel installation enquiries for homes and business premises.' },
    { name: 'EPC certificates', group: 'Energy & building', description: 'Energy Performance Certificate enquiries.' },
    { name: 'Part F ventilation testing', group: 'Energy & building', description: 'Ventilation testing enquiries for relevant property work.' },
    { name: 'Mould & condensation surveys', group: 'Energy & building', description: 'An assessment route for property ventilation and condensation concerns.' },
    { name: 'Loft insulation', group: 'Energy & building', description: 'Loft insulation enquiries as part of home energy work.' },
    { name: 'Street lighting & access', group: 'Specialist', description: 'Lighting work, including projects needing access equipment.' },
    { name: 'Hazardous area electrical work', group: 'Specialist', description: 'Electrical installation, design and maintenance enquiries for specialist sites.' },
    { name: 'Asbestos surveys', group: 'Specialist', description: 'A route to discuss the asbestos survey service listed by RJA.' }
  ];
  const currency = value => `£${value.toFixed(2)}`;

  if (page === 'wholesale') {
    const search = document.getElementById('shop-search');
    const categories = document.getElementById('shop-categories');
    const grid = document.getElementById('products');
    let storage = null;
    try {
      storage = window.sessionStorage;
      storage.setItem('rja-demo-storage-check', '1');
      storage.removeItem('rja-demo-storage-check');
    } catch { storage = null; }
    let savedCart = [];
    try { savedCart = JSON.parse(storage?.getItem('rja-demo-cart') || '[]'); } catch { savedCart = []; }
    const cart = new Map(Array.isArray(savedCart) ? savedCart.filter(entry => Array.isArray(entry) && products.some(product => product.id === entry[0]) && Number.isInteger(entry[1]) && entry[1] > 0 && entry[1] <= 99) : []);
    let guestSession = storage?.getItem('rja-demo-guest') || null;
    let selected = 'All';
    let priorFocus = null;
    const overlay = document.getElementById('overlay');
    const drawer = document.getElementById('cart-drawer');
    const dialog = document.getElementById('cart-dialog');
    const accountDialog = document.getElementById('account-dialog');
    const allCategories = ['All', 'Indoor lighting', 'Outdoor lighting', 'Wiring accessories', 'Cable & containment', 'Safety & protection', 'Solar & energy', 'Bulbs', 'LED flex', 'Heaters', 'Tools & testing'];

    function startGuestSession() {
      if (guestSession) return;
      guestSession = typeof window.crypto?.randomUUID === 'function' ? window.crypto.randomUUID() : `guest-${Date.now()}`;
      try { storage?.setItem('rja-demo-guest', guestSession); } catch { /* In-memory guest cart still works. */ }
    }
    function persistCart() {
      try { storage?.setItem('rja-demo-cart', JSON.stringify([...cart])); } catch { /* In-memory cart still works. */ }
    }

    if (cart.size && !guestSession) startGuestSession();

    function renderCategories() {
      categories.innerHTML = allCategories.map(name => `<button type="button" class="chip" data-category="${name}" aria-pressed="${selected === name}">${name}</button>`).join('');
    }
    function renderProducts() {
      const term = search.value.trim().toLowerCase();
      const visible = products.filter(product => (selected === 'All' || product.category === selected) && (!term || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)));
      document.getElementById('shop-count').textContent = `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`;
      grid.innerHTML = visible.length ? visible.map(product => `<article class="product"><div class="product-art" style="--art-bg:${product.colour}"><img src="assets/shop-illustrations/${product.id}.svg" alt="" width="240" height="190" loading="lazy"></div><div class="product-info"><span class="product-category">${product.category}</span><h3>${product.name}</h3><div class="product-bottom"><div class="product-price">${currency(product.price)}</div><button class="add" type="button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button></div></div></article>`).join('') : '<div class="empty-state">No sample products match. Try another search or category.</div>';
    }
    function renderCart() {
      const lines = [...cart.entries()].map(([id, qty]) => ({ product: products.find(item => item.id === id), qty }));
      document.getElementById('cart-count').textContent = lines.reduce((sum, line) => sum + line.qty, 0);
      document.getElementById('cart-lines').innerHTML = lines.length ? lines.map(({ product, qty }) => `<div class="cart-line"><div><strong>${product.name}</strong><small>${currency(product.price)} sample price each</small></div><div class="cart-controls"><button type="button" data-item="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button><span>${qty}</span><button type="button" data-item="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button></div></div>`).join('') : '<p>Your cart is empty. Add a product to start a guest session.</p>';
      document.getElementById('cart-total').textContent = currency(lines.reduce((sum, line) => sum + line.product.price * line.qty, 0));
      document.getElementById('cart-next').disabled = !lines.length;
      document.getElementById('shop-session-status').textContent = guestSession ? 'Guest session active' : 'Guest cart';
      persistCart();
    }
    function openLayer(element) {
      priorFocus = document.activeElement;
      overlay.classList.add('open');
      element.classList.add('open');
      element.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      element.querySelector('[data-close]').focus();
    }
    function closeLayers() {
      overlay.classList.remove('open');
      for (const element of [drawer, dialog, accountDialog]) {
        element.classList.remove('open');
        element.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('no-scroll');
      priorFocus?.focus();
    }
    categories.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      selected = button.dataset.category;
      renderCategories();
      renderProducts();
    });
    search.addEventListener('input', renderProducts);
    grid.addEventListener('click', event => {
      const button = event.target.closest('[data-add]');
      if (!button) return;
      const id = button.dataset.add;
      startGuestSession();
      cart.set(id, Math.min((cart.get(id) || 0) + 1, 99));
      renderCart();
      button.textContent = '✓';
      setTimeout(() => { if (button.isConnected) button.textContent = '+'; }, 850);
    });
    document.getElementById('open-cart').addEventListener('click', () => openLayer(drawer));
    document.getElementById('open-account').addEventListener('click', () => openLayer(accountDialog));
    accountDialog.addEventListener('click', event => {
      const button = event.target.closest('[data-account-preview]');
      if (!button) return;
      document.getElementById('account-preview').textContent = button.dataset.accountPreview === 'create'
        ? 'A live store would securely create an account, verify the email address and save orders. No account is created in this demo.'
        : 'A live store would securely check account credentials and restore saved orders. No sign-in happens in this demo.';
    });
    document.getElementById('cart-lines').addEventListener('click', event => {
      const button = event.target.closest('[data-item]');
      if (!button) return;
      const id = button.dataset.item;
      const next = (cart.get(id) || 0) + Number(button.dataset.change);
      if (next > 0) startGuestSession();
      if (next > 0) cart.set(id, Math.min(next, 99)); else cart.delete(id);
      renderCart();
    });
    document.getElementById('cart-next').addEventListener('click', () => {
      if (!cart.size) return;
      closeLayers();
      document.getElementById('dialog-items').innerHTML = [...cart.entries()].map(([id, qty]) => `<li>${qty} × ${products.find(item => item.id === id).name}</li>`).join('');
      document.getElementById('cart-form').reset();
      document.getElementById('cart-form').hidden = false;
      document.getElementById('cart-success').hidden = true;
      openLayer(dialog);
    });
    document.getElementById('cart-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      const name = String(new FormData(form).get('name') || '').trim();
      form.hidden = true;
      const message = document.getElementById('cart-success');
      message.textContent = `Demo preview complete, ${name}. A real RJA shop could review the cart, check stock and reply with the correct specification and price. Your contact details were not sent or saved.`;
      message.hidden = false;
    });
    overlay.addEventListener('click', closeLayers);
    document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', closeLayers));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLayers(); });
    renderCategories(); renderProducts(); renderCart();
    const requestedPanel = new URLSearchParams(window.location.search);
    if (requestedPanel.has('cart')) openLayer(drawer);
    else if (requestedPanel.has('account')) openLayer(accountDialog);
  }

  if (page === 'services') {
    const groups = document.getElementById('sector-service-groups');
    const moreServices = document.getElementById('more-service-links');
    const selector = document.getElementById('service-select');
    const photos = document.getElementById('service-photos');
    const photoStatus = document.getElementById('photo-status');
    const photoPreview = document.getElementById('photo-preview');
    let previewUrls = [];
    const serviceGroups = [
      {
        title: 'Commercial',
        intro: 'Electrical systems, safety and maintenance for business premises and managed property.',
        names: ['EICRs & electrical certificates', 'PAT testing', 'Fire alarm systems', 'Emergency lighting', 'CCTV systems', 'Planned maintenance & repairs', 'EV charger installation', 'Solar installations']
      },
      {
        title: 'Industrial',
        intro: 'Installation, inspection and upkeep for demanding sites and specialist environments.',
        names: ['Inspection & testing', 'Electrical installation & rewires', 'Planned maintenance & repairs', 'Fire alarm systems', 'Emergency lighting', 'Hazardous area electrical work', 'Street lighting & access']
      },
      {
        title: 'Domestic',
        intro: 'Electrical and property work for homeowners, landlords and residential buildings.',
        names: ['EICRs & electrical certificates', 'Landlord certificates', 'Electrical installation & rewires', 'EV charger installation', 'Solar installations', 'EPC certificates', 'Mould & condensation surveys', 'Loft insulation']
      }
    ];
    const specialistNames = ['Part F ventilation testing', 'Asbestos surveys'];
    selector.innerHTML += services.map(service => `<option>${service.name}</option>`).join('') + '<option>Something else</option>';
    groups.innerHTML = serviceGroups.map(group => `<section class="sector-service" aria-label="${group.title} services"><div class="sector-service-head"><h3>${group.title}</h3><p>${group.intro}</p></div><ul>${group.names.map(name => `<li><button type="button" data-service="${name}">${name}<span aria-hidden="true">→</span></button></li>`).join('')}</ul></section>`).join('');
    moreServices.innerHTML = specialistNames.map(name => `<button type="button" data-service="${name}">${name}<span aria-hidden="true">→</span></button>`).join('');
    function selectService(event) {
      const button = event.target.closest('[data-service]');
      if (!button) return;
      selector.value = button.dataset.service;
      document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
      selector.focus({ preventScroll: true });
    }
    groups.addEventListener('click', selectService);
    moreServices.addEventListener('click', selectService);
    document.querySelectorAll('[data-detail-service]').forEach(link => {
      link.addEventListener('click', () => { selector.value = link.dataset.detailService; });
    });
    const callbackButton = document.getElementById('callback-preview-button');
    callbackButton?.addEventListener('click', () => {
      const name = document.getElementById('callback-name').value.trim();
      const phone = document.getElementById('callback-phone').value.trim();
      const area = document.getElementById('callback-area').value.trim();
      const time = document.getElementById('callback-time').value;
      const status = document.getElementById('callback-preview-status');
      if (!name || !phone || !area || !time) {
        status.textContent = 'Add a name, phone number, site area and preferred time window to preview this route.';
        return;
      }
      status.textContent = `Preview ready for ${name} in ${area}: a ${time.toLowerCase()} call-back request would go to RJA for review. Nothing was sent, saved or booked.`;
    });
    photos.addEventListener('change', () => {
      previewUrls.forEach(URL.revokeObjectURL);
      previewUrls = [];
      photoPreview.replaceChildren();
      const files = [...photos.files];
      if (!files.length) {
        photoStatus.classList.remove('is-error');
        photoStatus.textContent = 'Optional · up to 4 images, 10 MB each. Photos stay on your device in this demo.';
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];
      if (files.length > 4 || files.some(file => !validTypes.includes(file.type) || file.size > 10 * 1024 * 1024)) {
        photos.value = '';
        photoStatus.textContent = 'Choose up to 4 JPG, PNG, WebP, AVIF or HEIC images, each under 10 MB.';
        photoStatus.classList.add('is-error');
        return;
      }
      photoStatus.classList.remove('is-error');
      photoStatus.textContent = `${files.length} ${files.length === 1 ? 'photo' : 'photos'} selected for this enquiry preview. Nothing has been uploaded.`;
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        previewUrls.push(url);
        const item = document.createElement('div');
        item.className = 'photo-preview-item';
        const image = document.createElement('img');
        image.src = url;
        image.alt = `Selected photo: ${file.name}`;
        image.addEventListener('error', () => {
          image.remove();
          item.classList.add('preview-unavailable');
        });
        const name = document.createElement('span');
        name.textContent = file.name;
        item.append(image, name);
        photoPreview.append(item);
      });
    });
    window.addEventListener('pagehide', () => previewUrls.forEach(URL.revokeObjectURL));
    document.getElementById('service-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const service = String(data.get('service') || '').trim();
      const photoCount = photos.files.length;
      const success = document.getElementById('service-success');
      success.textContent = `Demo preview complete, ${name}. A request about ${service}${photoCount ? ` with ${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}` : ''} would be reviewed by RJA before any quotation or visit was agreed. Nothing was sent, uploaded or saved.`;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();
