let itemArray = [];
let cartItem = [];
let isEditMode = false;
let row = null;
let storedData = localStorage.getItem("data") || "[]";
storedData = JSON.parse(storedData);

function openForm() {
  isEditMode = false;
  document.getElementById("form").style.display = "block";
  document.getElementById("form-heading").innerText = "Create Data";
}

function closeForm() {
  document.getElementById("form").style.display = "none";

  document.getElementById("flight-id").value = "";
  document.getElementById("depart").value = "";
  document.getElementById("destination").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("price").value = "";
  document.getElementById("numberText").innerHTML = "";
}

// Submit the informations retrieved from the form to array
function Submit() {
  let dataEntered = retrieveData();

  // Check if the price is a valid input
  if (isNaN(dataEntered.price)) {
    document.getElementById("numberText").innerHTML = "Invalid Input";
  } else {
    itemArray = setLocalStorage(dataEntered);
    let index = itemArray.length - 1;

    // Check if the data should be updated or a new data should be inserted in the array
    isEditMode ? saveData() : insertData(dataEntered, index);
    closeForm();
  }
}

// Retrieve the data from the form and set it to an object
function retrieveData() {
  let departFrom = document.getElementById("depart").value;
  let destination = document.getElementById("destination").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;
  let price = Number(document.getElementById("price").value); // Convert to number
  let obj = { departFrom, destination, date, time, price };
  return obj;
}

// set the data to the localstorage
function setLocalStorage(dataEntered) {
  if (!isEditMode) {
    // Generate a unique Id for each item added in the array
    let uniqueId = 1;
    if (storedData.length > 0) {
      let maxId = storedData.reduce(
        (max, item) => (item.id > max ? item.id : max),
        0
      );
      uniqueId = maxId + 1;
    }
    dataEntered.id = uniqueId;
    storedData.push(dataEntered);
    localStorage.setItem("data", JSON.stringify(storedData));
  }
  return storedData;
}

function showData() {
  let tableBody = document.getElementById("table-body");

  if (tableBody) {
    tableBody.innerHTML = "";
  }
  storedData.forEach((flightInfo, index) => insertData(flightInfo, index));
  showId();
}

function insertData(newFlightInfo, index) {
  let fields = [
    "id",
    "departFrom",
    "destination",
    "date",
    "time",
    "price",
    "action",
  ];
  let flightTable = document.getElementById("table-body");
  row = flightTable.insertRow();
  fields.forEach((key) => {
    row.insertCell().innerHTML =
      key == "action"
        ? `<button id="edit" onclick=editData(${index},openForm())>Edit</button>
            <button id="remove" onclick=removeData(${index})>Delete</button>`
        : newFlightInfo[key];
  });
  showId();
}

function removeData(deletedItemIndex) {
  let table = document.getElementById("flightTable");
  let deletedItemId = storedData[deletedItemIndex].id;

  storedData.splice(deletedItemIndex, 1);
  localStorage.setItem("data", JSON.stringify(storedData));

  for (let i = 1; i < table.rows.length; ) {
    table.deleteRow(i);
  }
  showData();
  // Remove the item from the cart table if it exists
  let cartItemIndex = cartItem.findIndex((item) => item.id === deletedItemId);
  if (cartItemIndex >= 0) {
    cartItem.splice(cartItemIndex, 1);
    displayCartItem();
  }
}

function editData(editedItemIndex) {
  isEditMode = true;
  document.getElementById("form-heading").innerText = "Edit Data";

  let displayData = storedData.filter(
    (item) => storedData.indexOf(item) === editedItemIndex
  );

  let displayItem = displayData[displayData.length - 1];

  document.getElementById("flight-id").value = displayItem.id;
  document.getElementById("depart").value = displayItem.departFrom;
  document.getElementById("destination").value = displayItem.destination;
  document.getElementById("date").value = displayItem.date;
  document.getElementById("time").value = displayItem.time;
  document.getElementById("price").value = displayItem.price;
}

function saveData() {
  let itemID = parseInt(document.getElementById("flight-id").value);

  let sourceItem = storedData.find((item) => item.id === itemID);

  sourceItem.departFrom = document.getElementById("depart").value;
  sourceItem.destination = document.getElementById("destination").value;
  sourceItem.date = document.getElementById("date").value;
  sourceItem.time = document.getElementById("time").value;
  sourceItem.price = document.getElementById("price").value;

  let cartItemIndex = cartItem.findIndex((item) => item.id === itemID);
  if (cartItemIndex !== -1) {
    Object.assign(cartItem[cartItemIndex], sourceItem);
  }

  localStorage.setItem("data", JSON.stringify(storedData));
  showData();
  if (cartItem.length > 0) {
    displayCartItem();
  }

  closeForm();
}

// Get the id of each item from the array and set it to cart tables dropdown menu
function showId() {
  let selectElement = document.getElementById("select");
  let optionElement = document.createElement("option");

  if (selectElement) {
    selectElement.innerHTML = "";
  }

  optionElement.textContent = "";
  selectElement.appendChild(optionElement);

  // Iterate through each element to find id and assign those to a new variable
  let rowID = storedData.map((itemId) => itemId.id);

  // Iterate through each element of the newly returned array of ID and assign those in each option element of the dropdown menu
  rowID.forEach((list) => {
    let option = document.createElement("option");
    option.textContent = list;
    selectElement.appendChild(option);
  });
}

// Add datas from the existing array to a new array for cart table
function addToCart() {
  let selectedId = parseInt(document.getElementById("select").value);

  let tableRows = document
    .getElementById("tableBody")
    .getElementsByTagName("tr");
  let valueOfIndex;

  // iterate through existing array, check if the selected id matches with the id from the object's element
  let selectedItem = storedData.find((obj) => obj.id === selectedId);

  // set the values of matched object to newly assigned variables
  let itemId = selectedItem.id;
  let itemDepart = selectedItem.departFrom;
  let itemDestination = selectedItem.destination;
  let itemDate = selectedItem.date;
  let itemTime = selectedItem.time;
  let itemPrice = selectedItem.price;

  // Iterate through a specific table row to find the value of first index of the row items
  // If the value matches with selected id from the dropdown and assing to a new variable
  for (let row of tableRows) {
    let rowItems = row.getElementsByTagName("td");
    if (rowItems[0].innerHTML == selectedId) {
      valueOfIndex = rowItems[0].innerHTML;
    }
  }

  if (!valueOfIndex) {
    cartItem.push({
      id: itemId,
      departFrom: itemDepart,
      destination: itemDestination,
      date: itemDate,
      time: itemTime,
      price: itemPrice,
      quantity: 1,
    });
  }
  displayCartItem();
}

// Creates new rows and sets the datas from the array to the newly created row
function displayCartItem() {
  let ticketCart = document.getElementById("tableBody");
  ticketCart.innerHTML = "";
  let totalPrice = 0;
  cartItem.forEach((item, index) => {
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${item.id}</td>
            <td>${item.departFrom}</td>
            <td>${item.destination}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>$${item.price}</td>
            <td><button class='increase' onclick="increaseItemQuantity(${index})">+</button> 
            <input type="number" id="number" value = ${item.quantity} onchange = 'updateQuantity(${index}, this.value)'> 
            <button class='decrease' onclick="decreaseItemQuantity(${index})">-</button></td>
            `;
    ticketCart.appendChild(newRow);

    // Calculate the total price of each items added in the cart and show the grand total price of all the items
    totalPrice += item.price * item.quantity;
  });
  document.getElementById("total-price").value = `$${totalPrice}`;
}

function increaseItemQuantity(index) {
  cartItem[index].quantity++;

  displayCartItem();
}

function decreaseItemQuantity(index) {
  let selectElement = document.getElementById("select");
  let item = cartItem[index];

  // Check the quantity of the item
  // Check the quantity is 0 or not, if the quantity decreased to 0 the item will be deleted from the array
  // Check the carts length is 0 or not to clear the total price label and select element if there is no items in the cart
  if (item.quantity >= 0) {
    item.quantity--;
    if (item.quantity === 0) {
      cartItem.splice(index, 1);
      selectElement.selectedIndex = 0;
    }
    if (cartItem.length === 0) {
      document.querySelector("#total-price").value = "";
    }
    displayCartItem();
  }
}
function updateQuantity(index, value) {
  let selectElement = document.getElementById("select");
  let item = cartItem[index];
  if (!isNaN(value) && value >= 0) {
    item.quantity = value;
  }
  if (item.quantity === 0) {
    cartItem.splice(index, 1);
    selectElement.selectedIndex = 0;
  }
  displayCartItem();
}
