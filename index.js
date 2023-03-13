var mon, tue, wen, thu, fri;
var rows = document.getElementsByTagName("tbody")[0].rows;
for (var time = 0; time < rows.length; time++) {
  for (var day = 0; day < 6; day++) {
    var tr = rows[time].getElementsByTagName("td")[day];
    if (tr.querySelector("td p a") == null) {
    } else {
      var a = tr.querySelector("td p");

      var tempLecture = extractData(a, day,time);
      console.log(tempLecture);

    }
  }
}

function extractData(a, day,time) {
  var title = a.querySelector("[data-original-title]").dataset.originalTitle;
  var code = a.querySelector("a strong").innerHTML;
  var place = a
    .querySelector("span")
    .innerHTML.replace(' <span class="ti-location-arrow"></span> ', "")
    .trim();

  // console.log(title);
  // console.log(code);
  // console.log(place);
  // console.log(convertDay(day));
  // console.log(convertTime(time));
  var lecture = [convertDay(day),convertTime(time),code,title,place];
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
    switch(time){
        case 0:
            return "8:30"
        case 1:
            return "9:25"
        case 2:
            return "10:20"
        case 3:
            return "11:15"
        case 4:
            return "12:10"
        case 5:
            return "13:05"
        case 6:
            return "14:00"
        case 7:
            return "14:55"
        case 8:
            return "15:50"
        case 9:
            return "16:45"
        case 10:
            return "17:40"
        case 11:
            return "18:35"
        case 12:
            return "19:30"
        case 13:
            return "20:25"
        case 14:
            return "21:20"
        case 15:
            return "22:15"
        

    }
}


//  console.log(rows);
function writeToFile(){

	// Requiring fs module in which
	// writeFile function is defined.
	const fs = require('fs')
	
	// Data which will write in a file.
	let data = "Learning how to write in a file."
	
	// Write data in 'Output.txt' .
	fs.writeFile('Output.txt', data, (err) => {
		
		// In case of a error throw err.
		if (err) throw err;
	})


}