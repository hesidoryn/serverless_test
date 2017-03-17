var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.hello = (event, context, callback) => {
  var params = {};
  params.TableName = "paralect";
  params.Key = {
    "ipAddress": event.source_ip
  };
  params.UpdateExpression = "set viewCount = viewCount + :val";
  params.ExpressionAttributeValues = {
    ":val":1
  };
  params.ReturnValues = "UPDATED_NEW";

  docClient.update(params, function(err, data){
    if(err.message === 'The provided expression refers to an attribute that does not exist in the item'){
      docClient.put({
        TableName: "paralect",
        Item: {
          "ipAddress": event.source_ip,
          "viewCount": 1
        }
      }, function(err, data){
        const response = '<p style="color:red;">Your IP Address: ' + event.source_ip + '. View count: ' + 1 +  '.</p>';
        callback(null, response);
      })
    } else {
      const response = '<div>' + err + '</div><p style="color:red;">Your IP Address: ' + event.source_ip + '. View count: ' + data.Attributes.viewCount +  '.</p>';
      callback(null, response);
    }
    callback(null, err);
  });
}
