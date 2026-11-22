import * as THREE from 'three';
import {
    BUTTER,
    CORAL_ROOF, HONEY, HORIZON_GLOW,
    MEADOW,
    PEACH_CLOUD,
    PLUM_SHADOW,
    SANDY_PATH,
    SKY_MIST, SUNSET_ORANGE, SUNSET_PINK, TANGERINE
} from "./assets/palette_constants.js";
import {EXRLoader, OrbitControls, VRButton} from "three/addons";
import {TERRAIN_DEPTH, TERRAIN_WIDTH} from "./assets/constants.js";
import {createPath} from "./worldBuilding/createPath.js";
import {pathCoordinates} from "./worldBuildingConstants/pathConstants.js";
import {getTerrainHeight, Terrain, terrainAddHills} from "./worldBuilding/Terrain.js";
import {TextureLoader} from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

//light
const directionalLight = new THREE.DirectionalLight(TANGERINE);
directionalLight.position.set(0, 10, 150);
const hemiLight = new THREE.HemisphereLight(HORIZON_GLOW, SUNSET_ORANGE, 3);
scene.add(directionalLight);
scene.add(hemiLight);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(PEACH_CLOUD)
document.body.appendChild(renderer.domElement);











//sky texture
new TextureLoader().load("/sky2.jpg", (skyTexture) =>{
skyTexture.mapping = THREE.EquirectangularReflectionMapping;
skyTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = skyTexture
scene.backgroundBlurriness= 0.1});
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
    const path = createPath(p, SANDY_PATH, terrain);
    scene.add(path);
}

//fog
//scene.fog = new THREE.FogExp2(SKY_MIST, 0.009)
scene.fog = new THREE.Fog(0xFFE3D0, 1 ,260)


// sun
const sunGeometry = new THREE.SphereGeometry(70, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({color: TANGERINE, side: THREE.DoubleSide, fog: false});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.z = 330;
sun.position.y= -30
scene.add(sun);


// set vr
renderer.xr.enabled = true;
const vrButton =  VRButton.createButton(renderer);
document.body.appendChild(vrButton);


//player setp for vr

const player = new THREE.Group()
player.add(camera);
player.position.set(0, getTerrainHeight(0,0,terrain), 0);


//animation loop

function animate() {

    renderer.render(scene, camera);
    controls.update();

}
renderer.setAnimationLoop(animate);
