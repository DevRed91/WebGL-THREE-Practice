class CreateCornice{
    constructor (shape, depth, color,[positionX,positionY,positionZ], [rotationX, rotationY, rotationZ]){

        let extrudeSettings = { depth: depth, bevelEnabled: false}
        let geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
        let material = new THREE.MeshStandardMaterial({ color: color, metalness:0.1})

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(positionX,positionY,positionZ);
        mesh.rotation.set(rotationX, rotationY, rotationZ);
        mesh.castShadow = true;
        mesh.recieveShadow = true;

        return mesh;
    }

}

export{CreateCornice};
