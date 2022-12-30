const cart_items = document.querySelector("#cart .cart-items");

const parentContainer = document.getElementById("EcommerceContainer");
// from old .js
parentContainer.addEventListener("click", (e) => {
  if (e.target.className == "shop-item-button") {
    const id = e.target.parentNode.parentNode.id;
    const name = document.querySelector(`#${id} h3`).innerText;
    const img_src = document.querySelector(`#${id} img`).src;
    const price =
      e.target.parentNode.firstElementChild.firstElementChild.innerText;

    let total_cart_price = document.querySelector("#total-value").innerText; // id -> #total-value
    // if item is already in your cart show a alert "This item is already added to the cart"
    if (document.querySelector(`#in-cart-${id}`)) {
      alert("This item is already added to the cart");
      return;
    }

    document.querySelector(".cart-number").innerText =
      parseInt(document.querySelector(".cart-number").innerText) + 1; // class='cart-number'
    const cart_item = document.createElement("div");
    cart_item.classList.add("cart-row");
    cart_item.setAttribute("id", `in-cart-${id}`);
    total_cart_price = parseFloat(total_cart_price) + parseFloat(price);
    total_cart_price = total_cart_price.toFixed(2);
    document.querySelector("#total-value").innerText = `${total_cart_price}`;
    cart_item.innerHTML = `
      <span class='cart-item cart-column'>
      <img class='cart-img' src="${img_src}" alt="">
          <span>${name}</span>
  </span>
  <span class='cart-price cart-column'>${price}</span>
  <span class='cart-quantity cart-column'>
      <input type="text" value="1">
      <button>REMOVE</button>
  </span>`;
    cart_items.appendChild(cart_item);

    const container = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2500);
  }
  if (
    e.target.className == "cart-btn-bottom" ||
    e.target.className == "cart-bottom" ||
    e.target.className == "cart-holder"
  ) {
    // update here for Task - 13 -> Show the Cart
    const cartContainer = document.getElementById("cart");
    cartContainer.innerHTML = "";
    getCartDetails();
    // document.querySelector("#cart").style = "display:block;";
  }
  if (e.target.className == "cancel") {
    document.querySelector("#cart").style = "display:none;";
  }
  if (e.target.className == "purchase-btn") {
    if (parseInt(document.querySelector(".cart-number").innerText) === 0) {
      alert("You have Nothing in Cart , Add some products to purchase !");
      return;
    }
    alert("Thanks for the purchase");
    cart_items.innerHTML = "";
    document.querySelector(".cart-number").innerText = 0;
    document.querySelector("#total-value").innerText = `0`;
  }

  if (e.target.innerText == "REMOVE") {
    let total_cart_price = document.querySelector("#total-value").innerText;
    total_cart_price =
      parseFloat(total_cart_price).toFixed(2) -
      parseFloat(
        document.querySelector(
          `#${e.target.parentNode.parentNode.id} .cart-price`
        ).innerText
      ).toFixed(2);
    document.querySelector(".cart-number").innerText =
      parseInt(document.querySelector(".cart-number").innerText) - 1;
    document.querySelector(
      "#total-value"
    ).innerText = `${total_cart_price.toFixed(2)}`;
    e.target.parentNode.parentNode.remove();
  }
});
// till from old .js

window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");

  axios.get("http://44.201.75.43:3000/products").then((data) => {
    console.log(data);

    if (data.request.status === 200) {
      // The HTTP 200 OK success status response code.
      // The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
      // The HTTP 500 Internal Server Error server error response code.
      // The HTTP 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error.
      const products = data.data.products;
      const parentSection = document.getElementById("Products");
      products.forEach((product) => {
        const productHtml = `
        <div>
            <h3>${product.title}</h3>
            <div class="image-container">
              <img class="prod-images" src=${product.imageUrl}></img>
            </div>
            <button onClick="addToCart(${product.id})"> Add To Cart </button>
        </div>`;
        parentSection.innerHTML = parentSection.innerHTML + productHtml;
      });
    }
  });
});

function addToCart(productId) {
  // productId -> get product id from frontend. (controllers/shop.js -> postCart)
  axios
    .post("http://44.201.75.43:3000/cart", { productId: productId })
    .then((response) => {
      // console.log(response)
      if (response.status === 200) {
        nofityUsers(response.data.message);
      } else {
        throw new ErrorEvent();
      }
    })
    .catch((err) => {
      console.log(err);
      nofityUsers(err.data.message);
    });
}

function getCartDetails() {
  axios
    .get("http://44.201.75.43:3000/cart")
    .then((response) => {
      if (response.status === 200) {
        response.data.products.forEach((product) => {
          const cartContainer = document.getElementById("cart");
          cartContainer.innerHTML += `<li>${product.title} - ${product.price} - ${product.cartItem.quantity}`;
        });
        document.querySelector("#cart").style = "display:block;";
      } else {
        throw new Error("Something went wrong");
      }
      // console.log(response)
    })
    .catch((error) => {
      nofityUsers(error);
    });
}

function nofityUsers(message) {
  const container = document.getElementById("notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}<h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2500);
}
