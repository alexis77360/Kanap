//! Fonction pour récupérer le panier
function getCart() {
  //? Opérateur de coalescence ( si null/undefined renvoie la 2eme valeur)
  return JSON.parse(localStorage.getItem("monPanier")) ?? [];
}

//! Fonction pour supprimer un article
function removeItem(e) {

  let cart = getCart();
  let article = e.target.closest("article");
  let newCart = cart.filter(cartItem => cartItem.idProduct !== article.dataset.id || cartItem.colorProduct !== article.dataset.color)

  localStorage.setItem("monPanier", JSON.stringify(newCart));

  window.location.reload()


}

//! Fonction pour changer la quantité d'un article
function changeQuantity(e) {

  let input = e.target;
  let article = input.closest("article");
  let cart = getCart();

  const found = cart.find(cartItem => cartItem.idProduct === article.dataset.id && cartItem.colorProduct === article.dataset.color);
  found.qtyProduct = parseInt(input.value);

  localStorage.setItem("monPanier", JSON.stringify(cart));

  window.location.reload()

}


//! Sélection HTML du cart
const cartPrice = document.getElementsByClassName("cart__price");
const cartSection = document.getElementById("cart__items");
const cartOrder = document.getElementsByClassName("cart__order");
const h1 = document.getElementsByTagName("h1");


//! Fonction pour afficher le panier
async function showCart(items) {
  let qty = 0;
  let price = 0;

  for (const item of items) {

    await fetch(`http://localhost:3000/api/products/${item.idProduct}`)
      .then((response) => response.json())
      .then((data) => {

        cartSection.innerHTML += `<article class="cart__item" data-id="${item.idProduct}" data-color="${item.colorProduct}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${item.colorProduct}</p>
                    <p>${data.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qtyProduct}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
        //! Calcul du prix total
        price += data.price * item.qtyProduct;
        document.getElementById("totalPrice").innerHTML = price;
      });

    //! Calcul de la quantité totale
    qty += parseInt(item.qtyProduct);
    document.getElementById("totalQuantity").innerHTML = qty;
  }
  return true;
}
let cart = getCart();

if (cart.length) {

  showCart(cart)
    .then(() => {
      cartSection.onchange = changeQuantity;

      let btns = document.getElementsByClassName('deleteItem');

      for (let btn of btns) {

        btn.onclick = removeItem;
      }
    })
} else {
  //! Si le panier est vide alors afficher le message
  h1.innerHTML = `Votre panier est actuellement vide`;
  cartOrder.innerHTML = "0";
  cartPrice.innerHTML = "0";
}




//! Gestion du formulaire



//? Vérifier les informations du formulaire de contact
const order = () => {

  const regexName = /([a-zA-Z]{3,30}\s*)+/;
  const regexLocation = /([a-zA-Z]{3,30}\s*)+/
  const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
 

  const orderBtn = document.getElementById("order");

  orderBtn.addEventListener("click", (e) => {
    //?Objet contact pour la requête POST
    
    let contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
    //? Test des champs du formulaire
    if (
      (regexName.test(contact.firstName) == true) &&
      (regexName.test(contact.lastName) == true) &&
      (regexLocation.test(contact.city) == true) &&
      (regexEmail.test(contact.email) == true) &&
      (regexLocation.test(contact.address) == true)
    ) {
      //? Si le formulaire ok, création du tableau "products" pour back
      e.preventDefault();
      let panier = getCart();
      let products = [];

      //? Push ID produit du local storage dans le tableau "products"
      for (let article of panier) {
        products.push(article.idProduct);
      }
      console.log(products);
      console.log(contact);
      alert("Commande effectuée !");

      //! Appeler la fonction POST avec en param l'objet contact + tableau products
      /*  maméthodepourPOST(contact, products);*/ 
    } else {
      
      alert("Tous les champs doivent être remplis");
    }
  });
};



/*   //? Envoyer le formulaire de contact + tableau products au back avec POST
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contact, products }),
  }); */

  order();