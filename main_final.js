const apartmentInput = document.getElementById("apartment");
const suggestionsContainer = document.getElementById("suggestions");
const resultContainer = document.getElementById('result-container');
const containerDiv = document.querySelector('.container');

apartmentInput.addEventListener("input", function () {
    const searchTerm = apartmentInput.value.toLowerCase();
    // Fetch suggestions from the API
    fetchSuggestions(searchTerm);
});

function fetchSuggestions(searchTerm) {
    const apiUrl = `https://yellowsensebackendapi.azurewebsites.net/society_names`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const suggestions = data; // Assuming the response is an array of apartment objects
            displaySuggestions(suggestions, searchTerm);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
}

function displaySuggestions(suggestions, searchTerm) {
    suggestionsContainer.innerHTML = "";
    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(searchTerm)
    );

    if (filteredSuggestions.length > 0) {
        suggestionsContainer.style.display = "block";
        filteredSuggestions.forEach((suggestion) => {
            const suggestionElement = document.createElement("div");
            suggestionElement.textContent = suggestion.name;
            suggestionElement.addEventListener("click", () => {
                apartmentInput.value = suggestion.name;
                suggestionsContainer.style.display = "none";
            });
            suggestionsContainer.appendChild(suggestionElement);
        });
    } else {
        suggestionsContainer.style.display = "none";
    }
}

document.addEventListener("click", (e) => {
    if (e.target !== apartmentInput) {
        suggestionsContainer.style.display = "none";
    }
});


const textCarousel = document.querySelector('.text-carousel');
const textArray = ["Book Maid", "Househelp Services"]; // Add your carousel text here
let currentIndex = 0;

function updateText() {
    textCarousel.textContent = textArray[currentIndex];
    currentIndex = (currentIndex + 1) % textArray.length;
}

setInterval(updateText, 3000); // Change text every 8 seconds
updateText(); // Initialize with the first text

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function displayResults(providers) {
    // Hide the form and other elements
    const form = document.getElementById('serviceForm');
    const containerDiv = document.querySelector('.container');
    const textCarousel = document.querySelector('.text-carousel');

    form.style.display = 'none';
    containerDiv.style.display = 'none';
    textCarousel.style.display = 'none';

    // Show the result container
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ""; // Clear previous results

    if (providers && providers.length > 0) {
        providers.forEach(provider => {
            const providerCard = document.createElement('div');
            providerCard.classList.add('provider-card');

            // Extracting properties from the provider object
            const name = provider.Name || 'N/A';
            const locations = provider.Locations || ['N/A'];
            const services = provider.Services || ['N/A'];
            const serviceType = services[0]; // Assuming the service type is the first item in the services array
            const timings = provider.Timings || 'N/A';

            providerCard.innerHTML = `
                <h3>${name}</h3>
                <p>Locations: ${locations.join(', ')}</p>
                <p>Services: ${services.join(', ')}</p>
                <p>Timings: ${timings}</p>
                <button class="book-now-button">Book Now</button>
            `;

            const bookNowButton = providerCard.querySelector('.book-now-button');
            bookNowButton.dataset.serviceType = serviceType;
            bookNowButton.addEventListener('click', () => {
                // Print maid details to the console
                // console.log('Booking details for Maid:', provider);
                console.log('Booking details for Maid:', provider);
                // Open the booking modal
                // openBookingModal(provider.Name);

                openBookingModal(provider.Name, serviceType);
            });

            resultContainer.appendChild(providerCard);
        });
    } else {
        // Display a specific message for no matching service providers
        const noProvidersCard = document.createElement('div');
        noProvidersCard.classList.add('provider-card');
        noProvidersCard.innerHTML = '<p>Sorry, no maids available</p>';
        resultContainer.appendChild(noProvidersCard);
    }

    // Show the result container
    resultContainer.style.display = 'block';
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getProviders(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = document.getElementById('serviceForm');
    const apartment = form.apartment.value;
    const serviceRadio = form.querySelector('input[name="services"]:checked');
    const service = serviceRadio ? serviceRadio.value : '';
    const date = form.date.value;
    const startTime = form.startTime.value;

    console.log('apartment:', apartment);
    console.log('Service:', service);
    console.log('Date:', date);
    console.log('Start Time:', startTime);

    const apiUrl = `https://yellowsensebackendapi.azurewebsites.net/get_matching_service_providers?Locations=${apartment}&Services=${service}&date=${date}&start_time=${startTime}`;

    console.log('API URL:', apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data.providers);
            displayResults(data.providers);


            const resultContainneer = document.getElementById('result-containneer');
            const resultContainer = document.getElementById('result-container');

            resultContainneer.style.marginTop = '8rem';// Adjust the value as needed
            resultContainneer.style.maxWidth = '100%';
            resultContainneer.style.display = 'flex';
            resultContainneer.style.alignItems = 'center';
            resultContainneer.style.justifyContent = 'center';


            resultContainer.style.maxWidth = '50%';


        })
        .catch(error => console.error('Error:', error));

}

// Attach the function to the form's submit event
const serviceForm = document.getElementById('serviceForm');
serviceForm.addEventListener('submit', getProviders);



// function openBookingModal(providerName) {
//     const modal = document.getElementById('bookingModal');
//     modal.style.display = 'block';

//     // Set provider's name in the modal
//     const providerNameInModal = document.getElementById('providerNameInModal');
//     providerNameInModal.textContent = providerName;

//     const bookingForm = document.getElementById('bookingForm');
//     const confirmationMessage = document.getElementById('confirmationMessage');

//     bookingForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         // Get values from the form
//         const userName = document.getElementById('userName').value;
//         const userPhoneNumber = document.getElementById('userPhoneNumber').value;
//         const userAddress = document.getElementById('userAddress').value;
//         const specialRequirements = document.getElementById('specialRequirements').value;

//         // Here, you can handle the form submission, send data to the server, etc.
//         // For demonstration purposes, just show the confirmation message with user details
//         confirmationMessage.innerHTML = `
//       <p>Maid booked successfully! Thank you, ${userName}!</p>
//       <p>Contact: ${userPhoneNumber}</p>
//       <p>Address: ${userAddress}</p>
//       <p>Special Requirements: ${specialRequirements}</p>
//     `;

//         bookingForm.style.display = 'none';
//         confirmationMessage.style.display = 'block';
//     });

//     // Close the modal when the user clicks outside the modal content
//     window.onclick = function (event) {
//         if (event.target === modal) {
//             modal.style.display = 'none';
//             bookingForm.style.display = 'block'; // Reset the form for the next use
//             confirmationMessage.style.display = 'none';
//         }
//     };
// }


function openBookingModal(providerName, serviceType) {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';

    // Set provider's name in the modal
    const providerNameInModal = document.getElementById('providerNameInModal');
    providerNameInModal.textContent = providerName;

    const bookingForm = document.getElementById('bookingForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get values from the form
        const userName = document.getElementById('userName').value;
        const userPhoneNumber = document.getElementById('userPhoneNumber').value;
        const userAddress = document.getElementById('userAddress').value;
        const specialRequirements = document.getElementById('specialRequirements').value;

        // Here, you can handle the form submission, send data to the server, etc.
        // For demonstration purposes, just show the confirmation message with user details
        confirmationMessage.innerHTML = `
            <p>${serviceType} booked successfully! Thank you, ${userName}!</p>
            <p>Contact: ${userPhoneNumber}</p>
            <p>Address: ${userAddress}</p>
            <p>Special Requirements: ${specialRequirements}</p>
        `;

        bookingForm.style.display = 'none';
        confirmationMessage.style.display = 'block';
    });

    // Close the modal when the user clicks outside the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            bookingForm.style.display = 'block'; // Reset the form for the next use
            confirmationMessage.style.display = 'none';
        }
    };

    // Customize the modal based on service type
    customizeModal(serviceType);
}

// Function to customize the modal based on service type
function customizeModal(serviceType) {
    const modalContent = document.querySelector('.modal-content');

    // Clear any existing customizations
    modalContent.innerHTML = '';

    // Customize modal content based on service type
    switch (serviceType) {
        case 'Maid':
            modalContent.innerHTML = `
                <p>Custom content for Maid service type.</p>
                <!-- Add more content specific to Maid if needed -->
            `;
            break;

        case 'Cook':
            modalContent.innerHTML = `
                <p>Custom content for Cook service type.</p>
                <!-- Add more content specific to Cook if needed -->
            `;
            break;

        case 'Nanny':
            modalContent.innerHTML = `
                <p>Custom content for Nanny service type.</p>
                <!-- Add more content specific to Nanny if needed -->
            `;
            break;

        default:
            // Default content if service type is not recognized
            modalContent.innerHTML = `
                <p>Custom content for unknown service type.</p>
            `;
            break;
    }
}



const items = document.querySelectorAll('.accordion button');

function toggleAccordion() {
    const itemToggle = this.getAttribute('aria-expanded');

    for (i = 0; i < items.length; i++) {
        items[i].setAttribute('aria-expanded', 'false');
    }

    if (itemToggle == 'false') {
        this.setAttribute('aria-expanded', 'true');
    }
}

items.forEach((item) => item.addEventListener('click', toggleAccordion));
