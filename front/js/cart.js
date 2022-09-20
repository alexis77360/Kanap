//! Fonction pour récupérer le panier
function getCart() {
    //? Opérateur de coalescence ( si null/undefined renvoie la 2eme valeur)
    return JSON.parse(localStorage.getItem("monPanier")) ?? [];
}

//! Fonction pour supprimer un article
function removeItem(e) {

  let cart = getCart();
  
  let article = e.target.closest("article");

  let newCart = cart.filter(cartItem => cartItem.idProduct !== article.dataset.id || cartItem.colorProduct !== article.dataset.color )

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
function showCart(items) {
    let qty = 0;
    let price = 0;

    console.log(items);
    
      for (const item of items) {
        
            fetch(`http://localhost:3000/api/products/${item.idProduct}`)
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
      
}
      let cart = getCart();

      if(cart.length){
        
        showCart(cart);
        cartSection.onchange= changeQuantity;

        let btns = document.getElementsByClassName('deleteItem');
        
        console.log(btns);
        for (let toto of btns) {
          
          console.log(toto);
          toto.onclick = removeItem;
          
          
        }




  } 

        
      
    else {
      //! Si le panier est vide alors afficher le message
        h1.innerHTML = `Votre panier est actuellement vide`;
        cartOrder.innerHTML = "0";
        cartPrice.innerHTML = "0";
    }
