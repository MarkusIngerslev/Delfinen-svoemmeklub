import { getMembersCoach, updateSwimtimeResult } from "./rest-data.js";
import { results, updateMembersTable } from "./script.js";

// ----- global variable ----- //

let filterList;
let isFilterOn;

// ========== show competitve members ========== //
//import { members } from "./script.js";

async function showCompetitiveMembers(results, members) {
  // event listener til svømmetid update
  document.querySelector("#update-swimtime-coach-form .btn-close-coach").addEventListener("click", cancelUpdate);
  document.querySelector("#update-swimtime-coach-form").addEventListener("submit", updateCoachSwimTime);

  // event listener til sort
  document.querySelector("#sortBy-for-coach").addEventListener("change", sortByForCoach);

  // event listener til filtre
  document.querySelector("#coachFilterTop5").addEventListener("change", filterforCoach);
  document.querySelector("#coachFilterJunior").addEventListener("change", filterforCoach);
  document.querySelector("#coachFilterSenior").addEventListener("change", filterforCoach);

  for (const result of results) {
    const member = members.find((member) => member.id === result.memberId);
    result.member = member;
    // console.log(result);
  }

  showCompetitiveMemberLoop(results);
}

function showCompetitiveMemberLoop(results) {
  document.querySelector("#coach-members-tbody").innerHTML = "";

  for (const result of results) {
    if (result.tournament === false) {
      if (result.member) {
        showCompetitiveMember(result);
      }
    }
  }
}

async function showCompetitiveMember(memberObject) {
  // const member = await getMembersCoach(memberObject.memberId);
  document.querySelector("#coach-members-tbody").insertAdjacentHTML(
    "beforeend",
    /*html*/ `
      <tr>
        <td>${memberObject.member.firstname + " " + memberObject.member.lastname}</td>
        <td>${memberObject.member.age}</td>
        <td>${memberObject.disciplin}</td>
        <td>${memberObject.timeMiliSeconds}ms</td>
        <td>${memberObject.date}</td>
        <td><button class="coachTableUpdateBtn">Opdater svømmetid</button></td>
      </tr>
    `
  );

  document.querySelector("#coach-members-tbody tr:last-child").addEventListener("click", showAthlete);

  document
    .querySelector("#coach-members-tbody tr:last-child .coachTableUpdateBtn")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      coachTableUpdate();
    });

  function showAthlete(event) {
    console.log("athlete clicked");
    event.preventDefault;

    // adding evenlistener for close btn in dialog view
    document.querySelector("#coach-dialog-btn-close").addEventListener("click", closeCoachDialog);

    // setting textcontent value equal to clicked member
    document.querySelector(
      "#coach-dialog-name"
    ).textContent = `Navn: ${memberObject.member.firstname} ${memberObject.lastname}`;
    document.querySelector("#coach-dialog-age").textContent = `Alder: ${memberObject.member.age}`;
    document.querySelector("#coach-dialog-phone").textContent = `Telefon: ${memberObject.member.phone}`;
    document.querySelector("#coach-dialog-mail").textContent = `E-mail: ${memberObject.member.email}`;
    document.querySelector(
      "#coach-dialog-activity-form"
    ).textContent = `Aktivitets-form: ${memberObject.member.activityForm}`;
    document.querySelector(
      "#coach-dialog-disciplines"
    ).textContent = `Disciplin(er): ${memberObject.member.disciplines}`;
    document.querySelector("#coach-dialog-coach").textContent = `Træner: ${memberObject.member.coach}`;
    document.querySelector("#coach-dialog-active").textContent = `Aktiv: ${memberObject.member.active}`;

    // show modal/dialog
    document.querySelector("#coach-dialog").showModal();

    // update swim time
  }
  function coachTableUpdate() {
    const updateForm = document.querySelector("#update-swimtime-coach-form");
    document.querySelector(
      "#update-swimtime-coach-person"
    ).textContent = `Svømme tid for: ${memberObject.member.firstname} ${memberObject.member.lastname}`;
    document.querySelector(
      "#update-swimtime-coach-oldtime"
    ).textContent = `Den nuværende tid er: ${memberObject.timeMiliSeconds}ms`;
    updateForm.time.value = memberObject.timeMiliSeconds;
    updateForm.setAttribute("data-id", memberObject.id);
    document.querySelector("#update-swimtime-coach-dialog").showModal();
  }
}

//close coach dialog
function closeCoachDialog() {
  document.querySelector("#coach-dialog").close();
}

// ========== update swimtime ========== //

function cancelUpdate() {
  console.log("cancel btn clicked");
  document.querySelector("#update-swimtime-coach-dialog").close();
}

async function updateCoachSwimTime(event) {
  // console.log(event);
  const form = event.target;
  const swimtime = document.querySelector("#update-swimtime-coach").value;

  const id = form.getAttribute("data-id");
  const response = await updateSwimtimeResult(id, swimtime);
  console.log();
  if (response.ok) {
    console.log("result updatet");
    updateMembersTable();
  } else {
    console.log("something whent wrong...?");
  }
}

// ========== Sort ========== //
function sortByForCoach(event) {
  const value = event.target.value;

  if (value === "none") {
    updateMembersTable();
  } else if (value === "age" && !isFilterOn) {
    results.sort(compareAge);
    showCompetitiveMemberLoop(results);
  } else if (value === "age" && isFilterOn) {
    filterList.sort(compareAge);
    showCompetitiveMemberLoop(filterList);
  } else if (value === "time" && !isFilterOn) {
    results.sort(compareTime);
    showCompetitiveMemberLoop(results);
  } else if (value === "time" && isFilterOn) {
    filterList.sort(compareTime);
    showCompetitiveMemberLoop(filterList);
  }

  function compareAge(result1, result2) {
    return result1.member.age - result2.member.age;
  }

  function compareTime(result1, result2) {
    return result1.timeMiliSeconds - result2.timeMiliSeconds;
  }
}

// ========== filter ========== //
async function filterforCoach() {
  const top5 = document.querySelector("#coachFilterTop5");
  const junior = document.querySelector("#coachFilterJunior");
  const senior = document.querySelector("#coachFilterSenior");

  if (junior.checked) {
    filterList = results.filter(isJunior);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (senior.checked) {
    filterList = results.filter(isSenior);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (top5.checked) {
    filterList = results.sort(top5Results).slice(); // .slice bliver brugt til at lave en copy results, som splice går ind og ændre.
    isFilterOn = true;
    filterList.splice(5);
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else {
    filterList = results;
    isFilterOn = false;
    showCompetitiveMemberLoop(results);
  }
}

function top5Results(result1, result2) {
  return result1.timeMiliSeconds - result2.timeMiliSeconds;
}

function isJunior(result) {
  return result.member.age < 18 && result.member.activityForm === "konkurrence-svømmer";
}
function isSenior(result) {
  return result.member.age >= 18 && result.member.activityForm === "konkurrence-svømmer";
}

export { showCompetitiveMembers };
