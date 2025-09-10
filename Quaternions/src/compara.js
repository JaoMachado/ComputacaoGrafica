import * as THREE from 'three';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

// 1. Configurações Iniciais
const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderizador = new THREE.WebGLRenderer({antialias: true});

renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setClearColor(0xdddddd);

// Adicionando o renderizador no html
document.body.appendChild(renderizador.domElement);

// Ajustando a Posição da Câmera
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Iluminação
const luzAmbiente = new THREE.AmbientLight(0x404040, 0.4);
cena.add(luzAmbiente);

const luzDirecional = new THREE.DirectionalLight(0xffffff, 1);
luzDirecional.position.set(0, 0, 5);
cena.add(luzDirecional);

// 2. Criar o Objeto da Cena
const geometria = new THREE.BoxGeometry(2.0, 0.5, 0.5);

// Euler
const eulerMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
const objetoEuler = new THREE.Mesh(geometria, eulerMaterial);
objetoEuler.position.set(-3, 0, 0);
cena.add(objetoEuler);

// Quaternion
const quartMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
const objetoQuart = new THREE.Mesh(geometria, quartMaterial);
objetoQuart.position.set(3, 0, 0);
cena.add(objetoQuart);

// 3. Preparar a Rotação

// Parâmetros
const parametros ={
    // Controles de Euler
    eulerX: 0,
    eulerY: 0,
    eulerZ: 0, 

    // Controles de Quaternion
    quarAlvoX: 0,
    quarAlvoY: 0,
    quarAlvoZ: 0,

    // Velocidade Slerp
    veloSLERP: 0.02
}

const quartInicial = new THREE.Quaternion();
const quartFinal = new THREE.Quaternion();
const quartAtual = new THREE.Quaternion();

function updateAlvoQuaternion(){
    quartInicial.copy(quartAtual);
    quartFinal.setFromEuler(
        new THREE.Euler(
            parametros.quarAlvoX,
            parametros.quarAlvoY,
            parametros.quarAlvoZ
        )
    );
}

function updateRotacao(){
    objetoEuler.rotation.set(parametros.eulerX, parametros.eulerY, parametros.eulerZ);
}

// 4. Menu

// Criando a Janela Constrols
const gui = new GUI();

// Pasta Euler
const eulerPasta = gui.addFolder("Ângulos de Euler");
eulerPasta.add(parametros, 'eulerX', -Math.PI, Math.PI, 0.01).name('Rotação X').onChange(updateRotacao);
eulerPasta.add(parametros, 'eulerY', -Math.PI, Math.PI, 0.01).name('Rotação Y').onChange(updateRotacao);
eulerPasta.add(parametros, 'eulerZ', -Math.PI, Math.PI, 0.01).name('Rotação Z').onChange(updateRotacao);

// Pasta Quaternion
const quartPasta = gui.addFolder("Quaternions");
quartPasta.add(parametros, 'quarAlvoX', -Math.PI, Math.PI, 0.01).name('Alvo X').onChange(updateAlvoQuaternion);
quartPasta.add(parametros, 'quarAlvoY', -Math.PI, Math.PI, 0.01).name('Alvo Y').onChange(updateAlvoQuaternion);
quartPasta.add(parametros, 'quarAlvoZ', -Math.PI, Math.PI, 0.01).name('Alvo Z').onChange(updateAlvoQuaternion);

// Pasta Slerp
const slerpPasta = gui.addFolder("SLERP");
slerpPasta.add(parametros, 'veloSLERP', 0.001, 0.1, 0.001).name('Velocidade');

// Renderizando a Cena
function animate(){
    requestAnimationFrame(animate);

    // Interpolação Suave do Quaternion Usando Slerp
    quartAtual.slerp(quartFinal, parametros.veloSLERP);
    objetoQuart.quaternion.copy(quartAtual);

    renderizador.render(cena, camera);
}

animate();