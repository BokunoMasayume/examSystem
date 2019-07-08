const http	= require("http"),
	url 	= require("url"),
	fs		= require("fs"),
	querystring = require("querystring");


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
		fs.readFile('./web_font/index.html' ,function(err,data){
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
		if(parsedUrl.pathname == '/login'){
			console.log(query);
			response.end(JSON.stringify({token:1432443}));
		}else if(parsedUrl.pathname == "/home"){
			sendFile("./web_font/home.html" , response);
		}else if(parsedUrl.pathname=='/questions'){
			sendFile("./web_font/questions.html" , response);
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