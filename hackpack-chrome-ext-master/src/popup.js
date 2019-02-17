// Script file that gets data from API and initializes variables to print in browser extension

var data;
var charityName, currentCEOTitle, tagLine, mission, donateEmail, deductible,
    categoryName, categoryImage, charityNavigatorURL;
var urlToEin = new Map([
    ['unitedway.org', '131635294'],
    ['doctorswithoutborders.org', '133433452'],
    ['donor.doctorswithoutborders.org', '133433452'],
    ['itgetsbetter.org', '261906629'],
    ['americares.org', '061008595'],
    ['secure.americares.org', '061008595'],
    ['unicefusa.org/', '131760110'],
    ['secure.unicefusa.org', '131760110'],
    ['worldwildlife.org', '521693387'],
    ['support.worldwildlife.org', '521693387'],
    ['greenpeace.org', '521541501'],
    ['engage.us.greenpeace.org', '521541501'],
    ['clintonfoundation.org', '311580204'],
    ['bbis.clintonfoundation.org', '311580204'],
    ['freedom424.org', '264320885'],
    ['freedom424.networkforgood.com', '264320885'],
    ['savethechildren.org', '060726487'],
    ['support.savethechildren.org', '060726487'],
    ['childrenswish.org', '581642982'],
    ['donatenow.networkforgood.org', '581642982'],
    ['cancer.org', '131788491'],
    ['donate3.cancer.org', '131788491'],
  ]);


  var currUrl;
  //currUrl = window.location.hostName;
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
     console.log("query");
     currUrl = tabs[0].url;
     console.log("URL is " + currUrl);
     var domain = extractRootDomain(currUrl);
     console.log("domain is " + domain);
     currUrl = domain;

   //currUrl = 'www.doctorswithoutborders.org';
   console.log("starting if statement");
if (urlToEin.has(currUrl)) {
    console.log("Has currUrl");
    var ein = urlToEin.get(currUrl);
    console.log("ein is " + ein);
    var url='https://api.data.charitynavigator.org/v2/Organizations/' + ein + '?app_id=0db87935&app_key=19ae9ac1bd6fc3c9cbbea2c403f4d14e';

    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange=(e)=> {
        var data = JSON.parse(Http.responseText);
        charityName =   (data.charityName  != null? data.charityName   :"n/a");
        currentCEOTitle = (data.currentCEO.title != null? data.currentCEO.title :"n/a");
        tagLine =         (data.tagLine  != null? data.tagLine :"n/a");
        mission = (data.mission   != null? data.mission :"n/a");
        donateEmail = (data.donateEmail!= null? data.donateEmail :"n/a");
        deductible =  (data.deductibility!= null? data.deductibility :"n/a");
        //categoryName  = (data.category.categoryName   != null? data.category.categoryName :"n/a");
        //categoryImage = (data.category.image != null? data.category.image   :"n/a");
        charityNavigatorURL = (data.charityNavigatorURL != null? data.charityNavigatorURL:"n/a");

        document.getElementById("domainName").innerHTML = currUrl;
        document.getElementById("Name").innerHTML = charityName;
        document.getElementById("CurrCEO").innerHTML = currentCEOTitle;


    }
}
   });

// extract the root domain of a website
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

//extracts host name- used in above code
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

