const endpoint = 'https://striveschool-api.herokuapp.com/api/product/';
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzOTY4ZjFmMTc1YzAwMTRjNTU4ZmQiLCJpYXQiOjE2OTI3MjE2NzgsImV4cCI6MTY5MzkzMTI3OH0.uNBUHkZq2AOSxddsAA8tL8SNCahQtzLc4j7iLUr5lq0"; 

const form = document.getElementById('articolo-form');
const userIdInput = document.getElementById('user-id');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const imageUrlInput = document.getElementById('imageUrl');
const priceInput = document.getElementById('price');

async function fetchDati() {

  
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

        setTimeout( () => {
          document.querySelector('.spinner-container').classList.add('d-none')}, 300
        )
        return data;
    } catch (error) {
        console.log('Errore nel recupero dei dati:', error);
        return null;
    }
}

// tabella
async function populateTable() {
  const products = await fetchDati();
  document.getElementById('titoloPagArticoli').innerHTML = '----AGGIUNGI UN NUOVO ARTICOLO----'
  const table = document.getElementById('tabellaOggettiBackend');

  while (table.rows.length > 0) {
    table.deleteRow(0);
  }
  
  const headerRow = table.insertRow(0);
  const headers = ['-Nome', '-Descrizione', '-Brand', '-Prezzo', '-Immagine', '-Id', '-Modifica', '-Cancella'];
  
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
    const cellId = row.insertCell(5)
    const cellModifica = row.insertCell(6);
    const cellCancella = row.insertCell(7);

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

    cellId.textContent = `${product._id}`;
    cellId.classList.add('alrticoloResultsTable');
    cellId.classList.add('idCard')

    cellModifica.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: #00f900; font-size: 0.6em; cursor: pointer;"> modifica</i>`;
    cellModifica.classList.add('alrticoloResultsTable');

    cellCancella.innerHTML = `<i class="fa-solid fa-square-xmark" style="color: #ff2600;font-size: 0.6em; cursor: pointer;"> cancella</i>`;
    cellCancella.classList.add('alrticoloResultsTable');

    cellModifica.addEventListener('click', () => modifica(product._id));

    cellCancella.addEventListener('click', () => cancella(product._id));

    cellModifica.addEventListener('click', async (event) => {
      event.preventDefault();


      document.getElementById('titoloPagArticoli').innerHTML = '----MODIFICA I TUOI ARTICOLI----';

      
      document.querySelector('.spinner-container').classList.remove('d-none');
      

      await modifica(product._id);

      setTimeout( () => {
        document.querySelector('.spinner-container').classList.add('d-none')}, 300
      )
    });
  
    cellCancella.addEventListener('click', async (event) => {event.stopPropagation();
    

    document.getElementById('titoloPagArticoli').innerHTML = '----AGGIUNGI UN NUOVO ARTICOLo----';

    
        });
      });
}

// funzione cancella DELETE
async function cancella(productId) {
  const shouldDelete = confirm('Sei sicuro di voler cancellare questo prodotto?');
  if (!shouldDelete) {
    return;
  }

  const deleteEndpoint = `https://striveschool-api.herokuapp.com/api/product/${productId}`;

  try {
    const response = await fetch(deleteEndpoint, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Errore nella richiesta di cancellazione');
    }

    console.log('delete');

    // rica riscrivo la tabella
    populateTable();


    const successMessage = document.createElement('div');
    successMessage.textContent = 'L\'articolo è stato cancellato con successo!!! ...attendi...';
    successMessage.style.backgroundColor = 'green';
    successMessage.style.color = 'white';
    successMessage.style.width = '100%'
    successMessage.style.padding = '20px';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '5%';
    successMessage.style.border = '10px solid lightgreen'
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.transition = 'opacity 0.5s';

    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.remove();
      
      window.location.href = 'index.html'
    }, 2000);

    
  } catch (error) {
    console.log('Errore nella cancellazione del prodotto:', error);
  }
}

// funzione modifica che va a richiamare recuperadatiutente
async function modifica(userId) {
  history.pushState(null, null, `articolo.html?id=${userId}`);

  await recuperaDatiUtente();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// funzione per recuperare i dati x modifica tramite id nella query string
async function recuperaDatiUtente() {
  const datiDaQS = new URLSearchParams(window.location.search);
  const userId = datiDaQS.get('id')

  if (userId) {

    const userEndpoint = `${endpoint}${userId}`;
    
    try {
        const response = await fetch(userEndpoint, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Errore nella richiesta');
        }

        const user = await response.json();

        userIdInput.value = user._id;
        nameInput.value = user.name;
        descriptionInput.value = user.description;
        brandInput.value = user.brand;
        imageUrlInput.value = user.imageUrl;
        priceInput.value = user.price;

    } catch (error) {
        console.log('Errore nel recupero dei dati utente:', error);
    } 
    
  }else {
        console.log('nessun utente trovato');
  }
}

// POST/PUT
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


      if (userIdInput.value) {

        console.log('put');
        // Effettua una richiesta PUT per aggiornare l'articolo esistente
        const updateUserEndpoint = `${endpoint}${userIdInput.value}`;
        const updatedArticolo = {
            name: nameInput.value,
            description: descriptionInput.value,
            brand: brandInput.value,
            imageUrl: imageUrlInput.value,
            price: priceInput.value,
        };
    
        try {
            const response = await fetch(updateUserEndpoint, {
                method: 'PUT',
                body: JSON.stringify(updatedArticolo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Authorization": `Bearer ${accessToken}`
                }
            });
    
            if (response.ok) {
                populateTable(); // Aggiorna la tabella con i nuovi dati
                
                const successMessage = document.createElement('div');
                successMessage.textContent = 'L\'articolo è stato MODIFICATO con successo!!! ...attendi...';
                successMessage.style.backgroundColor = 'blue';
                successMessage.style.width = '100%'
                successMessage.style.color = 'white';
                successMessage.style.padding = '20px';
                successMessage.style.position = 'fixed';
                successMessage.style.top = '5%';
                successMessage.style.border = '4px solid lightgreen'
                successMessage.style.left = '50%';
                successMessage.style.transform = 'translate(-50%, -50%)';
                successMessage.style.transition = 'opacity 0.5s';
                
                document.body.appendChild(successMessage);
                
                setTimeout( () => {
                  window.location.href = 'index.html';}, 2000
                )
                 
            } else {
                alert('Si è verificato un errore durante l\'aggiornamento dell\'articolo.');
            }
        } catch (error) {
            console.log('Errore durante l\'aggiornamento: ', error);
            alert('Si è verificato un errore durante l\'aggiornamento.');
        }
    } else {

      console.log('post');

        // Codice per la creazione di un nuovo articolo
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

            setTimeout( () => {
              window.location.href = 'index.html';}, 2000
            )


            const successMessage = document.createElement('div');
            successMessage.textContent = 'L\'articolo è stato CREATO con successo!!! ...attendi...';
            successMessage.style.backgroundColor = 'green';
            successMessage.style.width = '100%'
            successMessage.style.color = 'white';
            successMessage.style.padding = '20px';
            successMessage.style.position = 'fixed';
            successMessage.style.top = '5%';
            successMessage.style.left = '50%';
            successMessage.style.border = '4px solid lightgreen'
            successMessage.style.transform = 'translate(-50%, -50%)';
            successMessage.style.transition = 'opacity 0.5s';

            document.body.appendChild(successMessage);


        } else {
            alert('Si è verificato un errore durante la creazione dell\'articolo.');
        }
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

// funzione che va alla pag che crea articoli
function aggArticolo() {
  window.location.href = 'articolo.html' 
}

populateTable();
