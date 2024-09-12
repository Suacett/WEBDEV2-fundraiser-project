// Fetch and display active fundraisers on the home page
function fetchActiveFundraisers() {
    fetch('/api/fundraisers')
        .then(response => response.json())
        .then(data => {
            const fundraisersList = document.getElementById('fundraisers-list');
            fundraisersList.innerHTML = data.map(fundraiser => `
                <div class="fundraiser-card">
                    <h3>${fundraiser.CAPTION}</h3>
                    <p>ID: ${fundraiser.FUNDRAISER_ID}</p>
                    <p>Organizer: ${fundraiser.ORGANIZER}</p>
                    <p>Category: ${fundraiser.CATEGORY_NAME}</p>
                    <p>Target: $${fundraiser.TARGET_FUNDING}</p>
                    <p>Current: $${fundraiser.CURRENT_FUNDING}</p>
                    <p>City: ${fundraiser.CITY}</p>
                    <p>Active: ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
                    <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error:', error));
}

// Populate category dropdown on search page
function populateCategories() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.CATEGORY_ID;
                option.textContent = category.NAME;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Search fundraisers
function searchFundraisers(event) {
    event.preventDefault();
    const organizer = document.getElementById('organizer').value;
    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;

    if (!organizer && !city && !category) {
        alert('Please select at least one search criteria.');
        return;
    }

    const searchParams = new URLSearchParams({
        organizer: organizer,
        city: city,
        category: category
    });

    fetch(`/api/search?${searchParams}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('search-results');
            if (data.length === 0) {
                resultsDiv.innerHTML = '<p style="color: red; font-weight: bold;">No fundraisers found.</p>';
            } else {
                resultsDiv.innerHTML = data.map(fundraiser => `
                    <div class="fundraiser-card">
                        <h3>${fundraiser.CAPTION}</h3>
                        <p>Organizer: ${fundraiser.ORGANIZER}</p>
                        <p>Category: ${fundraiser.CATEGORY_NAME}</p>
                        <p>Target: $${fundraiser.TARGET_FUNDING}</p>
                        <p>Current: $${fundraiser.CURRENT_FUNDING}</p>
                        <p>City: ${fundraiser.CITY}</p>
                        <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Clear search form
function clearCheckboxes() {
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.getElementById('category').value = '';
}

// Fetch and display fundraiser details
function fetchFundraiserDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');

    fetch(`/api/fundraiser/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            document.getElementById('fundraiser-details').innerHTML = `
                <h2>${fundraiser.CAPTION}</h2>
                <p>ID: ${fundraiser.FUNDRAISER_ID}</p>
                <p>Organizer: ${fundraiser.ORGANIZER}</p>
                <p>Category: ${fundraiser.CATEGORY_NAME}</p>
                <p>Target: $${fundraiser.TARGET_FUNDING}</p>
                <p>Current: $${fundraiser.CURRENT_FUNDING}</p>
                <p>City: ${fundraiser.CITY}</p>
                <p>Active: ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
            `;
        })
        .catch(error => console.error('Error:', error));
}

function showDonateDialog() {
    alert('This feature is under construction');
}

// Event listeners and page-specific code
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        fetchActiveFundraisers();
    } else if (window.location.pathname.endsWith('search.html')) {
        populateCategories();
        document.getElementById('search-form').addEventListener('submit', searchFundraisers);
    } else if (window.location.pathname.endsWith('fundraiser.html')) {
        fetchFundraiserDetails();
    }
});