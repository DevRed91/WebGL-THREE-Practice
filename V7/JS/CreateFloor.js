class CreateFloor{
    constructor (shape, [color, side], [positionX,positionY,positionZ], [rotationX, rotationY, rotationZ]){
        let geometry = new THREE.ShapeBufferGeometry( shape );
        let material = new THREE.MeshStandardMaterial({ color: color, metalness:0.4, side : side})

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(positionX, positionY, positionZ);
        mesh.rotation.set( rotationX, rotationY, rotationZ );
        // mesh.scale.set( this.s, this.s, this.s);
        mesh.castShadow = true;
        mesh.recieveShadow = true;

        return mesh;
    }

}

export{CreateFloor};







