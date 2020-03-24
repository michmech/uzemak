const fs=require("fs");
const markdown=require("markdown-it");
const attrs=require("markdown-it-attrs");
const fm=require("markdown-it-front-matter");
const yaml=require("js-yaml");

nicks=[
  // ""
];
hotspots=[
  //{nick: "", latlon: [0, 0], title: "", blurb: ""}
];
fs.readdirSync("./hotspots/").map(filename => {
  var md=new markdown();
  md.use(attrs);
  var metadata={}; md.use(fm, fm => metadata=yaml.safeLoad(fm));
  if(filename.endsWith(".md")){
    var nick=filename.replace(/\.md$/, "");
    nicks.push(nick);
    var txt=fs.readFileSync(`./hotspots/${nick}.md`, "utf8");
    md.render(txt);
    metadata.nick=nick;
    hotspots.push(metadata);
  }
});

function render(req, res, nick){
  fs.readFile(`./hotspots/${nick}.md`, "utf8", function(err, txt){
    var md=new markdown();
    md.use(attrs);
    var metadata={}; md.use(fm, fm => metadata=yaml.safeLoad(fm));
    var html=md.render(txt);
    res.render("hotspot.ejs", {html: html, metadata: metadata, nick: nick});
  });
}

function random(req, res, notNick){
  var nick=null;
  while(!nick || nick==notNick) nick=nicks[getRandomInt(nicks.length)];
  fs.readFile(`./hotspots/${nick}.md`, "utf8", function(err, txt){
    var md=new markdown();
    md.use(attrs);
    var metadata={}; md.use(fm, fm => metadata=yaml.safeLoad(fm));
    md.render(txt);
    var feature={
      nick: nick,
      latlon: metadata.latlon,
      title: metadata.title,
      blurb: metadata.blurb
    };
    res.json(feature);
  });
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports={
  nicks: nicks,
  hotspots: hotspots,
  render: render,
  random: random,
};
