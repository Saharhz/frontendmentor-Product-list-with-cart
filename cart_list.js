const items = document.querySelectorAll(".item");
const cartContainer = document.querySelector(".cart-container");
const cartTitle = cartContainer.querySelector("h1");
const flexContainer = cartContainer.querySelector(".flex-container");

let cart = {};

items.forEach((item) => {
  // textContent used to set or get content inside an HTML element without Tags, only plain text
  const name = item.querySelector(".name").textContent;
  const price = parseFloat(
    item.querySelector(".price").textContent.replace("$", "")
  );
  const quantitySpan = item.querySelector(".quantity");

  const increaseBtn = item.querySelector(".increase-quantity");
  const decreaseBtn = item.querySelector(".decrease-quantity");

  const updateCartDisplay = () => {
    // Clear old cart. innerHTML represent the HTML Content, it includes tags, remove evrything in flexContainer, not to see duplicate
    flexContainer.innerHTML = "";
    // Object.values(cart) get all cart items as an array
    let totalItems = 0;
    for (let item of Object.values(cart)) {
      totalItems += item.quantity; //tatolItems = totalItems + item.quantity
    }

    if (totalItems === 0) {
      cartTitle.textContent = `Your Cart (0)`;
      flexContainer.innerHTML = `
        <img src="assets/images/illustration-empty-cart.svg" alt="illustration-empty-cart" />
        <p>Your added items will appear here</p>
      `;
      return;
    }

    cartTitle.textContent = `Your Cart (${totalItems})`;

    // creates and add items to the sidebar, the item will be add to variable cart
    Object.values(cart).forEach((item) => {
      if (item.quantity > 0) {
        // createElement method will create a container (div) to hold the items in it, we will create our array in this new element
        const cartItem = document.createElement("div");
        // toFixed(2): format the total price and add to decimal .00 to the price
        cartItem.innerHTML = `
          <p><strong>${item.name}</strong> x ${item.quantity}</p>
          <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
        `;
        // the new cart which is now inside new div with all added items will be saved in flexcontainer
        flexContainer.appendChild(cartItem);
      }
    });
  };

  const updateQuantity = (amount) => {
    if (!cart[name]) {
      cart[name] = { name, price, quantity: 0 };
    }
    // to make sure no negative quantity will be shown
    cart[name].quantity += amount;
    if (cart[name].quantity < 0) cart[name].quantity = 0;
    // update the quantity of the items on sidebar
    quantitySpan.textContent = cart[name].quantity;

    updateCartDisplay();
  };

  increaseBtn.addEventListener("click", () => updateQuantity(1));
  decreaseBtn.addEventListener("click", () => updateQuantity(-1));
});

document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.querySelector(".confirmBtn");

  confirmBtn.addEventListener("click", () => {
    alert("Order Confirmed");
  });
});
