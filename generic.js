var DB = require('./db.js')
var request = require('request');
var cheerio = require('cheerio');

var FN_getHtml = function(url, callback) {
    request(url, function(error, response, body) {
        if (!error) {
            callback('success', body);
        } else {
            callback('error', body);
        }
    })
}

var FN_getDOM = function(body, callback) {
    callback(cheerio.load(body));
}

var FN_db_insertDomains = function(domainsList, callback) {
    if (domainsList.length == 0) {
        callback('All domains inserted!!');
    } else {
        domain = domainsList[0];
        domainsList.splice(0, 1);
        console.log(domain)
        console.log('Pending to insert --------------------------------------- ' + domainsList.length)
        let model = new DB.domains(domain);
        model.save(function(err) {
            if (err) {
                console.log(err)
                process.exit(0);
                //FN_db_insertDomains( domainsList, callback )
            } else {
                FN_db_insertDomains(domainsList, callback)
            }
        });
    }
}

var FN_db_insert_programableDomains = function(domainsList, callback) {
    if (domainsList.length == 0) {
        callback('All domains inserted!!');
    } else {
        domain = domainsList.splice(0, 1);
        console.log('Pending to insert --------------------------------------- ' + domainsList.length)
        let model = new DB.temp_programmableweb(domain[0]);
        model.save(function(err) {
            if (err) {
                console.log(err)
                process.exit(0);
                //FN_db_insertDomains( domainsList, callback )
            } else {
                if (domainsList.length) {
                    FN_db_insert_programableDomains(domainsList, callback)
                } else {
                    callback("domain inserted");
                }
            }
        });
    }
}

module.exports = {
    getHtml: FN_getHtml,
    getDom: FN_getDOM,
    db_insertDomains: FN_db_insertDomains,
    db_insert_programableDomains: FN_db_insert_programableDomains
}