import * as THREE from 'three';
import {getTerrainHeight} from "./Terrain.js";

export function isTooHigh(x,z,terrain, max) {
    if(getTerrainHeight(x,z,terrain) > max) {
        return true;
    }
    return false;
}