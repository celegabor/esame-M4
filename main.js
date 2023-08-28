// array carrello
const cartItems = [];

// scritta ricerca index.html
let risultatiScritta = document.getElementById('risultati-scritta')

// funzione che va alla pag che crea articoli
function aggArticolo() {
    window.location.href = 'articolo.html' 
}

// funzione torna a index.html
function index() {
    window.location.href = 'index.html';
}

// funzione fetch
async function fetchData() {
    const endpoint = 'https://striveschool-api.herokuapp.com/api/product/';
  
    try {
      const response = await fetch(endpoint, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzOTY4ZjFmMTc1YzAwMTRjNTU4ZmQiLCJpYXQiOjE2OTI3MjE2NzgsImV4cCI6MTY5MzkzMTI3OH0.uNBUHkZq2AOSxddsAA8tL8SNCahQtzLc4j7iLUr5lq0"
        }
      });
  
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
  
      const data = await response.json();

      setTimeout( () => {
        document.querySelector('.spinner-container').classList.add('d-none')}, 300
      )
      return data;
    } catch (error) {
      console.log('Errore nel recupero dei dati:', error);
      return [];
    }  
}
  
// funzione che crea i prodotti
async function createProductCard(product) {
    const container = document.getElementById('container-prodotti');

    const card = document.createElement('div');
    card.classList.add('product-card');
    card.addEventListener('click', () => redirectToProductDetails(product._id)); 

    const id = document.createElement('p');
    id.textContent = product._id;
    id.classList.add('class-id-card')
    id.classList.add('d-none');
    card.appendChild(id);

    const name = document.createElement('h2');
    name.textContent = `${product.name}`;
    card.appendChild(name);

    const image = document.createElement('img');
    image.src = product.imageUrl;
    image.alt = product.name;
    card.appendChild(image);

    const price = document.createElement('p');
    price.textContent = `PREZZO: ${product.price} €`;
    card.appendChild(price);

    // bottone aggiungi carrello
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('button-cart')
    const cartIcon = document.createElement('i');
    cartIcon.classList.add('cart-custom', 'fa-solid', 'fa-cart-shopping');
    addToCartButton.appendChild(cartIcon);
    addToCartButton.addEventListener('click', (event) => {
        event.stopPropagation();
        addToCart(product);
    });
    card.appendChild(addToCartButton);

    // bottone togli carrello
    const removeCart = document.createElement('button');
    removeCart.classList.add('button-cart-remove');
    const cartIconRemove = document.createElement('i');
    cartIconRemove.classList.add('cart-custom-remove', 'fa-solid', 'fa-trash-can');
    removeCart.appendChild(cartIconRemove);

    removeCart.addEventListener('click', (event) => {
        event.stopPropagation(); 
        removeFromCart(product);
    });
    card.appendChild(removeCart);

    // bottone vai a modifica
    const modifica = document.createElement('button');
    modifica.classList.add('button-cart-modifica');
    const cartIconModifica = document.createElement('i');
    cartIconModifica.classList.add('cart-custom-modifica', 'fa-solid', 'fa-pen');
    modifica.appendChild(cartIconModifica);

    modifica.addEventListener('click', (event) => {
        event.stopPropagation(); 
        aggArticolo()
    });
    card.appendChild(modifica);

    container.appendChild(card);
}

// funzione che manda su pag dettagli
function redirectToProductDetails(productId) {
    const productDetailsUrl = `dettagli.html?id=${productId}`;
    window.location.href = productDetailsUrl;
}

// funzione per rimuovere card dal carrello
function removeFromCart(product) {
    const index = cartItems.findIndex(item => item.id === product.id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        updateCartView();
    }
    totalPrice();
}
 
// renderizza le card
async function renderProducts() {
const products = await fetchData();

    if (products.length === 0) {
        console.log('Nessun prodotto trovato.');
        return;
    }

    const container = document.getElementById('container-prodotti');
    container.innerHTML = '';

    products.forEach(product => {
        createProductCard(product);
    });
    risultatiScritta.classList.add('d-none')

}

// funzione push card
function addToCart(product) {
    cartItems.push(product);
    updateCartView();

    totalPrice();
}

// funzione che crea gli oggetti x carrello
function updateCartView() {
    const cartContainer = document.getElementById('carrelloAggiunte');
    cartContainer.innerHTML = '';

    cartItems.forEach(product => {
        const cartItemCard = document.createElement('div');
        cartItemCard.classList.add('cart-card');

        const image = document.createElement('img');
        image.src = product.imageUrl;
        image.alt = product.name;
        cartItemCard.appendChild(image);

        const name = document.createElement('h3');
        name.classList.add('name-cart')
        name.textContent = product.name;
        cartItemCard.appendChild(name);

        const price = document.createElement('p');
        price.classList.add('price-cart')
        price.textContent = `Prezzo: ${product.price} €`;
        cartItemCard.appendChild(price);


        const containerCartButtons = document.createElement('div')
        containerCartButtons.classList.add('containerCartButtons')
        
        // add
        const addFromCartButton = document.createElement('button');
        addFromCartButton.classList.add('button-cart')
        addFromCartButton.textContent = 'aggiungi un\'altro';
        addFromCartButton.addEventListener('click', () => addToCart(product));
        containerCartButtons.appendChild(addFromCartButton);
        
        // remove
        const removeFromCartButton = document.createElement('button');
        removeFromCartButton.classList.add('button-cart-remove')
        removeFromCartButton.textContent = 'Togli dal carrello';
        removeFromCartButton.addEventListener('click', () => removeFromCart(product));
        containerCartButtons.appendChild(removeFromCartButton);

        cartItemCard.appendChild(containerCartButtons)

        cartContainer.appendChild(cartItemCard);
    });

    const cartBadge = document.getElementById('cartBadge');
    cartBadge.textContent = cartItems.length.toString();
}

// funzione totale prezzo carrello
function totalPrice() {
    const prezzo = document.getElementById('totale-prezzo');
    let totalPrice = 0;

    cartItems.forEach(product => {
        totalPrice += product.price;
    });

    prezzo.innerHTML = `Totale: ${totalPrice.toFixed(2)} €`;
}

// funzione search
async function searchProducts(event) {
    event.preventDefault();

    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    setTimeout( () => {
        document.querySelector('.spinner-container').classList.remove('d-none')}, 300
      )

    const products = await fetchData(); 

    const searchResultContainer = document.getElementById('risultatiSearch');

    let svuotaMain = document.getElementById('container-prodotti')
    svuotaMain.innerHTML = ""

    risultatiScritta.classList.remove('d-none')

    const trovaProducts = products.filter(product => {
        const productName = product.name.toLowerCase();
        const productBrand = product.brand.toLowerCase();
        const productPrice = product.price.toString().toLowerCase();
        return productName.includes(searchInput) || productBrand.includes(searchInput) || productPrice.includes(searchInput);
    });

    

    setTimeout( () => {
        document.querySelector('.spinner-container').classList.add('d-none')}, 300
      )


      const lengthProduct = trovaProducts.length;

      if (lengthProduct > 0){
        trovaProducts.forEach(product => {
            createProductCard(product, searchResultContainer);
            document.getElementById('scrittaNienteProdottiTrovati').innerHTML = `La tua ricerca ha prodotto ${lengthProduct} risultati!!!`
        });
      } else {
        document.getElementById('scrittaNienteProdottiTrovati').innerHTML = 'Mi dispiace ma la tua ricerca non ha prodotto nessun risultato, controlla la ricerca o inserisci altre parole chiave!!!'
    }
}


totalPrice();
renderProducts();
updateCartView();