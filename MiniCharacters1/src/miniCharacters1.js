import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import { color } from 'three/src/nodes/TSL.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const cena = new THREE.Scene();
cena.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 25;
camera.position.z = 50;

const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.VSMShadowMap;
renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setClearColor(0xffffff);
document.body.appendChild(renderizador.domElement);

cena.add(new THREE.AmbientLight(0xaaaaaa));
const luzDirecional = new THREE.DirectionalLight(0xffff00);
luzDirecional.position.set(5, 15, 10);
luzDirecional.castShadow = true;
luzDirecional.shadow.bias = -0.0005;
cena.add(luzDirecional);

const controlador = new OrbitControls(camera, renderizador.domElement);
controlador.maxPolarAngle = 90 * (Math.PI / 180);

// criar um plano
const chaoGeometria = new THREE.PlaneGeometry(100, 100);
const chaoMaterial = new THREE.MeshLambertMaterial({ color: 0x99ff99 });
const chao = new THREE.Mesh(chaoGeometria, chaoMaterial);
chao.position.set(0, -2, 0);
chao.rotation.set(-Math.PI / 2, 0, 0);
chao.receiveShadow = true;
cena.add(chao);

const gltfLoader = new GLTFLoader();
const path = '../assets/character-male-b.glb';
gltfLoader.load(path, (gltf) => {
    const root = gltf.scene;
    root.scale.x = 50;
    root.scale.y = 50;
    root.scale.z = 50;
    root.position.set(0, -2, 0);
    cena.add(root);
});

function renderizar() {
    requestAnimationFrame(renderizar);

    renderizador.render(cena, camera);
    controlador.update();
  }
  
  renderizar();