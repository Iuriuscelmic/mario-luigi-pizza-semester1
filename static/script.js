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



const form = document.querySelectorAll('form') //get all forms by class 
form.forEach(form => { //for each form do this
  form.addEventListener('submit',function(event) {  // create an event listener 
      event.preventDefault(); //prevent default, meaning dont redirect
      const pizzaType = this.dataset.pizza; //this = current context in which the code is running
      const formData = new FormData(this); //create neew form data object 
      formData.append('pizza' , pizzaType);

      fetch('/submit_order' , { //send data using fetch
          method:'POST',
          body:formData
      })
      .then(data=>{
          console.log('order submitted for' ,pizzaType, ':' , data); //data = information from the form 
          alert(pizzaType + ' added to the cart') ; //notify the user
      })
      .catch(error=> {
          console.error('error:', error);
      })

  })
})
function redirect()
{
location.href = '/confirm'
}