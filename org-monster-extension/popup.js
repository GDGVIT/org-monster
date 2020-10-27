document.getElementById("submit").addEventListener("click", function () {
  var orgName = document.getElementById("orgName").value;

  fetch("https://api.github.com/orgs/" + orgName + "/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((activities) => {
      var i;
      var result = "";
      for (i = 0; i < activities.length; i++) {
        var activity = activities[i];
        console.log(activity);
        var type = activity["type"];
        console.log(type);
        console.log(activity["repo"]["name"]);
        console.log(activity["actor"]["display_login"]);
        console.log(activity["org"]["login"]);
        result += type + "<br/>";
        if (type == "PushEvent") {
          console.log(activity["payload"]["commits"].length);
        } else if (type == "PullRequestEvent") {
          console.log(activity["payload"]["number"]);
          console.log(activity["payload"]["pull_request"]["title"]);
        } else if (type == "ForkEvent") {
          console.log(activity["payload"]["forkee"]);
        } else if (
          type == "IssueCommentEvent" ||
          type == "PullRequestReviewEvent"
        ) {
          console.log("Dont show");
        } else {
          console.log("UNDEFINED");
        }
      }
      document.getElementById("name").innerHTML = result;
    });
});
