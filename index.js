import { menuArray } from "./data.js";

const itemsEl = document.getElementById("item-list");
const itemTotalEl = document.getElementById("item-total");

let orderTotal = 0;
let orderItems = {}; // Store items by name

// Render menu items
for (let item of menuArray) {
    itemsEl.innerHTML += `
        <div class="add-item">
            <div class="item-select">
                <div class="emoji-img">
                    <p>${item.emoji}</p>
                </div>
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-ing">${item.ingredients.join(", ")}</p>
                    <p class="item-price">$${item.price}</p>
                </div>
            </div>
            <div class="add-btn-item">
                <button class="add-btn" data-name="${item.name}" data-price="${item.price}"> + </button>
            </div>
        </div>
    `;
}

// Event listener for adding items
itemsEl.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-btn")) {
        const itemName = event.target.getAttribute("data-name");
        const itemPrice = parseFloat(event.target.getAttribute("data-price"));

        // Increase quantity if item exists, otherwise add it
        if (orderItems[itemName]) {
            orderItems[itemName].qty += 1;
        } else {
            orderItems[itemName] = { qty: 1, price: itemPrice };
        }

        orderTotal += itemPrice;
        renderOrderSummary();
    }
});

// Function to render order summary
function renderOrderSummary() {
    if (!document.querySelector("#order-summary")) {
        itemTotalEl.innerHTML = `
            <div id="order-summary">
                <div class="order-summary-title">Your Order</div>
                <div id="order-items"></div>
                <div id="order-total-section">
                    <div class="order-total-row">
                        <p>Total Price:</p>
                        <p class="order-total">$${orderTotal.toFixed(2)}</p>
                    </div>
                    <button id="complete-order">Complete Order</button>
                </div>
            </div>
        `;
    }

    const orderItemsEl = document.getElementById("order-items");
    orderItemsEl.innerHTML = ""; // Clear previous items

    for (let [name, item] of Object.entries(orderItems)) {
        orderItemsEl.innerHTML += `
            <div class="order-item">
                <div class="order-item-left">
                    <p class="order-item-name"><span class="order-item-name-title">${name}</span> x${item.qty}</p>
                    <button class="remove-btn" data-name="${name}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <p class="order-item-price">$${(item.price * item.qty).toFixed(2)}</p>
            </div>
        `;
    }

    document.querySelector(".order-total").textContent = `$${orderTotal.toFixed(2)}`;
}

// Event listener to remove an entire item from the order
itemTotalEl.addEventListener("click", function (event) {
    let removeBtn = event.target;

    // Check if the clicked element is the trash icon
    if (removeBtn.tagName === "I") {
        removeBtn = removeBtn.closest(".remove-btn"); // Get the parent button
    }

    if (removeBtn && removeBtn.classList.contains("remove-btn")) {
        const itemName = removeBtn.getAttribute("data-name");

        if (orderItems[itemName]) {
            orderTotal -= orderItems[itemName].price * orderItems[itemName].qty; // Deduct total price
            delete orderItems[itemName]; // Remove item from the order list
        }

        if (Object.keys(orderItems).length === 0) {
            itemTotalEl.innerHTML = ""; // Clear the order summary if no items remain
        } else {
            renderOrderSummary();
        }
    }
});

// Function to show the modal
function showModal() {
    const modal = document.getElementById("order-modal");
    modal.style.display = "flex";
}

// Function to hide the modal
function hideModal() {
    const modal = document.getElementById("order-modal");
    modal.style.display = "none";
}

// Close modal when clicking outside of modal content
document.getElementById("order-modal").addEventListener("click", function (event) {
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent.contains(event.target)) {
        hideModal(); // Hide modal if clicked outside
    }
});

// Function to enable/disable the Pay button based on form fields
function checkFormValidity() {
    const name = document.getElementById("name");
    const cardNumber = document.getElementById("card-number");
    const cvv = document.getElementById("cvv");
    const payButton = document.getElementById("pay-button");

    // Enable pay button only if all fields are filled
    if (name.value && cardNumber.value && cvv.value) {
        payButton.disabled = false;
    } else {
        payButton.disabled = true;
    }
}

document.getElementById("payment-form").addEventListener("input", checkFormValidity);

itemTotalEl.addEventListener("click", function (event) {
    if (event.target.id === "complete-order") {
        showModal();
    }
});

document.getElementById("payment-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const name = document.getElementById("name").value;

    hideModal();

    // Clear the order
    orderItems = {};
    orderTotal = 0;
    renderOrderSummary();

    itemTotalEl.innerHTML = `<p class="thanks-msg">Thanks ${name}! Your order is on its way!</p>`;
});
