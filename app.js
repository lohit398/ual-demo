var express = require('express');
var jsforce = require('jsforce');
var app = express();
const path = require('path');
const port = process.env.PORT || 3000;

const uName = process.env.username;
const pwd = process.env.password;

app.use(express.static(__dirname + '/'));

app.use(express.json());

/*Allow CORS*/
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization,X-Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');

    next();
});

app.get('/knowledge', function (req, response) {
    var conn = new jsforce.Connection();
    conn.login(uName, pwd, function (err, res) {
        if (err) {
            return console.error(err);
        }
        conn.query("SELECT ArticleNumber,FAQ_Answer__c,Title FROM Knowledge__kav WHERE Language = 'en_US' AND PublishStatus = 'Online' AND MasterVersionId in (SELECT EntityId FROM TopicAssignment WHERE Topic.Name IN " + req.query.topics + ")", function (err, res) {
            if (err) {
                return console.error(err);
            }
            response.send(res);
        });

    });
});

app.get('/knowledgesearch', function (req, response) {
    var conn = new jsforce.Connection();
    conn.login(uName, pwd, function (err, res) {
        if (err) {
            return console.error(err);
        }
        conn.query("SELECT ArticleNumber,FAQ_Answer__c,Title FROM Knowledge__kav WHERE Language = 'en_US' AND PublishStatus = 'Online' AND MasterVersionId in (SELECT EntityId FROM TopicAssignment WHERE Topic.Name IN ('SJD','DEN','Airbus A320','United Economy','International Flight','UA 452','UA 338','Mexico','Denver, CO','Cabo San Lucas, MX') ) AND Title Like '%" + req.query.searchstring + "%'", function (err, res) {
            if (err) {
                return console.error(err);
            }
            response.send(res);
        })
    })
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});
