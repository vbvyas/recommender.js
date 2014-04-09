// Simple Dev tool script to extract titles from amazon.com
var elems = $('div.data > h3 > a');
for (var i = 0; i < elems.length; i++) { console.log(elems[i].text); }
