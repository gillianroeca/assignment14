
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://roecag:Cedric05@cluster0.4zl5s.mongodb.net/stocks?retryWrites=true&w=majority";
var http = require('http'); 
var fs = require('fs'); //same as running html file directly 
var qs = require('querystring');
var readline = require('readline');
var port = process.env.PORT || 3000;
//var port =8080;


http.createServer(function(req, res) {
    
    if (req.url == "/")
    {
        file = "hw14form.html";
        fs.readFile(file, function(err, text) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(text);
            res.end();
        });
    } 
    
    else if (req.url == "/process")
    {     
        pdata = "";
        req.on('data', data => {
            pdata += data.toString();
        });
        
        req.on('end', () => {
            pdata = qs.parse(pdata);
            query = "";
            if (pdata['companyname'] == "")
            {
            	query = {ticker: pdata['ticker']};
            }
            else 
            {
                query = {name: pdata['companyname']};
            }
             getmongo(query, function(output) {
             	res.writeHead(200, {'Content-Type': 'text/html'});
                res.write("<h2>Stock Ticker Results: </h2>" + output);
                res.end();
            });
            
        });
        
        
    }
}).listen(port);

function getmongo(query, callback)
{    
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) {console.log("Connection err: " + err); return;}       
        var dbo = db.db("stocks");
        var collection = dbo.collection('companies');

                
        result = "";
        collection.find(query).toArray(function(err, items) {
            if (err) {throw err;}
            else 
            {
                if (items.length == 0)
                {
                    result += "There's no document in the database with that information.";
                }
                else 
                {
                	result = "<strong>Ticker: </strong>" + items[0]["ticker"] + "<br><br><strong>Company Name: </strong><ul>";
                    for (i=0; i<items.length; i++)
                    {
                        result += "<li>" + items[i].name + "</li>";
                    }
                    result += "</ul>"
                }
            }
            callback(result);
        });  //end find		
    });
}


