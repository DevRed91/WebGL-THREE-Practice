class CreateWall{
    constructor ([width, height, depth], color,[positionX,positionY,positionZ], rotation){
        let geometry = new THREE.PlaneBufferGeometry( width, height, depth);
        let material = new THREE.MeshPhongMaterial({ 
                        color: color, 
                        specular: 0x009900,
                        shininess: 30, 
                        side : THREE.FrontSide
                    })

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(positionX,positionY,positionZ);
        mesh.rotation.y = rotation;
        mesh.castShadow = true;
        mesh.recieveShadow = true;

        return mesh;
    }

}

export{CreateWall};



