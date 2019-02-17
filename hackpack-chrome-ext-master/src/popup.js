// Script file that initializes variables to data from Charity Navigator API.
// This information is then printed in the HTML/CSS of the browser extension

var data; // The JSON object returned by the API call
var charityName;
var currentCEO, currentCEOName, currentCEOTitle;
var tagLine, mission, donateEmail, deductible;
var category, categoryName, categoryImage
var charityNavigatorURL;
var ratingsURL, programExpensesRatio;
var financialRating, performanceMetrics;

// The API allows us to search for a charity by the EIN (a unique Employer Identification Number, assigned by the federal
// goverment). We cannot search by the url, so instead we manually map some donation urls to the EIN of their associated charities.
// This database is (intentionally) limited to a few domains, for proof-of-concept.
var urlToEin = new Map([
    ['unitedway.org', '131635294'],
    ['doctorswithoutborders.org', '133433452'],
    ['donor.doctorswithoutborders.org', '133433452'],
    ['itgetsbetter.org', '261906629'],
    ['americares.org', '061008595'],
    ['secure.americares.org', '061008595'],
    ['unicefusa.org', '131760110'],
    ['secure.unicefusa.org', '131760110'],
    ['worldwildlife.org', '521693387'],
    ['support.worldwildlife.org', '521693387'],
    ['greenpeace.org', '521541501'],
    ['engage.us.greenpeace.org', '521541501'],
    ['clintonfoundation.org', '311580204'],
    ['bbis.clintonfoundation.org', '311580204'],
    ['freedom424.org', '264320885'],
    ['networkforgood.com', '264320885'],
    ['savethechildren.org', '060726487'],
    ['support.savethechildren.org', '060726487'],
    ['childrenswish.org', '581642982'],
    ['cancer.org', '131788491'],
    ['donate3.cancer.org', '131788491'],
  ]);

  var currUrl;
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
    var ein = urlToEin.get(currUrl);
    
    // Note: app_id and app_key are limited to max 1000 requests/day for free tier, and expire after our 30 day free trial.
    // These values are for Trishiet Ray's account on February 16, 2019.
    var app_id = '0db87935';
    var app_key = '19ae9ac1bd6fc3c9cbbea2c403f4d14e';
    
    // Form the API request url using the EIN, as well as our unique app_id and app_key.
    var url='https://api.data.charitynavigator.org/v2/Organizations/' + ein +
        '?app_id=' + app_id + '&app_key=' + app_key;
    
    // Perform a GET request for the URL
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange=(e)=> {
        // Set variables to data from JSON file
        // Assume data is not null, since this code only runs if the map contains the current URL domain
        // (Otherwise, set every variable to n/a)
        var data = JSON.parse(Http.responseText);

        charityName =          (data.charityName             !== null? data.charityName               :'n/a');
        currentCEO     =       (data.currentCEO              !== null? data.currentCEO                :'n/a');
        if (currentCEO !== 'n/a') {
            currentCEOName =       (data.currentCEO.name         !== null? data.currentCEO.name       :'n/a');
            currentCEOTitle =      (data.currentCEO.title        !== null? data.currentCEO.title      :'n/a');
        }
        else {
            currentCEOName = 'n/a';
            currentCEOTitle = 'n/a';
        }

        tagLine =              (data.tagLine                 !== null? data.tagLine                   :'n/a');
        mission =              (data.mission                 !== null? data.mission                   :'n/a');
        donateEmail =          (data.donateEmail             !== null? data.donateEmail               :'n/a');
        deductible =           (data.deductibility           !== null? data.deductibility             :'n/a');
        category  =            (data.category.category       !== null? data.category.category         :'n/a');
        if (category !== 'n/a') {
            categoryName  =        (data.category.categoryName   !== null? data.category.categoryName     :'n/a');
            categoryImage =        (data.category.image          !== null? data.category.image            :'n/a');
        }
        else {
            categoryName  = 'n/a';
            categoryImage  = 'n/a';
        }
        charityNavigatorURL =  (data.charityNavigatorURL !== null? data.charityNavigatorURL       :'n/a');
        if (data.currentRating !== null && data.currentRating._rapid_links !== null && data.currentRating._rapid_links.related !== null) {
            ratingsURL = (data.currentRating._rapid_links.related.href !== 
                null? data.currentRating._rapid_links.related.href :'n/a');
        }
        else {
            ratingsURL = 'n/a';
        }

        // Form new API request url for the Financial Ratings object
        if (ratingsURL !== 'n/a') {
            var url2 = ratingsURL + '?app_id=' + app_id + '&app_key=' + app_key;

            // Make a request for the Rating object, which contains additional info about the Financial Rating
            // and Accounting Rating
            const Http2 = new XMLHttpRequest();
            Http2.open("GET", url2);
            Http2.send();
            Http2.onreadystatechange=(e)=> {
                // data2 should be valid, since ratingsURL is checked before entering this block
                var data2 = JSON.parse(Http2.responseText);

                // Set variables to JSON data
                financialRating = (data2.financialRating !== null ? data2.financialRating : 'n/a');
                if (financialRating !== 'n/a') {
                    performanceMetrics = (financialRating.performanceMetrics !== 
                        null ? financialRating.performanceMetrics : 'n/a');
                    if (performanceMetrics !== 'n/a') {
                        programExpensesRatio = (performanceMetrics.programExpensesRatio !==
                            null? performanceMetrics.programExpensesRatio :"n/a");
                    }
                    else {
                        programExpensesRatio = 'n/a';
                    }
                }
                else {
                    performanceMetrics = 'n/a';
                    programExpensesRatio = 'n/a';
                }
                
                // Make sure to print to console in this function (async task)
                console.log(financialRating);
                console.log(performanceMetrics);
                console.log(programExpensesRatio);
            }
        }

        // Set HTML objects to variables values
        document.getElementById("domainName").innerHTML = currUrl;
        document.getElementById("Name").innerHTML = charityName;
        document.getElementById("CurrCEO").innerHTML = currentCEOTitle;

        // Print variable values to console for testing
        console.log(charityName, currentCEOName, currentCEOTitle, tagLine, mission, donateEmail, deductible, categoryName, categoryImage);
        console.log(charityNavigatorURL);
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

