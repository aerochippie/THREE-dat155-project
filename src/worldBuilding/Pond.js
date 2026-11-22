import * as THREE from "three";
import {DEEP_TEAL, POND} from "../assets/palette_constants.js";
import vertex from "../shaders/pond_vertex.glsl?raw"
import fragment from "../shaders/pond_frag.glsl?raw"

export class Pond extends THREE.Mesh{

    constructor(radius) {
        super(new THREE.PlaneGeometry(radius*2, radius*2,128,128),
            new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: new THREE.Color(DEEP_TEAL) },
                    uTime:{value: 0}
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.DoubleSide,
                transparent: true
            }));
        this.geometry.rotateX(-Math.PI/2);
    }
}

export function digPond (positions, pondX, pondZ, radius, depth){

    for(let i = 0; i < positions.count; i++){
        let x =positions.getX(i)
        let z =positions.getZ(i)
        const pondCenterDistance = Math.hypot( x- pondX, z - pondZ);

        if(pondCenterDistance > radius){
            continue;
        }
        const smoothEdge = 1 - THREE.MathUtils.smoothstep(pondCenterDistance,0,radius);
        const heighBefore = positions.getY(i);
        const heightNow = heighBefore * (1-smoothEdge) + depth * smoothEdge;
        positions.setY(i, heightNow);
    }


}