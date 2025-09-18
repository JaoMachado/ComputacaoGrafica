import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import { color } from 'three/src/nodes/TSL.js';

class App{

    //Atributos privados
    #renderizador = null;
    #cena = null;
    #camera = null;
    #controles = null;
    #sol = null;
    #terra= null;
    #lua = null;

    constructor(){
        window.addEventListener('resize', () => {
            this.#redimensionar();
        });
            
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
        this.#camera.position.z = 75;

        // Criando a Cena
        this.#cena = new THREE.Scene();

        // Criando o Controle
        this.#controles = new OrbitControls(this.#camera, this.#renderizador.domElement);
        this.#controles.enableDamping = true;
        this.#controles.dampingFactor = 0.05;
        //this.#controles.target.set(2, 0, 0);

        // Criando o Sol e Adicionando na Cena
        this.#sol = new THREE.Mesh(
            new THREE.SphereGeometry(16, 32, 32), 
            new THREE.MeshBasicMaterial({color: 0xffff00})
        );
        this.#cena.add(this.#sol);

        // Criando a Terra e Adicionando na Cena
        this.#terra = new THREE.Mesh(
            new THREE.SphereGeometry(3, 32, 32), 
            new THREE.MeshBasicMaterial({color: 0x4682B4})
        );

        // Criando a Lua e Adicionando na Cena
        this.#lua = new THREE.Mesh(
            new THREE.SphereGeometry(0.81, 32, 32), 
            new THREE.MeshBasicMaterial({color: 0xDCDCDC})
        );

        // Setando a Posição dos planetas
        this.#sol.position.set(0, 0, 0);

        // Adicionando Terra como filha do sol
        this.#sol.add(this.#terra);

        this.#terra.position.set(-30, 0, 0);
        this.#terra.add(this.#lua);

        this.#lua.position.set(6, 0, 0);
    }

    // run(): Método para rodar o projeto, renderizar.
    run(){

        // Renderizar a Cena
        const render = () => {
            requestAnimationFrame(render);

            this.#controles.update();

            // Fazendo a "Órbita"(Objeto rotacionar)
            this.#sol.rotation.y += 0.01;
            this.#sol.rotation.x = 0.5;

            this.#terra.rotation.y += 0.02;
            this.#terra.rotation.x = 0.5;

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

        // Atualizar a matriz de projeção da câmera
        this.#camera.updateProjectionMatrix();
    }
};

const app = new App();
app.initialize();
app.run();