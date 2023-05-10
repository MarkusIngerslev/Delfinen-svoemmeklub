"use strict";

const password = true;

function addThreeNewLinksToNavBar() {
    if (password) {
        const threeNewLinks =
            /*html*/
            `<section>
          <a href="">For formanden</a>
          <a href="">For kasseren</a>
          <a href="">For trænerne</a>
     `;

        document
            .querySelector(".dropdown-content")
            .insertAdjacentHTML("beforeend", threeNewLinks);
    }
    console.log("Tre nye links sat ind");
}

export {addThreeNewLinksToNavBar};
