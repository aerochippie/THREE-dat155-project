import * as THREE from 'three';
import {MEADOW, PLUM_SHADOW, SKY_MIST} from "./assets/palette_constants.js";
import {ImprovedNoise, OrbitControls} from "three/addons";
import {TERRAIN_DEPTH, TERRAIN_WIDTH} from "./assets/constants.js";
import {createPath} from "./worldBuilding/createPath.js";
import {pathCoordinates} from "./worldBuildingConstants/pathConstants.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const helper = new THREE.CameraHelper(camera);
scene.add(helper);

//light
const directionalLight = new THREE.DirectionalLight(0xFFE3D0);
directionalLight.position.set(0, 10, 90);
const hemiLight = new THREE.HemisphereLight(SKY_MIST, MEADOW, 2);
scene.add(directionalLight);
scene.add(hemiLight);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(SKY_MIST)
document.body.appendChild(renderer.domElement);


//controls for testing PC
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0,100,-1);
controls.update();


//terrain -move to its own file
const terrain = new THREE.PlaneGeometry(TERRAIN_WIDTH,TERRAIN_DEPTH,128,128);
const angle = 90*Math.PI/180;
const terrainMaterial = new THREE.MeshStandardMaterial(
    {color: MEADOW, side: THREE.DoubleSide, wireframe: false},);
const terrainMesh = new THREE.Mesh(terrain, terrainMaterial);

terrain.rotateX(angle)
const pos =terrain.attributes.position;
const noise = new ImprovedNoise();
for(let i = 0; i<pos.count; i++) {
    const hypotenuse = Math.hypot(pos.getX(i), pos.getZ(i));
    pos.setY(i,
        //(Math.max(0,(Math.sin(pos.getX(i)*0.2) * Math.cos(pos.getZ(i)*0.2))))*hypotenuse/50);
        ((Math.max(0,noise.noise(pos.getX(i)*0.05,0,pos.getZ(i)*0.05))*2)*hypotenuse/50));
}
const raycaster = new THREE.Raycaster();
function getTerrainHeight(x,z){
    const rayOrigin = new THREE.Vector3(x,100,z)
    const rayDirection = new THREE.Vector3( 0, -1, 0)
    raycaster.set(rayOrigin, rayDirection);
    const list = raycaster.intersectObject(terrainMesh);
    if(list.length>0){
        console.log(list[0].point.y)
        return list[0].point.y;
    } else {
        return 0
    }
}


terrain.computeVertexNormals();
terrain.computeBoundingSphere();
scene.add(terrainMesh);




//paths

for(const p of pathCoordinates){
    for(const point of p){
        point.x = -point.x;
    }
    const path = createPath(p, PLUM_SHADOW, getTerrainHeight);
    scene.add(path);
}




//animation loop

function animate() {

    renderer.render(scene, camera);
    controls.update();

}
renderer.setAnimationLoop(animate);

// change the rotation of terrain so the coordinates are x and y and not x and z
// del opp i forkjellige filer og classer