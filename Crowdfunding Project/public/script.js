
/**
 * Fetches and displays all active fundraisers on the home page.
 * Retrieves data dynamically from the fundraisers api
 * generates html content to display each fundraisers details
 */
function fetchActiveFundraisers() { //HI FARAHANA 
    // Make a get request to the fundraisers api 
    fetch('/api/fundraisers')
        .then(response => response.json()) // Parse the json response
        .then(data => {
            // Get the dom for where the fundraisers will be displayed
            const fundraisersList = document.getElementById('fundraisers-list');
            if (fundraisersList) {
                if (data.length === 0) {
                    // Display a message if no active fundraisers are available
                    fundraisersList.innerHTML = '<p style="color: red; font-weight: bold;">No active fundraisers available at the moment.</p>';
                } else {
                    // Map each fundraiser to a html card and join them into a single string
                    fundraisersList.innerHTML = data.map(fundraiser => `
                        <div class="fundraiser-card">
                            <!-- Conditionally display the fundraiser image if IMAGE_URL exists -->
                            ${fundraiser.IMAGE_URL ? `<img src="${fundraiser.IMAGE_URL}" alt="${fundraiser.CAPTION}" class="fundraiser-image" onerror="this.src='/images/placeholder.jpg'">` : ''}
                            
                            <!-- Display fundraiser details -->
                            <h3>${fundraiser.CAPTION}</h3>
                            <p><strong>ID:</strong> ${fundraiser.FUNDRAISER_ID}</p>
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>
                            <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
                            
                            <!-- Link to the fundraiser's detail page -->
                            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}" class="details-button">View Details</a>
                        </div>
                    `).join(''); // join all fundraiser cards into a single html string
                }
            }
        })
        .catch(error => {
            // Log errors
            console.error('Error fetching active fundraisers:', error);

            // Displays error message to the user
            const fundraisersList = document.getElementById('fundraisers-list');
            if (fundraisersList) {
                fundraisersList.innerHTML = '<p style="color: red; font-weight: bold;">Error loading fundraisers. Please try again later.</p>';
            }
        });
}

/**
 * Populates the category dropdown on the search page.
 * Fetches category data from the categories api and
 * adds each category as an option in the dropdown.
 */
function populateCategories() {
    // Make a get request to the categories api
    fetch('/api/categories')
        .then(response => response.json()) // Parse the json response
        .then(data => {
            // Get the category dropdown element
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                // Iterate over each category and create an option element
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.NAME; // Set the value attribute
                    option.textContent = category.NAME; // Set the display text
                    categorySelect.appendChild(option); // Add the option to the dropdown
                });
            }
        })
        .catch(error => {
            // Log errors
            console.error('Error fetching categories:', error);

            // Display errors
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Error loading categories</option>';
            }
        });
}

/**
 * Handles the search functionality for fundraisers
 * Collects search criteria from the form, validates input,
 * sends a request to the search api, and displays results.
 */
function searchFundraisers(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve and trim input values from the form fields
    const organizer = document.getElementById('organizer').value.trim();
    const city = document.getElementById('city').value.trim();
    const category = document.getElementById('category').value;

    // Validate that at least one search criterion is selected
    if (!organizer && !city && !category) {
        alert('Please select at least one search criteria.');
        return; // Exit the function if validation fails
    }

    // Create url search parameters based on selected criteria
    const searchParams = new URLSearchParams();
    if (organizer) searchParams.append('organizer', organizer);
    if (city) searchParams.append('city', city);
    if (category) searchParams.append('category', category);

    // Make a get request to the search api with search parameters
    fetch(`/api/search?${searchParams}`)
        .then(response => response.json()) // parse json
        .then(data => {
            // Get the div where search results will be displayed
            const resultsDiv = document.getElementById('search-results');
            if (resultsDiv) {
                if (data.length === 0) {
                    // Display a message if no fundraisers match the search criteria
                    resultsDiv.innerHTML = '<p style="color: red; font-weight: bold;">No fundraisers found.</p>';
                } else {
                    // Map each fundraiser to an html card and join them into a single string
                    resultsDiv.innerHTML = data.map(fundraiser => `
                        <div class="fundraiser-card">
                            <!-- Conditionally display the fundraiser image if IMAGE_URL exists -->
                            ${fundraiser.IMAGE_URL ? `<img src="${fundraiser.IMAGE_URL}" alt="${fundraiser.CAPTION}" class="fundraiser-image" onerror="this.src='/images/placeholder.jpg'">` : ''}
                            
                            <!-- Display fundraiser details -->
                            <h3>${fundraiser.CAPTION}</h3>
                            <p><strong>ID:</strong> ${fundraiser.FUNDRAISER_ID}</p>
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>
                            <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
                            
                            <!-- Link to the fundraiser's detail page -->
                            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}" class="details-button">View Details</a>
                        </div>
                    `).join(''); // Join all fundraiser cards into a single html string
                }
            }
        })
        .catch(error => {
            // Log any errors to the console for debugging
            console.error('Error searching fundraisers:', error);

            // Display an error message to the user
            const resultsDiv = document.getElementById('search-results');
            if (resultsDiv) {
                resultsDiv.innerHTML = '<p style="color: red; font-weight: bold;">Error searching fundraisers. Please try again.</p>';
            }
        });
}

/**
 * Clears the search form inputs and any displayed search results.
 * Resets the Organiser, City, and Category fields to their default values.
 */
function clearCheckboxes() {
    // Reset the value of each form input to an empty string
    document.getElementById('organizer').value = '';
    document.getElementById('city').value = '';
    document.getElementById('category').value = '';

    // Get the div where search results are displayed and clear its content
    const resultsDiv = document.getElementById('search-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
}

/**
 * Fetches and displays the details of a single fundraiser on the fundraiser page.
 * Retrieves the fundraiser ID from the query string, fetches data from the API,
 * and generates html content to display all fundraiser details.
 */
function fetchFundraiserDetails() {
    // Parse the query string to get the id
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');

    // If no id is provided, display an error message
    if (!fundraiserId) {
        document.getElementById('fundraiser-details').innerHTML = '<p style="color: red; font-weight: bold;">No fundraiser ID provided.</p>';
        return;
    }

    // Make a request to the fundraiser id api 
    fetch(`/api/fundraiser/${fundraiserId}`)
        .then(response => {
            if (response.status === 404) {
                // If the fundraiser is not found, throw an error
                throw new Error('Fundraiser not found');
            }
            return response.json(); // Parse json
        })
        .then(fundraiser => {
            // Get the dom element where fundraiser details will be displayed
            const fundraiserDetailsDiv = document.getElementById('fundraiser-details');
            if (fundraiserDetailsDiv) {
                // generate html content with fundraiser details
                fundraiserDetailsDiv.innerHTML = `
                    <!-- Conditionally display the fundraiser image if IMAGE_URL exists -->
                    ${fundraiser.IMAGE_URL ? `<img src="${fundraiser.IMAGE_URL}" alt="${fundraiser.CAPTION}" class="fundraiser-detail-image" onerror="this.src='/images/placeholder.jpg'">` : ''}
                    
                    <!-- Display fundraiser details -->
                    <h2>${fundraiser.CAPTION}</h2>
                    <p><strong>ID:</strong> ${fundraiser.FUNDRAISER_ID}</p>
                    <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                    <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                    
                    <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
                    <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                    <p><strong>City:</strong> ${fundraiser.CITY}</p>
                    <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
                    
                    <!-- Donate button -->
                    <button onclick="showDonateDialog()">Donate</button>
                `;
            }
        })
        .catch(error => {
            // Log errors
            console.error('Error fetching fundraiser details:', error);

            // Display error message to the user
            document.getElementById('fundraiser-details').innerHTML = '<p style="color: red; font-weight: bold;">Error loading fundraiser details. Please try again.</p>';
        });
}

/**
 * Displays an alert dialog indicating that the Donate feature is under construction.
 */
function showDonateDialog() {
    alert('This feature is under construction');
}

/**
 * Initialises event listeners and fetches the needed data based on the current page
 * Runs when the dom content has fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {

    // Home Page Initialisation
    const fundraisersList = document.getElementById('fundraisers-list');
    if (fundraisersList) {
        fetchActiveFundraisers(); // Fetch and display active fundraisers
    }

    // Search Page Initialisation
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', searchFundraisers); // add search handler
        populateCategories(); // Populate category dropdown

        // Get the clear button and add the clear handler
        const clearButton = document.querySelector('button[type="button"]');
        if (clearButton) {
            clearButton.addEventListener('click', clearCheckboxes);
        }
    }

    // Fundraiser Details Page Initialisation
    const fundraiserDetails = document.getElementById('fundraiser-details');
    if (fundraiserDetails) {
        fetchFundraiserDetails(); // Fetch and display fundraiser details
    }
});
