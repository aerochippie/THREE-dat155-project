import * as THREE from "three";


export function createPath(pathCoordinates, color, width) {
    const pathCurve = new THREE.CatmullRomCurve3(pathCoordinates);
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(100));
    const pathMaterial = new THREE.LineBasicMaterial({color: color})
     return new THREE.Line(pathGeometry, pathMaterial)
}