const CLIENT_ID ="754236795965-14let0qr9p02uul951adelrenu6le96s.apps.googleusercontent.com";
const API_KEY = "AIzaSyArKYpP2wqgJACbGGZrl_s99uY6LE3JSf0";

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
    document.getElementById("authorize_button").innerText = "Refresh";
    // await createEvent();
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
  }
}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents() {
  let response;
  try {
    const request = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    console.log(err.message);
    return;
  }

  const events = response.result.items;
  if (!events || events.length == 0) {
    console.log("No events found.");
    return;
  }
  // Flatten to string to display
  const output = events.reduce(
    (str, event) =>
      `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
    "Events:\n"
  );
  console.log(output);
}
async function createEvent(lecture) {

  const event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2015-05-28T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles'
    },
    'end': {
      'dateTime': '2015-05-28T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles'
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'}
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  };

  const request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  request.execute(function (event) {
    console.log("Event created: " + event.htmlLink);
  });
}

var rows = document.getElementsByTagName("tbody")[0].rows;
for (var StartTime = 0; StartTime < rows.length; StartTime++) {
  for (var day = 0; day < 6; day++) {
    var tr = rows[StartTime].getElementsByTagName("td")[day];
    if (tr.querySelector("td p a") == null) {
    } else {
      var a = tr.querySelector("td p");

      var tempLecture = extractData(a, day,StartTime);
      // await createEvent(tempLecture)
      console.log(tempLecture);

    }
  }
}

function extractData(a, day,StartTime) {
  var title = a.querySelector("[data-original-title]").dataset.originalTitle;
  var code = a.querySelector("a strong").innerHTML;
  var place = a
    .querySelector("span")
    .innerHTML.replace(' <span class="ti-location-arrow"></span> ', "") // this is because oasis has some funny stuff
    .trim();

  // console.log(title);
  // console.log(code);
  // console.log(place);
  // console.log(convertDay(day));
  // console.log(convertTime(time));
  var lecture = [convertDay(day),
    convertTime(StartTime)[0],
  code,title,place];
  return lecture
}
function convertDay(day) {
  switch (day) {
    case 1:
      return "pazartesi";
    case 2:
      return "sali";
    case 3:
      return "carsamba";
    case 4:
      return "persembe";
    case 5:
      return "cuma";
  }
}
function convertTime(time){
  var format = "+03:00"
    switch(time){
        case 0:
            return ["08:30"+format+"\""]
        case 1:
            return ["09:25"+format+"\""]
        case 2:
            return ["10:20"+format+"\""]
        case 3:
            return ["11:15]"+format+"\""]
        case 4:
            return ["12:10"+format+"\""]
        case 5:
            return ["13:05"+format+"\""]
        case 6:
            return ["14:00"+format+"\""]
        case 7:
            return ["14:55"+format+"\""]
        case 8:
            return ["15:50"+format+"\""]
        case 9:
            return ["16:45"+format+"\""]
        case 10:
            return ["17:40"+format+"\""]
        case 11:
            return ["18:35"+format+"\""]
        case 12:
            return ["19:30"+format+"\""]
        case 13:
            return ["20:25"+format+"\""]
        case 14:
            return ["21:20"+format+"\""]
        case 15:
            return ["22:15"+format+"\""]
        

    }
}


