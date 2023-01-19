var csv = require("csvtojson");
var fs = require("fs")

csv()
  .fromFile('/Users/cnagara1/Desktop/TLP-2/Latest-Tl-Phase-2-raw.csv')
  .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
    fs.writeFile('./csvToJson+.json',JSON.stringify(jsonArrayObj), err => {});
   })