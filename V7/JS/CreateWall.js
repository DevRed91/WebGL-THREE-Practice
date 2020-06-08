import { PlaneBufferGeometry, MeshPhongMaterial, FrontSide, Mesh, Group } from '../three/src/Three';

export class CreateWall{
        constructor ([length, width, height], [positionX,positionY,positionZ], rotation){
            this.l = length;
            this.w = width;
            this.h = height;
        
            this.pX = positionX;
            this.pY = positionY;
            this.pZ = positionZ;

            this.r = rotation;
        }

        wallMat(_color, _specular, _shine){
            let wall = new PlaneBufferGeometry(this.l, this.w, this.h);
            let mat = new MeshPhongMaterial( {
                            color: _color,
                            specular: _specular,
                            shininess: _shine,
                            side: FrontSide
                        });
            let wallGeometry = new Mesh(wall, mat);

            wallGeometry.position.set(this.pX, this.pY, this.pZ);
            wallGeometry.rotation.y = this.r;
            wallGeometry.castShadow = true;
            wallGeometry.recieveShadow = true;
            
           let wallGroup = new Group();
            wallGroup.add(wallGeometry);
            scene.add(wallGroup);
        }
        
    }



