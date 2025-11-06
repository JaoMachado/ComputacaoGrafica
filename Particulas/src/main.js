import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { HDRLoader } from 'three/examples/jsm/Addons.js';

class App {

    #renderizador = null;
    #camera = null;
    #cena = null;
    #orbit = null;
    #clock = null;
    #geoNuvens = null;

    constructor(){
        window.addEventListener('resize', () => {
            this.#redimensionar();
        });
    }

    async initialize(){
        console.log("aplicação iniciada");
        // objeto clock para medir o tempo entre frames
        this.#clock = new THREE.Clock();
        this.#configurarProjeto();
        //this.#umaParticula();
        //this.#umaEstrela();
        //this.#nuvemEstrelas();
        this.#criarNuvens();
        this.#movimentarNuvens();
        //this.#carregarChao();
        //this.#carregarSprite();
        this.#atualizarCena();
    }

    #configurarProjeto(){
        // configura renderizador
        this.#renderizador = new THREE.WebGLRenderer({antialias: true});
        this.#renderizador.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.#renderizador.domElement);

        // configura câmera
        const fov = 70;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.#camera.position.set(0, 2, 7);

        // configura cena
        this.#cena = new THREE.Scene();
        this.#cena.background = new THREE.Color(0x00000000);

        // configura luz
        const luz = new THREE.DirectionalLight(0xffffff, 2.0);
        luz.position.set(5, 10, 7.5);
        luz.castShadow = true;        
        this.#cena.add(luz);

        // adiciona orbit controls
        this.#orbit = new OrbitControls(this.#camera, this.#renderizador.domElement);
        this.#orbit.enableDamping = true;
        this.#orbit.target.set(0, 1, 0);
        this.#orbit.maxPolarAngle = Math.PI / 2;

        // adiciona textura no ambiente
        const hdrLoader = new HDRLoader();
        hdrLoader.load('./assets/satara_night_4k.hdr', (hdr) => {
            hdr.mapping = THREE.EquirectangularReflectionMapping;
            this.#cena.background = hdr;
        });

    }

    #atualizarCena() {
        requestAnimationFrame(() =>{
            this.#renderizador.render(this.#cena, this.#camera);
            const delta = this.#clock.getDelta();
            this.#orbit.update(delta);
            if(this.#geoNuvens) this.#movimentarNuvens();
            this.#atualizarCena();
        });
    }

    #redimensionar(){
        const canvas = this.#renderizador.domElement;
        const w = canvas.clientWidth;
        const h = canvas. clientHeight;
        const aspect = w / h;
        this.#renderizador.setSize(w, h, false);
        this.#camera.aspect = aspect;
        this.#camera.updateProjectionMatrix();
    }

    #umaParticula(){
        const geometria = new THREE.BufferGeometry();
        const posicoes = [];

        posicoes.push(0, 0 , 0) // (x, y, z)
        posicoes.push(2, 2 , 2) // (x, y, z)

        const material = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 1
        });

        geometria.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        const pontos = new THREE.Points(geometria, material);

        this.#cena.add(pontos);
    }

    #umaEstrela(){
        const geometria = new THREE.BufferGeometry();
        const posicoes = [];

        posicoes.push(0, 0 , 0) // (x, y, z)
        posicoes.push(2, 2 , 2) // (x, y, z)

        // carregar textura da partícula 
        const textura = new THREE.TextureLoader();
        const texturaEstrela = textura.load('./assets/star.png')

        const material = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 1,
            map: texturaEstrela,
            transparent: true
        });

        geometria.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        const pontos = new THREE.Points(geometria, material);

        this.#cena.add(pontos);
    }

    #nuvemEstrelas(){
        const geometria = new THREE.BufferGeometry();
        const posicoes = [];

        // Adiciona aleatoriedade na criação das partículas
        for(let i = 0; i < 5000; i++){
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;

            posicoes.push(x, y, z)
        }

        // carregar textura da partícula 
        const textura = new THREE.TextureLoader();
        const texturaEstrela = textura.load('./assets/star.png')

        const material = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 1,
            map: texturaEstrela,
            transparent: true
        });

        geometria.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        const pontos = new THREE.Points(geometria, material);

        this.#cena.add(pontos);
    }

    #criarNuvens(){
        this.#geoNuvens = new THREE.BufferGeometry();
        const posicoes = [];

        // Adiciona aleatoriedade na criação das partículas
        for(let i = 0; i < 100; i++){
            const x = (Math.random() - 0.5) * 100;
            const y = 50;
            const z = (Math.random() - 0.5) * 100;

            posicoes.push(x, y, z)
        }

        // carregar textura da partícula 
        const textura = new THREE.TextureLoader();
        const texturaEstrela = textura.load('./assets/cloud.png')

        const material = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 20,
            map: texturaEstrela,
            transparent: true,
            // Eliminar as bordas visíveis
            depthTest: true, 
            depthWrite: false
        });

        this.#geoNuvens.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        const pontos = new THREE.Points(this.#geoNuvens, material);

        this.#cena.add(pontos);
    }

    #movimentarNuvens(){
        const posicoes = this.#geoNuvens.attributes.position.array;

        // Movimentação
        for(let i = 0; i < posicoes.length; i += 3){
            posicoes[i + 2] -= 0.2; // Altera o z
            posicoes[i + 1] += 0.05; // Altera o z

            if(posicoes[i + 2] > 200){
                posicoes[i + 2] = -200;
            }
        }

        // Atualiza o BufferGeometry
        this.#geoNuvens.attributes.position.needsUpdate = true;

    }
}

let app = null;
window.addEventListener('DOMContentLoaded', async () => {
    app = new App();
    await app.initialize();
});