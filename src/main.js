import * as THREE from 'three';
import {MEADOW, PLUM_SHADOW, SKY_MIST} from "./assets/palette_constants.js";
import {ImprovedNoise, OrbitControls} from "three/addons";
import {TERRAIN_DEPTH, TERRAIN_WIDTH} from "./assets/constants.js";
import {createPath} from "./worldBuilding/createPath.js";
import {pathCoordinates} from "./worldBuildingConstants/pathConstants.js";
import {getTerrainHeight, Terrain, terrainAddHills} from "./worldBuilding/Terrain.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

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


//terrain

const terrain = new Terrain(TERRAIN_WIDTH, TERRAIN_DEPTH, MEADOW);
const terrainGeometry = terrain.geometry;
terrainGeometry.rotateX(90*Math.PI/180)
const terrainPositions = terrainGeometry.attributes.position;
terrainAddHills(terrainPositions);
terrainGeometry.computeVertexNormals();
terrainGeometry.computeBoundingSphere();
scene.add(terrain);

//paths

for(const p of pathCoordinates){
    for(const point of p){
        point.x = -point.x;
    }
    const path = createPath(p, PLUM_SHADOW, terrain);
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