// /* global $ */
//
// var geocode = function () {
//   var q = $('#searchBox').val();
//   _geocode(q, function (matches) {
//     matches.forEach(function(match){
//       map.results.addData(match);
//     });
//   });
// };
//
// // var reverseGeocode_old = function(feature, callback) {
// //   var service = 'http://localhost:9200/playground_index/playground_type/_search'; // 'http://localhost:9200/agol/reverseGeocode';
// //   // make the request to Elasticsearch
// //   $.get(service + '=' +  JSON.stringify(feature), function(data) {
// //     _processResults(data, callback);
// //   });
// // };
//
// var reverseGeocode = function(feature, callback) {
//   var coords = feature.geometry.coordinates
//   var extent = [ coords[0], coords[2] ]
//
//   var service = 'http://localhost:3000/example/polygons_index?extent=' + feature.extent
//   $.get(service, function(something) {
//     console.log(something)
//   })
//
// }
//
// var _geocode = function(q, callback) {
//   var index = 'http://localhost:9200/koop_idx/_search?q=';
//   $.get(index + q + '&size=10', function (data) {
//     var hits = data.hits.hits;
//     _processResults(hits, callback);
//   });
// };
//
// var _processResults = function(hits, callback) {
//   var results = [];
//   hits.forEach(function(hit) {
//     var result = JSON.parse(hit._source.feature);
//     result.properties.score = hit._score;
//     // result.id = hit._id;
//     results.push(result);
//   });
//   callback(results);
// };
//
// $(document).ready(function() {
//   $('#searchButton').click(function() {
//     geocode();
//   });
//
//   $('#searchBox').keypress(function (e) {
//     var key = e.which;
//     if (key === 13) {
//         geocode();
//     }
//   });
// });
