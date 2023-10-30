import * as THREE from 'three';

const container = document.querySelector('#game-container');
//escena
const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

//camara
const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
//mesh

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);


container.appendChild(renderer.domElement);

renderer.render(scene, camera);
