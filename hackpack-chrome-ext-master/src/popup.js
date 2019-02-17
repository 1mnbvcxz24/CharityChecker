// Script file that gets data from API and initializes variables to print in browser extension
var data;
var charityName, currentCEOTitle, tagLine, mission, donateEmail;
var urlToEin = new Map([
    ['www.unitedway.org', '131635294'],
    ['www.doctorswithoutborders.org', '133433452'],
    ['www.donor.doctorswithoutborders.org', '133433452'],
    ['itgetsbetter.org', '261906629'],
    ['www.americares.org', '061008595'],
    ['secure.americares.org', '061008595'],
    ['www.unicefusa.org/', '131760110'],
    ['secure.unicefusa.org', '131760110'],
    ['www.worldwildlife.org', '521693387'],
    ['support.worldwildlife.org', '521693387'],
    ['www.greenpeace.org', '521541501'],
    ['engage.us.greenpeace.org', '521541501'],
    ['www.clintonfoundation.org', '311580204'],
    ['bbis.clintonfoundation.org', '311580204'],
    ['www.freedom424.org', '264320885'],
    ['freedom424.networkforgood.com', '264320885'],
    ['www.savethechildren.org', '060726487'],
    ['support.savethechildren.org', '060726487'],
    ['childrenswish.org', '581642982'],
    ['donatenow.networkforgood.org', '581642982'],
    ['www.cancer.org', '131788491'],
    ['donate3.cancer.org', '131788491'],
  ]);

// pseudocode: String currUrl = getCurrentUrl(); Hard coding with doctors w/ borders for testing
var currUrl = 'www.doctorswithoutborders.org';
if (urlToEin.has(currUrl)) {
    var ein = urlToEin.get(currUrl);
    var url='https://api.data.charitynavigator.org/v2/Organizations/' + ein + '?app_id=0db87935&app_key=19ae9ac1bd6fc3c9cbbea2c403f4d14e';

    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange=(e)=> {
        var data = JSON.parse(Http.responseText);
        charityName =     (data.charityName      != null? data.charityName      :"n/a");
        currentCEOTitle = (data.currentCEO.title != null? data.currentCEO.title :"n/a");
        tagLine =         (data.tagLine          != null? data.tagLine          :"n/a");
        mission =         (data.mission          != null? data.mission          :"n/a");
        donateEmail =     (data.donateEmail      != null? data.donateEmail      :"n/a");

        document.getElementById("Name").innerHTML = charityName;
        document.getElementById("CurrCEO").innerHTML = currentCEOTitle;
        console.log(charityName, currentCEOTitle, tagLine, mission, donateEmail);
    }
}
