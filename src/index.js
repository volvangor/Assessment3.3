import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GUI} from "three/examples/jsm/libs/dat.gui.module.js";

function getPoint() {
    let u = Math.random();
    let v = Math.random();
    let theta = u * 2.0 * Math.PI;
    let phi = Math.acos(2.0 * v - 1.0);
    let r = Math.cbrt((Math.random() * 100000000000));
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);
    let x = r * sinPhi * cosTheta;
    let y = r * sinPhi * sinTheta;
    let z = r * cosPhi;
    return {x: x, y: y, z: z};
}

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }

    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }

    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;
controls.update();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

const vertices = [];
vertices.push(0, 0, 0);
for (let i = 0; i < 50000; i++) {
    const coord = getPoint();
    vertices.push(coord.x, coord.y, coord.z);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({color: "#ffffff"});
material.size = 5;
const points = new THREE.Points(geometry, material);
scene.add(points);
let menu_params = {rotation_rate: 0.00001};


const gui = new GUI();
const pointsFolder = gui.addFolder("Points");
pointsFolder.add(points.material, "size", 0.001, 10);
pointsFolder.addColor(new ColorGUIHelper(material, "color"), "value")
pointsFolder.open();
const viewFolder = gui.addFolder("View");
viewFolder.add(menu_params, "rotation_rate", 0, 0.001);
viewFolder.open();

const animate = function () {
    requestAnimationFrame(animate);
    points.rotation.x += menu_params.rotation_rate;
    points.rotation.y += menu_params.rotation_rate;

    controls.update();
    renderer.render(scene, camera);
};

animate();