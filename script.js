let itemArray = [];
let updateItemID = 0;
// let itemInCart = [];
let row = null;
function openForm() {
    document.getElementById("form").style.display = "block";
}

function closeForm() {
    document.getElementById("form").style.display = "none";
}
function Submit() {
    let dataEntered = retrieveData();
    itemArray = readLocalStorage(dataEntered);
    const index = itemArray.length - 1;
    insertData(dataEntered, index);
    update();
}

function retrieveData() {
    let id = document.getElementById("flight-id").value;
    let departFrom = document.getElementById("depart").value;
    let destination = document.getElementById("destination").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let price = document.getElementById("price").value;
    let obj = {id, departFrom, destination, date, time, price };
    return obj;
}

function readLocalStorage(dataEntered) {
    const storedData = localStorage.getItem('data') || '[]';
    const parsedData = JSON.parse(storedData)
    // parsedData.push(dataEntered);
    let uniqueId = 1;
    if (parsedData.length > 0) {
        const maxId = parsedData.reduce((max, item) => (item.id > max ? item.id : max), 0);
        uniqueId = maxId + 1;
    }
    dataEntered.id = uniqueId;
    parsedData.push(dataEntered);
    localStorage.setItem('data', JSON.stringify(parsedData));
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
    const cell = `<button id="edit" onclick=edit(${dlt},openForm())>Edit</button>
    <button id="remove" onclick=remove(${dlt})>Delete</button>`;
    row.insertCell().innerHTML = cell;
}

function remove(dlt) {
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
function edit(dlt) {
    let editData = localStorage.getItem('data') || '[]';
    editData = JSON.parse(editData);
    // let fields = ["departFrom", "destination", "date", "time", "price"];
    var displayData = editData.filter((item) =>
        editData.indexOf(item) === dlt)
    // console.log(displayData);
    let displayItem = displayData[displayData.length - 1];
    updateItemID = document.getElementById('id').value;
    document.getElementById('depart').value = displayItem.departFrom;
    document.getElementById('destination').value = displayItem.destination;
    document.getElementById('date').value = displayItem.date;
    document.getElementById('time').value = displayItem.time;
    document.getElementById('price').value = displayItem.price;
}
function update(updateItemID) {
    let updateData = localStorage.getItem('data') || '[]';
    updateData = JSON.parse(updateData);

    var updatedData = updateData.filter((item) =>
    updateData.indexOf(item) === updateItemID)
    updateItemID = document.getElementById('id').value;
    let departFrom = document.getElementById("depart").value;
    let destination = document.getElementById("destination").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let price = document.getElementById("price").value;
    let obj = { departFrom, destination, date, time, price };
    console.log(updateItemID);
    updateData.splice(updateItemID, 1, obj);
}
function addToCart() {
    let ticketCart = document.getElementById("ticketCart");
    let row1 = ticketCart.insertRow();
    const storedData = localStorage.getItem("data") || "[]";
    const itemArray = JSON.parse(storedData);
    let fields1 = ["id", "departFrom", "destination", "date", "time", "price"];

    for (let i = 0; i < fields1.length; i++) {
        row1.insertCell(i).innerHTML = itemArray[itemArray.length - 1][fields1[i]];
    }
    const counterCell = `<div class='button'><button class='increase' onclick="increase()">+</button> 
                    <input type="text" id="number" value = "0"> 
                    <button class='decrease' onclick="decrease()">-</button></div>`;
    row1.insertCell().innerHTML = counterCell
    localStorage.setItem('data', JSON.stringify(itemArray));
}

function showId() {
    let arrOfID = {}
    const storedData = localStorage.getItem("data") || "[]";
    const itemArray = JSON.parse(storedData);
    let mySelect = document.getElementById('select');
    let newOption = document.createElement('option');

    //iterate through the array, find id, append all the id to child 
    // newOption.innerHTML = itemArray[itemArray.length - 1].id;
    // mySelect.appendChild(newOption);
    for (let i = 0; i < itemArray.length; i++) {
        newOption.innerHTML = itemArray[i].id;
        mySelect.appendChild(newOption);
    }
}

function increase() {
    let storedData = localStorage.getItem('data') || '[]';
    storedData = JSON.parse(storedData);
    let counter = parseInt(document.getElementById('number').value);
    counter = isNaN(counter) ? 0 : counter;
    counter++;
    document.getElementById('number').value = counter;
    // const priceElement = document.getElementById('price');
    // let price = priceElement.value ? priceElement.value : 0;
    // let flightTable = document.getElementById('ticketCart')
    let price = storedData.find((obj) => obj.id === storedData[storedData.length - 1].id).price;
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
    if (counter <= 0) {
        // itemInCart.splice(delt, 1);
        ticketTable.deleteRow(1);
    }
    localStorage.setItem('data', JSON.stringify(storedData));
    document.getElementById('number').value = counter;
    // let price = document.querySelector('#price').value;
    let price = storedData.find((obj) => obj.id === storedData[storedData.length - 1].id).price;
    let totalPrice = parseInt(price) * counter;
    document.querySelector('#total-price').value = totalPrice;
}
