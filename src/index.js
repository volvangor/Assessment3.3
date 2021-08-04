import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GUI} from "three/examples/jsm/libs/dat.gui.module.js";

function rand_normal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function getPoint() {
    let u = Math.random() * 100000000000;
    let x1 = rand_normal();
    let x2 = rand_normal();
    let x3 = rand_normal();

    let mag = Math.sqrt(x1 * x1 + x2 * x2 + x3 * x3);
    x1 /= mag;
    x2 /= mag;
    x3 /= mag;

    // Math.cbrt is cube root
    let c = Math.cbrt(u);

    return {x: x1 * c, y: x2 * c, z: x3 * c};
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
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 1000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.y = 20;
camera.position.z = 10;
camera.lookAt(0, 10, 0);
controls.update();

window.addEventListener("resize", onWindowResize, false);

const default_x = 20;
const default_y = 20; // how tall the walls are
const default_z = 10;

const wall_material = new THREE.MeshStandardMaterial({color: 0xaaaaaa, side: THREE.FrontSide});
const floor_material = new THREE.MeshStandardMaterial({color: 0xaaaaff, side: THREE.DoubleSide});

const play_floor_geometry = new THREE.PlaneGeometry(1, 1);
const play_floor = new THREE.Mesh(play_floor_geometry, floor_material);
play_floor.rotateX(-Math.PI / 2);
play_floor.scale.x = default_x;
play_floor.scale.y = default_z;
scene.add(play_floor);

const right_wall_geometry = new THREE.PlaneGeometry(1, 1);
const right_wall = new THREE.Mesh(right_wall_geometry, wall_material);
right_wall.rotateY(-Math.PI / 2);
right_wall.scale.x = default_z;
right_wall.scale.y = default_y;
right_wall.position.x = default_x / 2;
right_wall.position.y = default_y / 2;
scene.add(right_wall);

const left_wall_geometry = new THREE.PlaneGeometry(1, 1);
const left_wall = new THREE.Mesh(left_wall_geometry, wall_material);
left_wall.rotateY(Math.PI / 2);
left_wall.scale.x = default_z;
left_wall.scale.y = default_y;
left_wall.position.x = -(default_x / 2);
left_wall.position.y = default_y / 2;
scene.add(left_wall);

const back_wall_geometry = new THREE.PlaneGeometry(1, 1);
const back_wall = new THREE.Mesh(back_wall_geometry, wall_material);
back_wall.scale.x = default_x;
back_wall.scale.y = default_y;
back_wall.position.z = -default_z / 2;
back_wall.position.y = default_y / 2;
scene.add(back_wall);

const front_wall_geometry = new THREE.PlaneGeometry(1, 1);
const front_wall = new THREE.Mesh(front_wall_geometry, wall_material);
front_wall.rotateX(Math.PI);
front_wall.scale.x = default_x;
front_wall.scale.y = default_y;
front_wall.position.z = default_z / 2;
front_wall.position.y = default_y / 2;
scene.add(front_wall);


const hemi_light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
// scene.add(hemi_light);

const light = new THREE.PointLight(0xffffff, 0.75, 100);
light.position.set(0, 15, 0);
scene.add(light);


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let menu_params = {
    space_x: 20,
    space_z: 10,
    floor_y: 0,
};

function updatePlaySpace() {
    // update the play space coords
    play_floor.position.y = menu_params.floor_y;
    // 1. change scale of floor
    play_floor.scale.x = menu_params.space_x;
    play_floor.scale.y = menu_params.space_z;
    //   a. set x and z scale, ignore y
    // 2. change positions of planes
    //   a. halve x and z values, then use positive and negative
    //   b. set x or z positions of 4 planes, ignore y
    left_wall.position.x = -menu_params.space_x / 2;
    right_wall.position.x = menu_params.space_x / 2;
    back_wall.position.z = -menu_params.space_z / 2;
    front_wall.position.z = menu_params.space_z / 2;
    left_wall.scale.x = menu_params.space_z;
    right_wall.scale.x = menu_params.space_z;
    back_wall.scale.x = menu_params.space_x;
    front_wall.scale.x = menu_params.space_x;

}


function updateCamera() {
    camera.updateProjectionMatrix();
}

const gui = new GUI();
const pointsFolder = gui.addFolder("Play Space");
// pointsFolder.add(points.material, "size", 0.001, 10);
// pointsFolder.addColor(new ColorGUIHelper(material, "color"), "value");
pointsFolder.add(menu_params, "space_x", 10, 100).onChange(updatePlaySpace);
pointsFolder.add(menu_params, "space_z", 10, 100).onChange(updatePlaySpace);
pointsFolder.add(menu_params, "floor_y", 0, 10).onChange(updatePlaySpace);
pointsFolder.open();
const viewFolder = gui.addFolder("View");
viewFolder.add(camera, "fov", 30, 175).onChange(updateCamera);
viewFolder.open();


const animate = function () {
    requestAnimationFrame(animate);
    //console.log(camera.position)

    controls.update();
    renderer.render(scene, camera);
};

animate();