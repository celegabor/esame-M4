const endpoint = 'https://striveschool-api.herokuapp.com/api/product/';
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzOTY4ZjFmMTc1YzAwMTRjNTU4ZmQiLCJpYXQiOjE2OTI3MjE2NzgsImV4cCI6MTY5MzkzMTI3OH0.uNBUHkZq2AOSxddsAA8tL8SNCahQtzLc4j7iLUr5lq0";

// Recupera l'ID del prodotto dall'URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');

async function fetchProductDetails(productId) {
    const endpoint = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
  
    try {
        const response = await fetch(endpoint, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        });

        if (!response.ok) {
            throw new Error('Errore nella richiesta');
        }

        const product = await response.json();
        return product;
    } catch (error) {
        console.log('Errore nel recupero dei dati:', error);
        return null;
    }
}

async function renderProductDetails(productId) {
    const product = await fetchProductDetails(productId);
    
    if (product) {
        console.log(product);
        document.getElementById('product-name').textContent = `${product.name}`;
        document.getElementById('product-description').textContent = `DESCRIPTION: ${product.description}`;
        document.getElementById('product-brand').textContent = `BRAND: ${product.brand}`;
        document.getElementById('product-id').textContent = `ID card: ${product._id}`;
        document.getElementById('product-UrlImg').textContent = `Url Image: ${product.imageUrl}`;
        document.getElementById('product-userId').textContent = `UserId: ${product.userId}`;
        document.getElementById('product-price').textContent = `PREZZO: ${product.price} €`;
        document.getElementById('product-image').src = product.imageUrl;
    } else {
        alert('Errore nel recupero dei dettagli del prodotto.');
    }
}

//controllo per visualizzare il prodotto
if (productId) {
    renderProductDetails(productId);
} else {
    alert('ID del prodotto non trovato nella URL.');
}

// funzione torna a index.html
function index() {
    window.location.href = 'index.html';
}
