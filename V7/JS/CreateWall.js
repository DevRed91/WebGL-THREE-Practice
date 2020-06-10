class CreateWall{
    constructor (geomtery, material,[positionX,positionY,positionZ], rotation){

        let wallGeometry = new THREE.Mesh(geomtery, material);
        wallGeometry.position.set(positionX,positionY,positionZ);
        wallGeometry.rotation.y = rotation;
        wallGeometry.castShadow = true;
        wallGeometry.recieveShadow = true;

        return wallGeometry;
    }

}

export{CreateWall};






