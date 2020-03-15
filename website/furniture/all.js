//temporarily disables hyperlinks that do not work yet
function temporaryDisable(){
  var hrefs=["#", "mapa", "mapa/chci-nahlasit-lokalitu", "mapa/pr-parkoviste-purkynova", "kdo-jsme", "propojeni", "chci-vas-podporit", "chci-radu-odbornika", "jak-se-stat-zastupcem-verejnosti", "jak-cist-uzemni-plan", "chci-se-zorientovat", "chci-o-hodne-vic-informaci"];
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

//sets up on-click events for the wanter menu
function wanters(){
  $(".menu a").attr("href", "javascript:void(null)");
  $(".menu a").on("click", function(e){
    var $a=$(e.delegateTarget);
    var category=$a.attr("category");

    $(".menu a").removeClass("current");
    $a.addClass("current");

    $(".wanter").hide();
    $('.wanter[categories*="'+category+'"]').slideDown();
  });
}
