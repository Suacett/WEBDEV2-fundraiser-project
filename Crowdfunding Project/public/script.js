// Fetch and display active fundraisers on the home page
function fetchActiveFundraisers() {
    fetch('/api/fundraisers')
        .then(response => response.json())
        .then(data => {
            const fundraisersList = document.getElementById('fundraisers-list');
            if (fundraisersList) {
                if (data.length === 0) {
                    fundraisersList.innerHTML = '<p style="color: red; font-weight: bold;">No active fundraisers available at the moment.</p>';
                } else {
                    fundraisersList.innerHTML = data.map(fundraiser => `
                        <div class="fundraiser-card">
                            <h3>${fundraiser.CAPTION}</h3>
                            <p><strong>ID:</strong> ${fundraiser.FUNDRAISER_ID}</p>
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>
                            <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
                            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
                        </div>
                    `).join('');
                }
            }
        })
        .catch(error => {
            console.error('Error fetching active fundraisers:', error);
            const fundraisersList = document.getElementById('fundraisers-list');
            if (fundraisersList) {
                fundraisersList.innerHTML = '<p style="color: red; font-weight: bold;">Error loading fundraisers. Please try again later.</p>';
            }
        });
}

// Populate category dropdown on search page
function populateCategories() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.NAME;
                    option.textContent = category.NAME;
                    categorySelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Error loading categories</option>';
            }
        });
}

// Search fundraisers
function searchFundraisers(event) {
    event.preventDefault();

    const organizer = document.getElementById('organizer').value.trim();
    const city = document.getElementById('city').value.trim();
    const category = document.getElementById('category').value;

    if (!organizer && !city && !category) {
        alert('Please select at least one search criteria.');
        return;
    }

    const searchParams = new URLSearchParams();
    if (organizer) searchParams.append('organizer', organizer);
    if (city) searchParams.append('city', city);
    if (category) searchParams.append('category', category);

    fetch(`/api/search?${searchParams}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('search-results');
            if (resultsDiv) {
                if (data.length === 0) {
                    resultsDiv.innerHTML = '<p style="color: red; font-weight: bold;">No fundraisers found.</p>';
                } else {
                    resultsDiv.innerHTML = data.map(fundraiser => `
                        <div class="fundraiser-card">
                            <h3>${fundraiser.CAPTION}</h3>
                            <p><strong>ID:</strong> ${fundraiser.FUNDRAISER_ID}</p>
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>
                            <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
                            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
                        </div>
                    `).join('');
                }
            }
        })
        .catch(error => {
            console.error('Error searching fundraisers:', error);
            const resultsDiv = document.getElementById('search-results');
            if (resultsDiv) {
                resultsDiv.innerHTML = '<p style="color: red; font-weight: bold;">Error searching fundraisers. Please try again.</p>';
            }
        });
}

// Clear search form
function clearCheckboxes() {
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.getElementById('category').value = '';
    const resultsDiv = document.getElementById('search-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
}

// Fetch and display fundraiser details
function fetchFundraiserDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');

    if (!fundraiserId) {
        document.getElementById('fundraiser-details').innerHTML = '<p style="color: red; font-weight: bold;">No fundraiser ID provided.</p>';
        return;
    }

    fetch(`/api/fundraiser/${fundraiserId}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error('Fundraiser not found');
            }
            return response.json();
        })
        .then(fundraiser => {
            const progressPercentage = ((fundraiser.CURRENT_FUNDING / fundraiser.TARGET_FUNDING) * 100).toFixed(2);
            document.getElementById('fundraiser-details').innerHTML = `
                <h2>${fundraiser.CAPTION}</h2>
                <p><strong>ID:</strong> ${fundraiser.FUNDRAISER_ID}</p>
                <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressPercentage}%;"></div>
                </div>
                <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
                <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                <p><strong>City:</strong> ${fundraiser.CITY}</p>
                <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching fundraiser details:', error);
            document.getElementById('fundraiser-details').innerHTML = '<p style="color: red; font-weight: bold;">Error loading fundraiser details. Please try again.</p>';
        });
}

function showDonateDialog() {
    alert('This feature is under construction');
}

// Initialize functions based on the current page
document.addEventListener('DOMContentLoaded', () => {

    // Home Page
    const fundraisersList = document.getElementById('fundraisers-list');
    if (fundraisersList) {
        fetchActiveFundraisers();
    }

    // Search Page
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', searchFundraisers);
        populateCategories();

        const clearButton = document.querySelector('button[type="button"]');
        if (clearButton) {
            clearButton.addEventListener('click', clearCheckboxes);
        }
    }

    // Fundraiser Details Page
    const fundraiserDetails = document.getElementById('fundraiser-details');
    if (fundraiserDetails) {
        fetchFundraiserDetails();
    }
});
