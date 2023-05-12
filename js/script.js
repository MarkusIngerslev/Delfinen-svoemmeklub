"use strict";

import { initViews } from "./view-router.js";
import { determineWhatIsShownInNavbar } from "./dom.js";
import { getMembers, getResults } from "./rest-data.js";



let members;
let results;

window.addEventListener("load", startApp);

function startApp() {
  console.log("app is running");
  initViews();
  updateMembersTable();

  document.querySelector("#login-btn").addEventListener("click", loginClicked);
  document
    .querySelector("#logon-btn")
    .addEventListener("click", loginInLoginClicked);

  //-- Eventlistener på knap i detailedView for formanden, som lukker vinduet ---//
  const closeButton = document.querySelector("#close-button");
  closeButton.addEventListener("click", function () {
    const dialog = document.querySelector("#memberDetailedView");
    dialog.close();
  });

  document
    .querySelector(".btn-create")
    .addEventListener("click", createMemberClicked);
}

function loginClicked() {
  document.querySelector("#login").showModal();
  document.querySelector("#login").scrollTop = 0;
}

function loginInLoginClicked() {
  determineWhatIsShownInNavbar();
  document.querySelector("#login").close();
}
async function updateMembersTable() {
  members = await getMembers();
  results = await getResults();
  console.log(members);
  console.log(results);
  showMembersChairman();
}

function showMembersChairman() {
  var table = document.getElementById("membersTable");
  members.forEach(function (member) {
    var row = `
      <tr class="table-item">
        <td>${member.firstname}</td>
        <td>${member.lastname}</td>
        <td>${member.age}</td>
        <td>${member.phone}</td>
        <td>${member.email}</td>
        <td>${member.activityForm}</td>
        <td>${member.coach}</td>
        <td><button class="btn-update" data-id="${member.id}">Opdater</button></td>
        <td><button class="btn-delete" data-id="${member.id}">Slet</button></td>
      </tr>
    `;
    table.insertAdjacentHTML("beforeend", row);

    var tableItems = document.querySelectorAll(".table-item");
    tableItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        memberClicked(members[index]);
      });
    });

    document
      .querySelectorAll("#membersTable tr:last-child button")

      .forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent event from bubbling up to grid-item
        });
      });
  });
}

function memberClicked(member) {
  var dialog = document.querySelector("#memberDetailedView");
  document.querySelector("#dialog-header").textContent =
    member.firstname + " " + member.lastname;

  document.querySelector("#member-personalInfo").innerHTML =
    "Alder: " +
    member.age +
    " år" +
    "<br>" +
    "Telefon: " +
    member.phone +
    "<br>" +
    "E-mail: " +
    member.email;

  document.querySelector("#member-swimmerInfo").innerHTML =
    "Medlemskabsstatus: ";
  if (member.active) {
    document.querySelector("#member-swimmerInfo").innerHTML += "Aktiv" + "<br>";
  } else {
    document.querySelector("#member-swimmerInfo").innerHTML +=
      "Passiv" + "<br>";
  }

  document.querySelector("#member-swimmerInfo").innerHTML +=
    "Medlemskabstype: " + member.activityForm + "<br>";

  if (member.disciplines && member.disciplines.length > 0) {
    document.querySelector("#member-swimmerInfo").innerHTML +=
      "Discipliner: " + member.disciplines.join(", ") + "<br>";
  }

  if (member.coach && member.coach !== "") {
    document.querySelector("#member-swimmerInfo").innerHTML +=
      "Træner: " + member.coach + "<br>";
  }

  document.querySelector("#membershipInfo").innerHTML =
    "Startede i klubben: " +
    member.subscriptionStart +
    "<br>" +
    "Stoppede i klubben: " +
    member.subscriptionEnd;

  if (!dialog.open) {
    dialog.showModal();
    dialog.scrollTop = 0;
  }
}

document.querySelector("#forChairman").insertAdjacentHTML(
  "beforeend",
  `
<h1>Medlemmer</h1>
<button class="btn-create">Nyt medlem</button>
  <table id="membersTable" class="table-view">
        <tr>
        <th>Fornavn</th>
        <th>Efternavn</th>
        <th>Alder</th>
        <th>Telefon</th>
        <th>Mail</th>
        <th>Aktivitetsform</th>
        <th>Træner</th>
        <th>Opdater</th>
        <th>Slet</th>
        </tr>        
        </table>
        `
);

//-- Create member //

function createMemberClicked() {
  document.querySelector("#create-member").showModal();
  document.querySelector("#create-member").scrollTop = 0;
}
