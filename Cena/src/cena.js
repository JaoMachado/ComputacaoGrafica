/*
* A estrutura básica do arquivo é:
* 1) Importar bibliotecas; 2) Criar a cena; 3) Criar e configurar a câmera;
* 4) Configurar renderizador e anexar câmera; 5) adicionar iluminação;
* 6) criar objetos e montar a cena; 7) renderizar a cena
*/
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/Addons.js";

// 1. criar uma cena básica
const cena = new THREE.Scene();
cena.backgroundColor = 0xffffff;

// habilita névoa na cena
cena.fog = new THREE.Fog(0xffffff, 0.0025, 50);

// 2. criar e configurar câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -3;
camera.position.y = 8;
camera.position.z = 2;

// 4. configurar renderizador e anexar câmera
const renderizador = new THREE.WebGLRenderer({ antialias: true });
// configura espaço de cores
renderizador.outputColorSpace = THREE.SRGBColorSpace;
// habilita sombras
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.VSMShadowMap;
// define tamanho, cor e anexa no DOM
renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setClearColor(0xffffff);
document.body.appendChild(renderizador.domElement);

// 5. adicionar iluminação
cena.add(new THREE.AmbientLight(0xaaaaaa));
const luzDirecional = new THREE.DirectionalLight(0xffff00);
luzDirecional.position.set(5, 12, 8);
luzDirecional.castShadow = true;
luzDirecional.shadow.bias = -0.0005;
cena.add(luzDirecional);

// add orbitcontrols
const controlador = new OrbitControls(camera, renderizador.domElement);
controlador.maxPolarAngle = 90 * (Math.PI / 180);

// 6. criar objetos e montar a cena

// Criar um array de objetos
const objetos = [];

// Criar Função para add esferas na cena
function addEsfera(){
  const geometriaEsfera = new THREE.SphereGeometry();
  const materialEsfera = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);

// Adicionar a esfera em posições aleatórias
  esfera.position.set(
    Math.random() * 10 - 5,
    Math.random() * 10,
    Math.random() * 10 - 5
  );

  esfera.castShadow = true;
  cena.add(esfera);
  objetos.push(esfera);
}

// Programar evento "click"

// Pega o botão pelo id
const btnAddEsfera = document.getElementById("btnAddEsfera");

// Add o evento
btnAddEsfera.addEventListener("click", () => {
  addEsfera();
});

//Função Remover
function remover(){
  if(objetos.length > 0){
    // remove do array
    const obj = objetos.pop();
    // remove da cena
    cena.remove(obj);
  }
}

// Botão Remover
const btnRemoveEsfera = document.getElementById("btnRemoveEsfera");
btnRemoveEsfera.addEventListener("click", () => {
  remover();
});

// Carregar um objeto
const objLoader = new OBJLoader();
objLoader.load('assets/cat/cat.obj', (objeto) => {
  objeto.scale.set(0.1, 0.1, 0.1); // Reduz o objeto
  objeto.rotation.x = -Math.PI / 2; // -90 graus
  cena.add(objeto);
});

const geometriaCubo = new THREE.BoxGeometry();
const materialCubo = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cubo = new THREE.Mesh(geometriaCubo, materialCubo);

cubo.position.x = 0;
cubo.castShadow = true;
cena.add(cubo);

const geometriaTorus = new THREE.TorusKnotGeometry();
const materialTorus = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const torus = new THREE.Mesh(geometriaTorus, materialTorus);

torus.position.x = 3;
torus.castShadow = true;
cena.add(torus);

const geometriaEsfera = new THREE.SphereGeometry();
const materialEsfera = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);

esfera.position.x = -3;
esfera.castShadow = true;
cena.add(esfera);

// criar um plano
const chaoGeometria = new THREE.PlaneGeometry(100, 100);
const chaoMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const chao = new THREE.Mesh(chaoGeometria, chaoMaterial);
chao.position.set(0, -2, 0);
chao.rotation.set(-Math.PI / 2, 0, 0);
chao.receiveShadow = true;
cena.add(chao);

// 7. renderizar a cena
// Percorrer array de objetos para rotacioná-los
function renderizar() {
  requestAnimationFrame(renderizar);

  objetos.forEach((obj) => {
    obj.rotation.y += 0.03;
    obj.rotation.x += 0.02;
    obj.position.z -= 0.03;

    if (obj.position.z < -10) {
      obj.position.z = 0;
    }
  });

  cubo.rotation.x += 0.03;
  cubo.rotation.y += 0.03;
  cubo.position.z += -0.03;
  if(cubo.position.z < -10){
    cubo.rotation.x = 0;
    cubo.rotation.y = 0;  
    cubo.position.z = 0;
  }

  torus.position.x += 0.03;
  torus.rotation.y += 0.03;
  torus.position.z += -0.03;
  if(torus.position.z < -10){
    torus.position.x = 3;
    torus.position.z = 0;
  }

  esfera.position.x += -0.03;
  esfera.rotation.y += 0.03;
  esfera.position.z += -0.03;
  if(esfera.position.z < -10){
    esfera.position.x = -3;
    esfera.position.z = 0;
  }

  renderizador.render(cena, camera);
  controlador.update();
}

renderizar();

