const express=require("express");
const app=express();
const path=require("path");
const PORT=process.env.PORT||80;

//Paths to our static files:
app.use("/", express.static(path.join(__dirname, "static")));

//Path to our views:
app.set('views', path.join(__dirname, "views")); app.set('view engine', 'ejs') //http://ejs.co/

//Homepage:
app.get("/", function(req, res){
  res.render("home.ejs", {timeLeft: timeLeft()});
});

//Start listening:
app.listen(PORT);
console.log("Process ID "+process.pid+" is now listening on port number "+PORT+".");

//Utilities
function timeLeft(){
  var startDate=new Date();
  var endDate=new Date("2020-03-23T11:00:00.000+00:00");
  var diff=endDate-startDate;
  var days=Math.floor(diff/1000/60/60/24);
    diff-=days*1000*60*60*24;
  var hours=Math.floor(diff/1000/60/60);
    diff-=hours*1000*60*60;
  var minutes=Math.floor(diff/1000/60);
  var ret={days: (days<=9?"0":"")+days, hours: (hours<=9?"0":"")+hours, minutes: (minutes<=9?"0":"")+minutes};
  return ret;
}
