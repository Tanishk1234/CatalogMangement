// Product Data Store (Simulating a database)
let products = [];
let cart = [];
let uniqueIdCounter = { A: 1, B: 1, C: 1, D: 1 };

// Helper Function: Generate Unique ID
function generateUniqueId(range) {
    return `${range}-${uniqueIdCounter[range]++}`;
}

// Helper Function: Calculate Poly Weight
function calculatePolyWeight(net, gross) {
    return (gross - net).toFixed(2);
}

// Add Card Function
document.getElementById("create-card").addEventListener("click", () => {
    const imageInput = document.getElementById("product-image");
    const range = document.getElementById("range").value;
    const netWt = parseFloat(document.getElementById("net-wt").value);
    const grossWt = parseFloat(document.getElementById("gross-wt").value);

    if (!imageInput.files[0] || isNaN(netWt) || isNaN(grossWt) || netWt > grossWt) {
        alert("Please provide valid inputs!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageSrc = e.target.result;
        const uniqueId = generateUniqueId(range);
        const polyWt = calculatePolyWeight(netWt, grossWt);

        const product = { id: uniqueId, image: imageSrc, netWt, grossWt, polyWt };
        products.push(product);

        addProductToCatalog(product);
        updateModifyOptions();
        alert(`Product Created: ${uniqueId}`);
    };
    reader.readAsDataURL(imageInput.files[0]);
});

// Add Product to Catalog
function addProductToCatalog(product) {
    const catalogContainer = document.getElementById("catalog-container");
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${product.image}" alt="Product Image">
        <div class="card-content">
            <p><strong>ID:</strong> ${product.id}</p>
            <p><strong>Net Weight:</strong> ${product.netWt}g</p>
            <p><strong>Gross Weight:</strong> ${product.grossWt}g</p>
            <p><strong>Poly Weight:</strong> ${product.polyWt}g</p>
            <button onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `;
    catalogContainer.appendChild(card);
}

// Update Modify Options
function updateModifyOptions() {
    const select = document.getElementById("modify-select");
    select.innerHTML = '<option value="">Select Product to Modify</option>';
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.id} (${product.netWt}g)`;
        select.appendChild(option);
    });
}

// Modify Card
document.getElementById("update-card").addEventListener("click", () => {
    const selectedId = document.getElementById("modify-select").value;
    if (!selectedId) return alert("Select a product to modify!");

    const product = products.find(p => p.id === selectedId);
    if (!product) return alert("Product not found!");

    const imageInput = document.getElementById("modify-image");
    const newNetWt = parseFloat(document.getElementById("modify-net-wt").value) || product.netWt;
    const newGrossWt = parseFloat(document.getElementById("modify-gross-wt").value) || product.grossWt;

    if (newNetWt > newGrossWt) {
        alert("Net weight cannot be greater than gross weight.");
        return;
    }

    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            product.image = e.target.result;
            updateProductDetails(product, newNetWt, newGrossWt);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        updateProductDetails(product, newNetWt, newGrossWt);
    }
});

// Update Product Details
function updateProductDetails(product, netWt, grossWt) {
    product.netWt = netWt;
    product.grossWt = grossWt;
    product.polyWt = calculatePolyWeight(netWt, grossWt);

    document.getElementById("catalog-container").innerHTML = "";
    products.forEach(addProductToCatalog);
    updateModifyOptions();
    alert(`Product Updated: ${product.id}`);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
        alert(`Added to Cart: ${product.id}`);
    }
}

// Update Cart Display
function updateCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    cart.forEach(product => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.id}">
            <p>${product.id} - ${product.netWt}g / ${product.grossWt}g</p>
            <button onclick="removeFromCart('${product.id}')">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Generate Order Page
document.getElementById("continue-order").addEventListener("click", () => {
    if (cart.length === 0) return alert("Cart is empty!");

    const orderId = `order${Date.now()}`;
    const currentUrl = window.location.origin;
    const orderPageLink = `${currentUrl}/orders/${orderId}.html`;

    let orderContent = `
        <html>
        <head><title>${orderId}</title></head>
        <body>
        <h1>Order: ${orderId}</h1>
        <div>
    `;

    cart.forEach(product => {
        orderContent += `
            <div>
                <img src="${product.image}" alt="${product.id}" style="width:200px;">
                <p>ID: ${product.id}</p>
                <p>Net Weight: ${product.netWt}g</p>
                <p>Gross Weight: ${product.grossWt}g</p>
                <p>Poly Weight: ${product.polyWt}g</p>
            </div><hr>
        `;
    });

    orderContent += `
        <p>Scan QR Code to View Order:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(orderPageLink)}&size=200x200" alt="QR Code">
        <p><a href="${orderPageLink}" target="_blank">View Order Page</a></p>
        </div>
        </body>
        </html>
    `;

    const blob = new Blob([orderContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Open order page in a new tab
    window.open(url, "_blank");

    alert(`Order Page Generated: ${orderId}`);
});
