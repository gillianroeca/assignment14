const MongoClient = require('mongodb').MongoClient;
var readline = require('readline');
var fs = require('fs');
const url = "mongodb+srv://roecag:Cedric05@cluster0.4zl5s.mongodb.net/stocks?retryWrites=true&w=majority";
// connection string 

  
  	MongoClient.connect(url, {useUnifiedTopology:true}, function(err, db) { //callback function with error parameter or db obj
  	if(err) { return console.log(err); return;}

  	var file = readline.createInterface({ 
		input: fs.createReadStream('companies.csv')
	});
  
    var dbo = db.db("stocks"); //like use command //dbo=databaseobject
	var collection = dbo.collection('companies'); //grabs a collection in selected db

	
	file.on('line', function (line) {
		
		var companyname = line.split(",")[0];
		var stocktick = line.split(",")[1];
		var newData = {"name": companyname, "ticker" : stocktick};
		console.log(newData);

		collection.insertOne(newData, function(err, res){
			if(err)
			{
				console.log("querry error: " + err);
				return;
			}
			console.log("document inserted!"); 
		}); 
	}); 
}); // end connect 



