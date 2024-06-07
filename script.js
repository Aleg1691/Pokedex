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

// let allPokemonData = [];
// let displayedPokemonCount = 0;
// const maxPokemon = 15;

// async function render() {
//     for (let i = 1; i <= 9; i++) {
//         let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(i - 1) * 100}&limit=100`);
//         let responseAsJson = await response.json();
//         allPokemonData = allPokemonData.concat(responseAsJson.results);
//     }

//     renderCharacters();
// }

// async function renderCharacters() {
//     let content = document.getElementById('content');

//     let end = Math.min(displayedPokemonCount + maxPokemon, allPokemonData.length);
//     for (let index = displayedPokemonCount; index < end; index++) {
//         let pokemonUrl = allPokemonData[index].url;
//         let pokemonDetails = await fetch(pokemonUrl);
//         let pokemonDetailsJson = await pokemonDetails.json();

//         content.innerHTML += renderHTML(pokemonDetailsJson, index);
//     }

//     displayedPokemonCount = end;

//     if (displayedPokemonCount >= allPokemonData.length) {
//         document.getElementById('loadMorePokemon').style.display = 'none';
//     }

//     let pokemonElements = document.querySelectorAll('.pokemon');
//     pokemonElements.forEach((pokemon, index) => {
//         pokemon.addEventListener('click', () => {
//             openModal(pokemon.dataset.details, index);
//         });
//     });
// }

// function getPokemonTypesHtml(types) {
//     let typesHtml = '';
//     for (let type of types) {
//         let typeName = type.type.name;
//         let typeImgUrl = typeImages[typeName];
//         if (typeImgUrl) {
//             let typeClass = `type-icon type-${typeName}`;
//             typesHtml += `<img src="${typeImgUrl}" alt="${typeName}" class="${typeClass}" title="${typeName}">`;
//         }
//     }
//     return typesHtml;
// }

// function loadMorePokemon() {
//     renderCharacters();
// }

// function toggleDetails() {
//     let detailsContent = document.getElementById('details-content');
//     let statsContent = document.getElementById('stats-content');
//     if (detailsContent.classList.contains('d-none')) {
//         detailsContent.classList.remove('d-none');
//         statsContent.classList.add('d-none');
//     }
// }

// function toggleStats() {
//     let detailsContent = document.getElementById('details-content');
//     let statsContent = document.getElementById('stats-content');
//     if (statsContent.classList.contains('d-none')) {
//         statsContent.classList.remove('d-none');
//         detailsContent.classList.add('d-none');
//     }
// }

// function closeModal() {
//     document.getElementById('pokemonModal').style.display = 'none';
// }

// function navigatePokemon(index) {
//     if (index < 0) {
//         index = allPokemonData.length - 1;
//     } else if (index >= allPokemonData.length) {
//         index = 0;
//     }

//     let pokemonUrl = allPokemonData[index].url;
//     fetch(pokemonUrl)
//         .then(response => response.json())
//         .then(pokemonDetails => {
//             openModal(JSON.stringify(pokemonDetails), index);
//         });
// }

// async function searchPokemon() {
//     let input = document.getElementById('searchInput').value.toLowerCase();
//     let content = document.getElementById('content');
//     content.innerHTML = '';

//     if (input.length < 3) {
//         if (input.length === 0) {
//             displayedPokemonCount = 0;
//             renderCharacters();
//         }
//         return;
//     }

//     for (let i = 0; i < allPokemonData.length; i++) {
//         let pokemon = allPokemonData[i];
//         if (pokemon.name.toLowerCase().startsWith(input)) {
//             let pokemonDetails = await fetch(pokemon.url);
//             let pokemonDetailsJson = await pokemonDetails.json();
//             content.innerHTML += renderHTML(pokemonDetailsJson, i);
//         }
//     }

//     let pokemonElements = document.querySelectorAll('.pokemon');
//     for (let k = 0; k < pokemonElements.length; k++) {
//         pokemonElements[k].addEventListener('click', function () {
//             openModal(this.dataset.details, this.dataset.index);
//         });
//     }
// }

// const typeImages = {
//     "bug": "./icons/bug.png",
//     "dark": "./icons/dark.png",
//     "dragon": "./icons/dragon.png",
//     "electric": "./icons/electric.png",
//     "fairy": "./icons/fairy.png",
//     "fighting": "./icons/fighting.png",
//     "fire": "./icons/fire.png",
//     "flying": "./icons/flying.png",
//     "ghost": "./icons/ghost.png",
//     "grass": "./icons/grass.png",
//     "ground": "./icons/ground.png",
//     "ice": "./icons/ice.png",
//     "normal": "./icons/normal.png",
//     "poison": "./icons/poison.png",
//     "psychic": "./icons/psychic.png",
//     "rock": "./icons/rock.png",
//     "steel": "./icons/steel.png",
//     "water": "./icons/water.png",
// };

// function openModal(pokemonDetailsJson, index) {
//     let pokemonDetails = JSON.parse(pokemonDetailsJson);
//     let modal = document.getElementById('pokemonModal');
//     let modalContent = document.getElementById('pokemonDetails');
//     let abilities = '';
//     for (let i = 0; i < pokemonDetails.abilities.length; i++) {
//         abilities += pokemonDetails.abilities[i].ability.name;
//         if (i < pokemonDetails.abilities.length - 1) {
//             abilities += ', ';
//         }
//     }
//     let stats = '';
//     for (let j = 0; j < pokemonDetails.stats.length; j++) {
//         stats += '<p><strong>' + pokemonDetails.stats[j].stat.name.replace('-', ' ') + ':</strong> ' + pokemonDetails.stats[j].base_stat + '</p>';
//     }
//     modalContent.innerHTML = `
//         <div class="modalInnen">
//             <h2>${pokemonDetails.name}</h2>
//             <img src="${pokemonDetails.sprites.other['official-artwork'].front_default}" width="150" height="150">
//             <div class="types">${getPokemonTypesHtml(pokemonDetails.types)}</div>
//             <div class="details-section">
//                 <div class="stats">
//                     <h3 class="details-heading" onclick="toggleDetails()">Main</h3>
//                     <h3 class="details-heading" onclick="toggleStats()">Stats</h3>
//                 </div>
//                 <div id="details-content" class="details-content">
//                     <p><strong>Height:</strong> ${(pokemonDetails.height / 10).toFixed(1)} m</p>
//                     <p><strong>Weight:</strong> ${(pokemonDetails.weight / 10).toFixed(1)} kg</p>
//                     <p><strong>Base Experience:</strong> ${pokemonDetails.base_experience}</p>
//                     <p><strong>Abilities:</strong> ${abilities}</p>
//                 </div>
//                 <div id="stats-content" class="details-content d-none">
//                     ${stats}
//                 </div>
//             </div>
//         </div>
//         <div>    
//             <img onclick="navigatePokemon(${index - 1})" class="arrow" src="./img/arrows-left.png" alt="Arrow Left" width="50" height="50">
//             <img onclick="navigatePokemon(${index + 1})" class="arrow" src="./img/arrows-right.png" alt="Arrow Right" width="50" height="50">
//         </div>    
//     `;

//     modal.style.display = 'block';
// }

// function renderHTML(pokemonDetails, index) {
//     let typesHtml = getPokemonTypesHtml(pokemonDetails.types);
//     let htmlString = `
//         <div class="pokemon" data-details='${JSON.stringify(pokemonDetails)}' data-index='${index}'>
//             <div class="pokemonInnen">
//                 <h2>${index + 1}. ${pokemonDetails.name}</h2>
//                 <img class="pokemonImg" src="${pokemonDetails.sprites.other['official-artwork'].front_default}" alt="${pokemonDetails.name}">
//             </div>
//             <div class="typesMain">
//                 <div class="types">${typesHtml}</div>
//             </div>    
//         </div>
//     `;
//     return htmlString;
// }
