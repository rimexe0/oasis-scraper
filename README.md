# oasis-scraper
simple script that gets calendar data from [ieu oasis](https://oasis.izmirekonomi.edu.tr/) and sends it to google calendar.

## server setup 
clone the repo and add google API_KEY and CLIENT_ID to index.js [(more info)](https://developers.google.com/calendar/api/quickstart/js)

start it with [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or something similar

## tempermonkey setup

[get tempermonkey](https://www.tampermonkey.net/) and go to oasis and create a new script

paste tempermonkey_script.js into there and change url to your server url

after that button should show up at the bottom of the calendar.

