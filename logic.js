var mapboxAccessToken = "access_token=pk.eyJ1IjoidGFtbWllbHlubmUiLCJhIjoiY2ppY2F2YmFwMWllbDNwbG1xaHQ1dThtbiJ9.PHi-Izw6J6oJCJ403-J1KQ"

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
var techtonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    },

    pointToLayer: function(feature, latlng) {
        return new L.circle(latlng, {
            radius: feature.properties.mag * 40000, 
            fillColor: getColor(feature.properties.mag),
            fillOpacity: 0.5,
            stroke: true, 
            color: "black",
            weight: .3
        })

        function getColor(d) {
            return  d > 5 ? "darkblue":
                    d > 4 ? "darkgreen":
                    d > 3 ? "red":
                    d > 2 ? "orange":
                    d > 1 ? "yellow" :
                            "lightyellow";
        };

        // function getRadius(d) {
        //     return d * 50000;
        // }
    }
    });

createMap(earthquakes); 
}

    function createMap(earthquakes) {
        var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + mapboxAccessToken);
        var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + mapboxAccessToken);


    var plates = L.layerGroup()

    
    var baseMaps = {
        "Outdoor Map": outdoormap, 
        "Dark Map": darkmap,
    };

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Techtonic plates": plates
    };

d3.json(techtonicUrl, function(platesData){
    L.geoJson(platesData, {
        color: "orange",
        weight: 0.5,
})
 .addTo(plates);    

    var map = L.map("map", {
        center: [30, 31],
        zoom: 1., 
        layers: [outdoormap, earthquakes, plates]
    });


    L.control.layers(baseMaps, overlayMaps, {
        collapsed:false
    }).addTo(map);

var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
    
    var div = L.DomUtil.create("div", "info legend"), 
        grades = [0, 1, 2, 3, 4, 5,],
        labels = [];

        for  (var i =0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] +1) + '"></i> ' 
                + grades[i] + (grades[i +1] ? `&ndash;` + grades[i + 1] + '<br>' : '+');
        }

        return div;
};

legend.addTo(map);

function getColor(d) {
    return  d > 5 ? "darkblue":
            d > 4 ? "darkgreen":
            d > 3 ? "red":
            d > 2 ? "orange":
            d > 1 ? "yellow" :
                    "lightyellow";
} 

    })
}