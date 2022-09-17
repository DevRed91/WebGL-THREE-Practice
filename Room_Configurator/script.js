/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {ShadowMapViewer} from 'three/examples/jsm/utils/ShadowMapViewer'
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

let controls, scene, renderer, camera;
let BATHTUB_PATH = 'models/gltf/Bathtub_edited.glb'; 
let VANITY_PATH = 'models/gltf/vanity_edited.glb';
let CHAIR_PATH = 'models/gltf/chair_edited.gltf';
let BACKGROUND_COLOR = '#f1f1f1';
let wooden_Texture = new THREE.TextureLoader().load( "textures/wood_texture_3.jpg" ); 
wooden_Texture.wrapS = THREE.RepeatWrapping;
wooden_Texture.wrapT = THREE.RepeatWrapping;
wooden_Texture.repeat.set(2, 2);
let raycaster, pointer;
let currentIntersect = null;
let INTERSECTED;

let wooden_Material = new THREE.MeshStandardMaterial({
    map: wooden_Texture
  });

let BATH_TEXTURE = [
       {
        type: 'bathtub',
        color: 0xff0000,
	    name: 'Red Color'
        
      },
      {
        type: 'bathtubEnclosure',
        color: 0x00ff00,
        name: 'Green Color'
      }
]

let VANITY_TEXTURE = [
    {
     type: 'Vanity',
     color: 0xff0000,
     name: 'Red Color'
     
   },
   {
     type: 'counter_top',
     color: 0x00ff00,
     name: 'Green Color'
   },
   {
     type: 'Tap',
     color: 0x0000ff,
     name: 'Blue Color'
   }
]

let CHAIR_TEXTURE = [
    {
     type: 'legs',
     color: 0xfff000,
     name: 'Red Color'
     
   },
   {
     type: 'cushions',
     color: 0x0fff00,
     name: 'Green Color'
   },
   {
     type: 'Tap',
     color: 0x000fff,
     name: 'Blue Color'
   }
]

const colorsSwatches = [
    {
        color: '66533C'
    },
    {
        color: '173A2F'
    },
    {
        color: '153944'
    },
    {
        color: '27548D'
    },
    {
        color: '438AAC'
    }  
]
function init(){
    const container = document.createElement('div')
    document.body.appendChild(container);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    scene = new THREE.Scene()
    scene.background = new THREE.Color(BACKGROUND_COLOR);
    renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
    container.appendChild(renderer.domElement) // add the renderer to html div

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(80 ,10, 50)
    scene.add(camera);
    window.addEventListener('resize', () => {
        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        renderer.setPixelRatio(2)
    });

    window.addEventListener('pointermove', onPointerMove);
    // window.addEventListener('click', () => {
    //     const intersects = raycaster.intersectObjects( scene.children, false );
    //     if(intersects.length > 0){
    //         if(intersects[0].object){
    //             intersects[0].object.material.color.g = 0.25;
    //         }else {
    //             console.log("no object is clicked");
    //         }
            
    //     }
    // })
    // window.addEventListener('click', () =>
    //     {
    //         if(currentIntersect)
    //         {
    //             switch(currentIntersect.object)
    //             {
    //                 case object1:
    //                     console.log('click on object 1')
    //                     break

    //                 case object2:
    //                     console.log('click on object 2')
    //                     break

    //                 case object3:
    //                     console.log('click on object 3')
    //                     break
    //             }
    //         }
    //     })
    orbitControls(camera, renderer);
    setOrbitControlsLimits();
    lights();
    load_room();
    renderLoop();
    // cube_box(10, 10, 10);
    ground({x:120, y:70}, wooden_Material)
    console.log(scene.children);
}
function load_room(){
    load_model(BATHTUB_PATH, BATH_TEXTURE,{sx:10, sy:10, sz:10}, {x : -40, z : 20});
    load_model(VANITY_PATH, VANITY_TEXTURE,{sx:10, sy:10, sz:10}, {x : 0, z : -20});
    load_model(CHAIR_PATH, CHAIR_TEXTURE,{sx:12, sy:12, sz:12}, {x : 0, z : 35});
    load_model(CHAIR_PATH, CHAIR_TEXTURE,{sx:12, sy:12, sz:12}, {x : 10, z : 35});
}

function orbitControls(camera, renderer){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 1.0;
}

function ground(size, texture){
    let {x, y} = size;
    let floorGeometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1);
    let floor = new THREE.Mesh(floorGeometry, texture);
    floor.name = 'ground';
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.set(0,-5, 10);
    scene.add(floor);
}

function lights(){
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.name = 'Spot Light';
	spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.3;
	spotLight.position.set( 10, 200, 5 );
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 8;
	spotLight.shadow.camera.far = 300;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
    
    scene.add(spotLight);
    scene.add(ambient);
    
}
function load_model(model_path, texture, scale, position){
    let {x, z} = position;
    let {sx, sy, sz} = scale;
    loader.load(model_path, function (gltf) {
        let model = gltf.scene;
        model.scale.set(scale.sx, scale.sy, scale.sz);
        model.position.set(x,-5, z);
        model.traverse((child) => {
            for(let i = 0; i < texture.length; i++){
                if(child.name === texture[i].type){
                    let material = child.material;
                    material.color.set(texture[i].color);
                }
            }
        })
        scene.add(model);
    })

}


function setOrbitControlsLimits(){
    controls.enableDamping = true
    controls.dampingFactor = 0.5
    controls.minDistance = 35
    controls.maxDistance = 120
    controls.enableRotate = true
    controls.enableZoom = true
    controls.maxPolarAngle = Math.PI /3;
}

function cube_box(x, y, z){
    const geometry = new THREE.BoxGeometry( x, y, z );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    let cube = new THREE.Mesh( geometry, material );
    cube.name = "cube";
    cube.position.set(10, 0, 0);
    scene.add( cube );
}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera );
}

function renderLoop() {
    // TWEEN.update() // update animations
    controls.update() // update orbit controls
    renderer.render(scene, camera) // render the scene using the camera
    requestAnimationFrame(renderLoop) //loop the render function
    
}

init()
