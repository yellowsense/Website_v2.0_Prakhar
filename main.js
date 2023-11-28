
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
const textArray = ["Book a Maid","Book a Cook","Book a Nanny","AI Based Househelp Services"]; // Add your carousel text here
let currentIndex = 0;

function updateText() {
    textCarousel.textContent = textArray[currentIndex];
    currentIndex = (currentIndex + 1) % textArray.length;
}

setInterval(updateText, 3550); // Change text every 8 seconds
updateText(); // Initialize with the first text

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function displayResults(providers) {
    // Hide the form and other elements
    const form = document.getElementById('serviceForm');
    const containerDiv = document.querySelector('.container');
    const textCarousel = document.querySelector('.text-carousel');
    const marquee = document.querySelector('.marquee'); // Add this line
    const about = document.querySelector('.about'); // Add this line
    const registered = document.querySelector('.registered'); // Add this line

    form.style.display = 'none';
    containerDiv.style.display = 'none';
    textCarousel.style.display = 'none';
    marquee.style.display = 'none'; // Add this line
    about.style.display = 'none'; // Add this line
    registered.style.display = 'none'; // Add this line

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
            // const serviceType = services[0]; // Assuming the service type is the first item in the services array
            const timings = provider.Timings || 'N/A';

            providerCard.innerHTML = `
                <h3>${name}</h3>
                <p>Locations: ${locations.join(', ')}</p>
                <p>Services: ${services.join(', ')}</p>
                <p>Timings: ${timings}</p>
                <button class="book-now-button">Book Now</button>
            `;

            const bookNowButton = providerCard.querySelector('.book-now-button');
            
            const serviceType = selectedProviderDetails.service;
            // bookNowButton.dataset.serviceType = serviceType;
            bookNowButton.dataset.providerName = provider.Name; // Store provider name

            bookNowButton.addEventListener('click', () => {
                
                selectedProviderDetails = {
                    providerName: provider.Name,
                    apartment: document.getElementById('apartment').value,
                    service: services,
                    date: date,
                    startTime: startTime
                };
                
                // console.log('Booking details for Maid:', provider);
                
                
                openBookingModal(provider.Name, serviceType, selectedProviderDetails);
            });

            resultContainer.appendChild(providerCard);
        });
    } else {
        alert("No data available");
        
    }

    // Show the result container
    resultContainer.style.display = 'block';
    
}


let selectedProviderDetails;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getProviders(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = document.getElementById('serviceForm');
    const apartment = form.apartment.value;
    const serviceRadio = form.querySelector('input[name="services"]:checked');
    const service = serviceRadio ? serviceRadio.value : '';
    const date = form.date.value;
    const startTime = form.startTime.value;
    const currentDate = new Date();
    const selectedDate = new Date(document.getElementById('date').value + ' ' + document.getElementById('startTime').value);

    if (selectedDate < currentDate) {
        alert("Please select a date and time equal to or later than the current date and time.");
        return false;
    }
    

    // console.log('apartment:', apartment);
    // console.log('Service:', service);
    // console.log('Date:', date);
    // console.log('Start Time:', startTime);

    const apiUrl = `https://yellowsensebackendapi.azurewebsites.net/get_matching_service_providers?Locations=${apartment}&Services=${service}&date=${date}&start_time=${startTime}`;

    // console.log('API URL:', apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Fetched Data:', data.providers);

            if (data.providers && data.providers.length > 0) {
                const providerName = data.providers[0].Name || 'N/A';

                selectedProviderDetails = {
                    providerName: providerName,
                    apartment: apartment,
                    service: service,
                    date: date,
                    startTime: startTime
                };
                displayResults(data.providers);

                const resultContainneer = document.getElementById('result-containneer');
                const resultContainer = document.getElementById('result-container');

                resultContainneer.style.marginTop = '8rem'; // Adjust the value as needed
                resultContainneer.style.maxWidth = '100%';
                resultContainneer.style.display = 'flex';
                resultContainneer.style.alignItems = 'center';
                resultContainneer.style.justifyContent = 'center';

                resultContainer.style.maxWidth = '50%';
            } else {
                // Show an alert or modal with a sorry message
                alert('Sorry, no providers available for the selected slot.');
                // console.log('No providers available:', data);
            }
        })
        .catch(error => {
            // console.error('Error:', error);
            // // Handle the error (e.g., show a message to the user)
            alert('Sorry, no providers available. Try selecting another slot! ');
            
            window.location.href = 'https://www.yellowsense.in';
           
            // console.log('No providers available:', data);
        });
}


// Attach the function to the form's submit event
const serviceForm = document.getElementById('serviceForm');
serviceForm.addEventListener('submit', getProviders);





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
         const userEmail = document.getElementById('userEmail').value;
        const userPhoneNumber = document.getElementById('userPhoneNumber').value;
        const userAddress = document.getElementById('userAddress').value;
        const foodPreferences = document.getElementById('food').value; // Added for food preferences
        const specialRequirements = document.getElementById('specialRequirements').value;

        // Display confirmation message
        confirmationMessage.innerHTML = `
            <p>${serviceType} booked successfully! Thank you, ${userName}!</p>
            <p>Contact: ${userPhoneNumber}</p>
            <p>Address: ${userAddress}</p>
            <p>Food Preferences: ${foodPreferences}</p>
            <p>Special Requirements: ${specialRequirements}</p>
        `;

        // Log details to the console
        console.log('Booking details:', {
            ProviderName: providerName,
            ServiceType: serviceType,
            UserName: userName,
            UserPhoneNumber: userPhoneNumber,
            UserAddress: userAddress,
            FoodPreferences: foodPreferences,
            SpecialRequirements: specialRequirements
        });
        
     sendConfirmationEmail({
        to: '', // Use the user's email entered in the form
        subject: 'Booking Confirmation',
        body: `Thank you for booking ${serviceType} with us! Details: ${JSON.stringify({
            ProviderName: userName,
            ServiceType: serviceType,
            UserName: userName,
            UserPhoneNumber: userPhoneNumber,
            UserAddress: userAddress,
            SpecialRequirements: specialRequirements
        })}`
    });

        // Hide the form and show the confirmation message
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




function customizeModal(serviceType) {
    const modalContent = document.querySelector('.modal-content');

    // Clear any existing customizations
    modalContent.innerHTML = '';

    // Customize modal content based on service type
    switch (serviceType) {
        case 'Maid':
            modalContent.innerHTML = `
                <p>Custom content for Maid service type.</p>
                <label for="userName">Name:</label>
                <input type="text" id="userName" name="userName" required>
                <label for="userPhoneNumber">Phone Number:</label>
                <input type="tel" id="userPhoneNumber" name="userPhoneNumber" pattern="[0-9]{10}" required>
                <label for="userEmail">Email Address:</label>
                <input type="email" id="userEmail" name="userEmail" required>
                <label for="userAddress">Address:</label>
                <textarea id="userAddress" name="userAddress" rows="3" required></textarea>
                <label for="room">Enter size of house:</label>
                <select id="room" name="room" required>
                <option value="small">Room Size</option>
                <option value="small">2BHK</option>
                <option value="medium">3BHK</option>
                <option value="large">4BHK</option>
                <option value="small">Others</option>
                </select>
                <label for="specialRequirements">Special Requirements:</label>
                <textarea id="specialRequirements" name="specialRequirements" rows="3"></textarea>
                <button type="button" onclick="confirmBooking1('Maid')">Book Now</button>
            `;
            break;

        case 'Cook':
            modalContent.innerHTML = `
                <p>Custom content for Cook service type.</p>
                <label for="userName">Name:</label>
                <input type="text" id="userName" name="userName" required>
                <label for="userPhoneNumber">Phone Number:</label>
                <input type="tel" id="userPhoneNumber" name="userPhoneNumber" pattern="[0-9]{10}" required>
                <label for="userEmail">Email Address:</label>
                <input type="email" id="userEmail" name="userEmail" required>
                <label for="userAddress">Address:</label>
                <textarea id="userAddress" name="userAddress" rows="3" required></textarea>
                <label for="food">Enter food preferences:</label>
                <select id="food" name="food" required>
                <option value="food-types">Food Type</option>
                <option value="veg">Veg</option>
                <option value="non">Non-Veg</option>
                <option value="jain">Jain</option>
                <option value="other">Others</option>
                </select>
                <label for="specialRequirements">Special Requirements:</label>
                <textarea id="specialRequirements" name="specialRequirements" rows="3"></textarea>
                <button type="button" onclick="confirmBooking2('Cook')">Book Now</button>
            `;
            break;

        case 'Nanny':
            modalContent.innerHTML = `
                <p>Custom content for Nanny service type.</p>
                <label for="userName">Name:</label>
                <input type="text" id="userName" name="userName" required>
                <label for="userPhoneNumber">Phone Number:</label>
                <input type="tel" id="userPhoneNumber" name="userPhoneNumber" pattern="[0-9]{10}" required>
                <label for="userEmail">Email Address:</label>
                <input type="email" id="userEmail" name="userEmail" required>
                <label for="userAddress">Address:</label>
                <textarea id="userAddress" name="userAddress" rows="3" required></textarea>
                <label for="kid">Enter no. of children:</label>
                <textarea id="kid" name="kid" rows="3"></textarea>
                <label for="specialRequirements">Special Requirements:</label>
                <textarea id="specialRequirements" name="specialRequirements" rows="3"></textarea>
                <button type="button" onclick="confirmBooking3('Nanny')">Book Now</button>
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















function confirmBooking1(serviceType) {
    const providerName = selectedProviderDetails ? selectedProviderDetails.providerName : 'N/A';
    const roomDropdown = document.getElementById('room');
    const selectedRoomOption = roomDropdown.options[roomDropdown.selectedIndex];

    const bookingDetails = {
        ProviderName: providerName,
        ServiceType: serviceType,
        Apartment: document.getElementById('apartment').value,
        StartTime: document.getElementById('startTime').value,
        StartDate: document.getElementById('date').value,
        UserName: document.getElementById('userName').value,
        UserPhoneNumber: document.getElementById('userPhoneNumber').value,
        UserEmail: document.getElementById('userEmail').value,
        CompleteAddress: document.getElementById('userAddress').value,
        HouseSize: selectedRoomOption.text,
        SpecialRequirements: document.getElementById('specialRequirements').value
    };

    alert(`Booking for ${serviceType} confirmed!`);
    console.log('Booking details:', bookingDetails);
    window.location.href = 'https://www.yellowsense.in';
    sendBookingConfirmation1(bookingDetails);
}

function confirmBooking2(serviceType) {
    const providerName = selectedProviderDetails ? selectedProviderDetails.providerName : 'N/A';
    const foodDropdown = document.getElementById('food');
    const selectedFoodOption = foodDropdown.options[foodDropdown.selectedIndex];

    const bookingDetails = {
        ProviderName: providerName,
        ServiceType: serviceType,
        Apartment: document.getElementById('apartment').value,
        StartTime: document.getElementById('startTime').value,
        StartDate: document.getElementById('date').value,
        UserName: document.getElementById('userName').value,
        UserPhoneNumber: document.getElementById('userPhoneNumber').value,
        UserEmail: document.getElementById('userEmail').value,
        UserAddress: document.getElementById('userAddress').value,
        Apartment: document.getElementById('apartment').value,
        FoodPreferences: selectedFoodOption.text,
        SpecialRequirements: document.getElementById('specialRequirements').value
    };

    alert(`Booking for ${serviceType} confirmed!`);
    console.log('Booking details:', bookingDetails);
    window.location.href = 'https://www.yellowsense.in';
    sendBookingConfirmation2(bookingDetails);
}

function confirmBooking3(serviceType) {
    const providerName = selectedProviderDetails ? selectedProviderDetails.providerName : 'N/A';

    const bookingDetails = {
        ProviderName: providerName,
        ServiceType: serviceType,
        Apartment: document.getElementById('apartment').value,
        StartTime: document.getElementById('startTime').value,
        StartDate: document.getElementById('date').value,
        UserName: document.getElementById('userName').value,
        UserPhoneNumber: document.getElementById('userPhoneNumber').value,
        UserEmail: document.getElementById('userEmail').value,
        UserAddress: document.getElementById('userAddress').value,
        Apartment: document.getElementById('apartment').value,
        ChildNumber: document.getElementById('kid').value,
        SpecialRequirements: document.getElementById('specialRequirements').value
    };

    alert(`Booking for ${serviceType} confirmed!`);
    console.log('Booking details:', bookingDetails);
    window.location.href = 'https://www.yellowsense.in';
    sendBookingConfirmation3(bookingDetails);
}

function sendBookingConfirmation1(bookingDetails) {
    const apiUrl = 'https://yellowsensebackendapi.azurewebsites.net/confirm_maid_booking'; // Replace with your API endpoint
    const headers = {
        'Content-Type': 'application/json',
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingDetails),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send booking details to the API: ${response.statusText}`);
            }
            // console.log('Booking details sent to the API successfully');
            
            
        })
        
        .catch(error => console.error('Error sending booking details to the API:', error));
}


function sendBookingConfirmation2(bookingDetails) {
    const apiUrl = 'https://yellowsensebackendapi.azurewebsites.net/confirm_cook_booking'; // Replace with your API endpoint
    const headers = {
        'Content-Type': 'application/json',
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingDetails),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send booking details to the API: ${response.statusText}`);
            }
            // console.log('Booking details sent to the API successfully');
        })
        .catch(error => console.error('Error sending booking details to the API:', error));
}

function sendBookingConfirmation3(bookingDetails) {
    const apiUrl = 'https://yellowsensebackendapi.azurewebsites.net/confirm_nanny_booking'; // Replace with your API endpoint
    const headers = {
        'Content-Type': 'application/json',
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingDetails),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send booking details to the API: ${response.statusText}`);
            }
            // console.log('Booking details sent to the API successfully');
        })
        .catch(error => console.error('Error sending booking details to the API:', error));
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


