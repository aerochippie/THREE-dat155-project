varying vec2 vUv;
uniform float uTime;
varying float vCircle;
varying vec3 vWorldPos;



float makeRing(vec2 uv, vec2 middle, float period, float offset){
    float ripple = fract(uTime/period +offset);
    float radius = ripple *0.1;
    float distanceRing = abs(distance(uv, middle) - radius);
    float ring = 1.0 -smoothstep(0.0, 0.007, distanceRing);
    return ring * (1.0 - ripple);
}




void main (){
    vUv= uv;
    vCircle = makeRing(uv, vec2(0.3, 0.6), 4.0, 0.0) +makeRing(uv, vec2(0.6, 0.2), 5.0, 0.2) +makeRing(uv, vec2(0.4, 0.9), 6.0, 0.4);

    vec3 pos = position;
    pos.y = vCircle *0.2;
    vWorldPos = (modelMatrix *vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}