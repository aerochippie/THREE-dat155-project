import * as THREE from "three";
import {ImprovedNoise} from "three/addons";


export class Terrain  extends THREE.Mesh {

    constructor(width, height, color) {

        super(new THREE.PlaneGeometry(width,height,300,300),
            new THREE.MeshStandardMaterial({color, side: THREE.DoubleSide, wireframe: false}));
    }

}



export function terrainAddHills(positions){

    const noise = new ImprovedNoise();
    for(let i = 0; i<positions.count; i++) {
        const hypotenuse = Math.hypot(positions.getX(i), positions.getZ(i));
        positions.setY(i,
            //(Math.max(0,(Math.sin(pos.getX(i)*0.2) * Math.cos(pos.getZ(i)*0.2))))*hypotenuse/50);
            ((Math.max(0,noise.noise(positions.getX(i)*0.06,0,positions.getZ(i)*0.06))*6)*(0.1 +(hypotenuse/60) ** 3)));
    }
}
const raycaster = new THREE.Raycaster();
export function getTerrainHeight(x,z, mesh){
    // const rayOrigin = new THREE.Vector3(x,100,z)
    // const rayDirection = new THREE.Vector3( 0, -1, 0)
    // raycaster.set(rayOrigin, rayDirection);
    // const list = raycaster.intersectObject(mesh);
    // if(list.length>0){
    //     //console.log(list[0].point.y)
    //     return list[0].point.y;
    // } else {
    //     return 0
    // }
    const { width, height, widthSegments, heightSegments } = mesh.geometry.parameters;
    const positions = mesh.geometry.attributes.position;

    const cellWidth = width / widthSegments;
    const cellDepth = height / heightSegments;

    // where (x, z) is on the grid, counted in cells from the top-left corner
    const gridX = (x + width / 2) / cellWidth;
    const gridZ = (height / 2 - z) / cellDepth;

    // outside the terrain: no height
    if (gridX < 0 || gridZ < 0 || gridX > widthSegments || gridZ > heightSegments) {
        return 0;
    }

    // which cell we are in, and how far into it (0 to 1)
    const column = Math.min(Math.floor(gridX), widthSegments - 1);
    const row = Math.min(Math.floor(gridZ), heightSegments - 1);
    const fractionX = gridX - column;
    const fractionZ = gridZ - row;

    // heights at the four corners of the cell
    const rowLength = widthSegments + 1;
    const topLeft = positions.getY(row * rowLength + column);
    const topRight = positions.getY(row * rowLength + column + 1);
    const bottomLeft = positions.getY((row + 1) * rowLength + column);
    const bottomRight = positions.getY((row + 1) * rowLength + column + 1);

    // blend: first along x on the top and bottom edges, then between them along z
    const topEdge = topLeft + (topRight - topLeft) * fractionX;
    const bottomEdge = bottomLeft + (bottomRight - bottomLeft) * fractionX;
    return topEdge + (bottomEdge - topEdge) * fractionZ;
}

/// add notes fo rmyself with explantations

export function sandMix (terrain, grassTexture, sandTexture, pondX, pondZ, radius){
    const loader = new THREE.TextureLoader();
    const grass = loader.load(grassTexture);
    const sand =loader.load(sandTexture);

    for (const texture of [sand, grass]) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
    }
    // whole park
    grass.repeat.set(40,40);


    terrain.material.map = grass;
    terrain.material.color.set(0xffffff);
    terrain.material.onBeforeCompile = (shader) => {
        shader.uniforms.uSandMap = {value: sand};
        shader.uniforms.uPondCenter = {value: new THREE.Vector2(pondX, pondZ)};
        shader.uniforms.uSandRadius = {value: radius};
        //pass positions
        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            "#include <common>\nvarying vec3 vTerrainPos;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTerrainPos = position;")
            shader.fragmentShader = shader.fragmentShader.replace("#include <common>",
                `#include <common>
                 uniform sampler2D uSandMap;
                 uniform vec2 uPondCenter;
                 uniform float uSandRadius;
                 varying vec3 vTerrainPos;`)
            .replace("#include <map_fragment>",
                `vec4 grassColor = texture2D(map, vMapUv);
                 vec4 sandColor = texture2D(uSandMap, vMapUv);
                 float distanceToPond = distance(vTerrainPos.xz, uPondCenter);
                 float sandAmount = 1.0 - smoothstep(uSandRadius * 0.6, uSandRadius, distanceToPond);
                 diffuseColor *= mix(grassColor, sandColor, sandAmount);`);
    };
    terrain.material.needsUpdate = true;

}

