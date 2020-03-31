const express=require("express");
const app=express();
const path=require("path");
const querystring=require("querystring");
const PORT=process.env.PORT||80;
const bodyParser=require('body-parser');
  app.use(bodyParser.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded
const fs=require("fs");

//Our static files:
app.use("/", express.static(path.join(__dirname, "furniture")));
app.use("/", express.static(path.join(__dirname, "narratives")));

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

//------

function takeForm(type, body, cb){
  var timestamp=new Date(Date.now()).toISOString().replace(/[\:\.T]/g, "-").replace(/Z$/, "");
  var txt="---\r\n";
  if(body.name) txt+="name: "+body.name+"\r\n";
  if(body.email) txt+="email: "+body.email+"\r\n";
  if(body.latlon) txt+="latlon: "+body.latlon+"\r\n";
  txt+="---\r\n\r\n";
  if(body.plocha) txt+="## O jakou plochu v návrhu se jedná?\r\n\r\n"+body.plocha+"\r\n\r\n";
  if(body.zmena) txt+="## Jakou změnu navrhujete?\r\n\r\n"+body.zmena+"\r\n\r\n";
  if(body.oduvodneni) txt+="## Odůvodnění?\r\n\r\n"+body.oduvodneni+"\r\n\r\n";
  fs.writeFile(`./formdump/${timestamp}-${type}.md`, txt, "utf8", function(){
    cb();
  });
}

//Formulář "Konzultace":
app.get("/konzultace/", function(req, res){
  res.render("konzultace.ejs", {shape: "start"});
});
app.post("/konzultace/", function(req, res){
  takeForm("konzultace", req.body, function(){
    res.render("konzultace.ejs", {shape: "finish"});
  });
});

//Formulář "Přidat do mapy":
app.get("/pridat/", function(req, res){
  res.render("pridat.ejs", {shape: "start"});
});
app.post("/pridat/", function(req, res){
  takeForm("mapa", req.body, function(){
    res.render("pridat.ejs", {shape: "finish"});
  });
});

//------

const appHotspot=require("./app-hotspot.js");
const appNarrative=require("./app-narrative.js");

//Home page:
app.get("/", function(req, res){
  res.render("home.ejs", {hotspots: appHotspot.hotspots});
});

//Hotspot page or narrative page:
app.get("/:nick/", function(req, res){
  var nick=req.params.nick;
  if(appHotspot.nicks.indexOf(nick)>-1){
    appHotspot.render(req, res, nick);
  } else if(appNarrative.nicks.indexOf(nick)>-1){
      appNarrative.render(req, res, nick);
  } else {
    do404(req, res);
  }
});

//------

//404:
function do404(req, res){
  res.status(404).render("404.ejs", {});
}
app.use(do404);

//Start listening:
app.listen(PORT);
console.log("Process ID "+process.pid+" is now listening on port number "+PORT+".");
