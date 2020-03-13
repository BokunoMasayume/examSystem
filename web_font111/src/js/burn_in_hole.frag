precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(vec2 ip){
	//return fract(sin( dot(ip,vec2(12.44324,543.13032)) )*4324.432424);

	return fract(sin(dot(ip, vec2(12.9898,78.233)))*43758.5453123);
}

float noise(vec2 st){
	vec2 ip = floor(st);
	vec2 fp = fract(st);

	float a = random(ip);
	float b = random(ip + vec2(1.,0.));
	float c = random(ip + vec2(0.,1.));
	float d = random(ip + vec2(1.,1.));
	
	vec2 u = fp* fp * (3.-2.*fp);

	return mix(a,b,u.x)+
			(c-a)*u.y*(1.-u.x)+
			(d-b)*u.x*u.y;

}

vec2 g_random(vec2 ip){
	return fract(sin(
		vec2(dot(ip,vec2(127.1,311.7)), dot(ip,vec2(269.5,183.3)))
	)* 44753.976967) *2. - 1.;
}

float g_noise(vec2 st){
	vec2 ip = floor(st);
	vec2 fp = fract(st);

	//vec2 u = fp*fp*(3.-2.*fp);
	vec2 u = fp*fp*fp*(fp*(fp*6.-15.)+10.);
	return mix(
		mix(dot(g_random(ip) , fp-vec2(0.,0.)) , dot(g_random(ip+vec2(1.,0.)) , fp-vec2(1.,0.)) ,u.x),
		mix(dot(g_random(ip+vec2(0.,1.)) , fp-vec2(0.,1.)) , dot(g_random(ip+vec2(1.,1.)) ,fp-vec2(1.,1.)) , u.x),
		u.y
	);
}

float rect(vec2 st){
	vec2 p = -vec2(1.) + fract(st)*2.;
	float angle = atan(p.x,p.y) + TWO_PI /2.;
	float len = length(p);

	float perAng = TWO_PI / 4.;
	return cos(floor(.5 +angle /perAng)*perAng - angle)*len;
}

float circle(vec2 st , vec2 center){
	return distance(fract(st) , center)*(1. / u_time * 10.);
}


float shape(vec2 st ){
	
	float l1 = 1.2 ;
	float l2 = 1.;
	float len = circle(st , vec2(.6,.4)) * l1;
	float len2 = circle(st ,  vec2(.3,.8)) * l2;

	//return len* l1/(l1+l2) + len2* l2 / (l1+l2);
	//return len*.3 +len2*.7;

	if(len > len2)return len2;
	else return len;
	

}
void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	//st.x *= u_resolution.x / u_resolution.y;

	vec2 copy = st;
	//st *= vec2(3.,1.);
	
	//copy *= vec2(40.,12.);
	//copy*=(u_mouse+1.)*u_time;
	copy *= vec2(4.,4.);
	
	//float color = rect(st);
	//float color = circle(st);
	float color = shape(st);
	copy += g_noise(copy*3.);

	color += (g_noise(copy)-.5)*.19;

	//gl_FragColor = vec4(vec3(1.)*step(.7,color), 1.);
	//gl_FragColor = vec4(mix(vec3(.8,0.,0.),vec3(1., 1. , 1. ) , smoothstep(.65,.7,color)) ,1.);
	

	vec4 grandColor = mix( vec4( 0. , 0. , 0. ,1.) ,vec4(1.,1.,1.,0.) ,smoothstep(.58,.9,color));

	//vec4 grandColor = mix( vec4( 0. , 0. , 0. ,1.) ,vec4(0.) ,smoothstep(.58,.9,color));//show as transparent
	if(grandColor.a > .994 && grandColor.a <1.){
		//grandColor = vec4( 0.985,0.140,0.000 ,1.); //orange
		grandColor = mix( vec4( 0.985,0.0,0.000 ,1.) , vec4(0.985,0.696,0.285 , 1.) , smoothstep(.994, .999 , grandColor.a) );
		//E4550A
	}
	else if(grandColor.a != 1. && grandColor.a!=0.){
		grandColor = vec4( mix(vec3(0.,0.,0.) , vec3(0.690,0.373,0.000 )  ,smoothstep(.23 , .55,1.- grandColor.a)) , grandColor.a*1.6);
		vec4 fg = grandColor;
		vec4 bg = grandColor;

		fg =  mix(vec4(0.,0.,0.,1.) , vec4(0.,0.,0.,.3)  , smoothstep( .4 , 1.,1.- grandColor.a) ); //black
		bg = vec4(0.690,0.373,0.000 , 1.);

		grandColor.a += (random(st*400.)-.5)*.2;

		grandColor = vec4(grandColor.xyz * grandColor.a + vec3(1.) * (1. - grandColor.a) ,1.);
	}
	else if(grandColor.a == 1. ){
		grandColor.a=0.;
	}
	else if(grandColor == vec4(1.,1.,1.,0.))grandColor.a=1.;
	gl_FragColor = grandColor;

}

