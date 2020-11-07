var closebtns = document.getElementsByClassName("close");
var i;

for (i = 0; i < closebtns.length; i++) {
  closebtns[i].addEventListener("click", function () {
    console.log(this.parentElement.innerText.slice(0, -1));
    this.parentElement.style.display = "none";
  });
}
