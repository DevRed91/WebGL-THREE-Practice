class CreateWall{
    constructor (geomtery, material,[positionX,positionY,positionZ], rotation){
        this.geometry = geomtery;
        this.material = material;
    
        this.pX = positionX;
        this.pY = positionY;
        this.pZ = positionZ;

        this.r = rotation;

        let wallGeometry = new THREE.Mesh(geomtery, material);

        wallGeometry.position.set(this.pX, this.pY, this.pZ);
        wallGeometry.rotation.y = this.r;
        wallGeometry.castShadow = true;
        wallGeometry.recieveShadow = true;

        return wallGeometry;
    }

}

export{CreateWall};



