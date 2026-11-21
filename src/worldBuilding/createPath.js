import * as THREE from "three";
import {getTerrainHeight} from "./Terrain.js";
import {Vector4} from "three";


export function createPath(pathCoordinates, color, mesh) {
    const pathCurve = new THREE.CatmullRomCurve3(pathCoordinates);
    const pathPoints = pathCurve.getPoints(100);
    const leftSideList = [];
    const rightSideList = [];
    const widthFromCenter = 2

    for (let i = 0; i< pathPoints.length -1; i++){ // why do i want it to stop early
        pathPoints[i].y = getTerrainHeight(pathPoints[i].x,pathPoints[i].z,mesh) + 0.2;

        const thisPoint = pathPoints[i];
        const nextPoint = pathPoints[i+1];

        const distanceToNextPoint = Math.hypot(nextPoint.x - thisPoint.x, nextPoint.z - thisPoint.z);
        const sideDirectionX = -(nextPoint.z - thisPoint.z) / distanceToNextPoint  // divide to get the length of one
        const sideDirectionZ = (nextPoint.x - thisPoint.x) / distanceToNextPoint  // divide to get the length of one


        const rightX = thisPoint.x + sideDirectionX * widthFromCenter;  // review out the sides and logic later to explain
        const rightZ = thisPoint.z + sideDirectionZ * widthFromCenter;
        const leftX = thisPoint.x - sideDirectionX * widthFromCenter;
        const leftZ = thisPoint.z - sideDirectionZ * widthFromCenter;

        const leftPathPoint = new THREE.Vector3(leftX, getTerrainHeight(leftX,leftZ, mesh) + 0.1, leftZ);
        const rightPathPoint = new THREE.Vector3(rightX, getTerrainHeight(rightX, rightZ, mesh) +0.1, rightZ)

        leftSideList.push(leftPathPoint);
        rightSideList.push(rightPathPoint);
    }

    const finishedPath = []
   for(let i = 0 ; i < leftSideList.length - 1; i++){

       finishedPath.push(leftSideList[i]);
       finishedPath.push(rightSideList[i]);
       finishedPath.push(leftSideList[i +1]);

       finishedPath.push(leftSideList[i +1 ]);
       finishedPath.push(rightSideList[i +1]);
       finishedPath.push(rightSideList[i]);
   }


   const finishedPathGeometry = new THREE.BufferGeometry().setFromPoints(finishedPath);
    const finishedPathMaterial = new THREE.MeshLambertMaterial({color: color, side: THREE.DoubleSide})
    finishedPathGeometry.computeVertexNormals(); // for at light should hit the lambermaterial
    return new THREE.Mesh(finishedPathGeometry, finishedPathMaterial)


    // const leftLineGeometry = new THREE.BufferGeometry().setFromPoints(leftSideList);
    // const lineMaterial = new THREE.LineBasicMaterial({color: color});
    // const leftLine = new THREE.Line(leftLineGeometry, lineMaterial);
    //
    // const rightLineGeometry = new THREE.BufferGeometry().setFromPoints(rightSideList);
    // const rightLine = new THREE.Line(rightLineGeometry, lineMaterial);
    //
    // const groupPathOutline = new THREE.Group();
    // groupPathOutline.add(leftLine);
    // groupPathOutline.add(rightLine);
    //
    //
    //
    // const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    // const pathMaterial = new THREE.LineBasicMaterial({color: color})
    //  return groupPathOutline;
}






//pathCurve buildscurve from the points, where the curve is.
//pathPoints gets 100 evenly spaced points returns alist of vec3's so i can stick these points to the hills
//100 gaps need 101 posts
//loop
//like webgl buffer data - makes the shape data, copying x,y,z of every point to the positionbuffer
// return... combines shape into a Line object and draws segments through points.

//+0.2 so it doesnt flicker and melt into terrain/grass
//height/ y becomes is the getTerrainHeight function