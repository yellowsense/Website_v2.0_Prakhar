let slotCount = 1;
let selectedSuggestions = [];

function addSlot() {
    slotCount++;
    const newSlot = document.createElement('div');
    newSlot.classList.add('time-slot');
    newSlot.id = `slot${slotCount}`;

    newSlot.innerHTML = `
        <label for="startTime${slotCount}">Slot ${slotCount} - Start Time:</label>
        <input type="time" id="startTime${slotCount}" name="startTime${slotCount}" required>

        <label for="endTime${slotCount}">End Time:</label>
        <input type="time" id="endTime${slotCount}" name="endTime${slotCount}" required>

        <span class="remove-slot" onclick="removeSlot('slot${slotCount}')">Remove</span>
    `;

    document.getElementById('slotContainer').appendChild(newSlot);
}

function removeSlot(slotId) {
    const slotToRemove = document.getElementById(slotId);
    if (slotToRemove) {
        slotToRemove.remove();
    }
}

const societySearchInput = document.getElementById('societySearch');
const suggestionContainer = document.getElementById('suggestionContainer');



societySearchInput.addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();

    fetch('https://yellowsensebackendapi.azurewebsites.net/society_names')
        .then(response => response.json())
        .then(data => {
            const suggestions = data.filter(society => society.name.toLowerCase().includes(searchQuery));
            displaySuggestions(suggestions);
        })
        .catch(error => console.error('Error fetching data:', error));
});





function displaySuggestions(suggestions) {
    if (societySearchInput.value === '') {
        suggestionContainer.innerHTML = ''; // Clear suggestions when search box is empty
        return;
    }

    suggestionContainer.innerHTML = '';

    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.classList.add('society-suggestion');
        suggestionDiv.textContent = suggestion.name;

        suggestionDiv.addEventListener('click', function () {
            if (!selectedSuggestions.includes(suggestion.name)) {
                selectedSuggestions.push(suggestion.name);
                updateSelectedSuggestions();
            }
        });

        suggestionContainer.appendChild(suggestionDiv);
    });
}

function updateSelectedSuggestions() {
    const selectedContainer = document.getElementById('selectedSuggestions');
    selectedContainer.innerHTML = '';

    selectedSuggestions.forEach(selectedSuggestion => {
        const selectedDiv = document.createElement('div');
        selectedDiv.classList.add('selected-suggestion');
        selectedDiv.textContent = selectedSuggestion;

        const removeIcon = document.createElement('span');
        removeIcon.classList.add('remove-suggestion');
        removeIcon.innerHTML = '&#10006;';

        removeIcon.addEventListener('click', function () {
            selectedSuggestions = selectedSuggestions.filter(
                suggestion => suggestion !== selectedSuggestion
            );
            updateSelectedSuggestions();
        });

        selectedDiv.appendChild(removeIcon);
        selectedContainer.appendChild(selectedDiv);
    });
}

// Form submission
document.getElementById('timeSlotsForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting (for testing purposes)

    const formData = {
        AadharNumber: document.getElementById('aadhar').value,
        Name: document.getElementById('name').value,
        PhoneNumber: document.getElementById('mobile').value,
        Gender: document.querySelector('input[name="gender"]:checked').value,
        Services: '', // This will be a single string of services
        Locations: '', // This will be a single string of locations
        Timings: '', // This will be a single string of timings with hyphens
    };

    // Collect selected services
    formData.Services = `'${Array.from(document.querySelectorAll('input[name="services"]:checked')).map(checkbox => checkbox.value).join("', '")}'`;

    // Collect selected locations
    formData.Locations = `'${selectedSuggestions.join("', '")}'`;

    // Collect slot start time and end time for each slot
    const timingsArray = [];
    for (let i = 1; i <= slotCount; i++) {
        const startTime = document.getElementById(`startTime${i}`).value.replace(/,/g, '-'); // Replace comma with hyphen
        const endTime = document.getElementById(`endTime${i}`).value.replace(/,/g, '-'); // Replace comma with hyphen

        timingsArray.push(`${startTime}-${endTime}`);
    }

    formData.Timings = `'${timingsArray.join("', '")}'`; // Join timings with comma and wrap in single quotes

    // Log the form data (for testing purposes)
    console.log(formData);

    // Send data to the server
    sendDataToServer(formData);
});









function sendDataToServer(data) {
    fetch('https://yellowsensebackendapi.azurewebsites.net/insert_maid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            console.log('Data sent successfully:', result);
            // You can perform further actions after successfully sending data
        })
        .catch(error => {
            console.error('Error sending data:', error);
            // Handle the error accordingly
        });
}

