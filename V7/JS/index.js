import * as THREE from '../three/build/three.module.js'
import {OrbitControls} from '../three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from '../three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {CreateWall} from './CreateWall.js';

    let scene, camera;
    let renderer, raycaster;

    let group;

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
        
        //group
        group = new THREE.Group();
        scene.add(group);

        let wallGroup = new THREE.Group();

        // create walls
        let wall1 = new CreateWall([214.5, 300, 1], [224.4,150,-299], 0);
        wall1.wallMat(0xffffff, 0x009900, 30);
        scene.add(wall1);

        let wall2 = new CreateWall([304, 300, 1], [117.2,150,-150], Math.PI/2);
        wall2.wallMat(0xffffff, 0x009900, 30);
        scene.add(wall2);

        let wall3 = new CreateWall([234.4, 300, 1], [0,150,2.5], 0);
        wall3.wallMat(0xffffff, 0x009900, 30);
        scene.add(wall3);

        let wall4 = new CreateWall([304, 300, 1], [-117.2,150,-150], -Math.PI/2);
        wall4.wallMat(0xffffff, 0x990000, 30);
        scene.add(wall4);

        let wall5 = new CreateWall([214.5, 300, 1], [-224.4,150,-299], 0);
        wall5.wallMat(0xffffff, 0x990000, 30);
        scene.add(wall5);

        let wall6 = new CreateWall([598, 300, 1], [-331.7,150,0], Math.PI/2);
        wall6.wallMat(0xffffff, 0x990000, 30);
        scene.add(wall6);

        let wall7 = new CreateWall([663.4, 300, 1], [0,150,299], -Math.PI);
        wall7.wallMat(0xffffff, 0x990000, 30);
        scene.add(wall7);

        let wall8 = new CreateWall([598, 300, 1], [331.7,150,0], -Math.PI/2);
        wall8.wallMat(0xffffff, 0x990000, 30);
        scene.add(wall8);

        //adding cornice
        function addFloor(shape, color, side, x, y, z, rx, ry, rz, s){
            let  geometry = new THREE.ShapeBufferGeometry( shape );
            
            let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: color, metalness:0.4, side : side} ) );
            mesh.position.set( x, y, z);
            mesh.rotation.set( rx, ry, rz );
            mesh.scale.set( s, s, s );
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            group.add( mesh );
        }

        function addCornice(shape, depth, color, x, y, z, rx, ry, rz, s){
            let extrudeSettings = { depth: depth, bevelEnabled: false};

            let geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

            let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: color} ) );
            mesh.position.set( x, y, z);
            mesh.rotation.set( rx, ry, rz );
            mesh.scale.set( s, s, s );
            group.add( mesh );
        }

        let cornice = new THREE.Shape();
        cornice.moveTo( 0, 0 );
        cornice.lineTo( 0, 9 );
        cornice.lineTo( 20, 9 );
        cornice.lineTo( 20, 6 );
        cornice.lineTo( 17, 6 );
        cornice.lineTo( 17, 3 );
        cornice.lineTo( 14, 3 );
        cornice.lineTo( 14, 0 );
        cornice.lineTo( 0, 0 );

        //cornices
        addCornice(cornice, 598, 0xffffff, -331.7, 290, -299, 0, 0, 0, 1);
        addCornice(cornice, 663.4, 0xffffff, -331.7, 290, 299, 0, Math.PI/2, 0, 1);
        addCornice(cornice, 598, 0xffffff, 331.7, 290, 299, 0, Math.PI, 0, 1);
        addCornice(cornice, 214.5, 0xffffff, -117.2, 290, -299, 0, -Math.PI/2, 0, 1);
        addCornice(cornice, 214.5, 0xffffff, 331.7, 290, -299, 0, -Math.PI/2, 0, 1);
        addCornice(cornice, 304, 0xffffff, 117.2, 290, -299, 0, 0, 0, 1);
        addCornice(cornice, 274.4, 0xffffff, 138, 290, 0, 0, -Math.PI/2, 0, 1);
        addCornice(cornice, 304, 0xffffff, -137.2, 290, -299, 0, 0, 0, 1);
        
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
        //floor
        addFloor(floorShape, 0xe5e5e5, THREE.FrontSide, 224.4, 0, -299, -Math.PI/2, 0, 0, 1);
        //ceiling
        addFloor(ceilingShape, 0xe5e5e5, THREE.BackSide, 224.4, 300, -299, -Math.PI/2, 0, 0, 1);

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

            // ceilingGroup.add(Light);
        }
        
        //light1
        RectangularLight(0xffffff,-224.4, 299, 147);
        //light2
        RectangularLight(0xffffff,224.4, 299, 147);
        //light3
        RectangularLight(0xffffff,224.4, 299, -152);
        //light4
        RectangularLight(0xffffff,-224.4, 299, -152);


        // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        // document.addEventListener( 'keydown', onDocumentKeyDown, false );
        // document.addEventListener( 'keyup', onDocumentKeyUp, false );
        // document.addEventListener( 'mousemove', onCameraMove, false );
        // document.querySelector('#showCornice').onclick = showCornice;
        window.addEventListener( 'resize', onWindowResize, false );
    };

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        }

    function showCornice(){
        console.log('Show Cornice');
    }

    function render() {

        renderer.render( scene, camera );
        requestAnimationFrame(render);
    }

    init();
    render();
