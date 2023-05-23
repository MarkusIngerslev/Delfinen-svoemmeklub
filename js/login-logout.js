"use strict";

const chairman = document.querySelector("#login-formand");
const cashier = document.querySelector("#login-kasserer");
const coach = document.querySelector("#login-coach");

const username = "1234";
const password = "1234";

// ========== Vælg, hvilken funktion, der kaldes efter login ========== //
function determineWhatIsShownInNavbar() {
  if (
    chairman.checked &&
    password === document.querySelector("#password").value &&
    username === document.querySelector("#username").value
  ) {
    addNewLinksToNavBarForChairman();
  } else if (
    cashier.checked &&
    password === document.querySelector("#password").value &&
    username === document.querySelector("#username").value
  ) {
    addNewLinkToNavBarForCashier();
  } else if (
    coach.checked &&
    password === document.querySelector("#password").value &&
    username === document.querySelector("#username").value
  ) {
    addNewLinkToNavBarForCoach();
  } else {
    console.log("Ingen login-navne fundet");
    document.querySelector("#error-message-log-in").showModal();
    document.querySelector("#ok-button-error-message").addEventListener("click", closeErrorMessgeLogIn);
  }
}

function closeErrorMessgeLogIn() {
  document.querySelector("#error-message-log-in").close();
  console.log("fejlbesked lukkes");
}

// ========== Indsæt nye links i navbar for formand ========== //
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
// ========== Indsæt links i navbar for kasserer ========== //
function addNewLinkToNavBarForCashier() {
  //  if (passwordTreasurer && usernameTreasurer) {
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

// ========== Indsæt links i navbar for træner ========== //
function addNewLinkToNavBarForCoach() {
  // if (passwordCoach && usernameCoach) {
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

// ========== Hide login-in button ========== //
function hideLogIn() {
  document.querySelector("#login-btn").classList.add("hidden");
}

// ========== Show log-out-button ========== //
function showLogOut() {
  document.querySelector("#logout-btn").classList.remove("hidden");
}

// ========== Log-out clicked ========== //
function logOutClicked() {
  redirectToHomeAfterLogOut();
  removeLinksFromNavBarAfterLogOutClicked();
}

// ========== Redirect to home ========== //
function redirectToHomeAfterLogOut() {
  location.href = "#home";
  document.querySelector("#login-as-text").textContent = "";
  document.querySelector("#login-btn").classList.remove("hidden");
  document.querySelector("#logout-btn").classList.add("hidden");
}

// ========== Remove added links from nav bar after log out ========== //
function removeLinksFromNavBarAfterLogOutClicked() {
  const addedLinks = document.querySelectorAll(".dropdown-content section");
  addedLinks.forEach((link) => link.remove());
}


export { determineWhatIsShownInNavbar, logOutClicked };
