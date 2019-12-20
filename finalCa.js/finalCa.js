//mongodb

use finalCa_Jingjing_Lan

mongoimport -d finalCa_Jingjing_Lan -c hourly_dublin --type csv --headerline --file E:\year3\sem1\datasystem\ca2\BDSDA2FPData\hourly_dublin.csv

mongoimport -d finalCa_Jingjing_Lan -c JLHome1718Power --type csv --headerline --file E:\year3\sem1\datasystem\ca2\BDSDA2FPData\JLHome1718Power.csv

mongoimport -d finalCa_Jingjing_Lan -c JLHome1718Temperature --type csv --headerline --file E:\year3\sem1\datasystem\ca2\BDSDA2FPData\JLHome1718Temperature.csv

show collections

//JLHome1718Power
//JLHome1718Temperature
//hourly_dublin

//use forEach to create research like java for loop
db.JLHome1718Power().forEach(
    function(time){ 
      time.date = new Date(time.date);
db.JLHome1718Power.save(time)});

db.JLHome1718Temperature.find().forEach(
    function(time){
        time.date = new Date(time.date);
        db.JLHome1718Temperature.save(time)
    });

db.hourly_dublin.find().forEach(
    function(time){
        time.date = new Date(time.date);
        db.hourly_dublin.save(time)
    });	
	


//change time front
db.JLHome1718Temperature.find().forEach(
    function(time){
        time.date = new Date(time.date);
        db.JLHome1718Temperature.save(time)
    });
	
db.JLHome1718Power.find().forEach(
    function(time){
        time.date = new Date(time.date);
        db.JLHome1718Power.save(time)
    });

db.hourly_dublin.find().forEach(
    function(time){
        time.date = new Date(time.date);
        db.hourly_dublin.save(time)
    });

//ensureIndex the date
//Temperature
db.JLHome1718Temperature.ensureIndex({'date':1})

db.JLHome1718Temperature.find({
    "date" : { $gte : new ISODate("2018-08-08T00:00:00Z") 
}})
//power
db.JLHome1718Power.ensureIndex({'date':1})

db.JLHome1718Power.find({
    "date" : { $gte : new ISODate("2018-08-08T00:00:00Z") 
}})
//Dublin weather
db.hourly_dublin.ensureIndex({'date':1})

db.hourly_dublin.find({
    "date" : { $gte : new ISODate("2018-08-08T00:00:00Z") 
}})


//base on Data Analysis 2 just want use the data for 2018,try to get all information of year 2018 .

//catch power average for 2018
//time range refrence https://blog.csdn.net/u011781521/article/details/81197781?utm_source=blogxgwz6
//catch data out create new table refrence:https://blog.csdn.net/u014027680/article/details/84838560
db.JLHome1718Power.aggregate([
    {
        $match:{
            "date":{
                '$gte': new Date("2018-01-01T00:00Z"),//(>=) $gte
            '$lt': new Date("2019-01-01T00:00Z")//(<= ) $lt
            }
        }
    },
	{
		$group: 
		{
			_id: { $dateToString: { format: "%Y-%m-%d %H:00:00", date: "$date" } },
			power: { $avg: "$Power" },
		}
	},
	{ 
		$out : "JLHomePower18"
	}	
]);


db.JLHomePower18.find().pretty()
//catch Temperature average for 2018

db.JLHome1718Temperature.aggregate([
{
        $match:{
            "date":{
             '$gte': new Date("2018-01-01T00:00Z"),
            '$lt': new Date("2019-01-01T00:00Z")
            }}},
{
		$group:{
			_id: { $dateToString: { format: "%Y-%m-%d %H:00:00", date: "$date" } },
			Temperature: { $avg: "$Temperature" }
		}
	},
	{$out : "JLHomeTemperature18"}	
]);

db.JLHomeTemperature18.find().pretty()
//catch weather for 2018
db.hourly_dublin.aggregate([
    {
        $match:{
            "date":{
                $gte :new Date("2018-1-1 00:00"),
                $lt :new Date("2019-1-1 00:00 ")
            }
        }
    },
    {
        $out : "newWeather"
    }
]);

db.hourly_dublin.find().pretty()
//now we get the data we want analysis so can delete the initial data:
db.JLHomePower18.drop()

//In order to copy the data we can create different port
//I am sorry my laptop is use window system in Mac, so the mongodb file just can read can not change in the system
//so I just show the follows how to create ports and share

//create new three floders then return mongdb bin file to create ports
mongod --replSet cafinal --dbpath ../cafinal/mongo1 --port 27011
mongod --replSet cafinal --dbpath ../cafinal/mongo2 --port 27012
mongod --replSet cafinal --dbpath ./cafinal/mongo3 --port 27013


mongo localhost:27013

rs.initiate({
_id:'cafinal',
members:[
{_id:1,host:‘localhost:27011’},
{_id:2,host:‘localhost:27012’},
{_id:3,host:‘localhost:27013’}]
})
rs.status();


//then get it work can start to typr what you want:
db.echo.insert({say	:	‘I will come back MAC system now!’})
rs.slaveOk(true);