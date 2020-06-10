class CreateCornice{
    constructor (shape, [color, side],[positionX,positionY,positionZ], rotation){
        let geometry = new THREE.ShapeBufferGeometry( shape );
        let material = new THREE.MeshStandardMaterial({ color: color, metalness:0.4, side : side})

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(positionX,positionY,positionZ);
        mesh.rotation.y = rotation;
        mesh.castShadow = true;
        mesh.recieveShadow = true;

        return mesh;
    }

}

export{CreateCornice};







