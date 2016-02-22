require("./a.js")();
alert("b");
require("./c.js", function(c) {
    c();
});