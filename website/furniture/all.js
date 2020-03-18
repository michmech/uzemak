//temporarily disables hyperlinks that do not work yet
function temporaryDisable(){
  var hrefs=["#", "mapa"];
  $("a").each(function(){
    var $a=$(this);
    var href=$a.attr("href").replace(/^\//, "").replace(/\/$/, "");
    if(hrefs.indexOf(href)>-1){
      $a.on("click", function(e){
        alert("Tohle ještě nefunguje, sorry.");
        e.preventDefault();
      });
    }
  });
}
