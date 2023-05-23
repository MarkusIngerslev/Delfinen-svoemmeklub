import { updateSwimtimeResult } from "./rest-data.js";
import { results, updateMembersTable } from "./script.js";

// ----- global variable ----- //

let filterList;
let isFilterOn;
let coachResults;

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
  document.querySelector("#coachFilterCrawl").addEventListener("change", filterforCoach);
  document.querySelector("#coachFilterRygCrawl").addEventListener("change", filterforCoach);
  document.querySelector("#coachFilterBrystsvoemning").addEventListener("change", filterforCoach);
  document.querySelector("#coachFilterButterfly").addEventListener("change", filterforCoach);

  for (const result of results) {
    const member = members.find((member) => member.id === result.memberId);
    result.member = member;
    // console.log(result);
  }

  coachResults = results;
  // console.log(coachResults);
  showCompetitiveMemberLoop(coachResults);
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
  // document.querySelector("#coach-members-tbody tr").classList.remove("topFiveHighlight");
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
    ).textContent = `Navn: ${memberObject.member.firstname} ${memberObject.member.lastname}`;
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
    // document.querySelector("#coach-dialog-active").textContent = `Aktiv: ${memberObject.member.active}`;
    if (memberObject.member.active === true) {
      document.querySelector("#coach-dialog-active").textContent = `Aktiv: Ja, aktiv`;
    } else if (memberObject.member.active === false) {
      document.querySelector("#coach-dialog-active").textContent = `Aktiv: Nej, passiv`;
    }

    // show modal/dialog
    document.querySelector("#coach-dialog").showModal();

    // update swim time
  }
  function coachTableUpdate() {
    const updateForm = document.querySelector("#update-swimtime-coach-form");
    // sætter personen navn i form
    document.querySelector(
      "#update-swimtime-coach-person"
    ).textContent = `Svømme tid for: ${memberObject.member.firstname} ${memberObject.member.lastname}`;
    // sætter p til at vise den nuværende/gamle bedste tid
    document.querySelector(
      "#update-swimtime-coach-oldtime"
    ).textContent = `Den nuværende tid er: ${memberObject.timeMiliSeconds}ms`;
    // sætter den nuværende/gamle bedste tid ind i input
    updateForm.coachUpdatetime.value = memberObject.timeMiliSeconds;
    updateForm.setAttribute("data-id", memberObject.id);

    // tildeler skjulte elementer ekstra data til at kunne opdate database
    updateForm.coachUpdateMemberId.value = memberObject.memberId;
    updateForm.coachUpdateDisciplin.value = memberObject.disciplin;
    updateForm.coachUpdateTournamentName.value = memberObject.tournamentName;
    updateForm.coachUpdateTournament.value = memberObject.tournament;
    // updateForm.coachUpdateDate.value = memberObject.date;

    // dags dato
    const dateInput = document.querySelector("#coachUpdateDate");
    const currentDate = new Date(); // nyt dateobjekt

    // henter de 3 forskellige variabler dag, måned og år
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); //padStart er en måde at sikre at cifret altid er 2 langt.
    // når det gøres på denne måde for man månederne mellem 00-11 derfor +1 for at få det vist som 01-12

    const day = String(currentDate.getDate()).padStart(2, "0");
    const year = currentDate.getFullYear();
    // sammen sæt de 3 variabler i et format: "MM . DD . åååå"
    const dateString = `${month}/${day}/${year}`;
    // sæt date input til dags dato
    dateInput.value = dateString;

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
  const form = event.target;
  let tournament;
  // ting der kan ændres i form
  const swimtime = form.coachUpdatetime.value;
  const date = form.coachUpdateDate.value;

  // ekstra data som skal sende med til database
  const memberId = form.coachUpdateMemberId.value;
  const disciplin = form.coachUpdateDisciplin.value;
  const tournamentName = form.coachUpdateTournamentName.value;

  if (form.coachUpdateTournament.value === "false") {
    tournament = false;
  } else if (form.coachUpdateTournament.value === "true") {
    tournament = true;
  }

  console.log("-- UpdateCoachSwimTime --");

  const id = form.getAttribute("data-id");
  const response = await updateSwimtimeResult(id, swimtime, date, memberId, disciplin, tournamentName, tournament);
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
  console.log("--sortByForCoach--");

  if (value === "none" && !isFilterOn) {
    updateMembersTable();
  } else if (value === "none" && isFilterOn) {
    console.log("fjern checkbox først");
  } else if (value === "age" && !isFilterOn) {
    coachResults.sort(compareAge);
    console.log();
    console.log(coachResults);
    showCompetitiveMemberLoop(coachResults);
  } else if (value === "age" && isFilterOn) {
    filterList.sort(compareAge);
    showCompetitiveMemberLoop(filterList);
  } else if (value === "time" && !isFilterOn) {
    coachResults.sort(compareTime);
    showCompetitiveMemberLoop(coachResults);
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
  const crawl = document.querySelector("#coachFilterCrawl");
  const rygCrawl = document.querySelector("#coachFilterRygCrawl");
  const brystSvoemning = document.querySelector("#coachFilterBrystsvoemning");
  const butterfly = document.querySelector("#coachFilterButterfly");

  if (junior.checked) {
    filterList = coachResults.filter(isJunior);
    isFilterOn = true;
    console.log("--filter for junior checked--");
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (senior.checked) {
    filterList = coachResults.filter(isSenior);
    isFilterOn = true;
    console.log("--filter for senior checked--");
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (top5.checked) {
    filterList = coachResults.sort(top5Results).slice(); // .slice bliver brugt til at lave en copy results, som splice går ind og ændre.
    isFilterOn = true;
    filterList.splice(5);
    console.log("--filter for top5--");
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (crawl.checked) {
    filterList = coachResults.filter(isCrawl);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (rygCrawl.checked) {
    filterList = coachResults.filter(isRygCrawl);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (brystSvoemning.checked) {
    filterList = coachResults.filter(isBrystSvoemning);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (butterfly.checked) {
    filterList = coachResults.filter(isButterfly);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else {
    filterList = coachResults;
    isFilterOn = false;
    showCompetitiveMemberLoop(coachResults);
  }
}

function top5Results(result1, result2) {
  return result1.timeMiliSeconds - result2.timeMiliSeconds;
}

function isJunior(result) {
  // console.log(result);
  return result.member.age < 18 && result.member.activityForm === "konkurrence-svømmer";
}
function isSenior(result) {
  // console.log(result);
  return result.member.age >= 18 && result.member.activityForm === "konkurrence-svømmer";
}
function isCrawl(result) {
  //console.log(result)
  return result.disciplin === "crawl";
}
function isRygCrawl(result) {
  //console.log(result)
  return result.disciplin === "ryg-crawl";
}
function isBrystSvoemning(result) {
  //console.log(result)
  return result.disciplin === "bryst-svømning";
}
function isButterfly(result) {
  //console.log(result)
  return result.disciplin === "butterfly";
}

export { showCompetitiveMembers };
