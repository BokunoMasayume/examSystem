const http	= require("http"),
	url 	= require("url"),
	fs		= require("fs"),
	querystring = require("querystring");


let userList = [{
	token:12345678,
	username:"allen",
	password : 13579
}];
let examList = [];
let questList = [];


let q1 = {
	id:123,
	score:2,
	uppername:"例化",
	type:"单选",
	title : "“二十四史”编著使用的体例是()。",
	options:[
		{
			content:"记纂体",
			isAnswer:false,
			order:1,
		},
		{
			content:"编年体",
			isAnswer:false,
			order:2,
		},
		{
			content:"小说",
			isAnswer:false,
			order:3,
		},
		{
			content:"纪传体",
			isAnswer:true,
			order:4,
		}
	]
};

let q1Str = JSON.stringify(q1);
for(let i=1;i<=33;i++){
	let t = JSON.parse(q1Str);
	t.id=i;
	questList.push(t);
}

let t1 = {
		id:1234,
		examTitle:"摸仙煲方言专业八级考试",
		upper : "游乐王子",
		startTime: "2019-12-11 12:22",
		duration : 40,
		score:10,
		questions:[q1,q1,q1,q1,q1,q1,q1,q1,q1,q1]
	};

for(let i=0;i<44;i++){
	examList.push(t1);
}


let s1 = {
	name:"张三",
	startTime:"2019-12-11T12:22",
	duration:30,
	score:20
}

var server = http.createServer( function(request, response){
	console.log("create server");
});

server.on("request" , function(request , response){
	console.log("server on request");
	let parsedUrl = url.parse(request.url , true);
	
	console.log("url in request",request.url);
	console.log("pathname in url parse" , parsedUrl.pathname);
	console.log("search in url parse" , parsedUrl.query);
	console.log("request method" , request.method);

	let query;
	if(request.method=='GET'){
		query = parsedUrl.query;
	}else if(request.method=="POST"){
		query = getPostQuery(request);
	}

	if(parsedUrl.pathname=='/' ){//index page
		fs.readFile('./web_font/home.html' ,function(err,data){
			if(err){
				response.writeHead(500,{"Content-Type":"text/plain"});
				response.end("error");
			}else{
				response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
				response.write(data);
				response.end();
			}
		});
	}
	else if( parsedUrl.pathname.startsWith("/src") ) {
		fs.readFile('./web_font'+parsedUrl.pathname ,function(err,data){
			if(err){
				response.writeHead(500,{"Content-Type":"text/plain"});
				response.end("error");
			}else{
				response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
				response.write(data);
				response.end();
			}
		});
	}
	else{
		

		//route
		if(parsedUrl.pathname == '/api/app/login'){
			console.log(query);
			response.end(JSON.stringify({token:1432443}));
		}else if(parsedUrl.pathname == "/login"){
			sendFile("./web_font/index.html" , response);
		}else if(parsedUrl.pathname=='/questions'){
			sendFile("./web_font/questions.html" , response);
		}else if(parsedUrl.pathname == '/exams'){
			sendFile("./web_font/tests.html" , response) ;
		}else if(parsedUrl.pathname == '/addQuest'){
			sendFile("./web_font/addQuestion.html" , response);
		}else if(parsedUrl.pathname == '/addExam'){
			sendFile("./web_font/addTest.html" , response);
		}else if(parsedUrl.pathname == '/scores'){
			sendFile("./web_font/scores.html"  ,response);
		}else if(parsedUrl.pathname == "/updateExam"){
			sendFile("./web_font/updateTest.html"  ,response);
		}
		//api
		else if(parsedUrl.pathname == '/api/search/questList'){
			/*
			*check token...
			*/

			let num = parseInt(query.ps) ;
			let start = num*( parseInt(query.pn) -1);
			let resData = {
				state : "success",
				descript : "",
				count : questList.length,
				questions : questList.slice(start , start + num)
			};
			
			response.writeHead(200,{"Content-Type":"text/plain"});

			response.end(JSON.stringify(resData));
		}
		else if(parsedUrl.pathname == '/api/search/examList'){
			/*
			*check token
			*/
			let num = parseInt(query.ps) ;
			let start = num*( parseInt(query.pn) -1);
			let resData = {
				state : "success",
				descript : "",
				count : examList.length,
				exams : examList.slice(start , start + num)
			};
			
			response.writeHead(200,{"Content-Type":"text/plain"});

			response.end(JSON.stringify(resData));

		}
		else if(parsedUrl.pathname == '/api/insert/quest'){
			console.log("query",query);
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end("");
		}
		else if(parsedUrl.pathname == "/api/search/quest"){
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end(JSON.stringify(q1));
		}
		else if(parsedUrl.pathname == "/api/insert/exam"){
			console.log("query",query);
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end("");
		}
		else if(parsedUrl.pathname == "/api/search/score"){
			console.log("query",query);
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end(JSON.stringify({
				count:33,
				id:13123,
				examTitle:"摸仙煲方言专业八级考试",
				upper:"游乐",
				startTime : "2019-12-11T12:22",
				duration : "23",
				score :100,
				students :[s1,s1,s1,s1,s1,s1]
			}));
		}
		else if(parsedUrl.pathname == "/api/delete/quest"){
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end("");
		}
		else if(parsedUrl.pathname == "/api/delete/exam"){
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end("");
		}
		else if(parsedUrl.pathname =="/api/search/exam"){
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end(JSON.stringify(t1));
		}
		else if(parsedUrl.pathname == "/api/update/exam"){
			response.writeHead(200 , {"Content-Type":"text/plain"});
			response.end("");
		}

	}
});

function sendFile(filepath , response){
	fs.readFile(filepath ,function(err,data){
			if(err){
				response.writeHead(500,{"Content-Type":"text/plain"});
				response.end("error");
			}else{
				response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
				response.write(data);
				response.end();
			}
		});
}
function getPostQuery(req){
	let post = '';
	// console.log("in getPostQuery");
	req.on('data' , chunk => {
		post += chunk;
	   // console.log("ondata",post);

	});
	//do not do something for state 'close'
	req.on('end' , ()=>{
		post = JSON.parse(post);
	console.log("onend",post);

		return post
	});
}
server.listen(8889);

console.log("listening port 8888");