import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';

// Configurações Iniciais

// Criando Renderizador e anexando no body do html
const renderizador = new THREE.WebGLRenderer();
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);     

// Criando a Camera 
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
camera.position.z = 5;

// Criando a Cena
const cena = new THREE.Scene();

// Criando o Controle
const controles = new OrbitControls(camera, renderizador.domElement);
controles.enableDamping = true;
controles.dampingFactor = 0.05;
//controles.target.set(2, 0, 0);

// Criando o Objeto e Adicionando na Cena
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(), 
    new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
);
cena.add(mesh);

// Renderizar a Cena
function animate(){
    requestAnimationFrame(animate);

    renderizador.render(cena, camera);
}
animate();