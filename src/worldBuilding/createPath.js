import * as THREE from "three";
import {getTerrainHeight} from "./Terrain.js";


export function createPath(pathCoordinates, color, mesh) {
    const pathCurve = new THREE.CatmullRomCurve3(pathCoordinates);
    const pathPoints = pathCurve.getPoints(100);
    const leftSideList = new Float32Array(pathPoints.length);
    const rightSideList = new Float32Array(pathPoints.length);

    for (let i = 0; i<pathPoints.length; i++){
        pathPoints[i].y = getTerrainHeight(pathPoints[i].x,pathPoints[i].z,mesh) + 0.2;

        const thisPoint = pathPoints[i];
        const nextPoint = pathPoints[i+1];
        const distanceToNextPoint = Math.hypot((nextPoint.x - thisPoint.x), (nextPoint.z - thisPoint.z));
        const leftSidex = (nextPoint.x - thisPoint.x);
        const rightSidex = - nextPoint.z - thisPoint.z;

    }


    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathMaterial = new THREE.LineBasicMaterial({color: color})
     return new THREE.Line(pathGeometry, pathMaterial)
}






//pathCurve buildscurve from the points, where the curve is.
//pathPoints gets 100 evenly spaced points returns alist of vec3's so i can stick these points to the hills
//100 gaps need 101 posts
//loop
//like webgl buffer data - makes the shape data, copying x,y,z of every point to the positionbuffer
// return... combines shape into a Line object and draws segments through points.

//+0.2 so it doesnt flicker and melt into terrain/grass
//height/ y becomes is the getTerrainHeight function