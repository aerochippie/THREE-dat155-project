

export function isNearPath(x,z,positions, minDist) {

    for( const p of positions){
        const distance = Math.hypot(x-p.x, z-p.z);
        if( distance < minDist ){
            return true
        }
    }
    return false;

}