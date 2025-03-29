// Initialize an empty cart array to store items
const cart = [];
let cartCount = 0;

// Wait for the DOM to fully load before running our code
document.addEventListener("DOMContentLoaded", () => {
  // Get all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add_cart");

  // Add click event listener to each button
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  // Initialize the cart display
  updateCartDisplay();
});

// Function to handle adding items to cart
function addToCart(event) {
  // Get the parent item element
  const itemElement = event.currentTarget.closest(".item");

  // Get item details
  const name = itemElement.querySelector(".name").textContent;
  const category = itemElement.querySelector(".category").textContent;
  const priceText = itemElement.querySelector(".price").textContent;
  const price = Number.parseFloat(priceText.replace("$", ""));

  // Check if item is already in cart
  const existingItemIndex = cart.findIndex((item) => item.name === name);

  if (existingItemIndex !== -1) {
    // Item exists, increase quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cart.push({
      name: name,
      category: category,
      price: price,
      quantity: 1,
    });
  }

  // Update cart count
  cartCount += 1;

  // Update the cart display
  updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
  const cartContainer = document.querySelector(".cart-container");
  const cartTitle = cartContainer.querySelector("h1");

  // Update cart title with count
  cartTitle.textContent = `Your Cart (${cartCount})`;

  // Clear existing cart content
  const flexContainer = cartContainer.querySelector(".flex-container");

  // If cart is empty, show empty cart message
  if (cart.length === 0) {
    flexContainer.innerHTML = `
            <img src="assets/images/illustration-empty-cart.svg" alt="illustration-empty-cart">
            <p>Your added items will appear here</p>
        `;
    return;
  }

  // Create cart items HTML
  let cartHTML = '<div class="cart-items">';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    cartHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-category">${item.category}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)} x ${
      item.quantity
    }</p>
                </div>
                <div class="cart-item-actions">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
  });

  cartHTML += `
        <div class="cart-total">
            <p>Total: $${totalPrice.toFixed(2)}</p>
        </div>
        <button class="checkout-button">Checkout</button>
    </div>`;

  // Update the cart container
  flexContainer.innerHTML = cartHTML;

  // Add event listeners to the new buttons
  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", decreaseQuantity);
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeItem);
  });
}

// Function to decrease item quantity
function decreaseQuantity(event) {
  const index = event.currentTarget.dataset.index;

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    cartCount -= 1;
  } else {
    // If quantity would be 0, remove the item
    removeItem(event);
    return;
  }

  updateCartDisplay();
}

// Function to increase item quantity
function increaseQuantity(event) {
  const index = event.currentTarget.dataset.index;
  cart[index].quantity += 1;
  cartCount += 1;
  updateCartDisplay();
}

// Function to remove item from cart
function removeItem(event) {
  const index = event.currentTarget.dataset.index;

  // Decrease cart count by the item's quantity
  cartCount -= cart[index].quantity;

  // Remove the item from the cart
  cart.splice(index, 1);

  updateCartDisplay();
}
