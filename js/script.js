document.addEventListener('DOMContentLoaded', () => {
    // Ruta al archivo JSON
    const apiUrl = 'recommendations.json';

    // Elementos del DOM
    const searchInput = document.querySelector('#searchInput');
    const searchButton = document.querySelector('#searchButton');
    const resetButton = document.querySelector('#resetButton');
    const resultsContainer = document.querySelector('#results');

    // Función para realizar la búsqueda
    async function fetchDataAndSearch(keyword) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Convertir el keyword a minúsculas para una comparación insensible a mayúsculas
            const normalizedKeyword = keyword.toLowerCase();

            // Filtrar los resultados en función del keyword en todas las categorías
            let results = [];

            // Filtrar países
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (
                        city.name.toLowerCase().includes(normalizedKeyword) ||
                        city.description.toLowerCase().includes(normalizedKeyword)
                    ) {
                        results.push(city);
                    }
                });
            });

            // Filtrar templos
            data.temples.forEach(temple => {
                if (
                    temple.name.toLowerCase().includes(normalizedKeyword) ||
                    temple.description.toLowerCase().includes(normalizedKeyword)
                ) {
                    results.push(temple);
                }
            });

            // Filtrar playas
            data.beaches.forEach(beach => {
                if (
                    beach.name.toLowerCase().includes(normalizedKeyword) ||
                    beach.description.toLowerCase().includes(normalizedKeyword)
                ) {
                    results.push(beach);
                }
            });

            // Mostrar resultados
            displayResults(results);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    // Función para mostrar los resultados en la página
    function displayResults(results) {
        // Limpiar resultados anteriores
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        // Crear elementos para cada resultado
        results.forEach(item => {
            const resultCard = document.createElement('div');
            resultCard.classList.add('recommendation');
            resultCard.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            `;
            resultsContainer.appendChild(resultCard);
        });
    }

    // Evento al hacer clic en el botón de búsqueda
    searchButton.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            fetchDataAndSearch(keyword);
        } else {
            alert('Por favor, ingresa una palabra clave.');
        }
    });

    // Evento al hacer clic en el botón de reset
    resetButton.addEventListener('click', () => {
        resultsContainer.innerHTML = '';
        searchInput.value = '';
    });

    // Evento de limpieza adicional
    document.querySelector("#clear-button").addEventListener("click", () => {
        document.querySelector("#results").innerHTML = "";
        document.querySelector("#searchInput").value = "";
    });

    // Mostrar hora en una zona horaria específica
    const displayTime = (timeZone) => {
        const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date().toLocaleTimeString('en-US', options);
    };

    console.log("Time in New York:", displayTime("America/New_York"));
});
