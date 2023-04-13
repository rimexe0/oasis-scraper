(function () {
  let scrape_button = document.createElement("BUTTON");
  scrape_button.innerHTML = "get calendar data";
  let table = document.querySelector(".calendar");
  table.appendChild(scrape_button);
  scrape_button.addEventListener("click", yoink);
  console.log(window.location.href);
  scrape_button.classList.add("btn","bg-primary");
})();

function yoink() {
  var rows = document.getElementsByTagName("tbody")[1].rows;
  var lectures = [];
  var lecturesStr = "";
  let url = new URL('YOUR_SERVER_URL');

  for (var StartTime = 0; StartTime < rows.length; StartTime++) {
    for (var day = 0; day < 6; day++) {
      var tr = rows[StartTime].getElementsByTagName("td")[day];
      if (tr.querySelector("td p a") == null) {
      } else {
        var a = tr.querySelector("td p"); // gets the lecture
        var tempLecture = extractData(a, day, StartTime);
        lectures.push(tempLecture);
      }
    }
  }
  let lectures2= JSON.stringify(lectures);
  let encryptCalendar = encodeURIComponent(lectures2);
  url.searchParams.set('calendar',encryptCalendar);
  window.open(url, '_blank');


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
    place,day
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
function splitStr(str) {
  console.log(str);
  splited = str.split("&");
  var splitedArray = [];
  var temp = "";
  var temp2= [];
  for (var i = 0; i <= splited.length; i++) {
    //console.log(splited[i].split(","));
    temp = splited[i];
    console.log(temp);
    temp2=temp.split(",");
    console.log(temp2);
    //splitedArray.push(temp);
  }
  console.log(splitedArray);
}
