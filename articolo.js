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
        return data;
    } catch (error) {
        console.log('Errore nel recupero dei dati:', error);
        return null;
    }
}

// tabella
async function populateTable() {
  const products = await fetchData();
  const table = document.getElementById('tabellaOggettiBackend');
  
  const headerRow = table.insertRow(0);
  const headers = ['Nome', 'Descrizione', 'Brand', 'Prezzo', 'Immagine'];
  
  headers.forEach(headerText => {
      const headerCell = document.createElement('th');
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
  });

  products.forEach(product => {
      const row = table.insertRow();
      const cellName = row.insertCell(0);
      const cellDescription = row.insertCell(1);
      const cellBrand = row.insertCell(2);
      const cellPrice = row.insertCell(3);
      const cellImage = row.insertCell(4);


      cellName.textContent = product.name;
      cellName.classList.add('alrticoloResultsTable');

      cellDescription.textContent = product.description;
      cellDescription.classList.add('alrticoloResultsTable');

      cellBrand.textContent = product.brand;
      cellBrand.classList.add('alrticoloResultsTable');

      cellPrice.textContent = `${product.price} €`;
      cellPrice.classList.add('alrticoloResultsTable');

      cellImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.name}" style="max-height: 50px;">`;
      cellImage.classList.add('alrticoloResultsTable');

  });
}

const form = document.getElementById('articolo-form');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const imageUrlInput = document.getElementById('imageUrl');
const priceInput = document.getElementById('price');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isFormValid = handleFormValidation();
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
            populateTable(); // Popola la tabella con l'oggetto appena creato
            window.location.href = 'index.html';
        } else {
            alert('Si è verificato un errore durante la creazione dell\'articolo.');
        }
    } catch (error) {
        console.log('Errore durante il salvataggio: ', error);
        alert('Si è verificato un errore durante il salvataggio.');
    }
});

// validazione form
function handleFormValidation() {
    const validation = inputForm();
    let isValid = true;

    if (!validation.isValid) {
        for (const field in validation.errors) {
            const errorElement = document.getElementById(`${field}-error`);
            errorElement.textContent = validation.errors[field];
        }
        isValid = false;
    }

    return isValid;
}

// controllo url
const isValidUrl = url => {
    const urlPattern = /^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
    return urlPattern.test(url);
};

// contorllo numero
const isValidNumber = value => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

// funzione controlli/errori form
function inputForm() {
    const errors = {};

    const name = nameInput.value;
    const description = descriptionInput.value;
    const brand = brandInput.value;
    const imageUrl = imageUrlInput.value;
    const price = priceInput.value;

    if (!name) errors.name = "Il campo nome è obbligatorio.";
    if (!description) errors.description = "Il campo description è obbligatorio.";
    if (!brand) errors.brand = "Il campo brand è obbligatorio.";
    if (!imageUrl) errors.imageUrl = "Il campo imageUrl è obbligatorio.";
    else if (!isValidUrl(imageUrl)) errors.imageUrl = "L'URL dell'immagine non è valido.";
    if (!price) errors.price = "Il campo price è obbligatorio.";
    else if (!isValidNumber(price)) errors.price = "Inserisci un numero valido.";

    return {
        isValid: Object.values(errors).every(value => value === ''),
        errors
    };
}

// funzione torna a index.html
function index() {
    window.location.href = 'index.html';
}

populateTable();
