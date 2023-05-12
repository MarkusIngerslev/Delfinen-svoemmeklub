"use strict";

import { initViews } from "./view-router.js";
import { determineWhatIsShownInNavbar } from "./dom.js";
import { getMembers, getResults } from "./rest-data.js";
import { showCompetitiveMembers } from "./coach.js";

let members;
let results;

window.addEventListener("load", startApp);

async function startApp() {
  console.log("app is running");
  initViews();
  updateMembersTable();

  document.querySelector("#login-btn").addEventListener("click", loginClicked);
  document.querySelector("#logon-btn").addEventListener("click", loginInLoginClicked);

  //-- Eventlistener på knap i detailedView for formanden, som lukker vinduet ---//
  const closeButton = document.querySelector("#close-button");
  closeButton.addEventListener("click", function () {
    const dialog = document.querySelector("#memberDetailedView");
    dialog.close();
  });

  document.querySelector(".btn-create").addEventListener("click", createMemberClicked);
}

function loginClicked() {
  document.querySelector("#login").showModal();
  document.querySelector("#login").scrollTop = 0;
}

async function loginInLoginClicked() {
  members = await getMembers();
  results = await getResults();
  determineWhatIsShownInNavbar();
  // tilføjet event listener for ny lavet coach knap.
  // document.querySelector("#for-coach-btn").addEventListener("click", showCompetitiveMembers(members, results));
  document.querySelector("#login").close();
}

async function updateMembersTable() {
  members = await getMembers();
  results = await getResults();
  console.log(members);
  console.log(results);
  showMembersChairman();
  showMembersForCashier(members);
  showCompetitiveMembers(members, results);
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
  document.querySelector("#dialog-header").textContent = member.firstname + " " + member.lastname;

  document.querySelector("#member-personalInfo").innerHTML =
    "Alder: " + member.age + " år" + "<br>" + "Telefon: " + member.phone + "<br>" + "E-mail: " + member.email;

  document.querySelector("#member-swimmerInfo").innerHTML = "Medlemskabsstatus: ";
  if (member.active) {
    document.querySelector("#member-swimmerInfo").innerHTML += "Aktiv" + "<br>";
  } else {
    document.querySelector("#member-swimmerInfo").innerHTML += "Passiv" + "<br>";
  }

  document.querySelector("#member-swimmerInfo").innerHTML += "Medlemskabstype: " + member.activityForm + "<br>";

  if (member.disciplines && member.disciplines.length > 0) {
    document.querySelector("#member-swimmerInfo").innerHTML += "Discipliner: " + member.disciplines.join(", ") + "<br>";
  }

  if (member.coach && member.coach !== "") {
    document.querySelector("#member-swimmerInfo").innerHTML += "Træner: " + member.coach + "<br>";
  }

  document.querySelector("#membershipInfo").innerHTML =
    "Startede i klubben: " + member.subscriptionStart + "<br>" + "Stoppede i klubben: " + member.subscriptionEnd;

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
  showMembersForCashier(members);
}

// ========== Cashier functions ========== //

function showMembersForCashier(membersList) {
  const table = document.querySelector("#cashier-members-tbody");
  for (let i = 0; i < table.rows.length; i++) {
    table.deleteRow(i);
  }
  for (const member of membersList) {
    showMemberForCashier(member);
  }
}

function showMemberForCashier(memberObject) {
  correctRestance(memberObject);

  const htmlCashier = /*html*/ `
                    <tr>
                      <td>${memberObject.firstname} ${memberObject.lastname}</td>
                      <td>${memberObject.age}</td>
                      <td>${memberObject.email}</td>
                      <td>${memberObject.phone}</td>
                      <td>${memberObject.subscriptionStart}</td>
                      <td>${memberObject.subscriptionEnd}</td>
                      <td>${memberObject.restance}</td>
                    </tr>
  `;

  document.querySelector("#cashier-members-tbody").insertAdjacentHTML("beforeend", htmlCashier);

  document.querySelector("#cashier-members-tbody tr:last-child").addEventListener("click", cashierMemberClicked);

  function cashierMemberClicked(event) {
    // open dialog and call another function to fill dialog window
    event.preventDefault;
    document.querySelector("#cashier-dialog-btn-close").addEventListener("click", closeCashierDialog);

    document.querySelector("#cashier-dialog-name").textContent = `Navn: ${memberObject.firstname} ${memberObject.lastname}`;
    document.querySelector("#cashier-dialog-age").textContent = `Alder: ${memberObject.age}`;
    document.querySelector("#cashier-dialog-phone").textContent = `Telefon: ${memberObject.phone}`;
    document.querySelector("#cashier-dialog-mail").textContent = `E-mail: ${memberObject.email}`;
    document.querySelector("#cashier-dialog-sub-start").textContent = `Tilmeldt: ${memberObject.subscriptionStart}`;
    document.querySelector("#cashier-dialog-sub-end").textContent = `Medlemskab ophører: ${memberObject.subscriptionEnd}`;
    document.querySelector("#cashier-dialog-restance").textContent = `Restance: ${memberObject.restance}`;

    document.querySelector("#cashier-dialog").showModal();
  }
}

function closeCashierDialog() {
  document.querySelector("#cashier-dialog").close();
}

function correctRestance(memberObject) {
  if (memberObject.restance) {
    memberObject.restance = "Ja!";
  } else {
    memberObject.restance = "Nej!";
  }
}
