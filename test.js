const fs = require('fs');


var arrayReadFile = [];

for (var i = 0; i <= 17; i++) {
	// console.log('data'+i+'.json');
	arrayReadFile.push(readfilePromise('data'+i+'.json'));
}

// console.log(arrayReadFile);
Promise.all(arrayReadFile).then(function(values){
	var dataTotal = [];
	values.map(function(items){
		var data = JSON.parse(items);
		// console.log(data);
		var dataReturn = data.filter(function(value){
			return typeof value == 'object' && value.total > 21;
		});
		dataTotal = dataTotal.concat(dataReturn);
		});

	console.log(dataTotal.length);

	// dataTotal = dataTotal.sort(function(a, b){
	// 	// console.log(a.total +'|'+b.total);
	// 	return a.total < b.total;
	// });

	// fs.writeFileSync('dataTotal.json', JSON.stringify(dataTotal), {encoding: 'utf8'});
// }).catch(function(errors){

	// console.log(errors);

});

function readfilePromise(path){
	return new Promise(function(resolve, reject){
		fs.readFile(path, {encoding: 'utf8'}, function(error, data){
			if (error) {
				// console.log(error);
				reject(error);
			}else{
				resolve(data);
			}
		});
	});
}