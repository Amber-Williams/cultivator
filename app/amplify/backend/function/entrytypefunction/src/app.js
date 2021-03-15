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

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "_id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/entry-type";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
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

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/
app.get(path, function(req, res) {
    let getItemParams = {
      TableName: tableName,
      Key: {
          "_id": req.query["_id"]
      }
    }
  
    dynamodb.get(getItemParams,(err, data) => {
      if(err) {
          res.statusCode = 500;
          res.json({error: 'Could not load items: ' + err.message});
      } else {
          // we register user if they don't exist
          if (data.Item && data.Item.entry_types) 
              res.json(data.Item.entry_types);
          else 
            res.json({
                'result': 'error', 
                'message': 'User does not exist'
            });
      }
    });
});

/***********************************************
* HTTP post method for user adding entry type *
************************************************/

app.post(path, function(req, res) {
    console.log('body is', req.body)
    
    console.log('key:', {
        "_id": req.body["_id"]
    })

    const updateItemParams = {
        TableName: tableName,
        Key: {
            "_id": req.body["_id"]
        },
        UpdateExpression: "SET #attrName = list_append(#attrName, :i)",
        ExpressionAttributeValues: {
            ':i': [req.body.entry_type],
        },
        ExpressionAttributeNames: {
            "#attrName" : "entry_types"
        },
        ReturnValues: "UPDATED_NEW"
    }

    console.log('updateItemParams created:', JSON.stringify(updateItemParams))

    dynamodb.update(updateItemParams, (err, item) => {
        if (err) {
            console.log('UsrPDATE FAILED! => ', err);
            res.statusCode = 500;
            res.json({error: err, url: req.url, body: req.body});
        } else {
            console.log('SUCCESS UPDATE! => ', item);
            item = item.Attributes;
            res.json({success: 'post call succeed!', url: req.url, data: item})
        }
    });
});

// /**************************************
// * HTTP remove method to delete object *
// ***************************************/

// app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
//   var params = {};
//   if (userIdPresent && req.apiGateway) {
//     params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   } else {
//     params[partitionKeyName] = req.params[partitionKeyName];
//      try {
//       params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }
//   if (hasSortKey) {
//     try {
//       params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }

//   let removeItemParams = {
//     TableName: tableName,
//     Key: params
//   }
//   dynamodb.delete(removeItemParams, (err, data)=> {
//     if(err) {
//       res.statusCode = 500;
//       res.json({error: err, url: req.url});
//     } else {
//       res.json({url: req.url, data: data});
//     }
//   });
// });
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
