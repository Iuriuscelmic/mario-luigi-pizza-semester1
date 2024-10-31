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

iconCart.addEventListener("click", () => {
  cartTab.classList.add("showCart");
});

closeBtn.addEventListener("click", () => {
  cartTab.classList.remove("showCart");
});
