"use strict";

import { members, updateMembersTable } from "./script.js";
import { createMember } from "./helpers.js";
import { deleteMember, updateMemberChairman } from "./rest-data.js";

//-- Eventlistener på knap i detailedView for formanden, som lukker vinduet ---//
const closeButton = document.querySelector("#close-button");
closeButton.addEventListener("click", function () {
  const dialog = document.querySelector("#memberDetailedView");
  dialog.close();
});

const closeButtonCreateMember = document.querySelector("#create-close-btn");
closeButtonCreateMember.addEventListener("click", function () {
  const dialog = document.querySelector("#create-member");
  dialog.close();
});

document.querySelector("form#form-create").addEventListener("submit", createMemberSubmitted);

const closeButtonDelete = document.querySelector("#deny-delete-btn");
closeButtonDelete.addEventListener("click", function () {
  const dialogClose = document.querySelector("#dialog-delete-member");
  dialogClose.close();
});

const closeButtonUpdate = document.querySelector("#update-close-btn-chairman");
closeButtonUpdate.addEventListener("click", function () {
  const dialogClose = document.querySelector("#update-member");
  dialogClose.close();
});

document.querySelector("form#form-delete-member").addEventListener("submit", deleteMemberConfirmed);

document.querySelector("form#form-update-chairman").addEventListener("submit", updateMemberConfirmed);

document.querySelector("#forChairman").insertAdjacentHTML(
  "beforeend",
  `
  <h1>Medlemmer</h1>
  <button class="btn-create">Nyt medlem</button>
  <table id="membersTable" class="table-view">
    <thead>
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
    </thead>
    <tbody id="membersTableBody"></tbody>
  </table>
`
);

document.querySelector(".btn-create").addEventListener("click", createMemberClicked);

function showMembersChairman(members) {
  const tableBody = document.querySelector("#membersTableBody");
  tableBody.innerHTML = "";
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
    tableBody.insertAdjacentHTML("beforeend", row);

    var tableItems = document.querySelectorAll(".table-item");
    tableItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        memberClicked(members[index]);
      });
    });

    document.querySelectorAll("#membersTableBody tr:last-child button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to grid-item
      });
    });
  });
  document.querySelectorAll(".btn-delete").forEach(function (button) {
    button.addEventListener("click", function () {
      const memberId = button.dataset.id;
      const member = members.find((member) => member.id === memberId);
      if (member) {
        deleteClickedChairman(member);
      }
    });
  });

  document.querySelectorAll(".btn-update").forEach(function (button) {
    button.addEventListener("click", function () {
      const memberId = button.dataset.id;
      const member = members.find((member) => member.id === memberId);
      if (member) {
        updateMemberChairmanClicked(member);
      }
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

  // Format the subscription dates before displaying them
  let subscriptionStart = member.subscriptionStart ? member.subscriptionStart : "";
  let subscriptionEnd = member.subscriptionEnd ? member.subscriptionEnd : "";

  document.querySelector("#membershipInfo").innerHTML =
    "Startede i klubben: " + subscriptionStart + "<br>" + "Stoppede i klubben: " + subscriptionEnd;

  if (!dialog.open) {
    dialog.showModal();
    dialog.scrollTop = 0;
  }
}

//-- Create member chairman //

function createMemberClicked() {
  document.querySelector("#create-member").showModal();
  document.querySelector("#create-member").scrollTop = 0;
}

function formatDate(dateString) {
  if (!dateString || isNaN(Date.parse(dateString))) {
    return ""; // Return an empty string for invalid or empty date string
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

async function createMemberSubmitted(event) {
  event.preventDefault();
  const form = document.querySelector("form#form-create");
  const member = {
    firstname: form.querySelector("#firstname-create").value,
    lastname: form.querySelector("#lastname-create").value,
    age: form.querySelector("#age-create").value,
    phone: form.querySelector("#phone-create").value,
    email: form.querySelector("#email-create").value,
    active: form.querySelector('input[name="active"]:checked').value === "active",
    disciplines: form
      .querySelector("#disciplines-create")
      .value.split(",")
      .map((item) => item.trim()),
    coach: form.querySelector("#coach-create").value,
    subscriptionStart: formatDate(form.querySelector("#subscriptionstart-create").value),
  };

  // Set activityForm based on the selected radio button
  const activityFormOption1 = form.querySelector("#activityform-create-option1");
  const activityFormOption2 = form.querySelector("#activityform-create-option2");
  const activityFormOption3 = form.querySelector("#activityform-create-option3");

  if (activityFormOption1.checked) {
    member.activityForm = "konkurrence-svømmer";
  } else if (activityFormOption2.checked) {
    member.activityForm = "motionist-svømmer";
  } else if (activityFormOption3.checked) {
    member.activityForm = "senior-svømmer";
  }

  const response = await createMember(
    member.firstname,
    member.lastname,
    member.age,
    member.phone,
    member.email,
    member.active,
    member.activityForm,
    member.disciplines,
    member.coach,
    member.subscriptionStart
  );

  if (response.ok) {
    console.log("New member added");
    updateMembersTable();
    console.log(members);
  }

  document.querySelector("#create-member").close(); // close dialog
}

// Update member chairman //

function updateMemberChairmanClicked(member) {
  const updateForm = document.querySelector("#form-update-chairman");
  updateForm.id.value = member.id;
  updateForm.firstname.value = member.firstname;
  updateForm.lastname.value = member.lastname;
  updateForm.age.value = member.age;
  updateForm.phone.value = member.phone;
  updateForm.email.value = member.email;
  updateForm.discipliner.value = member.disciplines;
  updateForm.coach.value = member.coach;

  // Set active radio button based on the member's active status
  if (member.active) {
    updateForm.querySelector("#active-update").checked = true;
  } else {
    updateForm.querySelector("#passive-update").checked = true;
  }

  // Set activityform radio button based on the member's activityForm value
  if (member.activityForm === "konkurrence-svømmer") {
    updateForm.querySelector("#activityform-update-option1").checked = true;
  } else if (member.activityForm === "motionist-svømmer") {
    updateForm.querySelector("#activityform-update-option2").checked = true;
  } else if (member.activityForm === "senior-svømmer" || member.activityForm === "Senior-svømmer") {
    updateForm.querySelector("#activityform-update-option3").checked = true;
  }

  // Convert the date format from "mm/dd/yyyy" to "yyyy-mm-dd"
  const subscriptionStart = formatDateReversed(member.subscriptionStart);
  const subscriptionEnd = formatDateReversed(member.subscriptionEnd);

  updateForm.subscriptionstart.value = subscriptionStart;
  updateForm.subscriptionend.value = subscriptionEnd;

  document.querySelector("#update-member").showModal();
}

function formatDateReversed(dateString) {
  if (dateString) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month}-${day}`;
    }
  }
  return dateString || ""; // Return empty string if dateString is undefined
}

async function updateMemberConfirmed(event) {
  event.preventDefault();
  const form = document.querySelector("form#form-update-chairman");
  const id = form.id.value;
  const member = {
    firstname: form.querySelector("#firstname-update").value,
    lastname: form.querySelector("#lastname-update").value,
    age: form.querySelector("#age-update").value,
    phone: form.querySelector("#phone-update").value,
    email: form.querySelector("#email-update").value,
    active: form.querySelector('input[name="active"]:checked').value === "active",
    disciplines: form
      .querySelector("#disciplines-update")
      .value.split(",")
      .map((item) => item.trim()),
    coach: form.querySelector("#coach-update").value,
    subscriptionStart: formatDate(form.querySelector("#subscriptionstart-update").value),
    subscriptionEnd: formatDate(form.querySelector("#subscriptionend-update").value),
  };

  // Set activityForm based on the selected radio button
  const activityFormOption1 = form.querySelector("#activityform-update-option1");
  const activityFormOption2 = form.querySelector("#activityform-update-option2");
  const activityFormOption3 = form.querySelector("#activityform-update-option3");

  if (activityFormOption1.checked) {
    member.activityForm = "Konkurrence-svømmer";
  } else if (activityFormOption2.checked) {
    member.activityForm = "Motionist-svømmer";
  } else if (activityFormOption3.checked) {
    member.activityForm = "Senior-svømmer";
  }

  const response = await updateMemberChairman(id, member);

  if (response.ok) {
    console.log("Member updated");
    updateMembersTable();
    document.querySelector("#update-member").close();

    console.log(members);
  }
}

// Delete member chairman //

function deleteClickedChairman(member) {
  document.querySelector("#dialog-delete-member-name").textContent = member.firstname + " " + member.lastname;
  document.querySelector("#form-delete-member").setAttribute("data-id", member.id);
  document.querySelector("#dialog-delete-member").showModal();
}

async function deleteMemberConfirmed(event) {
  const id = event.target.dataset.id;
  const response = await deleteMember(id);
  if (response.ok) {
    console.log("Member successfully deleted");
    updateMembersTable();
  }
}

// sortering //
// eventlistener på valg af sortering og filtrering //
const selectElementSort = document.getElementById("sort-by");
selectElementSort.addEventListener("change", applySorting);

const selectElementFilter = document.getElementById("filter-by");
selectElementFilter.addEventListener("change", filterUserSelection);

function sortByAnything(list, property) {
  return list.sort((a, b) => {
    const propA = a[property];
    const propB = b[property];

    if (typeof propA === "number" && typeof propB === "number") {
      return propA - propB; // Numeric comparison
    }

    const strA = String(propA).toUpperCase();
    const strB = String(propB).toUpperCase();

    if (strA < strB) {
      return -1;
    }
    if (strA > strB) {
      return 1;
    }
    return 0;
  });
}

function sortMembersAlphabetically(members) {
  console.log(members);
  return sortByAnything(members, "firstname");
}

function sortMembersAlphabeticallyReversed(members) {
  console.log(members);
  return sortByAnything(members, "firstname").reverse();
}

function sortMembersByAge(members) {
  console.log(members);
  return sortByAnything(members, "age");
}

function sortMembersByAgeReversed(members) {
  console.log(members);
  return sortByAnything(members, "age").reverse();
}

function sortMembersByActivityform(members) {
  console.log(members);
  return sortByAnything(members, "activityForm");
}

function sortMembersByCoach(members) {
  console.log(members);
  return sortByAnything(members, "coach").reverse();
}

let filteredMembers = [];

function filterUserSelection() {
  const selectElement = document.getElementById("filter-by");
  const selectedValue = selectElement.value;

  if (selectedValue === "konkurrencesvømmer") {
    filteredMembers = members.filter((member) => member.activityForm === "konkurrence-svømmer");
  } else if (selectedValue === "seniorsvømmer") {
    filteredMembers = members.filter((member) => member.activityForm === "senior-svømmer");
  } else if (selectedValue === "motionistsvømmer") {
    filteredMembers = members.filter(
      (member) => member.activityForm === "motionist-svømmer" || member.activityForm === "Motionist-svømmer"
    );
  } else if (selectedValue === "svømmeremedtræner") {
    filteredMembers = members.filter((member) => member.coach !== "");
  } else {
    filteredMembers = [];
  }
  applySorting();
}

function applySorting() {
  const selectElement = document.getElementById("sort-by");
  const selectedValue = selectElement.value;
  let sortedMembers = members;

  if (filteredMembers.length > 0) {
    // Apply sorting to filtered members
    if (selectedValue === "a-z") {
      sortedMembers = sortMembersAlphabetically(filteredMembers);
    } else if (selectedValue === "z-a") {
      sortedMembers = sortMembersAlphabeticallyReversed(filteredMembers);
    } else if (selectedValue === "age-low-to-high") {
      sortedMembers = sortMembersByAge(filteredMembers);
    } else if (selectedValue === "age-high-to-low") {
      sortedMembers = sortMembersByAgeReversed(filteredMembers);
    } else if (selectedValue === "activityform") {
      sortedMembers = sortMembersByActivityform(filteredMembers);
    } else if (selectedValue === "coach") {
      sortedMembers = sortMembersByCoach(filteredMembers);
    }
  } else {
    // Apply sorting to all members
    if (selectedValue === "a-z") {
      sortedMembers = sortMembersAlphabetically(members);
    } else if (selectedValue === "z-a") {
      sortedMembers = sortMembersAlphabeticallyReversed(members);
    } else if (selectedValue === "age-low-to-high") {
      sortedMembers = sortMembersByAge(members);
    } else if (selectedValue === "age-high-to-low") {
      sortedMembers = sortMembersByAgeReversed(members);
    } else if (selectedValue === "activityform") {
      sortedMembers = sortMembersByActivityform(members);
    } else if (selectedValue === "coach") {
      sortedMembers = sortMembersByCoach(members);
    }
  }

  showMembersChairman(sortedMembers);
}

export { showMembersChairman, createMemberClicked, createMemberSubmitted, formatDate };
