// Load saved input fields from localStorage
function loadInputFields() {
    const fields = ['transactionType', 'ticketNumber', 'routeType', 'airportCode', 'tagging', 'icName', 'pnr', 'description'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        input.value = ''; // Clear any loaded value
    });
}

document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = new Date().toLocaleDateString();
    const timestamp = new Date().toLocaleTimeString();
    const transactionType = document.getElementById('transactionType').value;
    const ticketNumber = document.getElementById('ticketNumber').value || 'N/A'; // Default to 'N/A'
    const routeType = document.getElementById('routeType').value;
    const airportCode = document.getElementById('airportCode').value;
    const tagging = document.getElementById('tagging').value;
    const icName = document.getElementById('icName').value;
    const pnr = document.getElementById('pnr').value || 'N/A'; // Default to 'N/A'
    const description = document.getElementById('description').value;
    const urgency = document.getElementById('urgency').value;

    // Shorten the urgency value
    const urgencyShort = urgency === 'urgent' ? 'U' : 'NU';

    const reservationData = { 
        date, 
        timestamp, 
        transactionType, 
        ticketNumber,  
        routeType, 
        airportCode, 
        tagging, 
        icName, 
        pnr, 
        description, 
        urgency: urgencyShort 
    };

    addReservationToTable(reservationData);
    saveReservations();
    document.getElementById('reservationForm').reset(); // Reset form fields
});

// Function to add reservation data to the table
function addReservationToTable(data) {
    const tableBody = document.getElementById('reservationTableBody');
    const newRow = tableBody.insertRow();

    // Insert each data value into the table cells
    Object.values(data).forEach((value, index) => {
        newRow.insertCell(index).textContent = value;
    });

    const deleteCell = newRow.insertCell(Object.keys(data).length);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete'; // Class for delete button styling
    deleteButton.onclick = function() {
        tableBody.deleteRow(newRow.rowIndex - 1);
        saveReservations(); // Save after deleting
    };
    deleteCell.appendChild(deleteButton);
}

// Function to save all reservations to localStorage
function saveReservations() {
    const reservations = [];
    const rows = document.querySelectorAll('#reservationTableBody tr');

    rows.forEach(row => {
        const rowData = {};
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, index) => {
            const key = Object.keys({
                date: '',
                timestamp: '',
                transactionType: '',
                ticketNumber: '',
                routeType: '',
                airportCode: '',
                tagging: '',
                icName: '',
                pnr: '',
                description: '',
                urgency: ''
            })[index];
            rowData[key] = cell.textContent;
        });
        reservations.push(rowData);
    });

    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Function to load reservations from localStorage
function loadReservations() {
    const savedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    savedReservations.forEach(reservation => {
        addReservationToTable(reservation);
    });
}

// Function to clear all reservations
function clearAllReservations() {
    const tableBody = document.getElementById('reservationTableBody');
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
    localStorage.removeItem('reservations');
}

// Load saved reservations when the page loads
window.onload = function() {
    loadReservations();
};

// Add event listener for the Clear All button
document.getElementById('clearAllButton').addEventListener('click', clearAllReservations);
