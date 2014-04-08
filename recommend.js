// Simple recommendation system in node
// Inspiration from: http://otobrglez.opalab.com/ruby/2014/03/23/simple-ruby-recommendation-system.html
// Also, was trying to write some code that highlights the awesomeness of sugar.js
require('sugar');

// Based on a book title, recommend other titles
function recommend(corpus_path, title) {
  // Create the index from the corpus
  var indexes = indexCorpus(corpus_path, title);
  
  // Return all titles with index greater than 0.5
  var recommendations = indexes.filter(function (n){
    if (n.index >= 0.5)
      return n;
  });
  
  return recommendations.reduce(function (head, tail){
    head.push(tail.title);
    return head;
  }, []);
}

// Read book titles from a file (corpus file)
function indexCorpus(path, title) {
  var fs = require('fs');
  
  var list = fs.readFileSync(path).toString().split("\n");
  
  // object to save book_title and it's corresponding index
  var map = [];
  
  list.each(function (book_title){
    var obj = {};
    obj.title = book_title;
    // Compute union of title and book_title
    var a = words(book_title);
    var b = words(title);
    var aub = union(a, b);
    // Compute intersection of title and book_title
    var anb = intersection(a, b);
    
    // Jaccard index, J(A, B) = A n B / A u B
    if (aub === 0) {
      obj.index = 0.0;
    } else {
      obj.index = anb / aub;
    }
    
    map.push(obj);
  });
  
  return map.sortBy(function (n){
    return -n.index; // sort descending
  });
}

// Create a list of unique words of length greater than 2
// from a sentence (book title in this case)
function words(sentence) {
  var words = sentence.words(function (w) {
    return w.toLowerCase();
  }).unique().sortBy();
  words = words.map(function (w) {
    if (w.length > 2)
      return w;
  });
  
  return words;
}

// Compute union of two lists
function union(a, b) {
  return a.union(b).length;
}

// Compute intersection of two lists
function intersection(a, b) {
  return a.intersect(b).length;
}
