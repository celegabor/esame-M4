// array carrello
const cartItems = [];

// funzione che va alla pag che crea articoli
function aggArticolo() {
    window.location.href = 'articolo.html' 
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

    const image = document.createElement('img');
    image.src = product.imageUrl;
    image.alt = product.name;
    card.appendChild(image);

    const name = document.createElement('h2');
    name.textContent = product.name;
    card.appendChild(name);

    const description = document.createElement('p');
    description.textContent = product.description;
    card.appendChild(description);

    const price = document.createElement('p');
    price.textContent = `Prezzo: ${product.price} €`;
    card.appendChild(price);

    // bottone aggiungi carrello
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('button-cart')
    const cartIcon = document.createElement('i');
    cartIcon.classList.add('cart-custom', 'fa-solid', 'fa-cart-shopping');
    addToCartButton.appendChild(cartIcon);
    addToCartButton.addEventListener('click', () => addToCart(product));
    card.appendChild(addToCartButton);

    // bottone togli carrello
    const removeCart = document.createElement('button');
    removeCart.classList.add('button-cart-remove')
    const cartIconRemove = document.createElement('i');
    cartIconRemove.classList.add('cart-custom-remove', 'fa-solid', 'fa-trash-can');
    removeCart.appendChild(cartIconRemove);

    removeCart.addEventListener('click', () => removeFromCart(product));
    card.appendChild(removeCart);

    container.appendChild(card);
}

// funzione per rimuovere card dal carrello
function removeFromCart(product) {
    const index = cartItems.findIndex(item => item.id === product.id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        updateCartView();
    }
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
}
  

// funzione push card
function addToCart(product) {
    cartItems.push(product);
    updateCartView();
}

// funzione che cre gli oggetti x carrello
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

renderProducts();
updateCartView();
