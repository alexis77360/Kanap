//! Fonction pour récupérer le panier
function getCart() {
  //? Opérateur de coalescence ( si null/undefined renvoie la 2eme valeur)
  return JSON.parse(localStorage.getItem("monPanier")) ?? [];
}

//! Requête d'un produit
function getProduct(id) {

  return fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }
      return res.json();
    })

}


//! Fonction pour supprimer un article
function removeItem(e) {

  let cart = getCart();
  let article = e.target.closest("article");
  let newCart = cart.filter(cartItem => cartItem.idProduct !== article.dataset.id || cartItem.colorProduct !== article.dataset.color)

  localStorage.setItem("monPanier", JSON.stringify(newCart));

  window.location.reload();


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
const totalPrice = document.getElementById("totalPrice");
const cartSection = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");


//! Retourne le HTML
function getCartItemHTML(product, item) {
  return `<article class="cart__item" data-id="${item.idProduct}" data-color="${item.colorProduct}">
  <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="${product.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${product.name}</h2>
      <p>${item.colorProduct}</p>
      <p>${product.price} €</p>
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
}


//! Fonction pour afficher le panier
async function showCart(items) {
  let qty = 0;
  let price = 0;

  for (const item of items) {

    await getProduct(item.idProduct)
      .then((prod) => {

        cartSection.innerHTML += getCartItemHTML(prod, item);
        //! Calcul du prix total
        price += prod.price * item.qtyProduct;
        document.getElementById("totalPrice").textContent = price;
      });

    //! Calcul de la quantité totale
    qty += parseInt(item.qtyProduct);
    document.getElementById("totalQuantity").textContent = qty;
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
  cartSection.innerHTML = "<h1> est actuellement vide </h1>";
  totalPrice.textContent = "0";
  totalQuantity.textContent = "0";
  
}

//? Debut REGEX 

//! Verif Regex FirstName
function testFirstName(firstName) {

  let regexOk = /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{3,}$/.test(firstName);

  if (!regexOk && firstName) {
    document.getElementById("firstNameErrorMsg").textContent = "Prénom invalide";

  }
  return regexOk;
}

//! Verif Regex Name
function testName(name) {

  let regexOk = /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{3,}$/.test(name);

  if (!regexOk && name) {
    document.getElementById("lastNameErrorMsg").textContent = "Nom invalide";

  }
  return regexOk;
}

//! Verif Regex adresse
function testlocation(adresse) {

  let regexOk = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(adresse);

  if (!regexOk && adresse) {
    document.getElementById("addressErrorMsg").textContent = "Adresse invalide";

  }
  return regexOk;
}

//! Verif Regex ville
function testcity(ville) {

  let regexOk = /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/.test(ville);

  if (!regexOk && ville) {
    document.getElementById("cityErrorMsg").textContent = "Ville invalide";

  }
  return regexOk;
}

//! Verif Regex email
function testemail(email) {

  let regexOk = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(email);

  if (!regexOk && email) {
    document.getElementById("emailErrorMsg").textContent = "Email invalide";

  }
  return regexOk;
}

//? Fin REGEX


//! Gestion du formulaire
//? Vérifier les informations du formulaire de contact
const order = () => {


  const orderBtn = document.getElementById("order");

  orderBtn.addEventListener("click", (e) => {
    //? Objet contact pour la requête POST

    let contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
    //? Test des champs du formulaire
    if (
      (testFirstName(contact.firstName)) &&
      (testName(contact.lastName) == true) &&
      (testcity(contact.city) == true) &&
      (testemail(contact.email) == true) &&
      (testlocation(contact.address) == true)
    ) {
      //? Si le formulaire ok, création du tableau "products" pour back
      e.preventDefault();
      let panier = getCart();
      let products = [];

      //? Push ID produit du local storage dans le tableau "products"
      for (let article of panier) {
        products.push(article.idProduct);

      }

      //! Retirer doublon du tableau
      products = [...new Set(products)];

      console.log(products);
      console.log(contact);
      alert("Commande effectuée !");


      //! Envoi par POST avec en param l'objet contact + tableau product

      //? Création de l'objet à envoyer
      const order = {
        contact,
        products: products,
      };


      //? Paramètres de la requête POST
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", //! Ne pas oublier pour node.js
        },
      };

      //? Requête avec contact et la liste des id produits. L'API renvoi l'id de commande
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          //?on redirige vers la page confirmation avec id de la commande
          document.location.href = "confirmation.html?id=" + data.orderId;
        })
        //? sinon on affiche l'erreur de la requête
        .catch((err) => {
          console.log("Erreur dans la requête : " + err.message);
        });

    } else {
      e.preventDefault();
      console.log("Veuillez remplir correctement le formulaire");
    }
  });
};

order();