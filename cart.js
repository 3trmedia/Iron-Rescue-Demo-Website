(function () {
  var STORAGE_KEY = 'iron-rescue-cart';

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart:updated'));
  }

  function addToCart(item, qty) {
    qty = qty || 1;
    var cart = getCart();
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id) { existing = cart[i]; break; }
    }
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, category: item.category, qty: qty });
    }
    saveCart(cart);
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(function (i) { return i.id !== id; }));
  }

  function setQty(id, qty) {
    var cart = getCart();
    var item = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { item = cart[i]; break; }
    }
    if (!item) return;
    if (qty <= 0) {
      saveCart(cart.filter(function (i) { return i.id !== id; }));
    } else {
      item.qty = qty;
      saveCart(cart);
    }
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function getCartTotal() {
    return getCart().reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
  }

  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function updateCartBadges() {
    var count = getCartCount();
    var badges = document.querySelectorAll('.cart-count-badge');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = String(count);
      badges[i].style.display = count > 0 ? 'flex' : 'none';
    }
  }

  window.IronCart = {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setQty: setQty,
    clearCart: clearCart,
    getCartCount: getCartCount,
    getCartTotal: getCartTotal,
    formatPrice: formatPrice,
    updateCartBadges: updateCartBadges
  };

  document.addEventListener('DOMContentLoaded', updateCartBadges);
  window.addEventListener('cart:updated', updateCartBadges);
  window.addEventListener('storage', updateCartBadges);
})();
