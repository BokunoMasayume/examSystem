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
		let query;
		if(request.method=='GET'){
			query = parsedUrl.query;
		}else if(request.method=="POST"){
			query = getPostQuery(request);
		}

		//route
		if(parsedUrl.pathname == '/api/login'){
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
	req.on('data' , chunk => {
		post += chunk;
	});
	//do not do something for state 'close'
	req.on('end' , ()=>{
		post = querystring.parse(post);
		return post
	});
}
server.listen(8888);

console.log("listening port 8888");