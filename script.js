let allPokemonData = [];
let displayedPokemonCount = 0;
const maxPokemon = 15;

async function render() {
    for (let i = 1; i <= 9; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(i - 1) * 100}&limit=100`);
        let responseAsJson = await response.json();
        allPokemonData = allPokemonData.concat(responseAsJson.results);
    }

    renderCharacters();
}

async function renderCharacters() {
    let content = document.getElementById('content');

    let end = Math.min(displayedPokemonCount + maxPokemon, allPokemonData.length);
    for (let index = displayedPokemonCount; index < end; index++) {
        let pokemonUrl = allPokemonData[index].url;
        let pokemonDetails = await fetch(pokemonUrl);
        let pokemonDetailsJson = await pokemonDetails.json();

        content.innerHTML += renderHTML(pokemonDetailsJson, index);
    }

    displayedPokemonCount = end;

    if (displayedPokemonCount >= allPokemonData.length) {
        document.getElementById('loadMorePokemon').style.display = 'none';
    }

    let pokemonElements = document.querySelectorAll('.pokemon');
    pokemonElements.forEach((pokemon, index) => {
        pokemon.addEventListener('click', () => {
            openModal(pokemon.dataset.details, index);
        });
    });
}

function getPokemonTypesHtml(types) {
    let typesHtml = '';
    for (let type of types) {
        let typeName = type.type.name;
        let typeImgUrl = typeImages[typeName];
        if (typeImgUrl) {
            typesHtml += `<img src="${typeImgUrl}" alt="${typeName}" class="type-icon type-${typeName}" title="${typeName}">
            `;
        }
    }
    return typesHtml;
}

function loadMorePokemon() {
    renderCharacters();
}

function toggleDetails() {
    let detailsContent = document.getElementById('details-content');
    let statsContent = document.getElementById('stats-content');
    if (detailsContent.classList.contains('d-none')) {
        detailsContent.classList.remove('d-none');
        statsContent.classList.add('d-none');
    }
}

function toggleStats() {
    let detailsContent = document.getElementById('details-content');
    let statsContent = document.getElementById('stats-content');
    if (statsContent.classList.contains('d-none')) {
        statsContent.classList.remove('d-none');
        detailsContent.classList.add('d-none');
    }
}

function closeModal() {
    document.getElementById('pokemonModal').style.display = 'none';
}

function navigatePokemon(index) {
    if (index < 0) {
        index = allPokemonData.length - 1;
    } else if (index >= allPokemonData.length) {
        index = 0;
    }

    let pokemonUrl = allPokemonData[index].url;
    fetch(pokemonUrl)
        .then(response => response.json())
        .then(pokemonDetails => {
            openModal(JSON.stringify(pokemonDetails), index);
        });
}

async function searchPokemon() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let content = document.getElementById('content');
    content.innerHTML = '';

    if (input.length < 3) {

        if (input.length === 0) {
            displayedPokemonCount = 0;
            renderCharacters();
        }
        return;
    }

    for (let i = 0; i < allPokemonData.length; i++) {
        let pokemon = allPokemonData[i];
        if (pokemon.name.toLowerCase().startsWith(input)) {
            let pokemonDetails = await fetch(pokemon.url);
            let pokemonDetailsJson = await pokemonDetails.json();
            content.innerHTML += renderHTML(pokemonDetailsJson, i);
        }
    }

    let pokemonElements = document.querySelectorAll('.pokemon');
    for (let k = 0; k < pokemonElements.length; k++) {
        pokemonElements[k].addEventListener('click', function () {
            openModal(this.dataset.details, this.dataset.index);
        });
    }
}