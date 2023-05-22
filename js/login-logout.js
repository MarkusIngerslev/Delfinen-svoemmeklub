"use strict";

const chairman = document.querySelector("#login-formand");
const cashier = document.querySelector("#login-kasserer");
const coach = document.querySelector("#login-coach");

const username = "1234";
const password = "1234";

// Funktionen til at bestemme, hvad der vises i navigationslinjen efter login
function determineWhatIsShownInNavbar() {
  const enteredPassword = document.querySelector("#password").value;
  const enteredUsername = document.querySelector("#username").value;

  if (chairman.checked && password === enteredPassword && username === enteredUsername) {
    addNewLinksToNavBarForChairman();
    saveLoginStatus("formand");
  } else if (cashier.checked && password === enteredPassword && username === enteredUsername) {
    addNewLinkToNavBarForCashier();
    saveLoginStatus("kasserer");
  } else if (coach.checked && password === enteredPassword && username === enteredUsername) {
    addNewLinkToNavBarForCoach();
    saveLoginStatus("træner");
  } else {
    console.log("Ingen gyldigt login fundet");
    document.querySelector("#error-message-log-in").showModal();
    document.querySelector("#ok-button-error-message").addEventListener("click", closeErrorMessageLogIn);
  }
}

function closeErrorMessageLogIn() {
  document.querySelector("#error-message-log-in").close();
  console.log("Fejlbesked lukkes");
}

// Funktionen til at gemme login-status i localStorage
function saveLoginStatus(role) {
  localStorage.setItem("loginStatus", role);
}

// Funktionen til at indlæse login-status fra localStorage
function loadLoginStatus() {
  return localStorage.getItem("loginStatus");
}

// Funktionen til at fjerne login-status fra localStorage
function clearLoginStatus() {
  localStorage.removeItem("loginStatus");
}

// Funktionen til at indsætte nye links i navigationslinjen for formanden
function addNewLinksToNavBarForChairman() {
  const linksForChairman =
    /*html*/
    `<section>
          <a href="#forChairman" class="view-link">For formanden</a>
          <a href="#forCashier" class="view-link">For kasseren</a>
          <a href="#for-coach-section" class="view-link" id="for-coach-btn">For trænerne</a>
        </section>
     `;

  document.querySelector(".dropdown-content").insertAdjacentHTML("beforeend", linksForChairman);
  console.log("Tre nye links sat ind");
  document.querySelector("#login-as-text").textContent = "Du er logget ind som formand";
  hideLogIn();
  showLogOut();
}

// Funktionen til at indsætte et link i navigationslinjen for kassereren
function addNewLinkToNavBarForCashier() {
  const linkForCashier =
    /*html*/
    `<section>
          <a href="#forCashier" class="view-link">For kasseren</a>
       </section>
     `;

  document.querySelector(".dropdown-content").insertAdjacentHTML("beforeend", linkForCashier);
  document.querySelector("#login-as-text").textContent = "Du er logget ind som kasserer";
  hideLogIn();
  showLogOut();
}

// Funktionen til at indsætte et link i navigationslinjen for træneren
function addNewLinkToNavBarForCoach() {
  const linkForCoach =
    /*html*/
    `<section>
          <a href="#for-coach-section" class="view-link">For Trænerne</a>
       </section>
     `;

  document.querySelector(".dropdown-content").insertAdjacentHTML("beforeend", linkForCoach);
  console.log("Link for træner sat ind");
  document.querySelector("#login-as-text").textContent = "Du er logget ind som træner";
  hideLogIn();
  showLogOut();
}

// Funktionen til at skjule log ind-knappen
function hideLogIn() {
  document.querySelector("#login-btn").classList.add("hidden");
}

// Funktionen til at vise log ud-knappen
function showLogOut() {
  document.querySelector("#logout-btn").classList.remove("hidden");
}

// Funktionen der kaldes når log ud-knappen klikkes
function logOutClicked() {
  redirectToHomeAfterLogOut();
  removeLinksFromNavBarAfterLogOutClicked();
  clearLoginStatus();
}

// Funktionen til at omdirigere til startsiden efter log ud
function redirectToHomeAfterLogOut() {
  location.href = "#home";
  document.querySelector("#login-as-text").textContent = "";
  document.querySelector("#login-btn").classList.remove("hidden");
  document.querySelector("#logout-btn").classList.add("hidden");
}

// Funktionen til at fjerne tilføjede links fra navigationslinjen efter log ud-klik
function removeLinksFromNavBarAfterLogOutClicked() {
  const addedLinks = document.querySelectorAll(".dropdown-content section");
  addedLinks.forEach((link) => link.remove());
}

// Indlæs login-status og opdater navigationslinjen baseret på det
window.addEventListener("DOMContentLoaded", function () {
  const loginStatus = loadLoginStatus();
  if (loginStatus === "formand") {
    addNewLinksToNavBarForChairman();
  } else if (loginStatus === "kasserer") {
    addNewLinkToNavBarForCashier();
  } else if (loginStatus === "træner") {
    addNewLinkToNavBarForCoach();
  }
});

export { determineWhatIsShownInNavbar, logOutClicked };
