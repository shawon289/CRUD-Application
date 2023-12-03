let itemArray = [];
let updateItemID = 0;
let isEditMode = true;
// let itemInCart = [];
let row = null;
function openForm() {
    isEditMode = false;
    document.getElementById("form").style.display = "block";
}

function closeForm() {
    document.getElementById("form").style.display = "none";
}
function Submit() {
    let dataEntered = retrieveData();
    itemArray = readLocalStorage(dataEntered);
    const index = itemArray.length - 1;
    isEditMode ? saveData() : insertData(dataEntered, index);

}

function retrieveData() {
    // let id = document.getElementById("flight-id").value;
    let departFrom = document.getElementById("depart").value;
    let destination = document.getElementById("destination").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let price = document.getElementById("price").value;
    let obj = { departFrom, destination, date, time, price };
    return obj;
}

function readLocalStorage(dataEntered) {
    const storedData = localStorage.getItem('data') || '[]';
    const parsedData = JSON.parse(storedData)
    // parsedData.push(dataEntered);
    if (!isEditMode) {
        let uniqueId = 1;
        if (parsedData.length > 0) {
            const maxId = parsedData.reduce((max, item) => (item.id > max ? item.id : max), 0);
            uniqueId = maxId + 1;
        }
        dataEntered.id = uniqueId;
        parsedData.push(dataEntered);
        localStorage.setItem('data', JSON.stringify(parsedData));
    }
    return parsedData;
}

function showData() {
    const storedData = localStorage.getItem("data") || "[]";
    const itemArray = JSON.parse(storedData);
    itemArray.forEach((flightInfo, dlt) => insertData(flightInfo, dlt));
    showId();
    // addToCart();
}

function insertData(newFlightInfo, dlt) {
    let fields = ["id", "departFrom", "destination", "date", "time", "price"];
    row = flightTable.insertRow();
    fields.forEach(key => {
        row.insertCell().innerHTML = (key == "date")
            ? newFlightInfo[key]
            : newFlightInfo[key];
    })
    const cell = `<button id="edit" onclick=editData(${dlt},openForm())>Edit</button>
    <button id="remove" onclick=removeData(${dlt})>Delete</button>`;
    row.insertCell().innerHTML = cell;
}

function removeData(dlt) {
    let storedData = localStorage.getItem('data') || '[]';
    storedData = JSON.parse(storedData);
    storedData.splice(dlt, 1);
    localStorage.setItem('data', JSON.stringify(storedData));
    const table = document.getElementById('flightTable');
    for (var i = 1; i < table.rows.length;) {
        table.deleteRow(i);
    }
    showData();
}

function editData(dlt) {
    isEditMode = true;
    let editData = localStorage.getItem('data') || '[]';
    editData = JSON.parse(editData);

    var displayData = editData.filter((item) =>
        editData.indexOf(item) === dlt)

    let displayItem = displayData[displayData.length - 1];
    // updateItemID = dlt;

    document.getElementById('flight-id').value = displayItem.id;
    document.getElementById('depart').value = displayItem.departFrom;
    document.getElementById('destination').value = displayItem.destination;
    document.getElementById('date').value = displayItem.date;
    document.getElementById('time').value = displayItem.time;
    document.getElementById('price').value = displayItem.price;
}

function saveData() {
    let updateData = localStorage.getItem('data') || '[]';
    updateData = JSON.parse(updateData);
    const itemID = parseInt(document.getElementById("flight-id").value);
    const sourceItem = updateData.find((item) => item.id === itemID);

    sourceItem.departFrom = document.getElementById("depart").value;
    sourceItem.destination = document.getElementById("destination").value;
    sourceItem.date = document.getElementById("date").value;
    sourceItem.time = document.getElementById("time").value;
    sourceItem.price = document.getElementById("price").value;

    localStorage.setItem('data', JSON.stringify(updateData));
}

function showId() {
    // let arrOfID = {}
    const storedData = localStorage.getItem("data") || "[]";
    const itemArray = JSON.parse(storedData);
    const selectElement = document.getElementById('select');

    let rowID = itemArray.map(itemId => itemId.id);
    rowID.forEach(list => {
        const option = document.createElement('option');
        option.textContent = list;
        selectElement.appendChild(option);
    })

}

function addToCart() {
    const storedData = localStorage.getItem("data") || "[]";
    const itemArray = JSON.parse(storedData);

    const ticketCart = document.getElementById("tableBody");
    const selectedId = parseInt(document.getElementById('select').value);

    const selectedData = itemArray.find(obj => obj.id === selectedId);
    const newRow = document.createElement('tr');

    ticketCart.innerHTML = '';

    if (selectedData) {
        newRow.innerHTML = `
        <td>${selectedData.id}</td>
        <td>${selectedData.departFrom}</td>
        <td>${selectedData.destination}</td>
        <td>${selectedData.date}</td>
        <td>${selectedData.time}</td>
        <td>${selectedData.price}</td>
        <td><button class='increase' onclick="increase()">+</button> 
                         <input type="text" id="number" value = "0"> 
                         <button class='decrease' onclick="decrease()">-</button>
        `;
        ticketCart.appendChild(newRow);
    }

    localStorage.setItem('data', JSON.stringify(itemArray));
}

function increase() {
    let storedData = localStorage.getItem('data') || '[]';
    storedData = JSON.parse(storedData);
    let counter = parseInt(document.getElementById('number').value);
    counter = isNaN(counter) ? 0 : counter;
    counter++;
    document.getElementById('number').value = counter;

    const selectedId = parseInt(document.getElementById('select').value);
    const selectedData = storedData.find(obj => obj.id === selectedId);

    let price = storedData.find((obj) => obj.id === selectedData.id).price;
    let totalPrice = parseInt(price) * counter;
    document.querySelector('#total-price').value = totalPrice;
}

function decrease() {
    let ticketTable = document.getElementById('ticketCart');
    let storedData = localStorage.getItem('data') || '[]';
    storedData = JSON.parse(storedData);
    let counter = document.getElementById('number').value;
    counter = isNaN(counter) ? 0 : counter;
    counter--
    document.getElementById('number').value = counter;
    if (counter <= 0) {
        ticketTable.deleteRow(1);
    }

    const selectedId = parseInt(document.getElementById('select').value);
    const selectedData = storedData.find(obj => obj.id === selectedId);

    let price = storedData.find((obj) => obj.id === selectedData.id).price;
    let totalPrice = parseInt(price) * counter;
    document.querySelector('#total-price').value = totalPrice;
}
