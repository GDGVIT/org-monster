var allActivities = [];

// Getting all Stored Organisations
chrome.storage.sync.get(["org"], function (res) {
  var temp = res.org;
  if (temp == undefined || temp.length == 0) {
    document.getElementById("emptyMsg").innerHTML =
      "Follow GitHub Organisations <br/>Add Organisations in Manage Section!";
  }

  for (i in temp) {
    fetchActivities(temp[i]);
  }
});

// FUNCTION DEFINITIONS

// Fetching all activity for an org
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

      for (i = 0; i < activities.length; i++) {
        var activity = activities[i];
        var type = activity["type"];

        if (
          type == "WatchEvent" ||
          type == "IssueCommentEvent" ||
          type == "PullRequestReviewCommentEvent"
        ) {
          continue;
        } else if (
          !(
            type == "PushEvent" ||
            type == "PullRequestEvent" ||
            type == "ForkEvent" ||
            type == "CreateEvent" ||
            type == "IssuesEvent" ||
            type == "DeleteEvent"
          )
        ) {
          // console.log(activity);
          continue;
        }

        var actObj = {
          type: activity["type"],
          repoName: activity["repo"]["name"],
          actorName: activity["actor"]["display_login"],
          orgName: activity["org"]["login"],
        };

        if (activity["updated_at"] == undefined) {
          actObj.timestamp = new Date(activity["created_at"].slice(0, -1));
        } else {
          actObj.timestamp = new Date(activity["updated_at"].slice(0, -1));
        }

        if (type == "PushEvent") {
          actObj.commits = activity["payload"]["commits"].length;
        } else if (type == "PullRequestEvent") {
          actObj.prAction = activity["payload"]["action"];
          actObj.prNo = activity["payload"]["number"];
          actObj.prTitle = activity["payload"]["pull_request"]["title"];
        } else if (type == "ForkEvent") {
          actObj.forkee = activity["payload"]["forkee"];
        } else if (type == "CreateEvent") {
          actObj.create_ref = activity["payload"]["ref_type"];
        } else if (type == "IssuesEvent") {
          actObj.issue_action = activity["payload"]["action"];
        } else if (type == "DeleteEvent") {
          actObj.delete_ref = activity["payload"]["ref_type"];
        }
        allActivities.push(actObj);
      }

      showActivityList();
    });
}

// Displaying activity
function showActivityList() {
  var activityDiv = document.getElementById("activites");
  activityDiv.innerHTML = "";
  allActivities.sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });

  for (i in allActivities) {
    activity = allActivities[i];
    content = "";

    if (activity.type == "PushEvent") {
      content = `
        ${activity.actorName} pushed  ${activity.commits} commit to ${
        activity.repoName
      } <br/>
        <span class="time">${findTime(activity.timestamp)}</span>`;
    } else if (activity.type == "PullRequestEvent") {
      content = `
        ${activity.actorName} ${activity.prAction} a pull request #${
        activity.prNo
      } in ${activity.repoName} <br/>
        <span class="time">${findTime(activity.timestamp)}</span>`;
    } else if (activity.type == "ForkEvent") {
      content = `
        ${activity.actorName} forked ${activity.repoName} <br/>
        <span class="time">${findTime(activity.timestamp)}</span>`;
    } else if (activity.type == "CreateEvent") {
      content = `
        ${activity.actorName} created ${activity.create_ref} in ${
        activity.repoName
      } <br/>
        <span class="time">${findTime(activity.timestamp)}</span>`;
    } else if (activity.type == "IssuesEvent") {
      content = `
        ${activity.actorName} ${activity.issue_action} issue in ${
        activity.repoName
      } <br/>
        <span class="time">${findTime(activity.timestamp)}</span>`;
    } else if (activity.type == "DeleteEvent") {
      content = `
        ${activity.actorName} removed ${activity.delete_ref} in ${
        activity.repoName
      } <br/>
        <span class="time">${findTime(activity.timestamp)}</span>`;
    }

    activityDiv.innerHTML += `<div class="activity-box">${content}</div>`;
  }
}

// Finding Time
function findTime(timestamp) {
  var today = new Date();
  var hoursDiff = (today.getTime() - timestamp.getTime()) / 1000;
  hoursDiff /= 60 * 60;
  hoursDiff = Math.max(Math.abs(Math.round(hoursDiff)) - 6, 0);
  if (hoursDiff <= 24) {
    return `${hoursDiff} hours ago`;
  }
  var days = Math.ceil(hoursDiff / 24);
  if (days <= 30) {
    return `${days} days ago`;
  }
  var months = Math.ceil(days / 30);
  if (months <= 12) {
    return `${months} months ago `;
  }
  return `a year ago`;
}
