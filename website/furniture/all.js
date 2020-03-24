//temporarily disables hyperlinks that do not work yet
function temporaryDisable(){
  var hrefs=["odbornici-na-uzemni-plan", "pridat"];
  $("a").each(function(){
    var $a=$(this);
    var href=$a.attr("href").replace(/^\//, "").replace(/\/$/, "");
    if(hrefs.indexOf(href)>-1){
      $a.on("click", function(e){
        alert("Tahle stránka se zatím připravuje.");
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
    popupAnchor:  [0, -20], // point from which the popup should open relative to the iconAnchor
    shadowUrl: '/hotspot-shadow.png',
    shadowSize:   [50, 50],
    shadowAnchor: [25, 25],
});
function tileLayer(){
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  	maxZoom: 19,
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
}
var map=null;
var marker=null

//sets up the map on the hotspot page:
function startMapHotspot(){
  map=L.map("map").setView(metadata.latlon, 16);
  tileLayer().addTo(map);
  var marker=L.marker(metadata.latlon, {icon: hotspotIcon, interactive: false}).addTo(map);
  marker.on("click", function(e){
    //window.location="/mapa/?"+nick;
    alert("Tohle ještě nefunguje, sorry.");
  });
}

//sets up the map on the homepage:
function startMapHomepage(){
  map=L.map("map").setView([49.1950833, 16.6081017], 12);
  tileLayer().addTo(map);
  var latlons=[];
  hotspots.map(spot => {
    latlons.push(spot.latlon);
    var marker=L.marker(spot.latlon, {icon: hotspotIcon}).addTo(map);
    var html='<div class="bubble">';
    html+='<div class="title"><a href="/'+spot.nick+'/">'+spot.title+'</a></div>';
    html+='<div class="blurb">'+spot.blurb+' <a href="/'+spot.nick+'/">Víc informací&nbsp;»</a></div>';
    html+='</div>';
    var popup=L.popup({maxWidth: 450}).setContent(html);
    marker.bindPopup(popup);
  });
  map.fitBounds(L.latLngBounds(latlons));
}

function maximizeMap(){
  $("body").addClass("unscrollable");
  $(".mapContainer").addClass("maximized");
  $("#map").replaceWith('<div class="maepchen homePage" id="map"></div>');
  startMapHomepage();
}

function minimizeMap(){
  $("body").removeClass("unscrollable");
  $(".mapContainer").removeClass("maximized");
  $("#map").replaceWith('<div class="maepchen homePage" id="map"></div>');
  startMapHomepage();
}
