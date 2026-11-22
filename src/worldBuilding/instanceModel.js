import * as THREE from "three";
import {GLTFLoader} from "three/addons";
import {TERRAIN_WIDTH} from "../assets/constants.js";
import {isNearPath} from "./isNearPath.js";
import {getTerrainHeight} from "./Terrain.js";
import {isTooHigh} from "./isTooHigh.js";

const loader = new GLTFLoader();

function random(v) {
    return(Math.random()-0.5)*v;  // why 0.5
}

export class InstanceModel extends THREE.Group {

    constructor(file,count,terrain,pathPositions,minDist = 2) {
        super();


    loader.load("/models/" + file, (gltf) => {
    const parts = [];
    gltf.scene.traverse(child => {
    if(child.isMesh){ parts.push(child); }})

        const instancedParts = []
        for (const p of parts){
            const instanced = new THREE.InstancedMesh(p.geometry, p.material, count);
            instanced.castShadow = true;
            instanced.receiveShadow = true;
            this.add(instanced);
            instancedParts.push(instanced);
        }
        const dummy = new THREE.Object3D();

        // so trees dont go on the paths
        for ( let i = 0 ; i<count; i++) {
            let x =random(TERRAIN_WIDTH);
            let z =random(TERRAIN_WIDTH);
            while (isNearPath(x,z,pathPositions,minDist) || isTooHigh(x,z,terrain, 2) && isNearPath(x,z,pathPositions,minDist)) {
                x =random(TERRAIN_WIDTH);
                z =random(TERRAIN_WIDTH);
            }


            //transforamtions
            dummy.position.set(x, getTerrainHeight(x,z,terrain), z);
            dummy.rotation.y = Math.random() * Math.PI *2;
            const treeScale = 0.7 + Math.random() * 0.5;
            dummy.scale.set(treeScale, treeScale, treeScale);
            //update matrix to ?
            dummy.updateMatrix();

            for(const instanced of instancedParts){
                instanced.setMatrixAt(i, dummy.matrix);
            }
        }
        for (const instanced of instancedParts){
            instanced.instanceMatrix.needsUpdate = true;
        }

});

}}