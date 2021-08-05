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

// Camera
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 1000000);
camera.position.y = 20;
camera.position.z = 10;
camera.lookAt(0, 10, 0);

function updateCamera() {
    camera.updateProjectionMatrix();
}

// scene
const scene = new THREE.Scene();

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// region Window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
// endregion


// region create play space...
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
play_floor.userData.ground = true;
scene.add(play_floor);

const right_wall_geometry = new THREE.PlaneGeometry(1, 1);
const right_wall = new THREE.Mesh(right_wall_geometry, wall_material);
right_wall.rotateY(-Math.PI / 2);
right_wall.scale.x = default_z;
right_wall.scale.y = default_y;
right_wall.position.x = default_x / 2;
right_wall.position.y = default_y / 2;
right_wall.userData.ground = true;
scene.add(right_wall);

const left_wall_geometry = new THREE.PlaneGeometry(1, 1);
const left_wall = new THREE.Mesh(left_wall_geometry, wall_material);
left_wall.rotateY(Math.PI / 2);
left_wall.scale.x = default_z;
left_wall.scale.y = default_y;
left_wall.position.x = -(default_x / 2);
left_wall.position.y = default_y / 2;
left_wall.userData.ground = true;
scene.add(left_wall);

const back_wall_geometry = new THREE.PlaneGeometry(1, 1);
const back_wall = new THREE.Mesh(back_wall_geometry, wall_material);
back_wall.scale.x = default_x;
back_wall.scale.y = default_y;
back_wall.position.z = -default_z / 2;
back_wall.position.y = default_y / 2;
back_wall.userData.ground = true;
scene.add(back_wall);

const front_wall_geometry = new THREE.PlaneGeometry(1, 1);
const front_wall = new THREE.Mesh(front_wall_geometry, wall_material);
front_wall.rotateX(Math.PI);
front_wall.scale.x = default_x;
front_wall.scale.y = default_y;
front_wall.position.z = default_z / 2;
front_wall.position.y = default_y / 2;
front_wall.userData.ground = true;
scene.add(front_wall);

const light = new THREE.PointLight(0xffffff, 0.75, 100);
light.position.set(0, 15, 0);
scene.add(light);

function updatePlaySpace() {
    // 1. change scale and position of floor
    //   a. set x and z scale, set y position
    // 2. change positions of planes
    //   a. halve x and z values, then use positive and negative
    //   b. set x or z positions of 4 planes, ignore y
    play_floor.position.y = menu_params.floor_y;
    play_floor.scale.x = menu_params.space_x;
    play_floor.scale.y = menu_params.space_z;
    left_wall.position.x = -menu_params.space_x / 2;
    right_wall.position.x = menu_params.space_x / 2;
    back_wall.position.z = -menu_params.space_z / 2;
    front_wall.position.z = menu_params.space_z / 2;
    left_wall.scale.x = menu_params.space_z;
    right_wall.scale.x = menu_params.space_z;
    back_wall.scale.x = menu_params.space_x;
    front_wall.scale.x = menu_params.space_x;
}

// endregion

//region drag and drop objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
let draggable;

function intersections(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}

window.addEventListener("mouseup", ev => {
    controls.saveState()
    if (draggable != null) {
        console.log(`dropping draggable ${draggable.userData.name}`);
        draggable = null;
    }
    controls.reset()
    controls.enabled = true;
});

window.addEventListener("mousedown", ev => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    const found = intersections(mouse);

    if (found.length > 0) {
        if (found[0].object.userData.draggable) {
            controls.enabled = false;
            draggable = found[0].object;
            console.log(`found draggable ${draggable.userData.name}`);
        } else {
            controls.enabled = true;
        }
    } else {
        controls.enabled = true;
    }
});

window.addEventListener("mousemove", event => {
    mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseMove.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
    if (draggable != null) {
        const found = intersections(mouseMove);
        if (found.length > 0) {
            for (let i = 0; i < found.length; i++) {
                if (!found[i].object.userData.ground)
                    continue;

                let target = found[i].point;
                draggable.position.x = target.x;
                draggable.position.z = target.z;
            }
        }
    }
}

// endregion

// region GUI setup...
let menu_params = {
    space_x: 20,
    space_z: 10,
    floor_y: 0,
};

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

// endregion

function createSphere() {
    let radius = 4;
    let pos = {x: 0, y: radius + 5, z: 0};

    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({color: 0x43a1f4}));
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    sphere.userData.draggable = true;
    sphere.userData.name = "SPHERE";
}

const animate = function () {
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

createSphere();

animate();