import * as THREE from '../three/build/three.module.js'
import {OrbitControls} from '../three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from '../three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {CreateWall} from './CreateWall.js';
import {CreateFloor} from './CreateFloor.js';
import {CreateCornice} from './CreateCornice.js';

    let scene, camera;
    let renderer, raycaster;

    let addCornice;

    let corniceDesign1, corniceDesign2;
    let corniceShape1, corniceShape2;

    function init() {

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        //lights
        let amblight = new THREE.AmbientLight( 0x404040 );
        scene.add(amblight);

        let hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5);
        hemiLight.position.set( 0, 500, 500 );
        scene.add( hemiLight );

        //camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(-200,500,300);
        camera.lookAt(0, 0, 0);

        //renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setClearColor(0x000000, 0.0);

        let controls = new OrbitControls( camera, renderer.domElement );
        controls.enablePan = true;
        controls.update();

        document.body.appendChild(renderer.domElement);

        //grid
        // let gridHelper = new THREE.GridHelper(10000, 20);
        // scene.add(gridHelper);

        //rect light inittialisation
        RectAreaLightUniformsLib.init();

        function RectangularLight(hexColor,positionX, positionY, positionZ){
            let Light = new THREE.RectAreaLight( hexColor, 60 ,60, 60);
            Light.position.set(positionX, positionY, positionZ);
            Light.rotateX( -Math.PI/2 );
            scene.add(Light);

            let LightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.BackSide } ));
            LightMesh.scale.x = Light.width;
            LightMesh.scale.y = Light.height;
            
            Light.add( LightMesh );

        }

        //wall width array
        let wallWidthX = new Float32Array([214.5,304, 234.4, 304, 214.5, 598, 663.4, 598]);
        let wallGroup = new THREE.Group();

        // walls
        let wall1 = new CreateWall(wallWidthX[0], 0xffffff, [224.4,150,-299], 0);
        wallGroup.add(wall1);
        let wall2 = new CreateWall(wallWidthX[1], 0xffffff, [117.2,150,-150], Math.PI/2);
        wallGroup.add(wall2);
        let wall3 = new CreateWall(wallWidthX[2], 0xffffff, [0,150,2.5], 0);
        wallGroup.add(wall3);
        let wall4 = new CreateWall(wallWidthX[3], 0xffffff, [-117.2,150,-150], -Math.PI/2);        
        wallGroup.add(wall4);
        let wall5 = new CreateWall(wallWidthX[4], 0xffffff, [-224.4,150,-299], 0);
        wallGroup.add(wall5);
        let wall6 = new CreateWall(wallWidthX[5], 0xffffff, [-331.7,150,0], Math.PI/2);
        wallGroup.add(wall6);
        let wall7 = new CreateWall(wallWidthX[6], 0xffffff, [0,150,299], -Math.PI);
        wallGroup.add(wall7);
        let wall8 = new CreateWall(wallWidthX[7], 0xffffff, [331.7,150,0], -Math.PI/2);
        wallGroup.add(wall8);

        scene.add(wallGroup);

        //cornice shapes
        // let corniceP1 = [];
        // let pX = [[0, 0], [0, 9], [20, 9], [20, 6], [17, 6], [17, 3], [14, 3], [14, 0], [0, 0]];
        // let pX = new Float32Array([0, 0, 20, 20, 17, 17, 14, 14, 0]);
        // let pY = new Float32Array([0, 9, 9, 6, 6, 3, 3, 0, 0]);
        // // console.log(pX.length);
        // // let p = [];
        // let array = [];
        // for (let i = 0; i < pX.length; i++) {
                
        //     array = new Float32Array([pX[i], pY[i]]);
            
        //     console.log(array);
        //     // return array;

        //     corniceP1.push(new THREE.Vector2(array));
        //     // return array;
        // }

        //corniceP1.push(new THREE.Vector2(array));
        // corniceP1.push(new THREE.Vector2(pX[1], pY[1]));
        // corniceP1.push(new THREE.Vector2(pX[2], pY[2]));
        // corniceP1.push(new THREE.Vector2(pX[3], pY[3]));
        // corniceP1.push(new THREE.Vector2(pX[4], pY[4]));
        // corniceP1.push(new THREE.Vector2(pX[5], pY[5]));
        // corniceP1.push(new THREE.Vector2(pX[6], pY[6]));
        // corniceP1.push(new THREE.Vector2(pX[7], pY[7]));
        // corniceP1.push(new THREE.Vector2(pX[8], pY[8]));
        // corniceP1.push(new THREE.Vector2.fromArray(pX, 0));
        // let array = [];
        // function createCornice ( x, y){
        //     
        // }
        
    //    createCornice(pX, pY);
        // corniceShape1 = new THREE.Shape();
        // corniceShape1.setFromPoints(pX);
        corniceDesign1 = new THREE.Group();
        // scene.add(corniceDesign1);
        // let corniceP2 = [];
        // corniceP2.push(new THREE.Vector2(0, 0));
        // corniceP2.push(new THREE.Vector2(0, 20));
        // corniceP2.push(new THREE.Vector2(20, 20));
        // corniceP2.push(new THREE.Vector2(20, 17));
        // corniceP2.push(new THREE.Vector2(17, 17));
        // corniceP2.push(new THREE.Vector2(17, 14));
        // corniceP2.push(new THREE.Vector2(14, 14));
        // corniceP2.push(new THREE.Vector2(14, 6));
        // corniceP2.push(new THREE.Vector2(17, 6));
        // corniceP2.push(new THREE.Vector2(17, 3));
        // corniceP2.push(new THREE.Vector2(20, 3));
        // corniceP2.push(new THREE.Vector2(20, 0));
        // corniceP2.push(new THREE.Vector2(0, 0));

        // for (let i = 0; i < corniceP2.length; i++) corniceP2[i];

        // corniceShape2 = new THREE.Shape(corniceP2);
        // corniceDesign2 = new THREE.Group();
        let arr = [[0,0], [100,0], [100, 100], [0,100], [0,0]]
        // console.log(arr);
        // let squareShape = new THREE.Shape();
        // squareShape.moveTo(0,0);
        // squareShape.lineTo(100,0);
        // squareShape.lineTo(100, 100);
        // squareShape.lineTo(0,100);
        // squareShape.lineTo(0,0);

        function createShape(array, [x, y, z], [rx, ry, rz], group){
            let shape = new THREE.Shape();
            shape.moveTo(array[0].x, array[0].y);
            for (let i = 1; i < array.length; i++){
                shape.lineTo(array[i].x, array[i].y);
            }
            console.log(array);
            // return shape;
            let geometry = new THREE.ShapeBufferGeometry( shape );
            let mesh = new THREE.Mesh(geometry,  new THREE.MeshPhongMaterial( { side: THREE.DoubleSide} ));
            mesh.position.set(x, y, z);
            mesh.rotation.set(rx, ry, rz);

            group.add(mesh);
            scene.add(group);
        }

        createShape(arr, [117.2, 290, -299], [0, 0, 0], corniceDesign1);

        // setPoints(squareShape, arr);

        // squareShape.setFromPoints(arr);

        // let geometry = new THREE.ShapeBufferGeometry( squareShape );
        // let corniceWall2 = new CreateCornice(squareShape, wallWidthX[1], 0xffffff,[117.2, 290, -299], [0, 0, 0]);
        //     scene.add(corniceWall2);

        // //adding cornice design
        // addCornice = (shape, group, y) => {
        //     //cornices
        //     let corniceWall1 = new CreateCornice(shape, wallWidthX[0], 0xffffff,[331.7, y, -299], [0, -Math.PI/2, 0]);
        //     group.add(corniceWall1);

        //     let corniceWall2 = new CreateCornice(shape, wallWidthX[1], 0xffffff,[117.2, y, -299], [0, 0, 0]);
        //     group.add(corniceWall2);

        //     let corniceWall3 = new CreateCornice(shape, 274.4, 0xffffff,[138, y, 0], [0, -Math.PI/2, 0]);
        //     group.add(corniceWall3);

        //     let corniceWall4 = new CreateCornice(shape, wallWidthX[3], 0xffffff,[-137.2, y, -299], [0, 0, 0]);
        //     group.add(corniceWall4);

        //     let corniceWall5 = new CreateCornice(shape, wallWidthX[4], 0xffffff,[-117.2, y, -299], [0, -Math.PI/2, 0]);
        //     group.add(corniceWall5);

        //     let corniceWall6 = new CreateCornice(shape, wallWidthX[5], 0xffffff,[-331.7, y, -299], [0, 0, 0]);
        //     group.add(corniceWall6);

        //     let corniceWall7 = new CreateCornice(shape, wallWidthX[6], 0xffffff,[-331.7, y, 299], [0, Math.PI/2, 0]);
        //     group.add(corniceWall7);

        //     let corniceWall8 = new CreateCornice(shape, wallWidthX[7], 0xffffff,[331.7, y, 299], [0, Math.PI, 0]);
        //     group.add(corniceWall8);

        // }

        let floorShape = new THREE.Shape();
        floorShape.moveTo( 107.2, 0);
        floorShape.lineTo( -107.2, 0 );
        floorShape.lineTo( -107.2, -304 );
        floorShape.lineTo( -341.6, -304 );
        floorShape.lineTo( -341.6, 0 );
        floorShape.lineTo( -556.3, 0 );
        floorShape.lineTo( -556.3, -598 );
        floorShape.lineTo( 107.2, -598 );
        floorShape.lineTo( 107.2, 0 );

        let ceilingShape = floorShape.clone();

        let floor = new CreateFloor(floorShape,[0xe5e5e5, THREE.FrontSide],[224.4, 0, -299], [-Math.PI/2, 0, 0]);
        scene.add(floor);

        let ceiling = new CreateFloor(ceilingShape,[0xe5e5e5, THREE.BackSide],[224.4, 300, -299], [-Math.PI/2, 0, 0]);
        scene.add(ceiling); 

        //light1
        RectangularLight(0xffffff,-224.4, 299, 147);
        //light2
        RectangularLight(0xffffff,224.4, 299, 147);
        //light3
        RectangularLight(0xffffff,224.4, 299, -152);
        //light4
        RectangularLight(0xffffff,-224.4, 299, -152);

        // document.querySelector('#firstDesign').onclick = firstDesign;
        // document.querySelector('#secondDesign').onclick = secondDesign;
        // document.querySelector('#thirdDesign').onclick = thirdDesign;
        window.addEventListener( 'resize', onWindowResize, false );
    };

    // function firstDesign(){
    //     let corniceP1 = [];

    //     let pX = new Float32Array([0, 0, 20, 20, 17, 17, 14, 14, 0]);
    //     let pY = new Float32Array([0, 9, 9, 6, 6, 3, 3, 0, 0]);
    //     // console.log(pX.length);
    //     corniceDesign1 = new THREE.Group();
    //     // let p = [];
    //     let array = [];
    //     for (let i = 0; i < pX.length; i++) {
                
    //         array = new Float32Array([pX[i], pY[i]]);
            
    //         console.log(array);
    //         // return array;

    //         corniceP1.push(new THREE.Vector2(array));
    //         // return array;
    //     }

    //     addCornice(corniceShape1, corniceDesign1, 290);
    //     scene.add(corniceDesign1);

    //     scene.remove(corniceDesign2);
    // }

    // function secondDesign(){
    //     addCornice(corniceShape2, corniceDesign2, 280);
    //     scene.add(corniceDesign2);
        
    //     scene.remove(corniceDesign1);
    // }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function render() {

        renderer.render( scene, camera );
        requestAnimationFrame(render);
    }

    init();
    render();
