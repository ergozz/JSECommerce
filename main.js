const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

const baseUrl = "https://api.escuelajs.co/api/v1";

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    .then((res) => res.json())
    .then((data) => {
      renderCategories(data.slice(1, 5));
    })
    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-card");
    categoryDiv.innerHTML = `
    <img src=${category.image} />
    <p>${category.name}</p>
    `;
    categoryList.appendChild(categoryDiv);
  });
}
async function fetchProducts() {
  try {
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 25));
  } catch (err) {
    console.log(err);
  }
}
function renderProducts(products) {
  const productsHTML = products
    .map(
      (product) => `
          <div class="card">
            <img src=${product.images[0]} />
            <h4>${product.title}</h4>
            <h4>${product.category.name ? product.category.name : "Diğer"}</h4>
            <div class="action">
              <span>${product.price} &#8378;</span>
              <button onclick="addToBasket({id:${product.id},title:'${
        product.title
      }',price:${product.price},img:'${
        product.images[0]
      }',amount:1})">Sepete Ekle</button>
            </div>
          </div>
   `
    )
    .join(" ");
  productsArea.innerHTML += productsHTML;
}
let basket = [];
let total = 0;

basketBtn.addEventListener("click", () => {
  modal.classList.add("active");
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});
function addToBasket(product) {
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    found.amount++;
  } else {
    basket.push(product);
  }
}
function renderBasket() {
  const cardsHTML = basket
    .map(
      (product) => `
     <div class="item">
            <img src=${product.img} />
            <h3 class="title">${product.title}</h3>
            <h4 class="price">${product.price} &#8378;</h4>
            <p>Miktar: ${product.amount}</p>
            <img onclick="deleteItem(${product.id})" id="delete" src="/images/e-trash.png" />
      </div>
  `
    )
    .join(" ");

  basketList.innerHTML = cardsHTML;

  calculateTotal();
}

function calculateTotal() {
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  const amount = basket.reduce((sum, i) => sum + i.amount, 0);

  totalSpan.innerText = sum;

  totalCount.innerText = amount + " " + "Ürün";
}

function deleteItem(deleteid) {
  basket = basket.filter((i) => i.id !== deleteid);

  renderBasket();
}
