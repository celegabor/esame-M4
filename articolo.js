
const endpoint = 'https://striveschool-api.herokuapp.com/api/product/';
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzOTY4ZjFmMTc1YzAwMTRjNTU4ZmQiLCJpYXQiOjE2OTI3MjE2NzgsImV4cCI6MTY5MzkzMTI3OH0.uNBUHkZq2AOSxddsAA8tL8SNCahQtzLc4j7iLUr5lq0"; 


async function fetchData() {
    try {
        const response = await fetch(endpoint, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Errore nella richiesta');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Errore nel recupero dei dati:', error);
        return null;
    }
}

const form = document.getElementById('articolo-form');

const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const imageUrlInput = document.getElementById('imageUrl');
const priceInput = document.getElementById('price');


// creazione oggetto con metodo POST
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isFormValid = handelFormValidation();
    if (!isFormValid) return false;

    const articolo = {
        name: nameInput.value,
        description: descriptionInput.value,
        brand: brandInput.value,
        imageUrl: imageUrlInput.value,
        price: priceInput.value,
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(articolo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            alert('Si è verificato un errore durante la creazione dell\'articolo.');
        }
    } catch (error) {
        console.log('Errore durante il salvataggio: ', error);
        alert('Si è verificato un errore durante il salvataggio.');
    }
});

// controllo del form che sia valido
function handelFormValidation() {
  
  const validation = inputForm()
  let isValid = true;

  if (!validation.isValid) {

    for (const field in validation.errors) {
      const errorElement = document.getElementById(`${field}-error`)
      errorElement.textContent = '';
      errorElement.textContent = validation.errors[field]
    }

    isValid = false
    
  }

  return isValid

}

// validazione indirizzo http per url image
const isValidUrl = url => {
  const urlPattern = /^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  return urlPattern.test(url);
};

// validazione numeri
const isValidNumber = value => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// crea il form
function inputForm() {
  const errors = {}

  const name = document.getElementById('name').value
  const description = document.getElementById('description').value
  const brand = document.getElementById('brand').value
  const imageUrl = document.getElementById('imageUrl').value
  const price = document.getElementById('price').value

  // verifica nome
  if (!name) errors.name = "Il campo nome è obbligatorio."
  else errors.name = "";

  // veriifica descrizione
  if (!description) errors.description = "Il campo description è obbligatorio." 
  else errors.description = "";

  // verifica brand
  if (!brand) errors.brand = "Il campo brand è obbligatorio."
  else errors.brand = "";

  // verifica img con restrizione
  if (!imageUrl) {
    errors.imageUrl = "Il campo imageUrl è obbligatorio.";
  } else if (!isValidUrl(imageUrl)) {
    errors.imageUrl = "L'URL dell'immagine non è valido.";
  } else {
    errors.imageUrl = "";
  }

  // verifica prezzo con restrizione
  if (!price) errors.price = "Il campo price è obbligatorio.";
  else if (!isValidNumber(price)) {
    errors.price = "Inserisci un numero valido.";
  } else {
    errors.price = "";
  }


  return {
    isValid: Object.values(errors).every(value => value === ''),
    errors
  }
  
}

// ritorna a index.html
function index() {
  window.location.href = 'index.html' 
 }