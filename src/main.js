import * as THREE from 'three';
import {
    APRICOT,
    BUTTER,
    CORAL_ROOF, HONEY, HORIZON_GLOW,
    MEADOW,
    PEACH_CLOUD,
    PLUM_SHADOW, PUMPKIN,
    SANDY_PATH,
    SKY_MIST, SUNSET_ORANGE, SUNSET_PINK, TANGERINE, TWILIGHT, WISTERIA
} from "./assets/palette_constants.js";
import {EXRLoader, OrbitControls, VRButton, XRControllerModelFactory} from "three/addons";
import {TERRAIN_DEPTH, TERRAIN_WIDTH} from "./assets/constants.js";
import {createPath} from "./worldBuilding/createPath.js";
import {pathCoordinates} from "./worldBuildingConstants/pathConstants.js";
import {getTerrainHeight, sandMix, Terrain, terrainAddHills} from "./worldBuilding/Terrain.js";
import {TextureLoader} from "three";
import {GLTFLoader} from "three/addons";
import {isNearPath} from "./worldBuilding/isNearPath.js";
import {InstanceModel} from "./worldBuilding/instanceModel.js";
import {digPond, Pond} from "./worldBuilding/Pond.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

//light
const directionalLight = new THREE.DirectionalLight(TANGERINE, 3);
directionalLight.position.set(0, 40, 150);
directionalLight.shadow.camera.left = -150;
directionalLight.shadow.camera.right = 150;
directionalLight.shadow.camera.top = 150;
directionalLight.shadow.camera.bottom = -150;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.bias = -0.0005;
directionalLight.castShadow = true;
directionalLight.shadow.camera.updateProjectionMatrix();
const hemiLight = new THREE.HemisphereLight(APRICOT, SUNSET_ORANGE, 2);
scene.add(directionalLight);
scene.add(hemiLight);

//renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(APRICOT)
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);











//sky texture
new TextureLoader().load("textures/sky_equirect.jpg", (skyTexture) =>{
skyTexture.mapping = THREE.EquirectangularReflectionMapping;
skyTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = skyTexture
});
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
//pond thing
digPond(terrainPositions, -20,0,24,-1)
terrainGeometry.computeVertexNormals();

terrainGeometry.computeBoundingSphere();
terrain.receiveShadow = true;
scene.add(terrain);


//pond

const pondPosX = -20;
const pondPosZ = 0;
const pondRadius = 15;
const pond = new Pond(pondRadius);
pond.position.set(-20, 0,0)
scene.add(pond);
sandMix(terrain,"/textures/grass.jpg", "textures/sand.jpg",pondPosX,pondPosZ, 15);


//paths

const isNearPathPositions = []  // for isNearPath function
for(const p of pathCoordinates){
    for(const point of p){
        point.x = -point.x;
    }
    const path = createPath(p, SANDY_PATH, terrain);

    // for is NearPath function:
    const pathPositions = path.geometry.attributes.position;
    for (let i = 0;i<pathPositions.count;i++){
        isNearPathPositions.push({x: pathPositions.getX(i), z: pathPositions.getZ(i)});
    }
    path.receiveShadow = true;
    scene.add(path);
}
//get stuff lout of the way from pond
for (let stepsFromCenterX = -pondRadius; stepsFromCenterX <= pondRadius; stepsFromCenterX++) {
    for (let stepsFromCenterZ = -pondRadius; stepsFromCenterZ <= pondRadius; stepsFromCenterZ++) {

        const distanceFromCenter = Math.hypot(stepsFromCenterX, stepsFromCenterZ);

        if (distanceFromCenter <= pondRadius) {
            isNearPathPositions.push({
                x: pondPosX + stepsFromCenterX,
                z: pondPosZ + stepsFromCenterZ
            });
        }
    }
}


//fog
//scene.fog = new THREE.FogExp2(SKY_MIST, 0.009)
scene.fog = new THREE.Fog(HORIZON_GLOW, 20 ,260)


// sun
const sunGeometry = new THREE.SphereGeometry(70, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({color: TANGERINE, side: THREE.DoubleSide, fog: false});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.z = 330;
sun.position.y= -30
scene.add(sun);


//  MODELS ---------------------
scene.add(new InstanceModel("CommonTree_1.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("CommonTree_2.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("CommonTree_3.gltf", 10, terrain, isNearPathPositions, 1))
scene.add(new InstanceModel("CommonTree_4.gltf", 10, terrain, isNearPathPositions, 1))
scene.add(new InstanceModel("CommonTree_5.gltf", 20, terrain, isNearPathPositions))

scene.add(new InstanceModel("TwistedTree_1.gltf", 5, terrain, isNearPathPositions))
scene.add(new InstanceModel("TwistedTree_2.gltf", 5, terrain, isNearPathPositions))
scene.add(new InstanceModel("TwistedTree_3.gltf", 7, terrain, isNearPathPositions))
scene.add(new InstanceModel("TwistedTree_4.gltf", 7, terrain, isNearPathPositions))
scene.add(new InstanceModel("TwistedTree_5.gltf", 5, terrain, isNearPathPositions))

scene.add(new InstanceModel("Pebble_Round_1.gltf", 14, terrain, isNearPathPositions, 0.8))
scene.add(new InstanceModel("Pebble_Round_2.gltf", 14, terrain, isNearPathPositions,0.5))
scene.add(new InstanceModel("Pebble_Round_3.gltf", 14, terrain, isNearPathPositions, 0.5))
scene.add(new InstanceModel("Pebble_Round_4.gltf", 14, terrain, isNearPathPositions, 0.8))
scene.add(new InstanceModel("Pebble_Round_5.gltf", 14, terrain, isNearPathPositions, 0.5))
scene.add(new InstanceModel("Pebble_Square_1.gltf", 14, terrain, isNearPathPositions, 0.5))
scene.add(new InstanceModel("Pebble_Square_2.gltf", 14, terrain, isNearPathPositions, 0.5))
scene.add(new InstanceModel("Pebble_Square_3.gltf", 14, terrain, isNearPathPositions, 0.5))
scene.add(new InstanceModel("Pebble_Square_4.gltf", 14, terrain, isNearPathPositions, 0.8))
scene.add(new InstanceModel("Pebble_Square_5.gltf", 14, terrain, isNearPathPositions, 0.5))
scene.add(new InstanceModel("Rock_Medium_1.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("Rock_Medium_2.gltf", 4, terrain, isNearPathPositions ))
scene.add(new InstanceModel("Rock_Medium_3.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Round_Small_1.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Round_Small_2.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Round_Small_3.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Square_Small_1.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Square_Small_2.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Square_Small_3.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Round_Thin.gltf", 4, terrain, isNearPathPositions))
scene.add(new InstanceModel("RockPath_Round_Wide.gltf", 4, terrain, isNearPathPositions))


scene.add(new InstanceModel("Clover_1.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Clover_2.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Fern_1.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Flower_3_Single.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Flower_3_Group.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Flower_4_Single.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Flower_4_Group.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Plant_1.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Plant_1_Big.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Plant_7.gltf", 20, terrain, isNearPathPositions))
scene.add(new InstanceModel("Plant_7_Big.gltf", 20, terrain, isNearPathPositions))

scene.add(new InstanceModel("Grass_Common_Short.gltf", 500, terrain, isNearPathPositions))
scene.add(new InstanceModel("Grass_Wispy_Short.gltf", 200, terrain, isNearPathPositions))
scene.add(new InstanceModel("Bush_Common.gltf", 200, terrain, isNearPathPositions))
scene.add(new InstanceModel("Bush_Common_Flowers.gltf", 200, terrain, isNearPathPositions))



















// set vr
renderer.xr.enabled = true;
const vrButton =  VRButton.createButton(renderer);
document.body.appendChild(vrButton);


//player setp for vr

const player = new THREE.Group()
scene.add(player);
player.add(camera);
player.position.set(0, getTerrainHeight(0,0,terrain), 0);

 const controllerFactory = new XRControllerModelFactory();
 for(let i = 0; i<2;i++){
     const controller = renderer.xr.getController(i)
     const grip = renderer.xr.getControllerGrip(i);
     grip.add(controllerFactory.createControllerModel(grip))
     player.add(controller);
     player.add(grip);

 }
//walking vr
const timer = new THREE.Timer();
 const walkingspeed = 2;
 const lookingAtDirection = new THREE.Vector3();
function walkVr(time){

     const session = renderer.xr.getSession();
     if(!session){
         return;
     }

     for (const s of session.inputSources) {
         if (!s.gamepad || s.handedness !== "left") {
             continue;
         }

         const sideways = s.gamepad.axes[2];
         const ahead = -s.gamepad.axes[3];
         if (Math.abs(sideways) < 0.1 && Math.abs(ahead) < 0.1) {
             return;
         }

         renderer.xr.getCamera().getWorldDirection(lookingAtDirection);
       //  camera.getWorldDirection(lookingAtDirection);
         lookingAtDirection.y = 0;
         lookingAtDirection.normalize();

         const rightX = -lookingAtDirection.z;
         const rightZ = lookingAtDirection.x;
         player.position.x += (lookingAtDirection.x * ahead + rightX * sideways) * walkingspeed * time;
         player.position.z += (lookingAtDirection.z * ahead + rightZ * sideways) * walkingspeed * time;
         player.position.y = getTerrainHeight(player.position.x, player.position.z, terrain);
     }
}
const turnspeed= THREE.MathUtils.degToRad(60)
function turnAround(time){
    const session = renderer.xr.getSession();
    if(!session){
        return
    }
    for (const s of session.inputSources) {
        if (!s.gamepad || s.handedness !== "right") {
            continue;
        }
        const turnButton = s.gamepad.axes[2];
        if(Math.abs(turnButton)<0.1){
            return
        }

        player.rotation.y -= turnButton * turnspeed * time;


    }
}

//animation loop

function animate(timestamp) {

    timer.update(timestamp);
    pond.material.uniforms.uTime.value = timer.getElapsed()
    walkVr(timer.getDelta());
    turnAround(timer.getDelta());
    renderer.render(scene, camera);
    controls.update();


}
renderer.setAnimationLoop(animate);
