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

let iconCart = document.querySelector(".nav-icon");
let cartTab = document.querySelector(".cart-tab");
let closeBtn = document.querySelector(".close-window");
let pizzaList = document.getElementById("pizza-list");
let sidesList = document.getElementById("sides-list");
let drinksList = document.getElementById("drinks-list");
let desertList = document.getElementById("desert-list");

let pizzaMenu = [];
let sidesMenu = [];
let drinksMenu = [];
let desertMenu = [];

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
              <img src="${product.image}" alt="${product.name} image" class="menu-img">
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
                <div class="add-item">
                  <form class="form" method="POST" data-pizza="${product.name}">
                    <div class="menu-item-price">&#8364; ${product.price}</div>
                    <button class="add-to-cart">Add to cart</button>
                  </form>
                </div>
              </div>
              `;
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
              <img src="${product.image}" alt="${product.name} image" class="menu-img">
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
                <div class="add-item">
                  <form class="form" method="POST" data-pizza="${product.name}">
                    <div class="menu-item-price">&#8364; ${product.price}</div>
                    <button class="add-to-cart">Add to cart</button>
                  </form>
                </div>
              </div>
              `;
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
              <img src="${product.image}" alt="${product.name} image" class="menu-img">
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
                <div class="add-item">
                  <form class="form" method="POST" data-pizza="${product.name}">
                    <div class="menu-item-price">&#8364; ${product.price}</div>
                    <button class="add-to-cart">Add to cart</button>
                  </form>
                </div>
              </div>
              `;
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
              <img src="${product.image}" alt="${product.name} image" class="menu-img">
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
                <div class="add-item">
                  <form class="form" method="POST" data-pizza="${product.name}">
                    <div class="menu-item-price">&#8364; ${product.price}</div>
                    <button class="add-to-cart">Add to cart</button>
                  </form>
                </div>
              </div>
              `;
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

const initApp = () => {
  fetch("/static/products.json")
    .then((response) => response.json())
    .then((data) => {
      pizzaMenu = data.pizzaMenu;
      sidesMenu = data.sidesMenu;
      drinksMenu = data.drinksMenu;
      desertMenu = data.desertMenu;
      console.log(pizzaMenu);
      console.log(sidesMenu);
      console.log(drinksMenu);
      console.log(desertMenu);
      addDataToHTML();
    });
};
initApp();

const form = document.querySelectorAll("form"); //get all forms by class
form.forEach((form) => {
  //for each form do this
  form.addEventListener("submit", function (event) {
    // create an event listener
    event.preventDefault(); //prevent default, meaning dont redirect
    const pizzaType = this.dataset.pizza; //this = current context in which the code is running
    const formData = new FormData(this); //create neew form data object
    formData.append("pizza", pizzaType);

    fetch("/submit_order", {
      //send data using fetch
      method: "POST",
      body: formData,
    })
      .then((data) => {
        console.log("order submitted for", pizzaType, ":", data); //data = information from the form
        alert(pizzaType + " added to the cart"); //notify the user
      })
      .catch((error) => {
        console.error("error:", error);
      });
  });
});
function redirect() {
  location.href = "/confirm";
}
