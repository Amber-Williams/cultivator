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
const path = "/login";
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

function add_unregistered_user(res, req, params) {
    console.log(`Creating default user: ${params[partitionKeyName]}`)
    const body = {
        _id: params[partitionKeyName],
        registered: moment().utc().format(),
        entry_types: {
            "work": { color: "#000000" },
            "sleep": { color: "#008000" },
            "dance": { color: "#FF0100" },
            "none": { color: "#FFFFFF" }
        }
    }

    const putItemParams = {
        TableName: tableName,
        Item: body
    }

    dynamodb.put(putItemParams, (err, data) => {
        if (err) {
            console.error(`FAILED: default user not created`)
            res.statusCode = 500;
            res.json({error: err, url: req.url });
        } else{
            console.log(`SUCCESS: created default user`)
            res.statusCode = 201;
            res.json({success: 'User added successfully!', url: req.url, data: body})
        }
    });
}

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
        res.statusCode = 500;
        res.json({error: 'Could not load items: ' + err.message});
    } else {
        // we register user if they don't exist
        if (data.Item && data.Item["_id"]) {
            res.statusCode = 200;
            res.json({success: 'Got user successfully', url: req.url, data: data.Item })
        }
        else 
            add_unregistered_user(res, req, params);
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
