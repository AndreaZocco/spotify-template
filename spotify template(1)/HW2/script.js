// Il codice JS sembra funzionare correttamente ma capita di doverlo caricare più di una volta affinchè gli elementi siano visualizzati correttamente, ne ignoro i motivi


// funzione per caricare i dati delle canzoni
async function loadSongs(query, sectionId) {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`);
        const data = await response.json();
        displaySongs(data.data, sectionId);
    } catch (error) {
        console.error('Errore:', error);
    }
}

function displaySongs(songs, sectionId) {
    const section = document.getElementById(sectionId);
    const container = section.querySelector('.imgLinks');
    container.innerHTML = '';

    // prendi solo le prime 8 canzoni, puramente per un impatto visivo
    const limitedSongs = songs.slice(0, 8); //
 

    limitedSongs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'col mb-4';
        songElement.innerHTML = `
            <div class="card h-100">
                <img src="${song.album.cover}" class="card-img-top" alt="${song.album.title}">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">${song.artist.name}</p>
                </div>
            </div>
        `;
        container.appendChild(songElement);
    });
    section.classList.remove('d-none');
}



// caricamento dati all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadSongs('eminem', 'eminem');
    loadSongs('metallica', 'metallica');
    loadSongs('queen', 'queen');

    // pulsante "crea lista"
    createListButtonAndModal();
});

// funzione per creare il pulsante "crea lista" e il modale
function createListButtonAndModal() {
    const mainPage = document.querySelector('.mainPage');
    const listButton = document.createElement('button');
    listButton.className = 'btn btn-primary';
    listButton.textContent = 'Crea lista';
    listButton.setAttribute('data-toggle', 'modal');
    listButton.setAttribute('data-target', '#albumListModal');

    const modalHTML = `
        <div class="modal fade" id="albumListModal" tabindex="-1" aria-labelledby="albumListModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="albumListModalLabel">Titoli degli Album</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="albumListContent">
                        
                    </div>
                </div>
            </div>
        </div>
    `;

    mainPage.prepend(listButton);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // evento click pulsante per il modale con i titoli degli album
    listButton.addEventListener('click', populateModalWithAlbumTitles);
}

// funzione per popolare il modale con i titoli degli album, inserite alcune modifiche per un aspetto visivo sul menu a tendina (separatori tra artisti)
function populateModalWithAlbumTitles() {
    // array degli id delle sezioni degli artisti
    const artistSections = ['eminemSection', 'queenSection', 'metallicaSection'];
    const modalBody = document.getElementById('albumListContent');
    modalBody.innerHTML = '';

    artistSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // separatore nella lista artisti per rendere il menu a tendina più leggibile (puramente visivo)
        
        const artistName = sectionId.replace('Section', ''); 
        const albums = section.querySelectorAll('.card-title');

        const artistTitleElement = document.createElement('h4');
        artistTitleElement.textContent = artistName.charAt(0).toUpperCase() + artistName.slice(1);
        modalBody.appendChild(artistTitleElement);

        // aggiunge ogni nome dell'album sotto il relativo artista nel menu a tendina
        albums.forEach(album => {
            const titleElement = document.createElement('p');
            titleElement.textContent = album.textContent;
            modalBody.appendChild(titleElement);
        });

        // separatore dopo gli album di ogni artista, se non è l'ultimo artista (puramente visivo)
        if (artistSections.indexOf(sectionId) < artistSections.length - 1) {
            const separator = document.createElement('hr');
            modalBody.appendChild(separator);
        }
    });
}