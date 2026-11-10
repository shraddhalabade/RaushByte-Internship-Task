
document.addEventListener("DOMContentLoaded", () => {
    const read = key => {
        try {
            const x = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(x) ? x : [];
        } catch {
            return [];
        }
    };

    const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

    const money = n =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(n);

    const getProduct = id => products.find(p => p.id === Number(id));

    window.SLShop = { read, save, money, getProduct, refreshCounts };

    function refreshCounts() {
        const cart = read("SLShopCart");
        const wish = read("SLShopWishlist");
        const c = document.getElementById("cartCount");
        const w = document.getElementById("wishlistCount");

        if (c) c.textContent = cart.reduce((s, i) => s + Number(i.quantity || 1), 0);
        if (w) w.textContent = wish.length;
    }

    function toast(msg) {
        let el = document.getElementById("shopToast");

        if (!el) {
            el = document.createElement("div");
            el.id = "shopToast";
            el.className = "shop-toast";
            el.setAttribute("role", "status");
            document.body.appendChild(el);
        }

        el.textContent = msg;
        el.classList.add("show");
        clearTimeout(window.shopToastTimer);

        window.shopToastTimer = setTimeout(
            () => el.classList.remove("show"),
            2400
        );
    }

    window.SLShop.toast = toast;

    function card(p) {
        const wished = read("SLShopWishlist").some(x => Number(x.id) === p.id);

        return `<div class="col-6 col-lg-3"><article class="product-card">
            <div class="product-image-wrap">
                <a href="product.html?id=${p.id}">
                    <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
                </a>
                <span class="product-badge">${p.badge}</span>
                <button class="product-wishlist ${wished ? "is-active" : ""}" data-wishlist-id="${p.id}" aria-label="Toggle wishlist">
                    <i class="bi ${wished ? "bi-heart-fill" : "bi-heart"}"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h3 class="product-name">
                    <a href="product.html?id=${p.id}">${p.name}</a>
                </h3>
                <div class="product-rating">
                    <i class="bi bi-star-fill"></i> ${p.rating} <span>Rating</span>
                </div>
                <div class="product-bottom">
                    <div class="product-price">
                        ${money(p.price)} <span class="product-old-price">${money(p.oldPrice)}</span>
                    </div>
                    <button class="add-cart-btn" data-cart-id="${p.id}">
                        <i class="bi bi-bag-plus"></i> Add
                    </button>
                </div>
            </div>
        </article></div>`;
    }

    function renderProducts(list, target) {
        if (!target) return;

        target.innerHTML = list.length
            ? list.map(card).join("")
            : '<div class="col-12"><p class="no-products">No products found. Try another search or category.</p></div>';
    }

    const featured = document.getElementById("featuredProducts");

    if (featured) renderProducts(products.slice(0, 4), featured);

    const grid = document.getElementById("shopProducts");

    if (grid) {
        const search = document.getElementById("productSearch");
        const category = document.getElementById("categoryFilter");
        const sort = document.getElementById("sortProducts");
        const params = new URLSearchParams(location.search);

        if (category && params.get("category")) {
            category.value = params.get("category");
        }

        function apply() {
            let list = [...products];
            const q = (search?.value || "").trim().toLowerCase();
            const cat = category?.value || "all";
            const order = sort?.value || "featured";

            if (q) {
                list = list.filter(p =>
                    (p.name + " " + p.category + " " + p.description)
                        .toLowerCase()
                        .includes(q)
                );
            }

            if (cat !== "all") {
                list = list.filter(p => p.categoryKey === cat);
            }

            if (order === "price-low") list.sort((a, b) => a.price - b.price);
            if (order === "price-high") list.sort((a, b) => b.price - a.price);
            if (order === "rating") list.sort((a, b) => b.rating - a.rating);

            renderProducts(list, grid);

            const count = document.getElementById("resultsCount");

            if (count) {
                count.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;
            }
        }

        [search, category, sort].forEach(el =>
            el && el.addEventListener(el === search ? "input" : "change", apply)
        );

        apply();
    }

    const detail = document.getElementById("productDetail");

    if (detail) {
        const p = getProduct(new URLSearchParams(location.search).get("id")) || products[0];

        detail.innerHTML = `<div class="col-md-6">
            <img class="detail-image" src="${p.image}" alt="${p.name}">
        </div>
        <div class="col-md-6">
            <span class="section-eyebrow">${p.category}</span>
            <h1 class="detail-title">${p.name}</h1>
            <div class="product-rating">
                <i class="bi bi-star-fill"></i> ${p.rating} <span>Customer rating</span>
            </div>
            <p class="detail-price">
                ${money(p.price)} <span class="product-old-price">${money(p.oldPrice)}</span>
            </p>
            <p class="detail-description">${p.description}</p>
            <p class="small text-secondary">Demo product • Prices are illustrative</p>
            <div class="d-flex gap-2 flex-wrap mt-4">
                <button class="btn btn-dark" data-cart-id="${p.id}">
                    <i class="bi bi-bag-plus me-2"></i>Add to Cart
                </button>
                <button class="btn btn-outline-dark" data-wishlist-id="${p.id}">
                    <i class="bi bi-heart me-2"></i>Add to Wishlist
                </button>
            </div>
            <hr>
            <p><i class="bi bi-truck me-2"></i>Delivery information shown for demo purposes.</p>
            <p><i class="bi bi-arrow-repeat me-2"></i>Easy returns policy is illustrative.</p>
        </div>`;
    }

    const cartPage = document.getElementById("cartItems");

    function renderCart() {
        if (!cartPage) return;

        const cart = read("SLShopCart");

        if (!cart.length) {
            cartPage.innerHTML = '<div class="empty-state"><i class="bi bi-bag"></i><h3>Your cart is empty</h3><p>Find something you love and add it here.</p><a href="shop.html" class="btn btn-dark">Explore Products</a></div>';
            updateSummary([]);
            return;
        }

        cartPage.innerHTML = cart.map(item => {
            const p = getProduct(item.id);

            if (!p) return "";

            return `<div class="cart-item">
                <img src="${p.image}" alt="${p.name}">
                <div class="cart-item-info">
                    <a class="cart-item-title" href="product.html?id=${p.id}">${p.name}</a>
                    <p>${money(p.price)}</p>
                    <div class="quantity-control">
                        <button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <strong>${money(p.price * item.quantity)}</strong>
                <button class="remove-btn" data-remove-cart="${p.id}" aria-label="Remove ${p.name}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;
        }).join("");

        updateSummary(cart);
    }

    function updateSummary(cart) {
        const subtotal = cart.reduce((sum, item) => {
            const p = getProduct(item.id);
            return sum + (p ? p.price * Number(item.quantity || 1) : 0);
        }, 0);

        const sub = document.getElementById("cartSubtotal");
        const total = document.getElementById("cartTotal");
        const shipping = document.getElementById("cartShipping");

        if (sub) sub.textContent = money(subtotal);
        if (shipping) shipping.textContent = subtotal === 0 || subtotal >= 999 ? "Free" : money(79);
        if (total) total.textContent = money(subtotal === 0 ? 0 : subtotal + (subtotal >= 999 ? 0 : 79));
    }

    renderCart();

    const wishPage = document.getElementById("wishlistProducts");

    function renderWishlist() {
        if (!wishPage) return;

        const wish = read("SLShopWishlist");
        const list = wish.map(x => getProduct(x.id)).filter(Boolean);

        renderProducts(list, wishPage);

        if (!list.length) {
            wishPage.innerHTML = '<div class="col-12"><div class="empty-state"><i class="bi bi-heart"></i><h3>Your wishlist is empty</h3><p>Save products you would love to revisit.</p><a href="shop.html" class="btn btn-dark">Browse Products</a></div></div>';
        }
    }

    renderWishlist();

    document.addEventListener("click", e => {
        const add = e.target.closest("[data-cart-id]");
        const wish = e.target.closest("[data-wishlist-id]");
        const qty = e.target.closest("[data-qty]");
        const remove = e.target.closest("[data-remove-cart]");

        if (add) {
            const p = getProduct(add.dataset.cartId);
            if (!p) return;

            const cart = read("SLShopCart");
            const existing = cart.find(x => Number(x.id) === p.id);

            if (existing) {
                existing.quantity = Number(existing.quantity || 1) + 1;
            } else {
                cart.push({ id: p.id, quantity: 1 });
            }

            save("SLShopCart", cart);
            refreshCounts();
            toast(`${p.name} added to cart.`);
            renderCart();
        }

        if (wish) {
            const id = Number(wish.dataset.wishlistId);
            const arr = read("SLShopWishlist");
            const index = arr.findIndex(x => Number(x.id) === id);

            if (index >= 0) {
                arr.splice(index, 1);
                toast("Removed from wishlist.");
            } else {
                arr.push({ id });
                toast("Added to wishlist.");
            }

            save("SLShopWishlist", arr);
            refreshCounts();
            renderProducts(products.filter(p => arr.some(x => Number(x.id) === p.id)), wishPage);

            if (wishPage) renderWishlist();
            if (featured) renderProducts(products.slice(0, 4), featured);

            if (grid) {
                const evt = new Event("input");
                document.getElementById("productSearch")?.dispatchEvent(evt);
            }

            if (detail) {
                const btn = detail.querySelector(`[data-wishlist-id="${id}"]`);

                if (btn) {
                    btn.classList.toggle(
                        "is-active",
                        arr.some(x => Number(x.id) === id)
                    );
                }
            }
        }

        if (qty) {
            const id = Number(qty.dataset.qty);
            const change = Number(qty.dataset.change);
            const cart = read("SLShopCart");
            const item = cart.find(x => Number(x.id) === id);

            if (item) {
                item.quantity = Number(item.quantity || 1) + change;

                if (item.quantity <= 0) {
                    save("SLShopCart", cart.filter(x => Number(x.id) !== id));
                } else {
                    save("SLShopCart", cart);
                }
            }

            refreshCounts();
            renderCart();
        }

        if (remove) {
            save(
                "SLShopCart",
                read("SLShopCart").filter(
                    x => Number(x.id) !== Number(remove.dataset.removeCart)
                )
            );

            refreshCounts();
            renderCart();
            toast("Item removed from cart.");
        }
    });

    const checkoutForm = document.getElementById("checkoutForm");

    if (checkoutForm) {
        const checkoutCart = read("SLShopCart");
        const summary = document.getElementById("checkoutSummary");

        const subtotal = checkoutCart.reduce((sum, i) => {
            const p = getProduct(i.id);
            return sum + (p ? p.price * i.quantity : 0);
        }, 0);

        if (summary) {
            if (!checkoutCart.length) {
                summary.innerHTML = '<p>Your cart is empty. <a href="shop.html">Browse products</a>.</p>';
            } else {
                summary.innerHTML = checkoutCart.map(i => {
                    const p = getProduct(i.id);

                    return p
                        ? `<div class="summary-line"><span>${p.name} × ${i.quantity}</span><strong>${money(p.price * i.quantity)}</strong></div>`
                        : "";
                }).join("") +
                `<hr><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Shipping</span><strong>${subtotal >= 999 ? "Free" : money(79)}</strong></div><hr><div class="summary-line total-line"><span>Total</span><strong>${money(subtotal + (subtotal && subtotal < 999 ? 79 : 0))}</strong></div>`;
            }
        }

        checkoutForm.addEventListener("submit", e => {
            e.preventDefault();

            if (!checkoutForm.reportValidity()) return;

            if (!checkoutCart.length) {
                toast("Your cart is empty.");
                return;
            }

            document.getElementById("checkoutMessage").textContent = " order placed successfully! ";

            save("SLShopCart", []);
            refreshCounts();
            checkoutForm.reset();

            if (summary) {
                summary.innerHTML = '<div class="empty-state"><i class="bi bi-check-circle"></i><h3>order complete</h3></div>';
            }
        });
    }

    const newsletter = document.getElementById("newsletterForm");

    if (newsletter) {
        newsletter.addEventListener("submit", e => {
            e.preventDefault();

            const msg = document.getElementById("newsletterMessage");

            if (msg) {
                msg.textContent = "Thanks! This newsletter form is demo-only and does not save email addresses.";
            }

            newsletter.reset();
        });
    }

    const contact = document.getElementById("contactForm");

    if (contact) {
        contact.addEventListener("submit", async e => {
            e.preventDefault();

            if (!contact.reportValidity()) return;

            const contactMessage = document.getElementById("contactMessage");
            const submitButton = contact.querySelector('button[type="submit"]');

            if (typeof emailjs === "undefined") {
                contactMessage.textContent = "Email service is unavailable. Please try again.";
                return;
            }

            submitButton.disabled = true;
            contactMessage.textContent = "Sending your message...";

            try {
                await emailjs.sendForm(
                    "service_52zsphr",
                    "template_jt9nqhj",
                    contact,
                    {
                        publicKey: "pB5AhqNSViBfZcsS_"
                    }
                );

                contactMessage.textContent = "Your message has been sent successfully!";
                contact.reset();
            } catch (error) {
                console.error("EmailJS error:", error);
                contactMessage.textContent = "Sorry, your message could not be sent. Please try again.";
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    const year = document.getElementById("currentYear");

    if (year) year.textContent = new Date().getFullYear();

    refreshCounts();
});
