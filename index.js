const CLIENT_ID ="";
const API_KEY = "";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;
let gapiInited = false;
let gisInited = false;
document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";
document.getElementById("add_events_button").style.visibility = "hidden";

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}
/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}
/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}
/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
    document.getElementById("deadge_button").style.visibility = "hidden";
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("add_events_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
    document.getElementById("add_events_button").style.visibility = "hidden";
  }
}

async function createEvent(lecture, notificationMins) {
  var timezone = "Europe/Istanbul";
  var startTime = lecture[0];
  var endTime = lecture[1];
  var lectureCode = lecture[2];
  var lectureTitle = lecture[3];
  var lecturePlace = lecture[4];
  const event = {
    summary: lectureCode + " " + lectureTitle,
    location: lecturePlace,
    colorId: "1",
    description: "Izmir Ekonomi Universitesi",
    start: {
      dateTime: startTime,
      timeZone: timezone,
    },
    end: {
      dateTime: endTime,
      timeZone: timezone,
    },
    recurrence: ["RRULE:FREQ=WEEKLY;COUNT=14"],
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: notificationMins }],
    },
  };

  const request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  request.execute(function (event) {
    addTextToScreen("Event created: " + event.htmlLink);
    console.log("Event created: " + event.htmlLink);
  });
}
//this is where the funny business starts
let classes = new URL(document.location).searchParams;
let decryptedCalendar = decodeURIComponent(classes.get("calendar"));
let lectures = JSON.parse(decryptedCalendar);
if(lectures==null) addTextToScreen("getting calendar failed. Check your tempermonkey script.");

async function addEvents() {
  console.log(lectures);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  var sortedLectures = sortLectures(lectures);
  if (confirm("Are you sure to add these to the calendar?")) {
    for (i in sortedLectures) {
      for (k in sortedLectures[i]) {
        if (k == 0) {
          await createEvent(sortedLectures[i][k], 90);
        } else {
          await createEvent(sortedLectures[i][k], 9);
        }

        await sleep(1000);
      }
    }

    console.log("its done if you did not duck it up somehow");
    alert("done");
  } else {
    alert("Cancelled");
  }
}

function extractData(a, day, StartTime) {
  var format = "+03:00";
  var title = a.querySelector("[data-original-title]").dataset.originalTitle;
  var code = a.querySelector("a strong").innerHTML;
  var place = a
    .querySelector("span")
    .innerHTML.replace(' <span class="ti-location-arrow"></span> ', "") // this is because oasis has some funny stuff
    .trim();

  var lecture = [
    convertDay(day) + "T" + convertTime(StartTime, format),
    convertDay(day) + "T" + LectureTime(convertTime(StartTime), 45, format),
    code,
    title,
    place,
  ];
  return lecture;
}
function convertDay(day) {
  switch (day) {
    case 1:
      return "2023-03-13";
    case 2:
      return "2023-03-14";
    case 3:
      return "2023-03-15";
    case 4:
      return "2023-03-16";
    case 5:
      return "2023-03-17";
  }
}
function convertTime(time, format) {
  switch (time) {
    case 0:
      return "08:30:00" + format + "";
    case 1:
      return "09:25:00" + format + "";
    case 2:
      return "10:20:00" + format + "";
    case 3:
      return "11:15:00" + format + "";
    case 4:
      return "12:10:00" + format + "";
    case 5:
      return "13:05:00" + format + "";
    case 6:
      return "14:00:00" + format + "";
    case 7:
      return "14:55:00" + format + "";
    case 8:
      return "15:50:00" + format + "";
    case 9:
      return "16:45:00" + format + "";
    case 10:
      return "17:40:00" + format + "";
    case 11:
      return "18:35:00" + format + "";
    case 12:
      return "19:30:00" + format + "";
    case 13:
      return "20:25:00" + format + "";
    case 14:
      return "21:20:00" + format + "";
    case 15:
      return "22:15:00" + format + "";
  }
}
function LectureTime(Letcure, time, format) {
  var Letcure = Letcure.split(":");
  hour = parseInt(Letcure[0]);
  minute = parseInt(Letcure[1]);

  if (minute + time >= 60) {
    hour++;
    minute = minute + time - 60;
  } else {
    minute = minute + time;
  }
  return hour + ":" + minute + ":00" + format + "";
}
function sortLectures(lectures) {
  var mon = [];
  var tue = [];
  var wed = [];
  var thu = [];
  var fri = [];
  var sat = [];
  var sun = [];
  for (i = 0; i < lectures.length; i++) {
    switch (lectures[i][5]) {
      case 1:
        mon.push(lectures[i]);
        break;
      case 2:
        tue.push(lectures[i]);
        break;
      case 3:
        wed.push(lectures[i]);
        break;
      case 4:
        thu.push(lectures[i]);
        break;
      case 5:
        fri.push(lectures[i]);
        break;
      case 6:
        sat.push(lectures[i]);
        break;
      case 7:
        sun.push(lectures[i]);
        break;
    }
  }
  var sortedLectures = [mon, tue, wed, thu, fri, sat, sun];
  return sortedLectures;
}
function addTextToScreen(text){
  var log=document.createElement("p");
    var logText = document.createTextNode(text);
    log.appendChild(logText);
    var divlog = document.getElementById("log");
    divlog.appendChild(log);
}