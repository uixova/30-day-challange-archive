const products = [
    { id: 1, name: "Apple AirPods", price: 199, category: "tech", img: "assets/images/airpods.png" },
    { id: 2, name: "Nike Air Force", price: 499, category: "shoes", img: "assets/images/nikeAir.png" },
    { id: 3, name: "Razer Mouse", price: 999, category: "tech", img: "assets/images/razerMouse.png" },
    { id: 4, name: "Macbook Pro", price: 1299, category: "tech", img: "assets/images/mackbook.png" },
    { id: 5, name: "Sony Camera", price: 650, category: "tech", img: "assets/images/camera.png" },
    { id: 6, name: "Gaming Keyboard", price: 225, category: "tech", img: "assets/images/keyboard.png" }
];

let cart = []; 

const productGrid = document.getElementById("productGrid");
const categorySelect = document.getElementById("categorySelect");
const priceRange = document.getElementById("priceRange");
const rangeValue = document.getElementById("rangeValue");
const itemCountDisplay = document.getElementById("itemCountDisplay");
const totalPriceDisplay = document.getElementById("totalPriceDisplay");
const cartModal = document.getElementById("cartModal");
const checkoutBtn = document.getElementById("checkoutBtn");
const closeModal = document.getElementById("closeModal");
const cartItemsList = document.getElementById("cartItemsList");
const modalTotalValue = document.getElementById("modalTotalValue");
const finalConfirmBtn = document.getElementById("finalConfirmBtn");

function renderProducts(filteredProducts) {
    productGrid.innerHTML = "";

    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-img">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="price">${product.price}</p>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

function renderCartItems() {
    cartItemsList.innerHTML = ""; 

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-msg">Your basket is empty.</p>';
        modalTotalValue.innerText = "$0";
        return;
    }

    cart.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item-row";
        itemRow.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <span>$${item.price}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsList.appendChild(itemRow);
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    modalTotalValue.innerText = `$${total}`;
}

function filterProducts() {
    const selectedCategory = categorySelect.value;
    const maxPrice = parseInt(priceRange.value);

    const filtered = products.filter(product => {
        const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;

        const priceMatch = product.price <= maxPrice;

        return categoryMatch && priceMatch;
    });

    renderProducts(filtered);
}

priceRange.addEventListener("input", (e) => {
    rangeValue.innerText = `$${e.target.value}`;
    filterProducts();
});

categorySelect.addEventListener("change", filterProducts);

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    const existItem = cart.find(item => item.id === productId);

    if (existItem) {
        existItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0)
    itemCountDisplay.innerText = totalCount;

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalPriceDisplay.innerText = totalPrice;

    console.log("Sepet güncel:", cart);
}

function changeQuantity(productId, amount) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity += amount;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            renderCartItems();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
}

checkoutBtn.addEventListener("click", () => {
    cartModal.style.display = "flex";
    renderCartItems(); 
});

closeModal.addEventListener("click", () => {
    cartModal.style.display = "none";
});

finalConfirmBtn.addEventListener("click", () => {
    cart = []; 
    updateCartUI(); 
    cartModal.style.display = "none";
    alert("Your order has been successfully completed! 🚀");
});

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = "none";
    }
});

renderProducts(products);
