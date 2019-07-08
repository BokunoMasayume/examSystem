(function(){
	window.webglUtils = {
		createShader(gl,type,source){
			let shader = gl.createShader(type);
			gl.shaderSource(shader , source);
			gl.compileShader(shader);

			let success = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
			if(success){
				return shader;
			}
			console.log(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
		},

		createProgram(gl,vertexShader , fragmentShader){
			let program = gl.createProgram();
			gl.attachShader(program,vertexShader);
			gl.attachShader(program , fragmentShader);
			gl.linkProgram(program);

			let success = gl.getProgramParameter(program ,gl.LINK_STATUS);
			if(success){
				return program;
			}
			console.log(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
		},

		createProgramById(gl,vertexId , fragmentId){
			let vertexShader = this.createShader(gl,gl.VERTEX_SHADER,document.getElementById(vertexId).text);
			let fragmentShader = this.createShader(gl,gl.FRAGMENT_SHADER,document.getElementById(fragmentId).text);

			return this.createProgram(gl,vertexShader,fragmentShader);
		},
		createAndSetupTexture(gl,img=null,i=0){
			let texture = gl.createTexture();
			gl.activeTexture(gl["TEXTURE"+i]);
			gl.bindTexture(gl.TEXTURE_2D , texture);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);


		    if(img!=null){
		    	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
		    }

		    return texture;
		},
		updateTexture(gl,img,i){
			gl.activeTexture(gl["TEXTURE"+i]);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		},

		mat3 :{
			unit:[
				1,0,0,
				0,1,0,
				0,0,1
			],
			translate(x,y){//平移
				return [
					1,0,0,
					0,1,0,
					x,y,1
				];
			},
			rotate(angle){//旋转
				let co = Math.cos(angle);
				let si = Math.sin(angle);
				return [
					co , si , 0,
					-1*si,co, 0,
					0,0,1
				];
			},
			scale(scalerx,scalery){//缩放
				return [
					scalerx,0,0,
					0,scalery,0,
					0,0,1
				];
			},
			multiply(a,b){
				let v0 = a[0]*b[0]+a[3]*b[1]+a[6]*b[2];
				let v1 = a[0]*b[3]+a[3]*b[4]+a[6]*b[5];
				let v2 = a[0]*b[6]+a[3]*b[7]+a[6]*b[8];

				let v3 = a[1]*b[0]+a[4]*b[1]+a[7]*b[2];
				let v4 = a[1]*b[3]+a[4]*b[4]+a[7]*b[5];
				let v5 = a[1]*b[6]+a[4]*b[7]+a[7]*b[8];

				let v6 = a[2]*b[0]+a[5]*b[1]+a[8]*b[2];
				let v7 = a[2]*b[3]+a[5]*b[4]+a[8]*b[5];
				let v8 = a[2]*b[6]+a[5]*b[7]+a[8]*b[8];

				return [
					v0,v3,v6,
					v1,v4,v7,
					v2,v5,v8
				];
			}

		},

		mat4:{
			unit:[
				1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1
			],

			scale(sx,sy,sz){
				return [
					sx,0,0,0,
					0,sy,0,0,
					0,0,sz,0,
					0,0,0,1
				];
			},

			translate(dx,dy,dz){
				return [
					1,0,0,0,
					0,1,0,0,
					0,0,1,0,
					dx,dy,dz,1
				];
			},

			rotateX(angle){
				let si = Math.sin(angle);
				let co = Math.cos(angle);

				return [
					1,0,0,0,
					0,co,si,0,
					0,-1*si,co,0,
					0,0,0,1
				];
			},
			rotateY(angle){
				let si = Math.sin(angle);
				let co = Math.cos(angle);

				return [
					co,0,si,0,
					0,1,0,0,
					-1*si,0,co,0,
					0,0,0,1
				];
			},
			rotateZ(angle){
				let si = Math.sin(angle);
				let co = Math.cos(angle);
				return [
					co,si,0,0,
					-1*si,co,0,0,
					0,0,1,0,
					0,0,0,1
				];
			},
			multiply(a,b){
				
			}
		},
		setUniform(gl,program,type,name,...args){
			let unilocal = gl.getUniformLocation(program , "u_"+name);
			gl["uniform"+type](unilocal,...args);
		},
		loadImageList(imgList){
			return new Promise((resolve,reject)=>{
				Promise.all(imgList.map((imgobj)=>{
					return new Promise((resolve,reject)=>{
						imgobj.img=new Image();
						imgobj.img.addEventListener("load",(event)=>{
							resolve(imgobj);
						});
						imgobj.img.src = imgobj.src;
					});
				})).then((backList)=>{
					let r={};//list to object
					backList.forEach((theImg)=>{
						r[theImg.name]={
							src : theImg.src,
							img : theImg.img
						};
					});
					resolve(r);
				});
			});
		}
	}
})();