let itemArray = [];
let cartItem = [];
let isEditMode = false;
let row = null;
let storedData = localStorage.getItem("data") || "[]";
storedData = JSON.parse(storedData);

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
    let index = itemArray.length - 1;
    isEditMode ? saveData() : insertData(dataEntered, index);
    closeForm()
}

function retrieveData() {
    let departFrom = document.getElementById("depart").value;
    let destination = document.getElementById("destination").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let price = document.getElementById("price").value;
    let obj = { departFrom, destination, date, time, price };
    return obj;
}

function readLocalStorage(dataEntered) {
    if (!isEditMode) {
        let uniqueId = 1;
        if (storedData.length > 0) {
            let maxId = storedData.reduce((max, item) => (item.id > max ? item.id : max), 0);
            uniqueId = maxId + 1;
        }
        dataEntered.id = uniqueId;
        storedData.push(dataEntered);
        localStorage.setItem('data', JSON.stringify(storedData));
    }
    return storedData;
}

function showData() {
    let tableBody = document.getElementById('table-body');

    if (tableBody) {
        tableBody.innerHTML = '';
    }
    storedData.forEach((flightInfo, index) => insertData(flightInfo, index));
    showId();
}

function insertData(newFlightInfo, index) {
    let fields = ["id", "departFrom", "destination", "date", "time", "price", 'action'];
    let flightTable = document.getElementById('table-body');
    row = flightTable.insertRow();
    fields.forEach(key => {
        row.insertCell().innerHTML = (key == "action")
            ? `<button id="edit" onclick=editData(${index},openForm())>Edit</button>
            <button id="remove" onclick=removeData(${index})>Delete</button>`
            : newFlightInfo[key];
    })
    showId();
}

function removeData(deletedItemID) {
    storedData.splice(deletedItemID, 1);
    localStorage.setItem('data', JSON.stringify(storedData));
    let table = document.getElementById('flightTable');
    for (let i = 1; i < table.rows.length;) {
        table.deleteRow(i);
    }
    showData();
}

function editData(editedItemID) {
    isEditMode = true;

    let displayData = storedData.filter((item) =>
        storedData.indexOf(item) === editedItemID)

    let displayItem = displayData[displayData.length - 1];

    document.getElementById('flight-id').value = displayItem.id;
    document.getElementById('depart').value = displayItem.departFrom;
    document.getElementById('destination').value = displayItem.destination;
    document.getElementById('date').value = displayItem.date;
    document.getElementById('time').value = displayItem.time;
    document.getElementById('price').value = displayItem.price;
}

function saveData() {
    let itemID = parseInt(document.getElementById("flight-id").value);
    let sourceItem = storedData.find((item) => item.id === itemID);

    sourceItem.departFrom = document.getElementById("depart").value;
    sourceItem.destination = document.getElementById("destination").value;
    sourceItem.date = document.getElementById("date").value;
    sourceItem.time = document.getElementById("time").value;
    sourceItem.price = document.getElementById("price").value;

    localStorage.setItem('data', JSON.stringify(storedData));
    showData();
}

function showId() {
    let selectElement = document.getElementById('select');
    let optionElement = document.createElement('option');

    if (selectElement) {
        selectElement.innerHTML = '';
    }

    optionElement.textContent = "";
    selectElement.appendChild(optionElement);
    let rowID = storedData.map(itemId => itemId.id);
    rowID.forEach(list => {
        let option = document.createElement('option');
        option.textContent = list;
        selectElement.appendChild(option);
    })

}

function addToCart() {
    let selectedId = parseInt(document.getElementById('select').value);

    let tableRows = document.getElementById("tableBody").getElementsByTagName("tr");
    let valueOfIndex;

    let selectedItem = storedData.find(obj => obj.id === selectedId);

    let itemId = selectedItem.id;
    let itemDepart = selectedItem.departFrom;
    let itemDestination = selectedItem.destination;
    let itemDate = selectedItem.date;
    let itemTime = selectedItem.time;
    let itemPrice = selectedItem.price;

    for (let row of tableRows) {
        let rowItems = row.getElementsByTagName("td");
        if (rowItems[0].innerHTML == selectedId) {
            valueOfIndex = selectedId
        }
    }

    if (!valueOfIndex) {
        cartItem.push({ id: itemId, departFrom: itemDepart, destination: itemDestination, date: itemDate, time: itemTime, price: itemPrice, quantity: 1 });
    }

    displayCartItem();
}

function displayCartItem() {
    let ticketCart = document.getElementById("tableBody");
    ticketCart.innerHTML = '';
    cartItem.forEach((item, index) => {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.id}</td>
            <td>${item.departFrom}</td>
            <td>${item.destination}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.price}</td>
            <td><button class='increase' onclick="increase(${index})">+</button> 
            <input type="text" id="number" value = ${item.quantity}> 
            <button class='decrease' onclick="decrease(${index})">-</button></td>
            `;
        ticketCart.appendChild(newRow);
    })
}

function increase(index) {
    let subTotal = 0;
    let totalPrice = 0;
    let item = cartItem[index];
    item.quantity++;
    subTotal += parseInt(item.price) * item.quantity;
    totalPrice += totalPrice + subTotal;
    document.getElementById('total-price').value = totalPrice;

    displayCartItem();
}

function decrease(index) {
    let subTotal = 0;
    let totalPrice = 0;
    let selectElement = document.getElementById('select');
    let ticketCart = document.getElementById("tableBody");
    let item = cartItem[index];
    if (item.quantity >= 0) {
        item.quantity--;
        if (item.quantity <= 0) {
            cartItem.splice(index, 1);
            if(ticketCart.innerHTML = '') {
                selectElement.selectedIndex = 0;
                document.querySelector('#total-price').value = '';
            }
        } else {
            subTotal += parseInt(item.price) * item.quantity;
            totalPrice += subTotal;
            document.getElementById('total-price').value = totalPrice;
        }
        if(ticketCart.innerHTML = '') {
            selectElement.selectedIndex = 0;
            document.querySelector('#total-price').value = '';
        }
        displayCartItem();
    }
}
document.querySelector('#total-price').value = '';