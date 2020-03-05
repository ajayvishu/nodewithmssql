var express = require('express');
var sql = require("mssql");
var bodyparser = require("body-parser");
var app = express();

// Body Parser Middleware
app.use(bodyparser.json()); 

//Cors Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

// Config for your database
var config = {
    user: 'sa',
    password: '123456',
    server: 'localhost', 
    database: 'TESTDB' 
};

//Function to connect to database and execute query
var  executeQuery = function(res, query){             
    sql.connect(config, function (error_db) {
        if (error_db) {   
            console.log("Error while connecting Database :- " + error_db);
            res.send(error_db);
        }
        else 
		{
             // Create Request object
            var request = new sql.Request();
             // Query to the database
            request.query(query, function (error_query, res_data) {
                if (error_query) {
                    console.log("Error while querying Database :- " + error_query);
                    res.send(error_query);
                }
                else {
                    res.send(res_data);
                }
            });
        }
    });           
}

//GET API
app.get("/api/emp", function(req , res){
    var query = "SELECT * FROM Employee";
    executeQuery (res, query);
});

//GET API WITH ID
app.get("/api/emp/:id", function(req , res){
    var query = "SELECT * FROM Employee WHERE EmployeeID= " + req.params.id;
    executeQuery (res, query);
});

//POST API
 app.post("/api/emp", function(req , res){
    var query = "INSERT INTO Employee VALUES ('" + req.body.Employeename + "','" + req.body.EmployeeJoiningDate + "','" + req.body.Status + "')";
    executeQuery (res, query);
});

//PUT API
 app.put("/api/emp/:id", function(req , res){
    var query = "UPDATE Employee SET Employeename= '" + req.body.Employeename  +  "' , EmployeeJoiningDate=  '" + req.body.EmployeeJoiningDate + "',Status=  '" + req.body.Status + "'  WHERE EmployeeID= " + req.params.id;
    executeQuery (res, query);
});

// DELETE API
 app.delete("/api/emp/:id", function(req , res){
    var query = "DELETE FROM Employee WHERE EmployeeID=" + req.params.id;
    executeQuery (res, query);
});

var server = app.listen(4986, function () {
    console.log('server is running port 4986 ..');
});

/*Create Table With Some Record*/
/*
CREATE TABLE [dbo].[Employee](
	[EmployeeID] [bigint] IDENTITY(1,1) NOT NULL,
	[Employeename] [varchar](25) NULL,
	[EmployeeJoiningDate] [datetime] NULL,
	[Status] [int] NULL
) ON [PRIMARY]
GO
INSERT [dbo].[Employee] ([EmployeeID], [Employeename], [EmployeeJoiningDate], [Status]) VALUES (1, N'ajay', CAST(N'2020-01-02T09:53:05.390' AS DateTime), 1)
INSERT [dbo].[Employee] ([EmployeeID], [Employeename], [EmployeeJoiningDate], [Status]) VALUES (2, N'hiren', CAST(N'2020-01-02T09:53:21.930' AS DateTime), 0)
INSERT [dbo].[Employee] ([EmployeeID], [Employeename], [EmployeeJoiningDate], [Status]) VALUES (3, N'ganesh', CAST(N'2020-01-02T09:53:34.910' AS DateTime), 1)
*/
