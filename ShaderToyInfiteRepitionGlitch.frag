const float EPSI = 0.01;

float SDF(vec3 p){
    
    float c = 99.;
    vec3 q = mod(p+0.5*c,c)-0.5*c;
	return length(q)-0.5;
}

float marcher(vec3 ro, vec3 rd){
    
    float totalDst = 0.;
    for(int i =0;i<100;i++){
    	vec3 p = ro+totalDst*rd;
        float dst = SDF(p);
        totalDst+=dst;
        if(totalDst>1000. || dst < EPSI)break;
    }
    return totalDst;
}

vec3 normal(vec3 p ){
    
	vec3 norm = normalize(vec3(SDF(vec3(p.x+EPSI,p.y,p.z))-SDF(vec3(p.x-EPSI,p.y,p.z)),
                               SDF(vec3(p.x,p.y+EPSI,p.z))-SDF(vec3(p.x,p.y-EPSI,p.z)),
                               SDF(vec3(p.x,p.y,p.z+EPSI))-SDF(vec3(p.x,p.y,p.z-EPSI))));
    return norm;
}

float lighting(vec3 p){
    
    vec3 lightPos= vec3(1,4,9);
    vec3 l = normalize(lightPos-p);
    vec3 n = normal(p);
    float diff = clamp(dot(n,l),0.,1.);
	return diff;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    
    vec2 uv =(fragCoord-.5*iResolution.xy)/iResolution.x;
    vec3 ro = vec3(40.+(0.*iTime),70.*iTime,70.*iTime);
    vec3 rd = normalize(vec3(uv,1));
    vec3 col = vec3(lighting(ro+rd*vec3(marcher(ro,rd))));
    fragColor = vec4(col,1.0);
}
