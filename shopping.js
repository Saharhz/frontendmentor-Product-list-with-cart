// Initialize an empty cart array to store items
const cart = [];
let cartCount = 0;

// Object to track quantities for each product before adding to cart
const productQuantities = {};

// Wait for the DOM to fully load before running our code
document.addEventListener("DOMContentLoaded", () => {
  // Get all product items
  const productItems = document.querySelectorAll(".item");

  // Initialize quantity for each product
  productItems.forEach((item) => {
    const productId = item.id;
    productQuantities[productId] = 1; // Default quantity is 1
  });

  // Add click event listener to each "Add to Cart" button
  const addToCartButtons = document.querySelectorAll(".add_cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Prevent the default button behavior
      event.preventDefault();
      // Only trigger addToCart if the click was on the button itself or the cart icon
      // (not on the increment/decrement buttons)
      if (
        !event.target.closest(".increase") &&
        !event.target.closest(".decrease")
      ) {
        addToCart(event);
      }
    });
  });

  // Add click event listeners to increment buttons
  const incrementButtons = document.querySelectorAll(".increase");
  incrementButtons.forEach((button) => {
    button.addEventListener("click", incrementQuantity);
  });

  // Add click event listeners to decrement buttons
  const decrementButtons = document.querySelectorAll(".decrease");
  decrementButtons.forEach((button) => {
    button.addEventListener("click", decrementQuantity);
  });

  // Initialize the cart display
  updateCartDisplay();
});

// Function to increment quantity for a product
function incrementQuantity(event) {
  event.stopPropagation(); // Prevent triggering the parent button's click event

  const itemElement = event.target.closest(".item");
  const productId = itemElement.id;

  // Increment the quantity
  productQuantities[productId] = (productQuantities[productId] || 1) + 1;

  // Update the display if needed (you might want to add a quantity display)
  updateProductQuantityDisplay(itemElement, productQuantities[productId]);
}

// Function to decrement quantity for a product
function decrementQuantity(event) {
  event.stopPropagation(); // Prevent triggering the parent button's click event

  const itemElement = event.target.closest(".item");
  const productId = itemElement.id;

  // Don't allow quantity to go below 1
  if (productQuantities[productId] > 1) {
    productQuantities[productId] -= 1;
  }

  // Update the display if needed
  updateProductQuantityDisplay(itemElement, productQuantities[productId]);
}

// Function to update the quantity display for a product
function updateProductQuantityDisplay(itemElement, quantity) {
  // Check if a quantity display element already exists
  let quantityDisplay = itemElement.querySelector(".quantity-display");

  if (!quantityDisplay) {
    // Create a quantity display element if it doesn't exist
    quantityDisplay = document.createElement("span");
    quantityDisplay.className = "quantity-display";

    // Insert it after the "Add to Cart" text
    const addCartButton = itemElement.querySelector(".add_cart");
    addCartButton.appendChild(quantityDisplay);
  }

  // Update the quantity text
  quantityDisplay.textContent = ` (${quantity})`;
}

// Function to handle adding items to cart
function addToCart(event) {
  // Get the parent item element
  const itemElement = event.currentTarget.closest(".item");
  const productId = itemElement.id;

  // Get item details
  const name = itemElement.querySelector(".name").textContent;
  const category = itemElement.querySelector(".category").textContent;
  const priceText = itemElement.querySelector(".price").textContent;
  const price = Number.parseFloat(priceText.replace("$", ""));

  // Get the quantity for this product (default to 1 if not set)
  const quantity = productQuantities[productId] || 1;

  // Check if item is already in cart
  const existingItemIndex = cart.findIndex((item) => item.name === name);

  if (existingItemIndex !== -1) {
    // Item exists, add the selected quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart with the selected quantity
    cart.push({
      id: productId,
      name: name,
      category: category,
      price: price,
      quantity: quantity,
    });
  }

  // Update cart count
  cartCount += quantity;

  // Reset the product quantity to 1 after adding to cart
  productQuantities[productId] = 1;
  updateProductQuantityDisplay(itemElement, 1);

  // Update the cart display
  updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
  const cartContainer = document.querySelector(".cart-container");
  const cartTitle = cartContainer.querySelector("h1");

  // Update cart title with count
  cartTitle.textContent = `Your Cart (${cartCount})`;

  // Get the flex container
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
    button.addEventListener("click", decreaseCartQuantity);
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", increaseCartQuantity);
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeItem);
  });
}

// Function to decrease item quantity in the cart
function decreaseCartQuantity(event) {
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

// Function to increase item quantity in the cart
function increaseCartQuantity(event) {
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
