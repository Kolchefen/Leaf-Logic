const plantDatabase = [
    'Aloe Vera',
    'Fiddle Leaf Fig',
    'Spider Plant',
    'Basil',
    'Rosemary',
    'Pothos',
    'Peace Lily',
    'Succulent',
    'Dracaena',
    'Snake Plant',
    'Philodendron',
    'Bird of Paradise',
    'Chinese Evergreen',
    'Rubber Plant',
    'Jade Plant',
    'Monstera',
    'Orchid',
    'Calathea',
    'Lavender',
    'Chrysanthemum',
    'Daisy',
    'Petunia',
    'Maranta',
    'Hoya',
    'Cactus',
    'Geranium',
    'Clover',
    'Carnivorous Plant',
    'Coleus',
];

const inputField = document.getElementById('plantInput');
const suggestionsDiv = document.getElementById('suggestions');
const inventoryList = document.getElementById('inventoryList');
const addPlantBtn = document.getElementById('addPlantBtn');
let currentFocus = -1;
let inventory = [];

// Display suggestions dynamically
function displaySuggestions() {
    const query = inputField.value.toLowerCase();
    suggestionsDiv.innerHTML = '';

    if (query) {
        const filteredPlants = plantDatabase.filter((plant) =>
            plant.toLowerCase().startsWith(query)
        );

        filteredPlants.forEach((plant) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = plant;
            suggestionItem.className = 'suggestion-item';

            suggestionItem.addEventListener('click', () => {
                inputField.value = plant;
                suggestionsDiv.innerHTML = '';
                suggestionsDiv.style.display = 'none';
            });

            suggestionsDiv.appendChild(suggestionItem);
        });

        suggestionsDiv.style.display = filteredPlants.length ? 'block' : 'none';
    } else {
        suggestionsDiv.style.display = 'none';
    }
}

// Add active class to highlight a suggestion
function addActive(items) {
    if (!items.length) return;

    items.forEach((item) => item.classList.remove('active'));
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add('active');
}

// Add plant to inventory
function addPlantToInventory(plant) {
    if (inventory.includes(plant)) {
        alert('Plant already exists in your inventory!');
        return;
    }

    inventory.push(plant);
    renderInventory();

    // Feedback for successful addition
    alert(`${plant} has been added to your inventory!`);
}

// Render inventory list
function renderInventory() {
    inventoryList.innerHTML = '';

    inventory.forEach((plant, index) => {
        const inventoryItem = document.createElement('div');
        inventoryItem.className = 'inventory-item';

        const plantName = document.createElement('span');
        plantName.textContent = plant;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';

        deleteBtn.addEventListener('click', () => {
            inventory.splice(index, 1);
            renderInventory();
        });

        inventoryItem.appendChild(plantName);
        inventoryItem.appendChild(deleteBtn);
        inventoryList.appendChild(inventoryItem);
    });
}

// Initialize search suggestions and inventory management
function initializeApp() {
    inputField.addEventListener('input', () => {
        displaySuggestions();
        currentFocus = -1;
    });

    inputField.addEventListener('keydown', (e) => {
        const suggestionItems = suggestionsDiv.querySelectorAll('.suggestion-item');
        if (e.key === 'ArrowDown') {
            currentFocus++;
            addActive(suggestionItems);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            addActive(suggestionItems);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && suggestionItems[currentFocus]) {
                suggestionItems[currentFocus].click();
            } else if (inputField.value.trim()) {
                addPlantToInventory(inputField.value.trim());
                inputField.value = '';
                suggestionsDiv.style.display = 'none';
            }
        }
    });

    addPlantBtn.addEventListener('click', () => {
        const plant = inputField.value.trim();
        if (plant) {
            addPlantToInventory(plant);
            inputField.value = '';
            suggestionsDiv.style.display = 'none';
        } else {
            alert('Please enter a valid plant name!');
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#plantInput') && !event.target.closest('#suggestions')) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initializeApp);