// Script file that initializes variables to data from Charity Navigator API.
// This information is then printed in the HTML/CSS of the browser extension


// API Call 1
var charityName;
var currentCEO, currentCEOName, currentCEOTitle;
var tagLine, mission, donateEmail, deductible;
var category, categoryName, categoryImage
var charityNavigatorURL, ratingsURL;

// API Call 2
var programExpensesRatio;
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
    ['greenpeace.org', '953313195'],
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
    ['redcross.org', '530196605'],
    ['salvationarmyusa.org', '222406433'],
    ['goodwill.org', '530196517'],
    ['nature.org', '530242652'],
    ['nrdc.org', '132654926'],
    ['stjude.org', '351044585'],
    ['dav.org', '521521276'],
    ['aspca.org', '131623829'],
    ['feedingamerica.org', '363673599'],
    ['cityofhope.org', '953435919'],
    ['worldvision.org', '951922279'],
    ['directrelief.org', '951831116'],
    ['crs.org', '135563422'],
    ['womenssportsfoundation.org', '237380557'],
    ['cancersurvivorsfund.org', '760608215'],
    ['woundedwarriorproject.org', '202370934'],
    ['americanheart.org', '135613797'],
    ['shrinershospitalsforchildren.org', '362193608'],
    ['charitywater.org', '223936753']
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

        charityName =          (data.charityName             !== (null || undefined)? data.charityName               :'n/a');
        currentCEO     =       (data.currentCEO              !== (null || undefined)? data.currentCEO                :'n/a');
        if (currentCEO !== 'n/a') {
            currentCEOName =       (data.currentCEO.name         !== (null || undefined)? data.currentCEO.name       :'n/a');
            currentCEOTitle =      (data.currentCEO.title        !== (null || undefined)? data.currentCEO.title      :'n/a');
        }
        else {
            currentCEOName = 'n/a';
            currentCEOTitle = 'n/a';
        }

        tagLine =              (data.tagLine                 !== (null || undefined)? data.tagLine                   :'n/a');

        mission =              (data.mission                 !== (null || undefined)? data.mission                   :'n/a');

        donateEmail =          (data.generalEmail             !== (null || undefined)? data.generalEmail               :'n/a');

        if(data.irsClassification !== (null || undefined)){
            deductible =  (data.irsClassification.deductibility   !== (null || undefined)? data.irsClassification.deductibility :'n/a');
        }else{
          deductible = 'n/a';
        }
        category  =            (data.category                !== (null || undefined)? data.category         :'n/a');
        console.log("category is " + category);
        if (category !== 'n/a') {
            console.log("got into category loop");
            categoryName  =        (data.category.categoryName   !== (null || undefined)? data.category.categoryName     :'n/a');
            categoryImage =        (data.category.image          !== (null || undefined)? data.category.image            :'n/a');
        } else {
            categoryName  = 'n/a';
            categoryImage  = 'n/a';
        }

        charityNavigatorURL =  (data.charityNavigatorURL !== (null || undefined)? data.charityNavigatorURL       :'n/a');
        if (data.currentRating !== (null || undefined) && data.currentRating._rapid_links !== (null || undefined) && data.currentRating._rapid_links.related !== undefined) {
            ratingsURL = (data.currentRating._rapid_links.related.href !==
                undefined? data.currentRating._rapid_links.related.href :'n/a');
        } else {
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
                console.log("programExpensesRatio: " + data2.financialRating.performanceMetrics.programExpensesRatio);
                financialRating = (data2.financialRating !== undefined ? data2.financialRating : 'n/a');
                if (financialRating !== 'n/a') {
                    performanceMetrics = (financialRating.performanceMetrics !==
                        undefined ? financialRating.performanceMetrics : 'n/a');
                    if (performanceMetrics !== 'n/a') {
                        programExpensesRatio = ((performanceMetrics.programExpensesRatio !==
                            undefined) ? performanceMetrics.programExpensesRatio : "n/a");
                        console.log('1' + programExpensesRatio)
                    } else {
                        programExpensesRatio = 'n/a';
                        console.log('2' + programExpensesRatio)
                    }
                    console.log('3' + programExpensesRatio)
                } else {
                    console.log('4' + programExpensesRatio)
                    performanceMetrics = 'n/a';
                    programExpensesRatio = 'n/a';
                    console.log('5' + programExpensesRatio)
                }

                // Make sure to print to console in this function (async task)
                console.log("financialRating: " + financialRating);
                console.log("performanceMetrics: " + performanceMetrics);
                console.log("programExpensesRatio: " + programExpensesRatio);

                let percent = programExpensesRatio * 100;
                document.getElementById("centsOutOfDollar").innerHTML = percent;
                console.log('9' + percent)
                document.querySelectorAll('#progressbar > div').forEach(e => {
                    e.setAttribute('style', `width: ${percent}%`)
                })
            }
        }

        console.log('6' + programExpensesRatio)
       if (programExpensesRatio !== 'n/a') {
         console.log("ratio: " + programExpensesRatio);
          programExpensesRatio = parseInt(programExpensesRatio);
          console.log("new ratio: " + programExpensesRatio);
        }

    console.log('7' + programExpensesRatio)
        // Set HTML objects to variables values
        //document.getElementById("domainName").innerHTML = currUrl;
        document.getElementById("Name").innerHTML = charityName;
        //document.getElementById("programRatio").innerHTML = programExpensesRatio;
        document.getElementById("Name").innerHTML = charityName;

        console.log('8' + programExpensesRatio);
        document.getElementById("CurrCEO").innerHTML = currentCEOName;
        document.getElementById("CEOTitle").innerHTML = currentCEOTitle;

        document.getElementById("taxDeductP").innerHTML = deductible;
        document.getElementById("donateEmailP").innerHTML = donateEmail;

        document.getElementById("missionP").innerHTML = mission.substr(0, 200) + ". . .";
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
