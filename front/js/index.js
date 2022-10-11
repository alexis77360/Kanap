//? Requête pour récupérer les produits
function getAllProducts(){

        return fetch("http://localhost:3000/api/products")    
        .then(res => { 
            if( !res.ok ){
                throw new Error(`HTTP ${res.status} - ${res.statusText}`);
            }
            return res.json();
        })
        
}

//? Fonction pour afficher les produits
function getProductHtml(prod){

    return `<a href="./product.html?id=${prod._id}">
        <article>
        <img src="${prod.imageUrl}"
        alt="${prod.altTxt}">
        <h3 class="productName">${prod.name}</h3>
        <p class="productDescription">${prod.description}</p>
        </article>
        </a>`;
        
}

let target = document.querySelector("#items");


getAllProducts().then(products => {

    let html ="";

/*    let html = 
    target.innerHTML = products.map(product =>getProductHtml(product)).join(""); */

    for (const product of products) {
        
        html += getProductHtml(product);
    }
    target.innerHTML = html;
}).catch(error => console.log(error));

