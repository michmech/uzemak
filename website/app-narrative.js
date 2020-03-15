const fs=require("fs");
const markdown=require("markdown-it");
const attrs=require("markdown-it-attrs");
const fm=require("markdown-it-front-matter");
const yaml=require("js-yaml");

const nicks=[
  "chci-vic-informaci",
  "chci-o-hodne-vic-informaci",
  "chci-se-zorientovat",
  "chci-radu-odbornika",
  "chci-vas-podporit",
  "jak-cist-uzemni-plan",
  "jak-se-stat-zastupcem-verejnosti",
  "kdo-jsme",
  "propojeni",
];

function render(req, res, nick){
  fs.readFile(`./narratives/${nick}.md`, "utf8", function(err, txt){
    var md=new markdown();
    md.use(attrs);
    var metadata={}; md.use(fm, fm => metadata=yaml.safeLoad(fm));
    var html=md.render(txt);
    console.log(metadata);
    res.render("narrative.ejs", {html: html, metadata: metadata, nick: nick});
  });
}

module.exports={
  nicks: nicks,
  render: render,
};
