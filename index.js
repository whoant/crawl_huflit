const axios 	= require('axios');
const fs 		= require('fs');
const cheerio   = require('cheerio');

var domain = 'http://ts.huflit.edu.vn/examinee/view/';


var request = [];
var start = 8500;
var end = 9000;
var fileName = 'data17.json';

for (var i = start; i < end; i++) {
	request.push(getData(pad(i, 4)));
}


Promise.all(request).then(function(data){

	fs.writeFileSync(fileName, JSON.stringify(data), {encoding: 'utf8'});
});


function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getData(number){
	return new Promise(function(reject, resolve){
		Crawler(number).then(function(data){

			if (typeof data == 'object') {
				data.total = data.subject1 + data.subject2 + data.subject3;
				console.log(data.name);
				
			}
			reject(data);
		});

	});
}


async function Crawler(number){
	return await axios.get(domain + '00'+number).then(function(data){
		var $ = cheerio.load(data.data);
		var codeSubject = $('#ExamineeType_branch_id').val();
		if (codeSubject === '[7480201] Công nghệ thông tin'){
			return {
				name: $('#ExamineeType_fullname').val(),
				codeSubject: codeSubject,
				subject: $('#ExamineeType_subjectset_id').val(),
				subject1: parseFloat($('#ExamineeType_score1').val()),
				subject2: parseFloat($('#ExamineeType_score2').val()),
				subject3: parseFloat($('#ExamineeType_score3').val()),
			}
		}
		return false;
		
	});

}