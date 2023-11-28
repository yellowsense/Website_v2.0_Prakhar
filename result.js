// result.js

document.addEventListener('DOMContentLoaded', function () {
    const resultContainer = document.getElementById('result-container');

    // Fetch data from the API
    fetchDataFromAPI();
});

function fetchDataFromAPI() {
    const apiUrl = ''; // Replace with your actual API URL

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data.providers);
            displayResults(data.providers);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayResults(data) {
    const resultContainer = document.getElementById('result-container');

    data.forEach(provider => {
        const card = document.createElement('div');
        card.classList.add('card');

        const nameElement = document.createElement('h3');
        nameElement.textContent = provider.name;

        const locationElement = document.createElement('p');
        locationElement.textContent = `Location: ${provider.location}`;

        const ratingElement = document.createElement('p');
        ratingElement.textContent = `Rating: ${provider.rating}`;

        card.appendChild(nameElement);
        card.appendChild(locationElement);
        card.appendChild(ratingElement);

        resultContainer.appendChild(card);
    });
}
