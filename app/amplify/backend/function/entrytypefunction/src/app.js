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

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "database";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const path = "/entry-type";

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


/*********************************************************
* HTTP Get method for getting all entry types of a user *
*********************************************************/
app.get(path, function(req, res) {
    console.log("STARTED: GET request for getting all entry types of a user")
    let getItemParams = {
      TableName: tableName,
      Key: {
          "_id": req.query["_id"]
      }
    }
  
    dynamodb.get(getItemParams,(err, data) => {
      if (err) {
            console.error("FAILED: unable to get all user's entry types")
            res.statusCode = 500;
            res.json({error: 'Could not load items: ' + err.message});
      } else {
            if (data.Item && data.Item.entry_types) {
                console.log("SUCCESS: got all user's entry types")
                res.statusCode = 200;
                res.json(data.Item.entry_types);
            }
            else {
                console.error("FAILED: unable to get all user's entry types")
                res.statusCode = 404;
                res.json({
                    'result': 'error', 
                    'message': 'User does not exist'
                });
            }
      }
    });
});

/***********************************************
* HTTP post method for user adding entry type *
************************************************/
app.post(path, function(req, res) {
    const updateItemParams = {
        TableName: tableName,
        Key: {
            "_id": req.body["_id"]
        },
        UpdateExpression: "SET #entry_types.#entry_name = :entry_type",
        ExpressionAttributeValues: {
            ':entry_type': {'color': req.body.entry_type.color},
        },
        ExpressionAttributeNames: {
            "#entry_types" : "entry_types",
            "#entry_name" : req.body.entry_type.name,
            
        },
        ConditionExpression: "attribute_not_exists(#entry_types.#entry_name)",
        ReturnValues: "ALL_NEW"
    }

    dynamodb.update(updateItemParams, (err, data) => {
        if (err) {
            
            if (err.statusCode === 400) {
                console.error("FAILED: entry already exists")
                res.statusCode = 409;
                res.json({error: "Entry already exists", url: req.url, body: req.body});
            } else {
                console.error(`FAILED: unable to add entry type of ${req.body.entry_type.name}`)
                res.statusCode = 500;
                res.json({error: err, url: req.url, body: req.body});
            }
           
        } else {
            console.log(`SUCCESS: added entry type of - ${req.body.entry_type.name}`)
            const updated_entry_types = data.Attributes.entry_types
            res.statusCode = 200;
            res.json({success: `Entry type: "${req.body.entry_type.name}" successfully added`, data: updated_entry_types })
        }
    });
});

/***************************************************
* HTTP delete method to remove a user's entry type *
****************************************************/
app.delete(path, function(req, res) {

    const removeItemParams = {
        TableName: tableName,
        Key: {
            "_id": req.body["_id"]
        },
        UpdateExpression: `REMOVE #et.#item`,
        ExpressionAttributeNames: {
            "#et" : `entry_types`,
            "#item" : req.body.entry_type,
        },
        ReturnValues: "ALL_NEW"
    }

    dynamodb.update(removeItemParams, (err, data) => {
        if (err) {
            console.error(`FAILED: unable to delete user's entry type - ${req.body.entry_type}`)
            res.statusCode = 500;
            res.json({error: err, url: req.url});
        } else {
            const updated_entry_types = data.Attributes.entry_types
            console.log(`SUCCESS: deleted user's entry type - ${req.body.entry_type}`)
            res.statusCode = 200;
            res.json({success: `Entry type: "${req.body.entry_type}" successfully removed`, data: updated_entry_types});
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
