// import { PlaneBufferGeometry, MeshPhongMaterial, FrontSide, Mesh, Group } from '../three/build/three';

export class CreateWall extends THREE.Object3D{
        constructor ([length, width, height], [positionX,positionY,positionZ], rotation){
          super();
            this.l = length;
            this.w = width;
            this.h = height;
        
            this.pX = positionX;
            this.pY = positionY;
            this.pZ = positionZ;

            this.r = rotation;
            
            
        }

        wallMat(_color, _specular, _shine){
            let wall = new THREE.PlaneBufferGeometry(this.l, this.w, this.h);
            let mat = new THREE.MeshPhongMaterial( {
                            color: _color,
                            specular: _specular,
                            shininess: _shine,
                            side: THREE.FrontSide
                        });
            let wallGeometry = new THREE.Mesh(wall, mat);

            wallGeometry.position.set(this.pX, this.pY, this.pZ);
            wallGeometry.rotation.y = this.r;
            wallGeometry.castShadow = true;
            wallGeometry.recieveShadow = true;

        }
        
        
    }

 }



