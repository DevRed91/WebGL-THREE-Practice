import * as THREE from '../three/build/three.module.js'
import {OrbitControls} from '../three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from '../three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {CreateWall} from './CreateWall.js';
import {CreateFloor} from './CreateFloor.js';
import {CreateCornice} from './CreateCornice.js';

    let scene, camera;
    let renderer, raycaster;

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
        
        let wallDimensions = [];
        wallDimensions.splice(0, 0, [214.5, 300, 1]);
        wallDimensions.splice(1, 0, [304, 300, 1]);
        wallDimensions.splice(2, 0, [234.4, 300, 1]);
        wallDimensions.splice(3, 0, [304, 300, 1]);
        wallDimensions.splice(4, 0, [214.5, 300, 1]);
        wallDimensions.splice(5, 0, [598, 300, 1]);
        wallDimensions.splice(6, 0, [663.4, 300, 1]);
        wallDimensions.splice(7, 0, [598, 300, 1]);

        // walls
        let wall1 = new CreateWall(wallDimensions[0], 0xffffff, [224.4,150,-299], 0);
        scene.add(wall1);

        let wall2 = new CreateWall(wallDimensions[1], 0xffffff, [117.2,150,-150], Math.PI/2);
        scene.add(wall2);

        let wall3 = new CreateWall(wallDimensions[2], 0xffffff, [0,150,2.5], 0);
        scene.add(wall3);

        let wall4 = new CreateWall(wallDimensions[3], 0xffffff, [-117.2,150,-150], -Math.PI/2);
        scene.add(wall4);

        let wall5 = new CreateWall(wallDimensions[4], 0xffffff, [-224.4,150,-299], 0);
        scene.add(wall5);

        let wall6 = new CreateWall(wallDimensions[5], 0xffffff, [-331.7,150,0], Math.PI/2);
        scene.add(wall6);

        let wall7 = new CreateWall(wallDimensions[6], 0xffffff, [0,150,299], -Math.PI);
        scene.add(wall7);

        let wall8 = new CreateWall(wallDimensions[7], 0xffffff, [331.7,150,0], -Math.PI/2);
        scene.add(wall8);

        //wall group
        let wallGrpElements = []
        wallGrpElements.push([wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8]);

        let wallGroup = new THREE.Group();
        wallGroup.add(wallGrpElements);

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

        let corniceGroup = new THREE.Group();

        //cornices
        let corniceWall1 = new CreateCornice(cornice, wallDimensions[0][0], 0xffffff,[331.7, 290, -299], [0, -Math.PI/2, 0]);
        corniceGroup.add(corniceWall1);

        let corniceWall2 = new CreateCornice(cornice, wallDimensions[1][0], 0xffffff,[117.2, 290, -299], [0, 0, 0]);
        corniceGroup.add(corniceWall2);

        let corniceWall3 = new CreateCornice(cornice, 274.4, 0xffffff,[138, 290, 0], [0, -Math.PI/2, 0]);
        corniceGroup.add(corniceWall3);

        let corniceWall4 = new CreateCornice(cornice, wallDimensions[3][0], 0xffffff,[-137.2, 290, -299], [0, 0, 0]);
        corniceGroup.add(corniceWall4);

        let corniceWall5 = new CreateCornice(cornice, wallDimensions[4][0], 0xffffff,[-117.2, 290, -299], [0, -Math.PI/2, 0]);
        corniceGroup.add(corniceWall5);

        let corniceWall6 = new CreateCornice(cornice, wallDimensions[5][0], 0xffffff,[-331.7, 290, -299], [0, 0, 0]);
        corniceGroup.add(corniceWall6);

        let corniceWall7 = new CreateCornice(cornice, wallDimensions[6][0], 0xffffff,[-331.7, 290, 299], [0, Math.PI/2, 0]);
        corniceGroup.add(corniceWall7);

        let corniceWall8 = new CreateCornice(cornice, wallDimensions[7][0], 0xffffff,[331.7, 290, 299], [0, Math.PI, 0]);
        corniceGroup.add(corniceWall8);

        scene.add(corniceGroup);

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
