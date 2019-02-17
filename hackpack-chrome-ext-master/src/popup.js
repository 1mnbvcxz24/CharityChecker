/* File: popup.js
 * -----------------------
 * This javascript file restores settings when the DOM loads.
 * You shouldn't have to change this file unless you also
 * change the corresponding popup.html file.
 */


var data;
const Http = new XMLHttpRequest();
const url='https://api.data.charitynavigator.org/v2/Organizations/133433452?app_id=0db87935&app_key=19ae9ac1bd6fc3c9cbbea2c403f4d14e';
Http.open("GET", url);
Http.send();
var charityName, currentCEOTitle, tagLine, mission, donateEmail;

Http.onreadystatechange=(e)=>{
   var data = JSON.parse(Http.responseText);
   charityName =     (data.charityName      != null? data.charityName      :"n/a");
   currentCEOTitle = (data.currentCEO.title != null? data.currentCEO.title :"n/a");
   tagLine =         (data.tagLine          != null? data.tagLine          :"n/a");
   mission =         (data.mission          != null? data.mission          :"n/a");
   donateEmail =     (data.donateEmail      != null? data.donateEmail      :"n/a");

   document.getElementById("Name").innerHTML = charityName;
   document.getElementById("CurrCEO").innerHTML = currentCEOTitle;


}
