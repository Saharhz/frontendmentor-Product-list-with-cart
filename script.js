document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector(
    ".cart-container .flex-container"
  );
  const cartTitle = document.querySelector(".cart-container h1");
  let cart = {};

  function updateCart() {
    cartContainer.innerHTML = "";
    let totalItems = 0;

    if (Object.keys(cart).length === 0) {
      cartContainer.innerHTML = `
        <img src="assets/images/illustration-empty-cart.svg" alt="illustration-empty-cart">
        <p>Your added items will appear here</p>
      `;
    } else {
      Object.values(cart).forEach((item) => {
        totalItems += item.quantity;
        cartContainer.innerHTML += `
          <div class="cart-item">
            <p>${item.name} (x${item.quantity}) - $${(
          item.price * item.quantity
        ).toFixed(2)}</p>
          </div>
        `;
      });
    }
    cartTitle.innerHTML = `Your Cart (${totalItems})`;
  }

  document.querySelectorAll(".add_cart").forEach((button) => {
    const dessert = button.closest("div");
    const name = dessert.querySelector(".name").textContent;
    const price = parseFloat(
      dessert.querySelector(".price").textContent.replace("$", "")
    );

    button.addEventListener("click", function () {
      if (!cart[name]) {
        cart[name] = { name, price, quantity: 1 };
      } else {
        cart[name].quantity++;
      }
      updateCart();
    });

    const increaseButton = button.querySelector(".increase");
    const decreaseButton = button.querySelector(".decrease");

    increaseButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (cart[name]) {
        cart[name].quantity++;
      } else {
        cart[name] = { name, price, quantity: 1 };
      }
      updateCart();
    });

    decreaseButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (cart[name] && cart[name].quantity > 1) {
        cart[name].quantity--;
      } else {
        delete cart[name];
      }
      updateCart();
    });
  });
});
