document.getElementById("submit").addEventListener("click", function () {
  var orgName = document.getElementById("orgName").value;
  document.getElementById("name").innerHTML = orgName;
  fetch("https://api.github.com/orgs/GDGVIT/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((activities) => {});
});
