/*jslint browser: true*/
/*jslint white: true */
/*global L */


var map;


var showScoring = function (feature, layer) {
	// builds the table for the on-click popups
	var table = document.createElement('table');
	var props = feature.properties;
	Object.keys(props).forEach(function(k){
		// quattroshapes have a lot of null values so strip them out
		if (props[k] !== null){
			var row = table.insertRow();
			var label = row.insertCell(0);
			var value = row.insertCell(1);
			label.innerHTML = k;
			value.innerHTML = props[k];
		}
	});

	layer.bindPopup(table);
};

(function (window, document, L, undefined) {
	'use strict';

	L.Icon.Default.imagePath = 'images/';
	map = L.map('map').setView([38.9047, -77.0164], 7);
	// L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png', {
	//     attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth'
	// 	}).addTo(map);

	// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	//   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	//   maxZoom: 18,
	//   id: 'mapbox.streets',
	//   accessToken: 'pk.eyJ1IjoibWUzNjBvdCIsImEiOiJjajZkejc2dnIwMHh5MndsOWE3Mmhncm10In0.RGHiMclp3dSwyAsm7BQaYg'
	// }).addTo(map);

	L.tileLayer('//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        minZoom: 0,
        label: 'Toner Lite'  // optional label used for tooltip
    }).addTo(map)

	// Initialise the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);
	// init a results layer
	map.results = L.geoJson(null,{onEachFeature: showScoring}).addTo(map);

	// Initialise the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
	    edit: {
	        featureGroup: drawnItems
	    	}
	    });
	map.addControl(drawControl);

	map.on('draw:created', function (e) {
	    var layer = e.layer;
	    var feature = layer.toGeoJSON();
	   	map.addLayer(layer);
			console.log(feature)
	    reverseGeocode(feature, function(matches){
	    	matches.forEach(function(match){
	    		map.results.addData(match);
	    	});
	    });
	});

}(window, document, L));


/* global $ */

var geocode = function () {
  var q = $('#searchBox').val();
  _geocode(q, function (matches) {
    matches.forEach(function(match){
      map.results.addData(match);
    });
  });
};

// var reverseGeocode_old = function(feature, callback) {
//   var service = 'http://localhost:9200/playground_index/playground_type/_search'; // 'http://localhost:9200/agol/reverseGeocode';
//   // make the request to Elasticsearch
//   $.get(service + '=' +  JSON.stringify(feature), function(data) {
//     _processResults(data, callback);
//   });
// };

var reverseGeocode = function(feature, callback) {
	console.log(feature.geometry.coordinates)
  var coords = feature.geometry.coordinates
	console.log('coords: ', coords[0][2])
	// let extent = '[['
	// extent += coords[0].toString()
	// extent += '],['
	// extent += coords[2].toString()
	// extent += ']]'

	let extent = `[[${coords[0]}],[${coords[2]}]]`

	let baseURL = 'http://localhost:3000/'
	let indexName = 'shape_index/'
	let query = '?extent=[['
	let coord0 = coords[0][0]
	let middle = '],['
	let coord2 = coords[0][2]
	let closure = ']]'
	let url = baseURL + indexName + query + coord0 + middle + coord2 + closure

	console.log('URL: ', url)


  // var service = 'http://localhost:3000/polygons_index?extent='.concat(extent)
  // $.get(service, function(something) {
  //   console.log(something)
  // })

	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		xhrFields: {
			withCredentials: false
		},
		headers: {},
		success: function(success) {
			console.log('success: ', success)
		},
		error: function(error) {
			console.log('error: ', error)
		},
	})

}

var _geocode = function(q, callback) {
  var index = 'http://localhost:9200/koop_idx/_search?q=';
  $.get(index + q + '&size=10', function (data) {
    var hits = data.hits.hits;
    _processResults(hits, callback);
  });
};

var _processResults = function(hits, callback) {
  var results = [];
  hits.forEach(function(hit) {
    var result = JSON.parse(hit._source.feature);
    result.properties.score = hit._score;
    // result.id = hit._id;
    results.push(result);
  });
  callback(results);
};

$(document).ready(function() {
  $('#searchButton').click(function() {
    geocode();
  });

  $('#searchBox').keypress(function (e) {
    var key = e.which;
    if (key === 13) {
        geocode();
    }
  });
});
