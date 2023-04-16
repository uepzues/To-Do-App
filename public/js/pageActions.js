let btn = document.querySelectorAll(".app__content-list > li img");
let li = document.querySelectorAll(".app__content-list > li");
const offreload = document.querySelector(".app__form > button");
const para = document.querySelectorAll("li > p");
let delBtn = document.querySelectorAll("li > div");

function click() {
  btn.forEach((abtn, index) => {
    abtn.addEventListener("click", () => {
      console.log(index);
      delBtn[index].classList.toggle("hidden");
    });
  });
}

click();
