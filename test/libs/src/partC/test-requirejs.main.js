var c = require('./c.js');
c();




require('./c.js', function(c){
	c();
});