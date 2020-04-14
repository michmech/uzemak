const fs=require("fs");
const markdown=require("markdown-it");
const attrs=require("markdown-it-attrs");
const fm=require("markdown-it-front-matter");
const yaml=require("js-yaml");
const krovak=require("./krovak.js");

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
    var html=md.render(txt).replace(/<a href="http/g, "<a target=\"_blank\" href=\"http");;
    if(metadata.latlon) metadata.krovak=krovak.convert(metadata.latlon[0], metadata.latlon[1]);
    res.render("hotspot.ejs", {html: html, metadata: metadata, nick: nick});
  });
}

module.exports={
  nicks: nicks,
  hotspots: hotspots,
  render: render,
};
