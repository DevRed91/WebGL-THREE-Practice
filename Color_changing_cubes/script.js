import {
  Scene,
  Color,
  PerspectiveCamera,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  AmbientLight,
  SphereGeometry,
  TextureLoader,
  sRGBEncoding,
  DoubleSide,
  PlaneGeometry,
  Matrix4
} from "three";
import OrbitControls from "three-orbitcontrols";
import Dat from "dat.gui";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { saveAs } from "file-saver";

let container;
let camera;
let renderer;
let scene;
let mesh, cube;
let controls;
const TRAY = document.getElementById("js-tray-slide");

const colorsSwatches = [
  {
    color: "ff0000"
  },
  {
    color: "00ff00"
  },
  {
    color: "ffa500"
  },
  {
    color: "0ff0f0"
  },
  {
    color: "fff000"
  }
];

function init() {
  container = document.querySelector("#scene-container");
  // Creating the scene
  scene = new Scene();
  scene.background = new Color("skyblue");

  createCamera();
  createLights();

  cube = createMesh();
  scene.add(cube);

  createControls();
  createRenderer();

  buildColors(colorsSwatches);

  //Selection of swtaches
  let swatchesColor = document.querySelectorAll(".tray__swatch");
  for (const swatchColor of swatchesColor) {
    swatchColor.addEventListener("click", (e) => {
      cube.material.dispose();
      let colorSelection = colorsSwatches[parseInt(e.target.dataset.key)];
      let material = new MeshStandardMaterial({
        color: parseInt("0x" + colorSelection.color)
      });
      console.log("Color :", material);
      cube.material = material;
    });
  }

  init_GUI();

  //Export gltf
  let exportBtn = document.getElementById("export_butn");
  exportBtn.addEventListener("click", () => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      function (gltfJson) {
        console.log(gltfJson);
        const jsonString = JSON.stringify(gltfJson);
        console.log(jsonString);
        const blob = new Blob([jsonString], { type: "application/json" });
        saveAs(blob, "cube.gltf");
      },
      { binary: false }
    );
  });

  renderer.setAnimationLoop(() => {
    render();
  });
}
function init_GUI() {
  const gui = new Dat.GUI();
  const cubeFolder = gui.addFolder("Cube");
  cubeFolder.add(cube.scale, "x", 1, 6).name("Width").listen();
  cubeFolder.add(cube.scale, "y", 1, 6).name("Height").listen();
  cubeFolder.add(cube.scale, "z", 1, 6).name("Depth").listen();
  // cubeFolder.add( params, 'exportSphere' ).name( 'Export Sphere' );
  cubeFolder.open();
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;
  camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-2, 2, 10);
}

function createLights() {
  const mainLight = new DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
  scene.add(mainLight, hemisphereLight);
}

function createMesh() {
  const geometry = new BoxGeometry(2, 2, 2);
  const material = new MeshStandardMaterial();
  mesh = new Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  return mesh;
}

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add("tray__swatch");
    swatch.style.background = "#" + color.color;
    swatch.setAttribute("data-key", i);
    TRAY.append(swatch);
  }
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new OrbitControls(camera, container);
}

function render() {
  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);
