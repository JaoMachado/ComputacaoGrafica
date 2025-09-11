import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import { color } from 'three/src/nodes/TSL.js';

class App{

    //Atributos privados
    #renderizador = null;
    #cena = null;
    #camera = null;
    #controles = null;

    constructor(){
        window.addEventListener('resize', this.#redimensionar);
    }

    // initialize(): Método para iniciar o projeto, configurações iniciais.
    initialize(){
        // Configurações Iniciais

        // Criando Renderizador e anexando no body do html
        this.#renderizador = new THREE.WebGLRenderer();
        this.#renderizador.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.#renderizador.domElement);     

        // Criando a Camera 
        const aspect = window.innerWidth / window.innerHeight;
        this.#camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
        this.#camera.position.z = 5;

        // Criando a Cena
        this.#cena = new THREE.Scene();

        // Criando o Controle
        this.#controles = new OrbitControls(this.#camera, this.#renderizador.domElement);
        this.#controles.enableDamping = true;
        this.#controles.dampingFactor = 0.05;
        //this.#controles.target.set(2, 0, 0);

        // Criando o Objeto e Adicionando na Cena
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(), 
            new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true})
        );
        this.#cena.add(mesh);
    }

    // run(): Método para rodar o projeto, renderizar.
    run(){
        // Renderizar a Cena
        const render = () => {
            requestAnimationFrame(render);
            this.#renderizador.render(this.#cena, this.#camera);
        }

        render();
    }

    // redimensionar(): Função privada para redimensionar a tela
    #redimensionar(){
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / h;

        // atualizando o aspect da camera e atualizando o renderizador
        this.#camera.aspect = aspect;
        this.#renderizador.setSize(w, h);
    }
};

const app = new App();
app.initialize();
app.run();