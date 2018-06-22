//use strict for best practice
'use strict';
let employeesAll = null;

getEmployees();

// Get the 12 random employees with API
function getEmployees() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
  if(xhr.readyState === 4) {
    employeesAll = JSON.parse(xhr.responseText).results;
    initApplication();
  }
  };
  xhr.open("GET", "https://randomuser.me/api/?nat=us,gb&results=12");
  xhr.send();
}

// Setting up application
function initApplication() {
  let searchBox = document.getElementById("search");
  let clearButton = document.getElementsByTagName("button")[0];

  fillCards(employeesAll);
  setupModal(employeesAll);

  searchBox.addEventListener("keyup", function() {
    searchEmployees();
  });

  clearButton.addEventListener("click", function() {
    fillCards(employeesAll);
    setupModal(employeesAll);
  });

  document.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
    e.preventDefault();
  });
}

// adding employee information
function fillCards(employeeList) {
  for(let i = 0; i < employeeList.length; i++) {
    let currentCard = document.getElementById(`${i}`);
    currentCard.getElementsByTagName("img")[0].setAttribute("src", `${employeeList[i].picture.large}`);
    currentCard.getElementsByClassName("fullname")[0].textContent = `${employeeList[i].name.first}  ${employeeList[i].name.last}`;
    currentCard.getElementsByClassName("email")[0].textContent = `${employeeList[i].email}`;
    currentCard.getElementsByClassName("city")[0].textContent = `${employeeList[i].location.city}`;
    currentCard.style.display = "block";
  }
 }


 // Set up Modal
 function setupModal(employeeList) {
    let modal = document.getElementById('modal');
    let cards = document.getElementsByClassName("card");
    let closeX = document.getElementsByClassName("close")[0];
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    for(let card of cards) {
      card.onclick = () => {
        modal.style.display = "block";
        let index = parseInt(card.id);
        fillModal(employeeList[index]);
      };
    }
    // Click X to close Modal
    closeX.onclick = () => {
        modal.style.display = "none";
    };

    // Filling the modal with employee information
    prev.onclick = (e) => {
      let currentEmail = document.getElementById("modal-email").textContent.toLowerCase();
      let employeeId = getEmployeeId(currentEmail);
      let adjustedIndex = ((employeeId - 1) + employeesAll.length) % employeesAll.length;
      fillModal(employeesAll[adjustedIndex]);
    };
    next.onclick = (e) => {
      let currentEmail = document.getElementById("modal-email").textContent.toLowerCase();
      let employeeId = getEmployeeId(currentEmail);
      let adjustedIndex = ((employeeId + 1) + employeesAll.length) % employeesAll.length;
      fillModal(employeesAll[adjustedIndex]);
    };
  }

// Identify the employees
function getEmployeeId(email) {
    let personId;
    for(let i = 0; i < employeesAll.length; i++) {
      if(employeesAll[i].email === email) {
        personId = i;
        return i;
      }
    }
    return null;
}

function fillModal(employee) {
  let modalContent = document.getElementById("modal-content");
  let country;
  let birthday = new Date(employee.dob).toLocaleDateString();
  country = `${employee.nat}` === "US" ? "United States" : "Great Britain";

  modalContent.getElementsByTagName("img")[0].setAttribute("src", `${employee.picture.large}`);
  document.getElementById("modal-fullname").innerText = `${employee.name.first}  ${employee.name.last}`;
  document.getElementById("modal-username").innerText = `${employee.login.username}`;
  document.getElementById("modal-email").innerText = `${employee.email}`;
  document.getElementById("modal-telephone").innerText = `${employee.phone}`;
  document.getElementById("modal-street").innerText = `${employee.location.street}\u00A0\u00A0${employee.location.city}, ${country}\u00A0\u00A0${employee.location.postcode}`;
  document.getElementById("modal-birthdate").innerText = `Birthday: ${employee.dob.date}`;
}

  function searchEmployees() {
    let searchResults = [];
    hideAllEmployees();
    let searchString = document.getElementById("search").value.toLowerCase();
    if(searchString == "") {
        fillCards(employeesAll);
    }

    // code for hen user types in textbook looking for an employee
    for(var i = 0; i < employeesAll.length; i++) {
        let firstName = employeesAll[i].name.first.toLowerCase();
        let lastName = employeesAll[i].name.last.toLowerCase();
        let username = employeesAll[i].login.username.toLowerCase();
        if(firstName.includes(searchString) || lastName.includes(searchString) || username.includes(searchString) ) {
            searchResults.push(employeesAll[i]);
        }
    }

    fillCards(searchResults);
    setupModal(searchResults);
  }

// Hide all the employees
function hideAllEmployees() {
  let cards = document.getElementsByClassName("card");
  for(let card of cards) {
    card.style.display = "none";
  }
}
