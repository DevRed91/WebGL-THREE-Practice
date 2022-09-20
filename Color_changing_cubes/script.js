/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {ShadowMapViewer} from 'three/examples/jsm/utils/ShadowMapViewer'
import {BATH_TEXTURE, VANITY_TEXTURE, CHAIR_TEXTURE, colorsSwatches} from './textures';

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
let INTERSECTED, material;;

let wooden_Material = new THREE.MeshStandardMaterial({
    map: wooden_Texture
  });

let cubeSize = {
    x: 20,
    y: 20,
    z: 20
}

const TRAY = document.getElementById('js-tray-slide');
function init(){
    const container = document.createElement('div');
    
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
    orbitControls(camera, renderer);
    setOrbitControlsLimits();
    lights();
    // load_room();
    renderLoop();
    //build colors
    for (let [i, color] of colorsSwatches.entries()) {
        let swatch = document.createElement('div');
        swatch.classList.add('tray__swatch');
        swatch.style.background = "#" + color.color;
        swatch.setAttribute('data-key', i);
        TRAY.append(swatch);
    }
    let swatchesColor = document.querySelectorAll('.tray__swatch');
    //Addition of meshes
    let cube1 = cube_box(cubeSize, {px: 10, py: 0, pz: 20});
    let cube2 = cube_box(cubeSize, {px: -10, py: 0, pz: -20});
    // Selection of color swatches
    for(const swatchColor of swatchesColor){
        swatchColor.addEventListener('click', (e) => {
            let colorSelection = colorsSwatches[parseInt(e.target.dataset.key)];
            material = new THREE.MeshStandardMaterial({
                color: parseInt("0x" + colorSelection.color)
            });
            console.log("Color :", material);
            cube1.material = material;
        });
        scene.add(cube1);
        scene.add(cube2);
    }
    
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

function buildColors(colors) {
    for (let [i, color] of colors.entries()) {
      let swatch = document.createElement('div');
      swatch.classList.add('tray__swatch');
      swatch.style.background = "#" + color.color;
      swatch.setAttribute('data-key', i);
      TRAY.append(swatch);
    }
    let swatchesColor = document.querySelectorAll('.tray__swatch');
    for(const swatchColor of swatchesColor){
        swatchColor.addEventListener('click', selectColor)
    }
  }
function selectColor(e){
    let color = colorsSwatches[parseInt(e.target.dataset.key)];
    console.log("Color key :", parseInt("0x" + color.color));
    let material = new THREE.MeshStandardMaterial({
        color: parseInt("0x" + color.color)
    })
    return material;
}
function setMaterial(object, color){
    object.material.color.setHex(color);
    scene.add(object);
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

function cube_box(size, position){
    let {x, y, z} = size;
    let {px, py, pz} = position;
    const geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
    const material = new THREE.MeshBasicMaterial();
    let cube = new THREE.Mesh( geometry, material );
    cube.name = "cube";
    cube.position.set(position.px, position.py, position.pz);
    return cube;
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
