const express=require("express");
const app=express();
const path=require("path");
const querystring=require("querystring");
const PORT=process.env.PORT||80;

//Our static files:
app.use("/", express.static(path.join(__dirname, "furniture")));

//Our views:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //http://ejs.co/

//Make sure all non-file GET requests have slahes at the end:
app.get(/^\/.*$/, function(req, res, next) {
  if(!req.path.endsWith("/") && req.path.indexOf(".")==-1){
    var url=req.path+"/";
    var qs=querystring.stringify(req.query);
    if(qs!="") url+="?"+qs;
    res.redirect(301, url);
  }
  else {
    next();
  }
});

//Home page:
app.get("/", function(req, res){
  res.render("home.ejs", {});
});

//------

const appHotspot=require("./app-hotspot.js");

//Hotspot page:
app.get("/mapa/:nick/", function(req, res){
  var nick=req.params.nick;
  if(appHotspot.nicks.indexOf(nick)>-1){
    appHotspot.render(req, res, nick);
  } else {
    do404(req, res);
  }
});

//Random hotspot for the home page:
app.get("/feature.json", function(req, res){
  appHotspot.random(req, res, req.query.not);
});

//------

const appNarrative=require("./app-narrative.js");

//Narrative page:
app.get("/:nick/", function(req, res){
  var nick=req.params.nick;
  if(appNarrative.nicks.indexOf(nick)>-1){
    appNarrative.render(req, res, nick);
  } else {
    do404(req, res);
  }
});


//------

//404:
function do404(req, res){
  console.log("404", req.url);
  res.status(404).render("404.ejs", {});
}
app.use(do404);

//Start listening:
app.listen(PORT);
console.log("Process ID "+process.pid+" is now listening on port number "+PORT+".");
