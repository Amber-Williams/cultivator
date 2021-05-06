/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var moment = require('moment')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "database";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = true;
const partitionKeyName = "_id";
const partitionKeyType = "S";
const path = "/entry";
const UNAUTH = 'UNAUTH';

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************************
 * HTTP GET - single dated entry            *
 ********************************************/
app.get(path, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  params[partitionKeyName] = params[partitionKeyName] + '__' + req.query.date

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item); // TODO: update this to use {success, data} formatting
      } else {
        // no entry exists for that date
        res.json({error: 'No entry for that date'});
      }
    }
  });
});

/******************************************
* HTTP POST -  editing single dated entry *
*******************************************/

app.post(path, function(req, res) {
  if (userIdPresent) {
    req.body['user_id'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  req.body[partitionKeyName] = req.body['user_id'] + '__' + req.body.date

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }

  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body}); //TODO: update this from body to data and remove url
    } else{
      res.json({success: 'successfully got dated entry', url: req.url, data: req.body})
    }
  });
});



/********************************************
 * HTTP GET - date entry range data         *
 ********************************************/
 app.get(path + "/range", function(req, res) {
    const { date_start, date_end } = req.query;
    const user_id = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
    const getItemsParams = {
        TableName: tableName,
        FilterExpression : 'user_id = :hkey AND #range BETWEEN :val1 AND :val2',
        ProjectionExpression: "time_entry, #range, notes",
        ExpressionAttributeNames: {
            "#range" : "date",
        },
        ExpressionAttributeValues : {
            ':hkey' : user_id,
            ":val1" : date_start,
            ":val2" : date_end
        },
        
    };


    function count_entry_type_intervals(entry_obj) {
        const count_obj = {};
        for (let time in entry_obj) {
            if (entry_obj[time]) {
                count_obj[entry_obj[time]] = count_obj[entry_obj[time]] + 1 || 1;
            }
        }

        return count_obj
    }

    dynamodb.scan(getItemsParams,(err, data) => {
      if (err) {
        res.json({error: 'Could not load items: ' + err.message});
      } else {
        if (data.Items) {

          // formats entries' entry_types to count 15 minute intervals
          const formatted_items = data.Items.map(entry => {
              entry.time_entry = count_entry_type_intervals(entry.time_entry)
              return entry
          })

          res.json({ success: 'successfully loaded between dates', data: formatted_items });
        } else {
          // no entry exists for that date
          res.json({error: 'No entry for that date'});
        }
      }
    });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
