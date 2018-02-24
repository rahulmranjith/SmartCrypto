var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: 'https://dynamodb.us-west-2.amazonaws.com',// "http://localhost:8009",
    accessKeyId: 'AKIAJ4NC6WCCVRMB5YAQ',
    secretAccessKey: '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'
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: "Users",
    KeySchema: [
        { AttributeName: "uniqID", KeyType: "HASH" },  //Partition key

    ],
    AttributeDefinitions: [
        { AttributeName: "uniqID", AttributeType: "S" },

    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.describeTable({ TableName: 'Users' }, function (err, data) {
    if (err) {
        dynamodb.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    }
    else {
        console.log(data);
    }
})



var docClient = new AWS.DynamoDB.DocumentClient()
var table = "Users";
var displayName = "";
var curr = "";
var portfolio = "";
var uniqID = "";
var inputs

var getRecords = function () {
    return new Promise((resolve, reject) => {
        inputs = {
            TableName: table,
            Key: {
                "displayName": displayName,
                "curr": curr,
                "portfolio": portfolio,
                "uniqID": uniqID,
            }
        };
        docClient.scan(inputs, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            } else {
                console.log("getRecords succeeded:", JSON.stringify(data, null, 2));
                resolve(data)
            }
        });
    })
};

var getRecord = function (where) {
    return new Promise((resolve, reject) => {
        inputs = {
            TableName: table,
            Key: where
        };
        docClient.get(inputs, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("getRecord succeeded:", JSON.stringify(data, null, 2));
                if (data.Item) {
                    resolve(data.Item);
                }
                else {
                    resolve(null);
                }

            }
        });
    })
};


var deleteUsers = function (id) {
    return new Promise((resolve, reject) => {
        inputs = {
            TableName: table,
            Key: { uniqID: id }
        };
        docClient.delete(inputs, function (err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            } else {
                console.log("delete succeeded:", JSON.stringify(data, null, 2));
                resolve(data)
            }
        });
    })
};


var updateInsert = function (newItem) {
    return new Promise((resolve, reject) => {

        var UpdateExpressionConfigured = "SET "
        var ExpressionAttributeValueConfigured = {}
        if (newItem.displayName) {
            UpdateExpressionConfigured += "displayName=:displayName,"
            ExpressionAttributeValueConfigured[":displayName"] = newItem.displayName
        }
        if (newItem.curr) {
            UpdateExpressionConfigured += "curr=:curr,"
            ExpressionAttributeValueConfigured[":curr"] = newItem.curr
        }
        if (newItem.portfolio) {
            UpdateExpressionConfigured += "portfolio=:portfolio,"
            ExpressionAttributeValueConfigured[":portfolio"] = newItem.portfolio
        }
        UpdateExpressionConfigured = UpdateExpressionConfigured.substr(0, UpdateExpressionConfigured.length - 1)
        inputs = {
            TableName: table,
            Key: { "uniqID": newItem.uniqID },

            UpdateExpression: UpdateExpressionConfigured,
            ExpressionAttributeValues: ExpressionAttributeValueConfigured,
            // ConditionExpression: "uniqID = :uniqID",
            ReturnValues: "ALL_NEW"
        }

        docClient.update(inputs, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        })

    })
}


module.exports = {
    // g_User: User,
    g_getRecord: getRecord,
    g_getRecords: getRecords,
    // g_createRecord: createRecord,
    g_UpdateInsert: updateInsert,
    g_deleteUser: deleteUsers
}