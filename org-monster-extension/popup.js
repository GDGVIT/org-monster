allActivities = [];

// chrome.storage.sync.get(["org"], function (res) {
//   var temp = res.org;
//   for (i in temp) {
//     fetchActivities(temp[i]);
//   }
// });

function saveOrg(orgName) {
  chrome.storage.sync.get(["org"], function (res) {
    var temp = res.org;
    if (temp == undefined) {
      temp = [orgName];
      chrome.storage.sync.set({ org: temp }, function () {
        document.getElementById("extra").innerHTML = temp;
      });
    } else if (!temp.includes(orgName)) {
      temp = temp.concat(orgName);
      chrome.storage.sync.set({ org: temp }, function () {
        document.getElementById("extra").innerHTML = temp;
      });
    }
  });
}

function fetchActivities(orgName) {
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
        var type = activity["type"];
        var actObj = {
          type: activity["type"],
          repoName: activity["repo"]["name"],
          actorName: activity["actor"]["display_login"],
          orgName: activity["org"]["login"],
        };

        result += type + "<br/>";
        if (type == "PushEvent") {
          actObj.commits = activity["payload"]["commits"].length;
        } else if (type == "PullRequestEvent") {
          actObj.prAction = activity["payload"]["action"];
          actObj.prNo = activity["payload"]["number"];
          actObj.prTitle = activity["payload"]["pull_request"]["title"];
        } else if (type == "ForkEvent") {
          actObj.forkee = activity["payload"]["forkee"];
        }
      }

      // TODO
      // CreateEvent;
      // DeleteEvent;
      // IssuesEvent;
      // PublicEvent;

      showActivityList();
    });
}

// TODO
function showActivityList() {}

document.getElementById("submit").addEventListener("click", function () {
  var orgName = document.getElementById("orgName").value;
  saveOrg(orgName);
});
