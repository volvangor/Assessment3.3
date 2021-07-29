// import _ from "lodash";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

function getPoint() {
    let u = Math.random();
    let v = Math.random();
    let theta = u * 2.0 * Math.PI;
    let phi = Math.acos(2.0 * v - 1.0);
    let r = Math.cbrt(Math.random() * 5);
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);
    let x = r * sinPhi * cosTheta;
    let y = r * sinPhi * sinTheta;
    let z = r * cosPhi;
    return {x: x, y: y, z: z};
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
const controls = new OrbitControls();

const vertices = [];

for (let i = 0; i < 10000; i++) {
    const coord = getPoint();
    vertices.push(coord.x, coord.y, coord.z);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({color: 0xFFFFFF});
material.size = 0.001;
const points = new THREE.Points(geometry, material);
scene.add(points);


const animate = function () {
    requestAnimationFrame(animate);

    points.rotation.x += 0.01;
    points.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();

// function component() {
//     const element = document.createElement('div');
//     // Lodash, now imported by this script
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//     return element;
// }
//
// document.body.appendChild(component());