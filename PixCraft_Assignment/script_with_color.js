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
  CylinderGeometry,
  TextureLoader,
  sRGBEncoding,
  DoubleSide,
  PlaneGeometry,
  Matrix4,
  Raycaster,
  Vector2,
  WireframeGeometry
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
let gui;
const raycaster = new Raycaster();
const pointer = new Vector2();
const TRAY = document.getElementById("js-tray-slide");

const cubeConfig = {
  type: "Cube",
  data: {
    width: 1,
    height: 1,
    depth: 1
  }
};

const cylinderConfig = {
  type: "Cylinder",
  data: {
    radiusTop: 1,
    radiusBottom: 1,
    height: 1
  }
};

const sphereConfig = {
  type: "Sphere",
  data: {
    radius: 1,
    widthSegments: 1
  }
};

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
  const cubeMesh = createMesh(cubeConfig);
  cubeMesh.position.set(-3, 0, 0);
  cubeMesh.userData.type = "Cube";
  scene.add(cubeMesh);
  const cylinderMesh = createMesh(cylinderConfig);
  cylinderMesh.position.set(0, 0, 0);
  cylinderMesh.userData.type = "Cylinder";
  scene.add(cylinderMesh);
  const sphereMesh = createMesh(sphereConfig);
  sphereMesh.position.set(3, 0, 0);
  sphereMesh.userData.type = "Sphere";
  scene.add(sphereMesh);

  createControls();
  createRenderer();

  buildColors(colorsSwatches);

  //Selection of swtaches
  let swatchesColor = document.querySelectorAll(".tray__swatch");
  for (const swatchColor of swatchesColor) {
    swatchColor.addEventListener("click", (e) => {
      cubeMesh.material.dispose();
      let colorSelection = colorsSwatches[parseInt(e.target.dataset.key)];
      let material = new MeshStandardMaterial({
        color: parseInt("0x" + colorSelection.color)
      });
      console.log("Color :", material);
      cubeMesh.material = material;
    });
  }
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", () => {
    const intersects = raycaster.intersectObjects(scene.children, false);
    if (intersects.length > 0) {
      if (intersects[0].object) {
        init_GUI(intersects[0].object);
      }
    }
  });

  renderer.setAnimationLoop(() => {
    render();
  });
}
function init_GUI(mesh) {
  if (gui) {
    gui.destroy();
  }
  gui = new Dat.GUI();
  const meshType = mesh.userData.type;
  const meshFolder = gui.addFolder(meshType);
  if (meshType === "Cube") {
    let cubeData = mesh.geometry.parameters;
    let parameters = ["width", "height", "depth"];

    parameters.forEach((param) => {
      meshFolder
        .add(cubeData, param, 1, 6)
        .name(param.charAt(0).toUpperCase() + param.slice(1)) // Capitalize the first letter
        .listen()
        .onChange((value) => {
          let newGeometry = new BoxGeometry(
            cubeData.width,
            cubeData.height,
            cubeData.depth
          );
          mesh.geometry.dispose();
          mesh.geometry = newGeometry;
        });
    });
  } else if (meshType === "Cylinder") {
    let cylinderData = mesh.geometry.parameters;
    let parameters = ["radiusTop", "radiusBottom", "height"];
    parameters.forEach((param) => {
      meshFolder
        .add(cylinderData, param, 1, 6)
        .name(param.charAt(0).toUpperCase() + param.slice(1)) // Capitalize the first letter
        .listen()
        .onChange((value) => {
          let newGeometry = new CylinderGeometry(
            cylinderData.radiusTop,
            cylinderData.radiusBottom,
            cylinderData.height
          );
          mesh.geometry.dispose();
          mesh.geometry = newGeometry;
        });
    });
  } else if (meshType === "Sphere") {
    let sphereData = mesh.geometry.parameters;
    let parameters = ["radius", "widthSegments"];
    parameters.forEach((param) => {
      meshFolder
        .add(sphereData, param, 1, 64)
        .name(param.charAt(0).toUpperCase() + param.slice(1)) // Capitalize the first letter
        .listen()
        .onChange((value) => {
          let newGeometry = new SphereGeometry(
            sphereData.radius,
            sphereData.widthSegments
          );
          mesh.geometry.dispose();
          mesh.geometry = newGeometry;
        });
    });
  }

  meshFolder.open();
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

function createMesh(meshConfig) {
  let geometry;
  switch (meshConfig.type) {
    case "Cube":
      geometry = new BoxGeometry(
        meshConfig.data.depth,
        meshConfig.data.height,
        meshConfig.data.width
      );
      break;
    case "Cylinder":
      geometry = new CylinderGeometry(
        meshConfig.data.radiusTop,
        meshConfig.data.radiusBottom,
        meshConfig.data.height
      );
      break;
    case "Sphere":
      geometry = new SphereGeometry(
        meshConfig.data.radius,
        meshConfig.data.widthSegments
      );
      break;
    default:
      throw new Error(`Invalid mesh type: ${meshConfig.type}`);
  }

  const material = new MeshStandardMaterial();
  const mesh = new Mesh(geometry, material);

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

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);
