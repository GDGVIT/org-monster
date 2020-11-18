var totalTags = 0;
var allOrgs = [];

// Press Enter to Submit
document.getElementById("orgName").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("addOrg").click();
  }
});

// Adding Eventlistener to add Org Button
document.getElementById("addOrg").addEventListener("click", function () {
  var orgName = document.getElementById("orgName").value;
  document.getElementById("orgName").value = "";
  if (orgName == "") {
    document.getElementById("orgName").focus();
  } else {
    if (/^[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]$/.test(orgName)) {
      if (totalTags == 0) {
        document.getElementById("emptyMsg").innerHTML = "";
      }
      saveOrg(orgName);
    } else {
      var errorMsg = document.getElementById("emptyMsg");
      errorMsg.innerHTML = "Invalid Organisation Name";
      fadeOutEffect(errorMsg);
    }
  }
});

// Getting all the stored orgs
chrome.storage.sync.get(["org"], function (res) {
  var orgs = res.org;
  for (i in orgs) {
    addTag(orgs[i]);
  }
  addcloseEventListener();
  if (totalTags == 0) {
    document.getElementById("emptyMsg").innerHTML =
      "Click on + to follow GitHub Organisations! <br/>";
  }
});

// FUNCTION DEFINITIONS

// Adding Closing action to cross buttons
function addcloseEventListener() {
  var closebtns = document.getElementsByClassName("close");
  var i;

  for (i = 0; i < closebtns.length; i++) {
    closebtns[i].addEventListener("click", function () {
      rmOrg = this.parentElement.innerText.slice(0, -1);
      this.parentElement.style.display = "none";
      var index = allOrgs.indexOf(rmOrg.trim());
      allOrgs.splice(index, 1);

      chrome.storage.sync.set({ org: allOrgs }, function () {});

      totalTags -= 1;
      if (totalTags == 0) {
        document.getElementById("emptyMsg").innerHTML =
          "Click on + to follow GitHub Organisations! <br/>";
      }
    });
  }
}

// Save Organisation to storage
function saveOrg(orgName) {
  chrome.storage.sync.get(["org"], function (res) {
    var storedOrgs = res.org;
    if (storedOrgs == undefined) {
      storedOrgs = [orgName];
      utilityStore(storedOrgs, orgName);
    } else if (!storedOrgs.includes(orgName)) {
      storedOrgs.push(orgName);
      utilityStore(storedOrgs, orgName);
    } else {
      var errorMsg = document.getElementById("emptyMsg");
      errorMsg.innerHTML = "Org Already Present!";
      fadeOutEffect(errorMsg);
    }
  });
}

// A utility function for Storage
function utilityStore(orgs, orgName) {
  chrome.storage.sync.set({ org: orgs }, function () {
    addTag(orgName);
    addcloseEventListener();
  });
}

// Adding Tags
function addTag(orgName) {
  var orgsList = document.getElementById("orgsList");
  orgsList.innerHTML += `<li class="org-tag"><span class="tag-text">${orgName}</span><span class="close">&times;</span></li>`;
  allOrgs.push(orgName);
  totalTags += 1;
}

// Fading Effect
function fadeOutEffect(fadeTarget) {
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
      fadeTarget.style.opacity = 1;
      if (totalTags == 0) {
        fadeTarget.innerHTML =
          "Click on + to follow GitHub Organisations! <br/>";
      } else {
        fadeTarget.innerHTML = "";
      }
    }
  }, 200);
}
