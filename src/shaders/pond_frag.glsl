

varying vec3 vWorldPos;
uniform vec3 uColor;
varying float vCircle;
varying vec2 vUv;

void main(){


    vec3 sunsetOrange = vec3(1.0, 0.55, 0.3);
    vec3 color = mix(uColor, sunsetOrange, 0.12);
    color+=sunsetOrange  *  vCircle *0.2;


    //fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(viewDirection.y, 0.0), 3.5);
    vec3 sky = vec3(1.0,0.7,0.5);
    color = mix(color,sky,fresnel*0.8);

    float alpha = 1.0 -smoothstep(0.3,0.4, distance(vUv, vec2(0.5)));
    gl_FragColor = vec4(color, alpha);

}