const axios 	= require('axios');
const fs 		= require('fs');
const cheerio   = require('cheerio');

var start = 1;
var end = start + 499;
var fileName = 'data.json';

crawlMark();



function crawlMark(){
	console.log('Start :' + start);
	console.log('End :' + end);
	var request = [];


	for (var i = start; i < end; i++) {
		request.push(getData(fillNumber(i, 4)));

	}


	Promise.all(request).then(function(data){
		fs.writeFileSync(fileName, JSON.stringify(data), {encoding: 'utf8', flag: 'a'});
		start = end + 1;
		end = start + 499;
		setTimeout(function(){
			console.log('Wait 3s');
			crawlMark();
		}, 3000)
		
	});
	
}


function fillNumber(n, width, fillNumber = 0) {
	var dataReturn;
	n = n.toString();
	if (n.length < width) {
		dataReturn = new Array(width - n.length + 1).join(fillNumber) + n;
	}else{
		dataReturn = n;
	}
	return dataReturn;
	
}

function getData(number){
	return new Promise(function(reject, resolve){
		Crawler(number).then(function(data){

			if (typeof data == 'object') {
				data.total = data.subject1 + data.subject2 + data.subject3;
				// console.log(data.name);
				
			}
			reject(data);
		});

	});
}


async function Crawler(number){
	return await axios.get('http://ts.huflit.edu.vn/examinee/view/00'+number)
	.then(function(data){
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