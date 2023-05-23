import { members } from "./script.js";

let memberInRestance;
// ========== Cashier functions ========== //

function showMembersForCashier(membersList) {
  //#cashier-members-tbody sættes til en variable kaldt "table"
  const table = document.querySelector("#cashier-members-tbody");
  table.innerHTML = "";

  insertAccountingResults();

  //alle rows i tabel nulstilles til tom string
  document.querySelector("#cashier-members-tbody").textContent = "";

  //en row skabes i table for hvert medlem i members array
  for (const member of membersList) {
    showMemberForCashier(member);
  }
}

//function for creating row member element
function showMemberForCashier(memberObject) {
  const restance = correctRestance(memberObject);

  const htmlCashier = /*html*/ `
                    <tr>
                      <td>${memberObject.firstname} ${memberObject.lastname}</td>
                      <td>${memberObject.age}</td>
                      <td>${memberObject.email}</td>
                      <td>${memberObject.phone}</td>
                      <td>${memberObject.subscriptionStart}</td>
                      <td>${memberObject.subscriptionEnd}</td>
                      <td>${restance}</td>
                    </tr>
  `;

  document.querySelector("#cashier-members-tbody").insertAdjacentHTML("beforeend", htmlCashier);

  // adding evenlistener for showing dialog view on table row subject
  document.querySelector("#cashier-members-tbody tr:last-child").addEventListener("click", cashierMemberClicked);

  //function for creating dialog view(cashier)
  function cashierMemberClicked(event) {
    event.preventDefault;

    // adding evenlistener for close btn in dialog view
    document.querySelector("#cashier-dialog-btn-close").addEventListener("click", closeCashierDialog);

    // setting textcontent value equal to clicked member
    document.querySelector(
      "#cashier-dialog-name"
    ).textContent = `Navn: ${memberObject.firstname} ${memberObject.lastname}`;
    document.querySelector("#cashier-dialog-age").textContent = `Alder: ${memberObject.age}`;
    document.querySelector("#cashier-dialog-phone").textContent = `Telefon: ${memberObject.phone}`;
    document.querySelector("#cashier-dialog-mail").textContent = `E-mail: ${memberObject.email}`;
    document.querySelector("#cashier-dialog-sub-start").textContent = `Tilmeldt: ${memberObject.subscriptionStart}`;
    document.querySelector(
      "#cashier-dialog-sub-end"
    ).textContent = `Medlemskab ophører: ${memberObject.subscriptionEnd}`;
    document.querySelector("#cashier-dialog-restance").textContent = `Restance: ${restance}`;

    // show modal/dialog
    document.querySelector("#cashier-dialog").showModal();
  }
}

//close cashier dialog
function closeCashierDialog() {
  document.querySelector("#cashier-dialog").close();
}

//correcting restance to yes/no instead of true/false
function correctRestance(memberObject) {
  const noRestance = "0 dkk";
  const priceYouth = "1000 dkk";
  const priceSenior = "1600 dkk";
  const pricePensionist = "1200 dkk";
  const pricePassive = "500 dkk";

  if (memberObject.restance && memberObject.age < 18 && memberObject.active) {
    return priceYouth;
  } else if (memberObject.restance && memberObject.age >= 18 && memberObject.age < 60 && memberObject.active) {
    return priceSenior;
  } else if (memberObject.restance && memberObject.age >= 60 && memberObject.active) {
    return pricePensionist;
  } else if (memberObject.restance && !memberObject.active) {
    return pricePassive;
  } else {
    return noRestance;
  }
}

//inserting html article element for accounting overview
function insertAccountingResults() {
  let kontingenter = calculateAllSubscriptions(members);
  let restance = calculateRestance(members);
  let samlet = kontingenter - restance;

  document.querySelector("#kontingenter").textContent = kontingenter;
  document.querySelector("#restance").textContent = restance;
  document.querySelector("#samlet").textContent = samlet;
}

//calculating sum of all subscriptions
function calculateAllSubscriptions(membersList) {
  let result = 0;

  for (let i = 0; i < membersList.length; i++) {
    const element = membersList[i];
    if (element.active && element.age < 18) {
      // active u18 =+ 1000,-
      result += 1000;
    } else if (element.active && element.age >= 18 && element.age <= 60) {
      // active 18+ =+ 1600,-
      result += 1600;
    } else if (element.active && element.age > 60) {
      // active 60+ = (1600 * 0,75) = 1200,-
      result += 1200;
    } else if (!element.active) {
      // inactive = 500,-
      result += 500;
    }
  }

  return result;
}

//calculating sum of members in restance
function calculateRestance(membersList) {
  let result = 0;

  for (let i = 0; i < membersList.length; i++) {
    const element = membersList[i];
    if (element.restance && element.active && element.age < 18) {
      // active u18 =+ 1000,-
      result += 1000;
    } else if (element.restance && element.active && element.age >= 18 && element.age <= 60) {
      // active 18+ =+ 1600,-
      result += 1600;
    } else if (element.restance && element.active && element.age > 60) {
      // active 60+ = (1600 * 0,75) = 1200,-
      result += 1200;
    } else if (element.restance && !element.active) {
      // inactive = 500,-
      result += 500;
    }
  }

  return result;
}

//filtering cashiers list by restance
function cashierFilterByRestance() {
  const restance = document.querySelector("#restance-filter");

  console.log("...");
  if (restance.checked) {
    memberInRestance = members.filter(checkRestance);
    showMembersForCashier(memberInRestance);
  } else {
    showMembersForCashier(members);
  }

  function checkRestance(member) {
    if (member.restance) {
      return member;
    }
  }
}

export { showMembersForCashier, cashierFilterByRestance, insertAccountingResults };
