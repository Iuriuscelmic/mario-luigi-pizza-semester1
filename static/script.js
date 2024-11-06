let iconCart = document.querySelector(".nav-icon");
let cartTab = document.querySelector(".cart-tab");
let closeBtn = document.querySelector(".close-window");
let pizzaList = document.getElementById("pizza-list");
let sidesList = document.getElementById("sides-list");
let drinksList = document.getElementById("drinks-list");
let desertList = document.getElementById("desert-list");
let listCartHTML = document.querySelector(".cart-list");
let iconCartSpan = document.querySelector(".nav-cta span");
let checkOut = document.querySelector(".go-to-checkout");

let pizzaMenu = [];
let sidesMenu = [];
let drinksMenu = [];
let desertMenu = [];
let carts = [];

function showContent(tabId) {
  // Hide all tab content
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  // Show the clicked tab content
  const activeContent = document.getElementById(tabId);
  activeContent.classList.add("active");
}

iconCart.addEventListener("click", () => {
  cartTab.classList.add("showCart");
});

closeBtn.addEventListener("click", () => {
  cartTab.classList.remove("showCart");
});

const addPizzaList = () => {
  pizzaList.innerHTML = "";
  if (pizzaMenu.length > 0) {
    pizzaMenu.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("menu-card");
      newProduct.innerHTML = `
              <img src="${product.image}" alt="${
        product.name
      } image" class="menu-img">
              <div class="meal-content">
                <div class="item-header">
                  <h3 class="item-title">${product.name}</h3>
                  <div class="cat-inline-block">
                    <div class="cat-tag tag--${product.tag}">
                      <ion-icon name="leaf-outline" class="cat-icon"></ion-icon>
                    </div>
                  </div>
                </div>
                <p class="menu-item-description">
                  ${product.desc}
                </p>
                <div class="add-item" data-id="${product.itemId}">
                    <div class="menu-item-price">&#8364; ${product.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to cart</button>
                    </div>
              </div>`;
      pizzaList.appendChild(newProduct);
    });
  }
};

const addSidesList = () => {
  sidesList.innerHTML = "";
  if (sidesMenu.length > 0) {
    sidesMenu.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("menu-card");
      newProduct.innerHTML = `
        <img src="${product.image}" alt="${
          product.name
        } image" class="menu-img">
        <div class="meal-content">
          <div class="item-header">
            <h3 class="item-title">${product.name}</h3>
            <div class="cat-inline-block">
              <div class="cat-tag tag--${product.tag}">
                <ion-icon name="leaf-outline" class="cat-icon"></ion-icon>
              </div>
            </div>
          </div>
          <p class="menu-item-description">
            ${product.desc}
          </p>
          <div class="add-item" data-id="${product.itemId}">
            <div class="menu-item-price">&#8364; ${product.price.toFixed(2)}</div>
            <button class="add-to-cart">Add to cart</button>
          </div>
        </div>`;
      sidesList.appendChild(newProduct);
    });
  }
};

const addDrinksList = () => {
  drinksList.innerHTML = "";
  if (drinksMenu.length > 0) {
    drinksMenu.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("menu-card");
      newProduct.innerHTML = `
              <img src="${product.image}" alt="${
        product.name
      } image" class="menu-img">
              <div class="meal-content">
                <div class="item-header">
                  <h3 class="item-title">${product.name}</h3>
                  <div class="cat-inline-block">
                    <div class="cat-tag tag--${product.tag}">
                      <ion-icon name="leaf-outline" class="cat-icon"></ion-icon>
                    </div>
                  </div>
                </div>
                <p class="menu-item-description">
                  ${product.desc}
                </p>
                <div class="add-item" data-id="${product.itemId}">
                    <div class="menu-item-price">&#8364; ${product.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to cart</button>
                    </div>
              </div>`;
      drinksList.appendChild(newProduct);
    });
  }
};

const addDesertList = () => {
  desertList.innerHTML = "";
  if (desertMenu.length > 0) {
    desertMenu.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("menu-card");
      newProduct.innerHTML = `
              <img src="${product.image}" alt="${
        product.name
      } image" class="menu-img">
              <div class="meal-content">
                <div class="item-header">
                  <h3 class="item-title">${product.name}</h3>
                  <div class="cat-inline-block">
                    <div class="cat-tag tag--${product.tag}">
                      <ion-icon name="leaf-outline" class="cat-icon"></ion-icon>
                    </div>
                  </div>
                </div>
                <p class="menu-item-description">
                  ${product.desc}
                </p>
                <div class="add-item" data-id="${product.itemId}">
                    <div class="menu-item-price">&#8364; ${product.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to cart</button>
                    </div>
              </div>`;
      desertList.appendChild(newProduct);
    });
  }
};

const addDataToHTML = () => {
  addPizzaList();
  addSidesList();
  addDrinksList();
  addDesertList();
};

pizzaList.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-to-cart")) {
    let product_id = positionClick.parentElement.dataset.id;
    console.log(product_id);
    addToCart(product_id);
  }
});

sidesList.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-to-cart")) {
    let product_id = positionClick.parentElement.dataset.id;
    console.log(product_id);
    addToCart(product_id);
  }
});

drinksList.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-to-cart")) {
    let product_id = positionClick.parentElement.dataset.id;
    console.log(product_id);
    addToCart(product_id);
  }
});

desertList.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-to-cart")) {
    let product_id = positionClick.parentElement.dataset.id;
    console.log(product_id);
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity =
      carts[positionThisProductInCart].quantity + 1;
  }
  console.log(carts);
  addCartToHTML();
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  let totalAmount = 0;

  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;

      // Find product across all menus
      let info =
        pizzaMenu.find((p) => p.itemId == cart.product_id) ||
        sidesMenu.find((p) => p.itemId == cart.product_id) ||
        drinksMenu.find((p) => p.itemId == cart.product_id) ||
        desertMenu.find((p) => p.itemId == cart.product_id);

      console.log(info);

      if (info) {
        totalAmount += info.price * cart.quantity;

        let newCart = document.createElement("div");
        newCart.classList.add("cart-item");
        newCart.dataset.id = cart.product_id;
        newCart.innerHTML = `
        <div class="item-name">${info.name}</div>
          <div class="item-info">
            <div class="item-quantity">
              <span class="minus">-</span>
              <span>${cart.quantity}</span>
              <span class="plus">+</span>
            </div>
        <div class="item-price">&#8364;${(info.price * cart.quantity).toFixed(
          2
        )}</div>
          </div>`;
        listCartHTML.appendChild(newCart);
      }
    });
  }

  // Update quantity and subtotal
  iconCartSpan.innerText = totalQuantity;
  const subtotalElement = document.querySelector(".subtotal .total-text");
  if (subtotalElement) {
    subtotalElement.innerText = `€${totalAmount.toFixed(2)}`;
  }
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id =
      positionClick.parentElement.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;

      default:
        let valueChange = (carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity - 1);
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
};

checkOut.addEventListener("click", () => {
  fetch("/submit_cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ carts: carts }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Cart submitted:", data);
      location.href = data.redirect_url;
    })
    .catch((error) => {
      console.error("Error submitting cart:", error);
    });
});

const initApp = () => {
  fetch("/static/products.json")
    .then((response) => response.json())
    .then((data) => {
      pizzaMenu = data.pizzaMenu;
      sidesMenu = data.sidesMenu;
      drinksMenu = data.drinksMenu;
      desertMenu = data.desertMenu;
      addDataToHTML();
    });
};
initApp();

const scrollBtnOffer = document.getElementById('scroll-offer') ; //offer button from hero

scrollBtnOffer.addEventListener('click' , (event) => {
  event.preventDefault();
  const target = document.getElementById('section-offers');
  target.scrollIntoView({behavior : 'smooth'});
});

const scroll_menu = document.getElementById('orderBtn'); //order button from hero

scroll_menu.addEventListener('click' ,(event)=>{
  event.preventDefault();
  const menu= document.getElementById('menu');
  menu.scrollIntoView({behavior: 'smooth'});
});

const scroll_menu_nav = document.getElementById('menu_nav'); //menu button navbar

scroll_menu_nav.addEventListener('click' ,(event)=>{
  event.preventDefault();
  const target= document.getElementById('menu');
  target.scrollIntoView({behavior: 'smooth'});
});


const aboutUs  = document.getElementById('Abt_us_nav'); //About us button navbar

aboutUs.addEventListener('click' ,(event)=>{
  event.preventDefault();
  const target = document.getElementById('about-us');
  target.scrollIntoView({behavior: 'smooth'});
});

const scrollOffer_nav = document.getElementById('scroll-offer-nav'); //offer button navbar
scrollOffer_nav.addEventListener('click' ,(event) => {
  event.preventDefault();
  const target = document.getElementById('section-offers');
  target.scrollIntoView({behavior : 'smooth'});
});