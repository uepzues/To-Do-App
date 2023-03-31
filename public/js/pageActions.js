let btn = document.querySelectorAll(".app__content-list > li img");
const li = document.querySelectorAll(".app__content-list > li");

let click = () => {
  for (let i in btn) {
    btn[i].addEventListener("click", () => {
        li[i].remove();
      alert("hello");
    });
  }
};

click();
