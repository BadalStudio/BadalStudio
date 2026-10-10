// ===================================
// NOVASHOP - JAVASCRIPT
// Interactive Demo Store
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  // ELEMENTS
  const menuButton = $(".mobile-menu-button");
  const navLinks = $(".nav-links");
  const searchButton = $(".search-toggle");
  const searchPanel = $(".search-panel");
  const searchInput = $("#productSearch");
  const searchClose = $(".search-close");
  const cartButton = $(".cart-button");
  const cartPanel = $(".cart-panel");
  const cartOverlay = $(".cart-overlay");
  const cartClose = $(".cart-close");
  const cartItemsContainer = $(".cart-items");
  const cartCount = $(".cart-count");
  const cartSubtotal = $(".cart-subtotal");
  const checkoutButton = $(".checkout-button");
  const toast = $(".toast");

  const products = $$(".product-card");
  const filterButtons = $$(".filter-button");
  const categoryCards = $$(".category-card");

  let activeCategory = "all";
  let searchTerm = "";
  let cart = [];
  let toastTimer;

  // TOAST MESSAGE
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // MOBILE MENU
  menuButton?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(Boolean(isOpen))
    );
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  // SEARCH PANEL
  searchButton?.addEventListener("click", () => {
    if (!searchPanel) return;

    searchPanel.classList.toggle("open");

    if (searchPanel.classList.contains("open")) {
      searchInput?.focus();
    }
  });

  searchClose?.addEventListener("click", () => {
    searchPanel?.classList.remove("open");
  });

  // PRODUCT FILTERING + SEARCH
  function filterProducts() {
    let visibleCount = 0;

    products.forEach((product) => {
      const category = (
        product.dataset.category || ""
      ).toLowerCase();

      const name = (
        product.dataset.name ||
        $(".product-info h3", product)?.textContent ||
        ""
      ).toLowerCase();

      const matchesCategory =
        activeCategory === "all" ||
        category === activeCategory;

      const matchesSearch = name.includes(searchTerm);

      const visible = matchesCategory && matchesSearch;

      product.hidden = !visible;

      if (visible) visibleCount++;
    });

    const emptyMessage = $(".empty-message");

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }

    filterButtons.forEach((button) => {
      const isActive =
        (button.dataset.filter || "all") === activeCategory;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = (
        button.dataset.filter || "all"
      ).toLowerCase();

      filterProducts();
    });
  });

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      activeCategory = (
        card.dataset.category || "all"
      ).toLowerCase();

      filterProducts();

      $(".products-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  searchInput?.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    filterProducts();
  });

  // SHOW ALL PRODUCTS BUTTON
  const showAllButton = $(".show-all-products");

  showAllButton?.addEventListener("click", () => {
    activeCategory = "all";
    searchTerm = "";

    if (searchInput) searchInput.value = "";

    filterProducts();

    $(".products-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  // WISHLIST
  $$(".wishlist-button").forEach((button) => {
    button.addEventListener("click", () => {
      const liked = button.classList.toggle("liked");

      button.setAttribute("aria-pressed", String(liked));
      button.textContent = liked ? "♥" : "♡";

      showToast(
        liked
          ? "Added to your demo wishlist!"
          : "Removed from your demo wishlist."
      );
    });
  });

  // CART OPEN/CLOSE
  function openCart() {
    cartPanel?.classList.add("open");
    cartOverlay?.classList.add("open");

    cartPanel?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartPanel?.classList.remove("open");
    cartOverlay?.classList.remove("open");

    cartPanel?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  cartButton?.addEventListener("click", openCart);
  cartClose?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      searchPanel?.classList.remove("open");
      navLinks?.classList.remove("open");
    }
  });

  // ADD PRODUCTS TO CART
  products.forEach((product) => {
    const addButton = $(".add-to-cart", product);

    addButton?.addEventListener("click", () => {
      const name =
        product.dataset.name ||
        $(".product-info h3", product)?.textContent.trim() ||
        "Product";

      const price = Number(product.dataset.price);

      const emoji =
        $(".product-emoji", product)?.textContent.trim() || "🛍️";

      if (!Number.isFinite(price) || price < 0) {
        showToast("Product price is missing.");
        return;
      }

      const existingItem = cart.find(
        (item) => item.name === name
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          name,
          price,
          emoji,
          quantity: 1
        });
      }

      renderCart();
      showToast(`${name} added to cart!`);
    });
  });

  // UPDATE CART DISPLAY
  function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.replaceChildren();

    if (cart.length === 0) {
      const empty = document.createElement("p");
      empty.className = "cart-empty";
      empty.textContent =
        "Your cart is empty. Let's find something cool! 🛍️";

      cartItemsContainer.appendChild(empty);
    }

    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      const emoji = document.createElement("div");
      emoji.className = "cart-item-emoji";
      emoji.textContent = item.emoji;

      const info = document.createElement("div");
      info.className = "cart-item-info";

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.textContent = formatPrice(item.price * item.quantity);

      const quantity = document.createElement("div");
      quantity.className = "cart-quantity";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", `Decrease ${item.name}`);

      const quantityText = document.createElement("span");
      quantityText.textContent = String(item.quantity);

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", `Increase ${item.name}`);

      minus.addEventListener("click", () => {
        item.quantity--;

        if (item.quantity <= 0) {
          cart = cart.filter((entry) => entry !== item);
        }

        renderCart();
      });

      plus.addEventListener("click", () => {
        item.quantity++;
        renderCart();
      });

      quantity.append(minus, quantityText, plus);
      info.append(name, price, quantity);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-cart-item";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${item.name}`);

      remove.addEventListener("click", () => {
        cart = cart.filter((entry) => entry !== item);
        renderCart();
        showToast("Product removed from cart.");
      });

      row.append(emoji, info, remove);
      cartItemsContainer.appendChild(row);
    });

    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (cartCount) {
      cartCount.textContent = String(totalQuantity);
    }

    if (cartSubtotal) {
      const amount = $(".subtotal-amount", cartSubtotal);

      if (amount) {
        amount.textContent = formatPrice(totalPrice);
      } else {
        cartSubtotal.textContent =
          `Subtotal: ${formatPrice(totalPrice)}`;
      }
    }
  }

  // FORMAT PRICES
  function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  // DEMO CHECKOUT ONLY
  checkoutButton?.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }

    showToast("Demo only — real checkout isn't enabled yet.");
  });

  // NEWSLETTER DEMO
  const newsletterForm = $(".newsletter-form");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    showToast("Thanks! Newsletter signup is demo-only.");

    const message = $(".newsletter-message");

    if (message) {
      message.textContent =
        "Thanks for your interest! This demo doesn't save or send emails.";
    }

    newsletterForm.reset();
  });

  // CURRENT YEAR
  const yearElement = $("#currentYear");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // INITIALIZE
  renderCart();
  filterProducts();

  console.log("NovaShop demo is ready! 🚀");
});
