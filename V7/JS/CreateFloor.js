class CreateFloor{
    constructor (geomtery, material, [positionX,positionY,positionZ], [rotationX, rotationY, rotationZ]){

        let mesh = new THREE.Mesh(geomtery, material);
        mesh.position.set(positionX, positionY, positionZ);
        mesh.rotation.set( rotationX, rotationY, rotationZ );
        // mesh.scale.set( this.s, this.s, this.s);
        mesh.castShadow = true;
        mesh.recieveShadow = true;

        return mesh;
    }

}

export{CreateFloor};



