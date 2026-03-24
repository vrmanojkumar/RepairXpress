/* ===== REPAIRXPRESS APP.JS ===== */

// =====================
// THEME MANAGEMENT
// =====================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  showToast(isDark ? '☀️ Light mode enabled' : '🌙 Dark mode enabled', 'info');
}

// =====================
// TOAST NOTIFICATIONS
// =====================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success:'✅', error:'❌', info:'💡', warning:'⚠️' };
  toast.innerHTML = `<span>${icons[type] || '💡'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// =====================
// SCREEN NAVIGATION (SPA)
// =====================
function navigate(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
  // Update navbar active
  document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
  const navMap = { 'screen-home': 0, 'screen-shops': 1, 'screen-tracking': 2 };
  const links = document.querySelectorAll('.navbar-link');
  const navIdx = navMap[screenId];
  if (navIdx !== undefined && links[navIdx]) links[navIdx].classList.add('active');
  // Show/hide navbar
  const navbar = document.getElementById('mainNavbar');
  if (navbar) navbar.style.display = screenId === 'screen-splash' ? 'none' : 'flex';
}

// =====================
// SPLASH SCREEN
// =====================
function initSplash() {
  // Create particles
  const container = document.getElementById('splashParticles');
  if (container) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'splash-particle';
      p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${2+Math.random()*3}s;--delay:${Math.random()*2}s;`;
      container.appendChild(p);
    }
  }
  // Animate loader bar
  const bar = document.querySelector('.splash-loader-bar');
  if (!bar) return;
  let w = 0;
  const interval = setInterval(() => {
    w += Math.random() * 8 + 2;
    if (w >= 100) { w = 100; clearInterval(interval); }
    bar.style.width = w + '%';
  }, 80);
  // Navigate to home after 3s
  setTimeout(() => {
    navigate('screen-home');
  }, 3100);
}

// =====================
// SERVICE SELECTION
// =====================
function selectIssue(name, price, el) {
  document.querySelectorAll('.service-issue-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const summary = document.getElementById('priceSummary');
  const nameEl = document.getElementById('selectedServiceName');
  const priceEl = document.getElementById('selectedServicePrice');
  if (summary && nameEl && priceEl) {
    summary.style.display = 'flex';
    nameEl.textContent = name;
    priceEl.textContent = '₹' + price;
  }
}

function selectChip(el, device) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast(`Showing ${device} repair services`, 'info');
}

function selectDevice(device, el) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  setTimeout(() => navigate('screen-services'), 300);
}

// =====================
// BOOKING
// =====================
function confirmBooking() {
  showToast('⏳ Processing booking...', 'info');
  setTimeout(() => {
    showToast('✅ Booking confirmed! Redirecting to payment...', 'success');
    setTimeout(() => navigate('screen-payment'), 1200);
  }, 1000);
}

// Date/time picker interaction
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('date-chip')) {
    document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
  }
  if (e.target.classList.contains('time-slot')) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// =====================
// PAYMENT
// =====================
function selectPayment(el) {
  document.querySelectorAll('.payment-option').forEach(o => {
    o.classList.remove('active');
    const check = o.querySelector('.payment-check');
    if (check) check.style.display = 'none';
  });
  el.classList.add('active');
  const check = el.querySelector('.payment-check');
  if (check) check.style.display = 'block';
  // Show UPI input only for UPI
  const upiRow = document.querySelector('.upi-input-row');
  if (upiRow) upiRow.style.display = el.querySelector('.font-semibold')?.textContent === 'UPI' ? 'flex' : 'none';
}

function processPayment() {
  const btn = event.currentTarget;
  btn.textContent = '⏳ Processing...';
  btn.disabled = true;
  setTimeout(() => {
    showToast('✅ Payment successful! ₹588 paid.', 'success');
    setTimeout(() => navigate('screen-tracking'), 500);
    btn.textContent = '🔒 Pay ₹588 Securely';
    btn.disabled = false;
  }, 2000);
}

// =====================
// REVIEW SCREEN
// =====================
let currentRating = 4;
function setRating(val) {
  currentRating = val;
  const stars = document.querySelectorAll('#ratingStars .star');
  const texts = ['😞 Terrible', '😕 Bad', '😐 Okay', '😊 Great!', '🤩 Excellent!'];
  stars.forEach((s, i) => {
    s.classList.toggle('filled', i < val);
    s.classList.toggle('empty', i >= val);
    s.textContent = i < val ? '★' : '☆';
  });
  const ratingText = document.getElementById('ratingText');
  if (ratingText) ratingText.textContent = `${val} stars – ${texts[val-1]}`;
}

function submitReview() {
  showToast('🙏 Thank you for your feedback!', 'success');
  setTimeout(() => {
    const form = document.getElementById('review-form-section');
    const thanks = document.getElementById('review-thanks-section');
    if (form) form.style.display = 'none';
    if (thanks) thanks.style.display = 'block';
  }, 800);
}

function toggleChip(el) { el.classList.toggle('active'); }

// =====================
// FILTER TOGGLE
// =====================
function toggleFilter(el) {
  el.classList.toggle('active');
  showToast('🔍 Filters updated', 'info');
}

// =====================
// SHOP DASHBOARD TABS
// =====================
function shopTab(name, btn) {
  // Hide all tabs
  ['overview','orders','services','earnings'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.style.display = 'none';
  });
  // Show selected
  const tab = document.getElementById('tab-' + name);
  if (tab) { tab.style.display = 'block'; tab.style.animation = 'fadeIn 0.3s ease'; }
  // Update sidebar
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function toggleShopStatus(btn) {
  const isOpen = btn.textContent === 'Close';
  btn.textContent = isOpen ? 'Open' : 'Close';
  const statusText = btn.previousElementSibling;
  if (statusText) {
    statusText.textContent = isOpen ? 'Shop Closed' : 'Shop Open';
    statusText.style.color = isOpen ? '#f87171' : 'var(--neon-green)';
  }
  const dot = btn.parentElement.querySelector('.pulse-dot');
  if (dot) dot.style.background = isOpen ? '#f87171' : '';
  showToast(isOpen ? '🔴 Shop is now closed' : '🟢 Shop is now open', isOpen ? 'error' : 'success');
}

function handleOrder(btn, action) {
  const card = btn.closest('.incoming-order-card');
  const statusBadge = card.querySelector('.badge');
  if (action === 'accepted') {
    statusBadge.className = 'badge badge-green';
    statusBadge.textContent = 'Accepted';
    showToast('✅ Order accepted! Customer notified.', 'success');
  } else {
    card.style.opacity = '0.5';
    statusBadge.className = 'badge badge-red';
    statusBadge.textContent = 'Rejected';
    showToast('❌ Order rejected', 'error');
  }
  btn.parentElement.innerHTML = '<span class="text-muted text-sm">Status updated</span>';
}

function handleOrderComplete(btn) {
  const card = btn.closest('.incoming-order-card');
  const statusBadge = card.querySelector('.badge');
  statusBadge.className = 'badge badge-green';
  statusBadge.textContent = 'Completed ✓';
  btn.parentElement.innerHTML = '<span class="text-sm" style="color:var(--neon-green)">✅ Marked complete</span>';
  showToast('🏁 Job completed! Payment received.', 'success');
}

function openAddServiceModal() {
  const modal = document.getElementById('addServiceModal');
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function addService() {
  const name = document.getElementById('addServiceName')?.value;
  const price = document.getElementById('addServicePrice')?.value;
  if (!name || !price) { showToast('⚠️ Please fill all fields', 'warning'); return; }
  const list = document.getElementById('servicesList');
  if (list) {
    const card = document.createElement('div');
    card.className = 'service-mgmt-card';
    card.innerHTML = `<div class="service-mgmt-icon">🔧</div><div class="service-mgmt-info"><div class="service-mgmt-name">${name}</div><div class="service-mgmt-price">₹${price}</div></div><span class="badge badge-green">Active</span><div class="service-mgmt-actions"><button class="btn btn-secondary btn-sm" onclick="showToast('✏️ Edit mode','info')">Edit</button><button class="btn btn-ghost btn-sm" onclick="this.closest('.service-mgmt-card').remove()">Remove</button></div>`;
    list.appendChild(card);
  }
  closeModal('addServiceModal');
  showToast(`✅ "${name}" added successfully!`, 'success');
}

function switchChartTab(el, period) {
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  showToast(`📊 Showing ${period}ly data`, 'info');
}

function switchEarningTab(el, period) { switchChartTab(el, period); }

// =====================
// ADMIN TABS
// =====================
function adminTab(name, btn) {
  ['overview','shops','orders','users','analytics'].forEach(t => {
    const el = document.getElementById('adminTab-' + t);
    if (el) el.style.display = 'none';
  });
  const tab = document.getElementById('adminTab-' + name);
  if (tab) { tab.style.display = 'block'; tab.style.animation = 'fadeIn 0.3s ease'; }
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function approveShop(cardId, btn) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const badge = card.querySelector('.badge');
  badge.className = 'badge badge-green';
  badge.textContent = '✅ Approved';
  card.querySelector('.shop-approval-actions').innerHTML = '<span class="text-sm" style="color:var(--neon-green);">✅ Shop approved and notified</span>';
  showToast('✅ Shop approved! Owner notified via email.', 'success');
}

function rejectShop(cardId, btn) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const badge = card.querySelector('.badge');
  badge.className = 'badge badge-red';
  badge.textContent = '✗ Rejected';
  card.style.opacity = '0.6';
  card.querySelector('.shop-approval-actions').innerHTML = '<span class="text-sm text-muted">Shop rejected</span>';
  showToast('❌ Shop rejected and removed', 'error');
}

// =====================
// RIPPLE EFFECT ON BUTTONS
// =====================
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-primary');
  if (!btn) return;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;background:rgba(255,255,255,0.3);animation:ripple 0.6s linear;pointer-events:none;`;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', function() {
  const isSplash = document.getElementById('screen-splash');
  if (isSplash) {
    initSplash();
  }

  // Animate stat cards on load
  setTimeout(() => {
    document.querySelectorAll('.stat-value').forEach(el => {
      el.style.animation = 'fadeIn 0.5s ease forwards';
    });
  }, 500);

  // Animate chart bars
  setTimeout(() => {
    document.querySelectorAll('.chart-bar-fill').forEach(bar => {
      const h = bar.style.height;
      bar.style.height = '0';
      setTimeout(() => { bar.style.height = h; bar.style.transition = 'height 1s cubic-bezier(.4,0,.2,1)'; }, 100);
    });
  }, 300);

  // Init shop dashboard or admin panel active tab
  if (document.getElementById('tab-overview')) shopTab('overview', document.getElementById('sb-overview'));
  if (document.getElementById('adminTab-overview')) adminTab('overview', document.getElementById('asb-overview'));
});
