const fs=require("fs");
const markdown=require("markdown-it");
const attrs=require("markdown-it-attrs");
const fm=require("markdown-it-front-matter");
const yaml=require("js-yaml");

const nicks=[
  "pr-parkoviste-purkynova",
];

function render(req, res, nick){
  fs.readFile(`./hotspots/${nick}.md`, "utf8", function(err, txt){
    var md=new markdown();
    md.use(attrs);
    var metadata={}; md.use(fm, fm => metadata=yaml.safeLoad(fm));
    var html=md.render(txt);
    console.log(metadata);
    res.render("hotspot.ejs", {html: html, metadata: metadata, nick: nick});
  });
}

module.exports={
  nicks: nicks,
  render: render,
};
