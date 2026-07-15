const DATA_VERSION = 2; // <-- Ubah angka ini (misal jadi 3) setelah ganti gambar

const DEFAULT_PRODUCTS = [
    {id:1, name:'Classic White Tee', category:'Casual', price:299000, promo:0, sizes:{S:8,M:12,L:10,XL:5}, image:'image/Clasicwhite.png'},
    {id:2, name:'Black Essential', category:'Basic', price:249000, promo:0, sizes:{S:10,M:15,L:8,XL:4}, image:'image/Black.png'},
    {id:3, name:'Navy Blue Stripe', category:'Casual', price:349000, promo:0, sizes:{S:6,M:10,L:8,XL:3}, image:'image/navyblue.png'},
    {id:4, name:'Forest Green', category:'Basic', price:279000, promo:0, sizes:{S:8,M:12,L:6,XL:4}, image:'image/green.png'},
    {id:5, name:'Vintage Graphic', category:'Graphic', price:399000, promo:0, sizes:{S:4,M:6,L:4,XL:2}, image:'image/vintage graphic.png'},
    {id:6, name:'Sport Performance', category:'Sport', price:449000, promo:0, sizes:{S:6,M:8,L:6,XL:3}, image:'image/sports.png'},
    {id:7, name:'Premium Cotton', category:'Premium', price:499000, promo:0, sizes:{S:4,M:5,L:4,XL:2}, image:'image/premium.png'},
    {id:8, name:'Limited Edition', category:'Limited', price:599000, promo:0, sizes:{S:2,M:3,L:2,XL:1}, image:'image/limited.png'},
    {id:9, name:'Sunset Orange', category:'Casual', price:329000, promo:0, sizes:{S:6,M:10,L:6,XL:4}, image:'image/sunset.png'},
    {id:10, name:'Grey Classic', category:'Basic', price:229000, promo:0, sizes:{S:10,M:14,L:10,XL:6}, image:'image/Grey.png'},
    {id:11, name:'Tie Dye Wave', category:'Graphic', price:429000, promo:0, sizes:{S:3,M:5,L:3,XL:2}, image:'image/tie.png'},
    {id:12, name:'Athletic Blue', category:'Sport', price:379000, promo:0, sizes:{S:5,M:8,L:5,XL:3}, image:'image/blue.png'}
];

let products = [], cart = [], orders = [], currentLang = 'id';
let modalProductId = null, modalQty = 1, modalSize = null, adminLoggedIn = false;
let catFilter = { search: '', category: '', sort: 'default' };
let cardSelectedSize = {};

const T = {
    id: {
        'nav.home':'Beranda','nav.catalog':'Katalog','nav.about':'Tentang','nav.orders':'Pesanan',
        'hero.title':'Kaos Premium <span>untuk Sehari-hari</span>','hero.sub':'Dibuat menggunakan 100% katun organik premium untuk memberikan kenyamanan dan gaya yang tahan lama..','hero.cta':'Belanja →',
        'promo.text':'Dapatkan diskon 15%!','home.featured':'⭐ Unggulan','home.viewAll':'Lihat Semua →','home.categories':'📂 Kategori',
        'catalog.title':'Semua Produk','catalog.search':'Cari...','catalog.sortDefault':'Urut','catalog.priceLow':'Harga ↑','catalog.priceHigh':'Harga ↓',
        'cart.title':'🛒 Keranjang','cart.checkout':'Checkout',
        'checkout.title':'📋 Checkout','checkout.name':'Nama Lengkap','checkout.email':'Email','checkout.phone':'Telepon','checkout.address':'Alamat','checkout.payment':'Metode Bayar','checkout.placeOrder':'✅ Pesan',
        'orders.title':'📦 Status','orders.empty':'Belum ada pesanan.','footer.tag':'Kaos premium.'
    },
    en: {
        'nav.home':'Home','nav.catalog':'Catalog','nav.about':'About','nav.orders':'Orders',
        'hero.title':'Premium <span>T-Shirts</span> for Everyday','hero.sub':'Quality fabrics, timeless designs.','hero.cta':'Shop →',
        'promo.text':'Get 15% off!','home.featured':'⭐ Featured','home.viewAll':'View All →','home.categories':'📂 Categories',
        'catalog.title':'All Products','catalog.search':'Search...','catalog.sortDefault':'Sort','catalog.priceLow':'Price ↑','catalog.priceHigh':'Price ↓',
        'cart.title':'🛒 Cart','cart.checkout':'Checkout',
        'checkout.title':'📋 Checkout','checkout.name':'Full Name','checkout.email':'Email','checkout.phone':'Phone','checkout.address':'Address','checkout.payment':'Payment','checkout.placeOrder':'✅ Order',
        'orders.title':'📦 Orders','orders.empty':'No orders yet.','footer.tag':'Premium tees.'
    }
};

function getP(id) { return products.find(p => p.id === id); }
function fmt(v) { return 'Rp ' + Number(v).toLocaleString('id-ID'); }

function ensureSizes(p) {
    if (!p.sizes || typeof p.sizes !== 'object' || Object.keys(p.sizes).length === 0) {
        p.sizes = { M: 10 };
    }
    return p;
}

function getTotalStock(p) {
    let s = 0;
    for (let k in p.sizes) s += p.sizes[k];
    return s;
}
function getSizeStock(p, size) { return p.sizes[size] || 0; }

function save() {
    localStorage.setItem('always_products', JSON.stringify(products));
    localStorage.setItem('always_cart', JSON.stringify(cart));
    localStorage.setItem('always_orders', JSON.stringify(orders));
    localStorage.setItem('always_data_version', DATA_VERSION);
}

function triggerCartPulse() {
    const el = document.getElementById('cartPulse');
    if (!el) return;
    el.classList.remove('active');
    void el.offsetWidth;
    el.classList.add('active');
}

function loadData() {
    const savedVersion = localStorage.getItem('always_data_version');
    if (savedVersion != DATA_VERSION) {
        console.log('🔄 Versi data berbeda, reset ke default...');
        products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
        save();
        toast('Data produk diperbarui!', 'success');
    } else {
        let savedProducts = localStorage.getItem('always_products');
        if (savedProducts) {
            try {
                products = JSON.parse(savedProducts);
                products.forEach(p => ensureSizes(p));
            } catch(e) {
                products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
                save();
            }
        } else {
            products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
            save();
        }
    }
    //size produk
    products.forEach(p => ensureSizes(p));
    
    cart = JSON.parse(localStorage.getItem('always_cart') || '[]');
    orders = JSON.parse(localStorage.getItem('always_orders') || '[]');
    currentLang = localStorage.getItem('always_lang') || 'id';
}

function renderAll() {
    renderFeatured();
    renderCatalog();
    renderCart();
    renderOrders();
    renderAdminProducts();
    renderAdminOrders();
    renderAdminStats();
    populateCategories();
    populateCategoryFilter();
    updateBadges();
}

function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const featured = products.slice(0, 4);
    grid.innerHTML = featured.map(p => cardHTML(p)).join('');
}

function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    let list = products.filter(p => {
        if (catFilter.search && !p.name.toLowerCase().includes(catFilter.search.toLowerCase()) && !p.category.toLowerCase().includes(catFilter.search.toLowerCase())) return false;
        if (catFilter.category && p.category !== catFilter.category) return false;
        return true;
    });
    if (catFilter.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (catFilter.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    grid.innerHTML = list.length ? list.map(p => cardHTML(p)).join('') : '<div class="cart-empty" style="grid-column:1/-1;"><p>No products.</p></div>';
}

function cardHTML(p) {
    ensureSizes(p);
    const out = getTotalStock(p) <= 0;
    const sizes = Object.keys(p.sizes).filter(s => p.sizes[s] > 0);
    const price = p.promo && p.promo > 0 ? 
        `<span class="price">${fmt(p.promo)} <span class="original">${fmt(p.price)}</span></span>` : 
        `<span class="price">${fmt(p.price)}</span>`;
    const sizeBtns = sizes.map(s => 
        `<button class="size-opt" data-size="${s}" onclick="event.stopPropagation();selectCardSize(${p.id},'${s}')">${s}</button>`
    ).join('');
    return `<div class="product-card" onclick="openModal(${p.id})">
        <div class="img-wrap">
            <img src="${p.image}" onerror="this.src='image/limited.png'" loading="lazy" />
            ${p.promo && p.promo > 0 ? '<span class="badge badge-sale">Sale</span>' : ''}
        </div>
        <div class="info">
            <div class="name">${p.name}</div>
            ${price}
            <div class="category">${p.category}</div>
            <div class="size-selector" id="cardSizes_${p.id}">${sizeBtns}</div>
            <span class="stock${out ? ' out' : ''}">${out ? 'Out of Stock' : getTotalStock(p) + ' left'}</span>
            <button class="add-btn" onclick="event.stopPropagation();addFromCard(${p.id})" ${out ? 'disabled' : ''}>
                ${out ? 'Out of Stock' : '🛒 Add'}
            </button>
        </div>
    </div>`;
}

function selectCardSize(id, size) {
    cardSelectedSize[id] = size;
    document.querySelectorAll(`#cardSizes_${id} .size-opt`).forEach(b => b.classList.toggle('active', b.dataset.size === size));
}

function addFromCard(id) {
    const p = getP(id);
    if (!p || getTotalStock(p) <= 0) return toast('Out of stock', 'error');
    let size = cardSelectedSize[id] || Object.keys(p.sizes).find(s => p.sizes[s] > 0);
    if (!size) return toast('No size available', 'error');
    if (getSizeStock(p, size) <= 0) return toast('Size ' + size + ' out of stock', 'error');
    addToCartWithSize(id, size, 1);
}

//kategori produk
function populateCategories() {
    const cats = [...new Set(products.map(p => p.category))];
    const html = cats.map(c => `<button onclick="filterCategory('${c}')">${c}</button>`).join('') + 
                 `<button onclick="filterCategory('')" style="background:var(--bg);">All</button>`;
    document.getElementById('homeCategories').innerHTML = html;
    document.getElementById('catalogPills').innerHTML = html;
}

function filterCategory(c) {
    catFilter.category = c;
    renderCatalog();
    document.querySelectorAll('#catalogPills button').forEach(b => b.classList.toggle('active', b.textContent === c || (c === '' && b.textContent === 'All')));
    showPage('catalog');
}

function populateCategoryFilter() {
    const sel = document.getElementById('categoryFilter');
    if (!sel) return;
    const cats = [...new Set(products.map(p => p.category))];
    sel.innerHTML = '<option value="">All Categories</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

//keranjang
function addToCartWithSize(id, size, qty) {
    const p = getP(id);
    if (!p) return;
    if (getSizeStock(p, size) <= 0) return toast('Size ' + size + ' out of stock', 'error');
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) {
        if (item.qty + qty > getSizeStock(p, size)) return toast('Not enough stock for ' + size, 'error');
        item.qty += qty;
    } else {
        cart.push({ id, size, qty });
    }
    save();
    renderAll();
    triggerCartPulse();
    toast('Added ' + p.name + ' (' + size + ')!', 'success');
}

function removeFromCart(id, size) {
    cart = cart.filter(i => !(i.id === id && i.size === size));
    save();
    renderAll();
}

function updateCartQty(id, size, d) {
    const item = cart.find(i => i.id === id && i.size === size);
    if (!item) return;
    const p = getP(id);
    const n = item.qty + d;
    if (n <= 0) return removeFromCart(id, size);
    if (p && n > getSizeStock(p, size)) return toast('Not enough stock for ' + size, 'error');
    item.qty = n;
    save();
    renderAll();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = '<div class="cart-empty"><div class="icon">🛒</div><p>Cart is empty.</p></div>';
        summary.innerHTML = '';
        return;
    }
    let html = '', sub = 0;
    cart.forEach(item => {
        const p = getP(item.id);
        if (!p) return;
        const price = p.promo && p.promo > 0 ? p.promo : p.price;
        sub += price * item.qty;
        html += `<div class="cart-item">
            <div class="img"><img src="${p.image}" onerror="this.src='image'" /></div>
            <div class="details">
                <div class="name">${p.name}</div>
                <span class="size">${item.size}</span>
                <div class="price">${fmt(price)}</div>
            </div>
            <div class="qty-control">
                <button onclick="updateCartQty(${p.id},'${item.size}',-1)">−</button>
                <span>${item.qty}</span>
                <button onclick="updateCartQty(${p.id},'${item.size}',1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${p.id},'${item.size}')">✕</button>
        </div>`;
    });
    container.innerHTML = html;
    const ship = sub > 0 ? 20000 : 0;
    summary.innerHTML = `<div class="cart-summary">
        <div class="row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
        <div class="row"><span>Shipping</span><span>${fmt(ship)}</span></div>
        <div class="row total"><span>Total</span><span>${fmt(sub + ship)}</span></div>
    </div>`;
}

function updateBadges() {
    const c = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').textContent = c;
    document.getElementById('bottomCartCount').textContent = c;
}

//detail produk
function openModal(id) {
    const p = getP(id);
    if (!p) return;
    modalProductId = p.id;
    modalQty = 1;
    ensureSizes(p);
    const sizes = Object.keys(p.sizes).filter(s => p.sizes[s] > 0);
    modalSize = sizes.length ? sizes[0] : null;
    document.getElementById('modalImg').src = p.image;
    document.getElementById('modalName').textContent = p.name;
    const price = p.promo && p.promo > 0 ? p.promo : p.price;
    document.getElementById('modalPrice').innerHTML = fmt(price) + (p.promo && p.promo > 0 ? ` <span style="text-decoration:line-through;font-size:16px;color:var(--text-light);">${fmt(p.price)}</span>` : '');
    document.getElementById('modalDesc').textContent = p.description || 'Premium tee.';
    document.getElementById('modalStock').textContent = getTotalStock(p) <= 0 ? '❌ Out of Stock' : `✅ ${getTotalStock(p)} total stock`;
    document.getElementById('modalStock').style.color = getTotalStock(p) <= 0 ? '#dc2626' : '#059669';
    const sizeContainer = document.getElementById('modalSizeButtons');
    sizeContainer.innerHTML = sizes.map(s => 
        `<button data-size="${s}" onclick="selectModalSize('${s}')" ${getSizeStock(p,s) <= 0 ? 'disabled' : ''}>${s} (${getSizeStock(p,s)})</button>`
    ).join('');
    if (modalSize) document.querySelectorAll('#modalSizeButtons button').forEach(b => b.classList.toggle('active', b.dataset.size === modalSize));
    document.getElementById('modalQty').textContent = 1;
    document.getElementById('modalAddBtn').disabled = getTotalStock(p) <= 0;
    document.getElementById('modalAddBtn').textContent = getTotalStock(p) <= 0 ? 'Out of Stock' : '🛒 Add';
    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function selectModalSize(size) {
    modalSize = size;
    document.querySelectorAll('#modalSizeButtons button').forEach(b => b.classList.toggle('active', b.dataset.size === size));
}

function closeModal() {
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
}

function changeModalQty(d) {
    const p = getP(modalProductId);
    if (!p) return;
    const n = modalQty + d;
    if (n < 1) return;
    if (modalSize && n > getSizeStock(p, modalSize)) return toast('Not enough stock for ' + modalSize, 'error');
    modalQty = n;
    document.getElementById('modalQty').textContent = n;
}

function addFromModal() {
    if (!modalProductId || !modalSize) return toast('Select a size', 'error');
    const p = getP(modalProductId);
    if (!p) return;
    if (getSizeStock(p, modalSize) <= 0) return toast('Size ' + modalSize + ' out of stock', 'error');
    const item = cart.find(i => i.id === modalProductId && i.size === modalSize);
    const cur = item ? item.qty : 0;
    if (cur + modalQty > getSizeStock(p, modalSize)) return toast('Not enough stock for ' + modalSize, 'error');
    if (item) item.qty += modalQty;
    else cart.push({ id: modalProductId, size: modalSize, qty: modalQty });
    save();
    renderAll();
    closeModal();
    triggerCartPulse();
    toast(`Added ${modalQty} ${p.name} (${modalSize})`, 'success');
}

document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

//chekout
function goToCheckout() {
    if (!cart.length) { toast('Cart is empty!', 'error'); return; }
    updateCheckoutSummary();
    showPage('checkout');
}

function updateCheckoutSummary() {
    let sub = 0;
    cart.forEach(i => {
        const p = getP(i.id);
        if (p) sub += (p.promo && p.promo > 0 ? p.promo : p.price) * i.qty;
    });
    const ship = sub > 0 ? 20000 : 0;
    document.getElementById('checkoutSummary').innerHTML = `
        <div class="row"><span>Items (${cart.reduce((s,i) => s + i.qty, 0)})</span><span>${fmt(sub)}</span></div>
        <div class="row"><span>Shipping</span><span>${fmt(ship)}</span></div>
        <div class="row total"><span>Total</span><span>${fmt(sub + ship)}</span></div>
    `;
}

function placeOrder() {
    if (!cart.length) { toast('Cart is empty!', 'error'); return; }
    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    if (!name || !email || !phone || !address) return toast('Fill all fields', 'error');
    const pmt = document.querySelector('input[name="payment"]:checked');
    if (!pmt) return toast('Select payment', 'error');
    let sub = 0;
    const items = cart.map(i => {
        const p = getP(i.id);
        if (!p) return null;
        const price = p.promo && p.promo > 0 ? p.promo : p.price;
        sub += price * i.qty;
        return { ...p, qty: i.qty, size: i.size, unitPrice: price };
    }).filter(Boolean);
    const ship = sub > 0 ? 20000 : 0;
    const total = sub + ship;
    const orderId = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
    orders.unshift({
        id: orderId,
        customer: { name, email, phone, address },
        items,
        subtotal: sub,
        shipping: ship,
        total,
        payment: pmt.value,
        status: 'Pending',
        createdAt: new Date().toISOString()
    });
    save();
    cart = [];
    save();
    renderAll();
    document.getElementById('checkoutName').value = '';
    document.getElementById('checkoutEmail').value = '';
    document.getElementById('checkoutPhone').value = '';
    document.getElementById('checkoutAddress').value = '';
    
    showOrderSuccess(orderId, name, total);
}

function showOrderSuccess(orderId, customerName, total) {
    const info = document.getElementById('orderSuccessInfo');
    info.innerHTML = `
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Nama:</strong> ${customerName}</p>
        <p><strong>Total:</strong> ${fmt(total)}</p>
        <p style="margin-top:6px;color:#059669;">✅ Pesanan telah disimpan. Silakan konfirmasi via WhatsApp.</p>
    `;
    const waLink = `https://wa.me/6283821284553?text=Halo%20Always%20T-Shirt%2C%20saya%20ingin%20konfirmasi%20pesanan%20dengan%20ID%3A%20${orderId}%0ANama%3A%20${encodeURIComponent(customerName)}%0ATotal%3A%20${encodeURIComponent(fmt(total))}`;
    document.getElementById('waOrderBtn').href = waLink;
    document.getElementById('orderSuccessModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeOrderSuccess() {
    document.getElementById('orderSuccessModal').classList.remove('open');
    document.body.style.overflow = '';
    showPage('orders');
    renderOrders();
}

//order via wa
function renderOrders() {
    const el = document.getElementById('ordersList');
    if (!el) return;
    if (!orders.length) {
        el.innerHTML = '<div class="cart-empty"><div class="icon">📭</div><p>No orders.</p></div>';
        return;
    }
    el.innerHTML = orders.map(o => {
        const waLink = `https://wa.me/6283821284553?text=Halo%20Always%20T-Shirt%2C%20saya%20ingin%20konfirmasi%20pesanan%20ID%3A%20${o.id}%0ANama%3A%20${encodeURIComponent(o.customer.name)}%0ATotal%3A%20${encodeURIComponent(fmt(o.total))}`;
        return `<div class="order-card">
            <div class="order-header">
                <span class="order-id">${o.id}</span>
                <span class="status">${o.status}</span>
            </div>
            <div class="order-items">
                ${o.items.map(it => `<div class="item"><span>${it.name} (${it.size}) × ${it.qty}</span><span>${fmt(it.unitPrice * it.qty)}</span></div>`).join('')}
                <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;display:flex;justify-content:space-between;">
                    <span>Shipping</span><span>${fmt(o.shipping)}</span>
                </div>
            </div>
            <div class="order-total">Total: ${fmt(o.total)}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-top:8px;gap:8px;">
                <span style="font-size:12px;color:var(--text-light);">${o.payment} · ${new Date(o.createdAt).toLocaleDateString('id-ID')}</span>
                <a href="${waLink}" target="_blank" class="btn btn-success btn-sm">💬 Konfirmasi</a>
            </div>
        </div>`;
    }).join('');
}

//Admin
function adminLogin() {
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value.trim();
    if (u === 'admin' && p === 'admin123') {
        adminLoggedIn = true;
        document.getElementById('adminLoginError').textContent = '';
        showPage('admin-dashboard');
        renderAll();
        toast('Welcome Admin', 'success');
    } else {
        document.getElementById('adminLoginError').textContent = 'Invalid credentials.';
    }
}

function adminLogout() {
    adminLoggedIn = false;
    showPage('home');
}

function adminTab(tab) {
    document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.getElementById('admin-dashboard').classList.toggle('hidden', tab !== 'dashboard');
    document.getElementById('admin-products').classList.toggle('hidden', tab !== 'products');
    document.getElementById('admin-orders').classList.toggle('hidden', tab !== 'orders');
    if (tab === 'products') renderAdminProducts();
    if (tab === 'orders') renderAdminOrders();
    if (tab === 'dashboard') renderAdminStats();
}

function renderAdminStats() {
    const el = document.getElementById('adminStats');
    if (!el) return;
    el.innerHTML = `
        <div class="stat"><div class="num">${products.length}</div><div class="label">Products</div></div>
        <div class="stat"><div class="num">${orders.length}</div><div class="label">Orders</div></div>
        <div class="stat"><div class="num">${fmt(orders.reduce((s,o) => s + o.total, 0))}</div><div class="label">Revenue</div></div>
        <div class="stat"><div class="num">${cart.reduce((s,i) => s + i.qty, 0)}</div><div class="label">Cart</div></div>
    `;
}

function renderAdminProducts() {
    const tbody = document.getElementById('adminProductTable');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.src='https://picsum.photos/seed/fallback/100/100'" /></td>
            <td><strong>${p.name}</strong></td>
            <td>${fmt(p.price)}${p.promo && p.promo > 0 ? ` <span style="color:#dc2626;font-size:12px;">→${fmt(p.promo)}</span>` : ''}</td>
            <td>${getTotalStock(p)}</td>
            <td>${Object.keys(p.sizes).filter(s => p.sizes[s] > 0).join(', ')}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm" onclick="editProduct(${p.id})">✎</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">✕</button>
            </td>
        </tr>
    `).join('');
}

function renderAdminOrders() {
    const tbody = document.getElementById('adminOrderTable');
    if (!tbody) return;
    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-light);">No orders.</td></tr>';
        return;
    }
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.customer.name}</td>
            <td>${fmt(o.total)}</td>
            <td><span class="badge badge-new">${o.status}</span></td>
            <td>
                <select onchange="updateOrderStatus('${o.id}',this.value)" style="padding:4px 8px;border-radius:6px;border:1.5px solid var(--border);font-size:12px;">
                    <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(id, status) {
    const o = orders.find(o => o.id === id);
    if (o) {
        o.status = status;
        save();
        renderAll();
        renderAdminOrders();
        toast('Status updated', 'success');
    }
}

function toggleProductForm() {
    document.getElementById('productForm').classList.toggle('hidden');
}

function editProduct(id) {
    const p = getP(id);
    if (!p) return;
    const f = document.getElementById('productForm');
    f.classList.remove('hidden');
    document.getElementById('pfEditId').value = id;
    document.getElementById('pfName').value = p.name;
    document.getElementById('pfPrice').value = p.price;
    document.getElementById('pfCategory').value = p.category;
    document.getElementById('pfStock').value = getTotalStock(p);
    document.getElementById('pfImage').value = p.image;
    document.getElementById('pfPromo').value = p.promo || 0;
    document.getElementById('pfSizes').value = Object.keys(p.sizes).filter(s => p.sizes[s] > 0).join(',');
}

function saveProduct() {
    const id = document.getElementById('pfEditId').value;
    const name = document.getElementById('pfName').value.trim();
    const price = parseInt(document.getElementById('pfPrice').value) || 0;
    const category = document.getElementById('pfCategory').value.trim() || 'Uncategorized';
    const stock = parseInt(document.getElementById('pfStock').value) || 0;
    const image = document.getElementById('pfImage').value.trim() || 'image';
    const promo = parseInt(document.getElementById('pfPromo').value) || 0;
    const sizesInput = document.getElementById('pfSizes').value.trim();
    if (!name || price <= 0) return toast('Invalid name/price', 'error');
    const sizeList = sizesInput ? sizesInput.split(',').map(s => s.trim().toUpperCase()).filter(s => s) : ['M'];
    const sizes = {};
    const perSize = Math.max(1, Math.floor(stock / sizeList.length) || 1);
    sizeList.forEach(s => { sizes[s] = perSize; });
    if (id) {
        const e = getP(parseInt(id));
        if (e) {
            e.name = name;
            e.price = price;
            e.category = category;
            e.sizes = sizes;
            e.image = image;
            e.promo = promo;
            save();
            toast('Produk berhasil diupdate ✅', 'success');
        }
    } else {
        products.push({
            id: Math.max(...products.map(p => p.id), 0) + 1,
            name,
            price,
            category,
            sizes,
            image,
            promo
        });
        save();
        toast('Produk berhasil ditambahkan ✅', 'success');
    }
    document.getElementById('productForm').classList.add('hidden');
    renderAll();
    populateCategories();
    populateCategoryFilter();
}

function deleteProduct(id) {
    if (!confirm('Hapus produk ini?')) return;
    products = products.filter(p => p.id !== id);
    save();
    renderAll();
    populateCategories();
    populateCategoryFilter();
    toast('Produk dihapus.', '');
}

function resetProducts() {
    if (!confirm('Reset semua produk ke default? Data yang ada akan hilang!')) return;
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    save();
    renderAll();
    populateCategories();
    populateCategoryFilter();
    toast('✅ Produk direset ke default!', 'success');
}

function showPage(page) {
    if (page === 'admin-dashboard' && !adminLoggedIn) return showPage('admin-login');
    if (page === 'admin-login' && adminLoggedIn) return showPage('admin-dashboard');
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === page));
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.textContent.trim().toLowerCase() === page));
    if (page === 'cart') renderCart();
    if (page === 'orders') renderOrders();
    if (page === 'checkout') updateCheckoutSummary();
    if (page === 'admin-dashboard') { renderAdminStats(); renderAdminProducts(); renderAdminOrders(); }
    if (page === 'catalog') renderCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleLang() {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    localStorage.setItem('always_lang', currentLang);
    document.getElementById('langToggle').textContent = currentLang === 'id' ? 'EN' : 'ID';
    applyLang();
}

function applyLang() {
    const t = T[currentLang] || T.id;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) {
            if (el.tagName === 'INPUT' && el.placeholder) el.placeholder = t[key];
            else el.innerHTML = t[key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (T[currentLang] && T[currentLang][key]) el.placeholder = T[currentLang][key];
    });
    const hero = document.querySelector('.hero h1');
    if (hero) {
        const key = 'hero.title';
        if (T[currentLang] && T[currentLang][key]) hero.innerHTML = T[currentLang][key];
    }
    document.getElementById('langToggle').textContent = currentLang === 'id' ? 'EN' : 'ID';
}

function toast(msg, type = '') {
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => el.remove(), 300);
    }, 2500);
}

document.addEventListener('DOMContentLoaded', function() {
    loadData(); // otomatis cek versi
    renderAll();
    applyLang();

    // Events
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    document.getElementById('adminPass').addEventListener('keydown', e => { if (e.key === 'Enter') adminLogin(); });
    document.getElementById('adminUser').addEventListener('keydown', e => { if (e.key === 'Enter') adminLogin(); });
    document.getElementById('searchInput').addEventListener('input', function() {
        catFilter.search = this.value;
        renderCatalog();
    });
    document.getElementById('categoryFilter').addEventListener('change', function() {
        catFilter.category = this.value;
        renderCatalog();
    });
    document.getElementById('sortFilter').addEventListener('change', function() {
        catFilter.sort = this.value;
        renderCatalog();
    });
    document.querySelectorAll('input[name="payment"]').forEach(el => el.addEventListener('change', function() {
        const map = {
            'Bank Transfer': '💳 BCA 1234-5678-9012',
            'PayPal': '💳 payment@always-tshirt.com',
            'DANA': '📱 0812-3456-7890',
            'OVO': '🟣 0812-3456-7890',
            'GoPay': '🟢 0812-3456-7890'
        };
        document.getElementById('paymentAccountInfo').innerHTML = map[this.value] || map['Bank Transfer'];
    }));
});

