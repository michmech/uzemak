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

//helpers for leaflet maps:
const hotspotIcon=L.icon({
    iconUrl: '/hotspot.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [40, -10], // point from which the popup should open relative to the iconAnchor
    shadowUrl: '/hotspot-shadow.png',
    shadowSize:   [50, 50],
    shadowAnchor: [25, 25],
});
const tileLayer=L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var map=null;
var marker=null

//loads (and reloads) the featured hotspot on the homepage:
function loadFeature(){
  $("#map").hide();
  $(".feature .wait").show();
  $.getJSON("/feature.json", {not: $("#feature").data("nick")}, function(hotspot){
    $("#feature").data("nick", hotspot.nick);
    $("#feature .title a").html(hotspot.title);
    $("#feature .blurb .inside").html(hotspot.blurb);
    $("#feature a").attr("href", "/mapa/"+hotspot.nick+"/");
    startMapHomepage(hotspot);
    $(".feature .wait").hide();
    $(".feature").hide().fadeIn();
  });
}

//sets up the map on the home page:
function startMapHomepage(hotspot){
  $("#map").show();
  if(!map) {
    map=L.map("map");
    tileLayer.addTo(map);
  }
  map.setView(hotspot.latlon, 15);
  if(marker) marker.remove();
  marker=L.marker(hotspot.latlon, {icon: hotspotIcon}).addTo(map);
  marker.on("click", function(e){
    window.location="/mapa/"+hotspot.nick+"/";
  });
}

//sets up the map on the hotspot page:
function startMapHotspot(){
  map=L.map("map").setView(metadata.latlon, 16);
  tileLayer.addTo(map);
  var marker=L.marker(metadata.latlon, {icon: hotspotIcon}).addTo(map);
  marker.on("click", function(e){
    //window.location="/mapa/?"+nick;
    alert("Tohle ještě nefunguje, sorry.");
  });
}
