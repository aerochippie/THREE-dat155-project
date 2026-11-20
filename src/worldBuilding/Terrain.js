import * as THREE from "three";
import {ImprovedNoise} from "three/addons";


export class Terrain  extends THREE.Mesh {

    constructor(width, height, color) {

        super(new THREE.PlaneGeometry(width,height,128,128),
            new THREE.MeshStandardMaterial({color, side: THREE.DoubleSide, wireframe: false}));
    }

}



export function terrainAddHills(positions){

    const noise = new ImprovedNoise();
    for(let i = 0; i<positions.count; i++) {
        const hypotenuse = Math.hypot(positions.getX(i), positions.getZ(i));
        positions.setY(i,
            //(Math.max(0,(Math.sin(pos.getX(i)*0.2) * Math.cos(pos.getZ(i)*0.2))))*hypotenuse/50);
            ((Math.max(0,noise.noise(positions.getX(i)*0.05,0,positions.getZ(i)*0.05))*2)*hypotenuse/50));
    }
}
const raycaster = new THREE.Raycaster();
export function getTerrainHeight(x,z, mesh){
    const rayOrigin = new THREE.Vector3(x,100,z)
    const rayDirection = new THREE.Vector3( 0, -1, 0)
    raycaster.set(rayOrigin, rayDirection);
    const list = raycaster.intersectObject(mesh);
    if(list.length>0){
        //console.log(list[0].point.y)
        return list[0].point.y;
    } else {
        return 0
    }
}

/// add notes fo rmyself with explantations



