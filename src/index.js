import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GUI} from "three/examples/jsm/libs/dat.gui.module.js";


// Camera
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 20;
camera.position.z = 20;
camera.position.x = -10;
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


// region floor texture
const floor_texture_base = new THREE.TextureLoader().load("../textures/Concrete_017_basecolor.jpg");
const floor_texture_normal = new THREE.TextureLoader().load("../textures/Concrete_017_normal.jpg");
const floor_texture_rough = new THREE.TextureLoader().load("../textures/Concrete_017_roughness.jpg");
const floor_texture_ao = new THREE.TextureLoader().load("../textures/Concrete_017_ambientOcclusion.jpg");
const floor_texture_height = new THREE.TextureLoader().load("../textures/Concrete_017_height.jpg");
floor_texture_base.wrapS = THREE.RepeatWrapping;
floor_texture_base.wrapT = THREE.RepeatWrapping;
floor_texture_normal.wrapS = THREE.RepeatWrapping;
floor_texture_normal.wrapT = THREE.RepeatWrapping;
floor_texture_rough.wrapS = THREE.RepeatWrapping;
floor_texture_rough.wrapT = THREE.RepeatWrapping;
floor_texture_ao.wrapS = THREE.RepeatWrapping;
floor_texture_ao.wrapT = THREE.RepeatWrapping;
floor_texture_height.wrapS = THREE.RepeatWrapping;
floor_texture_height.wrapT = THREE.RepeatWrapping;

function changeFloorWrap(x, y) {
    floor_texture_base.repeat.set(x, y);
    floor_texture_normal.repeat.set(x, y);
    floor_texture_rough.repeat.set(x, y);
    floor_texture_ao.repeat.set(x, y);
    floor_texture_height.repeat.set(x, y);
}

// endregion

// region side wall texture
const side_wall_texture_base = new THREE.TextureLoader().load("../textures/Brick_wall_019_basecolor.jpg");
const side_wall_texture_normal = new THREE.TextureLoader().load("../textures/Brick_wall_019_normal.jpg");
const side_wall_texture_rough = new THREE.TextureLoader().load("../textures/Brick_wall_019_roughness.jpg");
const side_wall_texture_ao = new THREE.TextureLoader().load("../textures/Brick_wall_019_ambientOcclusion.jpg");
const side_wall_texture_height = new THREE.TextureLoader().load("../textures/Brick_wall_019_height.jpg");
side_wall_texture_base.wrapS = THREE.RepeatWrapping;
side_wall_texture_base.wrapT = THREE.RepeatWrapping;
side_wall_texture_normal.wrapS = THREE.RepeatWrapping;
side_wall_texture_normal.wrapT = THREE.RepeatWrapping;
side_wall_texture_rough.wrapS = THREE.RepeatWrapping;
side_wall_texture_rough.wrapT = THREE.RepeatWrapping;
side_wall_texture_ao.wrapS = THREE.RepeatWrapping;
side_wall_texture_ao.wrapT = THREE.RepeatWrapping;
side_wall_texture_height.wrapS = THREE.RepeatWrapping;
side_wall_texture_height.wrapT = THREE.RepeatWrapping;

function changeSideWallWrap(x, y) {
    side_wall_texture_base.repeat.set(x, y);
    side_wall_texture_normal.repeat.set(x, y);
    side_wall_texture_rough.repeat.set(x, y);
    side_wall_texture_ao.repeat.set(x, y);
    side_wall_texture_height.repeat.set(x, y);
}
// endregion

// region wall texture
const wall_texture_base = new THREE.TextureLoader().load("../textures/Brick_wall_019_basecolor.jpg");
const wall_texture_normal = new THREE.TextureLoader().load("../textures/Brick_wall_019_normal.jpg");
const wall_texture_rough = new THREE.TextureLoader().load("../textures/Brick_wall_019_roughness.jpg");
const wall_texture_ao = new THREE.TextureLoader().load("../textures/Brick_wall_019_ambientOcclusion.jpg");
const wall_texture_height = new THREE.TextureLoader().load("../textures/Brick_wall_019_height.jpg");
wall_texture_base.wrapS = THREE.RepeatWrapping;
wall_texture_base.wrapT = THREE.RepeatWrapping;
wall_texture_normal.wrapS = THREE.RepeatWrapping;
wall_texture_normal.wrapT = THREE.RepeatWrapping;
wall_texture_rough.wrapS = THREE.RepeatWrapping;
wall_texture_rough.wrapT = THREE.RepeatWrapping;
wall_texture_ao.wrapS = THREE.RepeatWrapping;
wall_texture_ao.wrapT = THREE.RepeatWrapping;
wall_texture_height.wrapS = THREE.RepeatWrapping;
wall_texture_height.wrapT = THREE.RepeatWrapping;

function changeWallWrap(x, y) {
    wall_texture_base.repeat.set(x, y);
    wall_texture_normal.repeat.set(x, y);
    wall_texture_rough.repeat.set(x, y);
    wall_texture_ao.repeat.set(x, y);
    wall_texture_height.repeat.set(x, y);
}

// endregion


// region create play space...
const default_x = 40;
const default_y = 20; // how tall the walls are
const default_z = 20;

changeFloorWrap(default_x / 20, default_z / 20);
changeSideWallWrap(default_z / 20, 1);
changeWallWrap(default_x / 20, 1);

const wall_material = new THREE.MeshStandardMaterial(
    {
        color: 0xffffff,
        side: THREE.FrontSide,
        map: wall_texture_base,
        normalMap: wall_texture_normal,
        roughnessMap: wall_texture_rough,
        aoMap: wall_texture_ao,
        displacementMap: wall_texture_height
    });
const side_wall_material = new THREE.MeshStandardMaterial(
    {
        color: 0xffffff,
        side: THREE.FrontSide,
        map: side_wall_texture_base,
        normalMap: side_wall_texture_normal,
        roughnessMap: side_wall_texture_rough,
        aoMap: side_wall_texture_ao,
        displacementMap: side_wall_texture_height
    });
const floor_material = new THREE.MeshStandardMaterial(
    {
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: floor_texture_base,
        normalMap: floor_texture_normal,
        roughnessMap: floor_texture_rough,
        aoMap: floor_texture_ao,
        displacementMap: floor_texture_height
    }
);

const play_floor_geometry = new THREE.PlaneGeometry(1, 1);
const play_floor = new THREE.Mesh(play_floor_geometry, floor_material);
play_floor.rotateX(-Math.PI / 2);
play_floor.scale.x = default_x;
play_floor.scale.y = default_z;
play_floor.userData.ground = true;
play_floor.receiveShadow = true;
scene.add(play_floor);

const right_wall_geometry = new THREE.PlaneGeometry(1, 1);
const right_wall = new THREE.Mesh(right_wall_geometry, side_wall_material);
right_wall.rotateY(-Math.PI / 2);
right_wall.scale.x = default_z;
right_wall.scale.y = default_y;
right_wall.position.x = default_x / 2;
right_wall.position.y = default_y / 2;
right_wall.userData.ground = true;
right_wall.receiveShadow = true;
scene.add(right_wall);

const left_wall_geometry = new THREE.PlaneGeometry(1, 1);
const left_wall = new THREE.Mesh(left_wall_geometry, side_wall_material);
left_wall.rotateY(Math.PI / 2);
left_wall.scale.x = default_z;
left_wall.scale.y = default_y;
left_wall.position.x = -(default_x / 2);
left_wall.position.y = default_y / 2;
left_wall.userData.ground = true;
left_wall.receiveShadow = true;
scene.add(left_wall);

const back_wall_geometry = new THREE.PlaneGeometry(1, 1);
const back_wall = new THREE.Mesh(back_wall_geometry, wall_material);
back_wall.scale.x = default_x;
back_wall.scale.y = default_y;
back_wall.position.z = -default_z / 2;
back_wall.position.y = default_y / 2;
back_wall.userData.ground = true;
back_wall.receiveShadow = true;
scene.add(back_wall);

const front_wall_geometry = new THREE.PlaneGeometry(1, 1);
const front_wall = new THREE.Mesh(front_wall_geometry, wall_material);
front_wall.rotateX(Math.PI);
front_wall.scale.x = default_x;
front_wall.scale.y = default_y;
front_wall.position.z = default_z / 2;
front_wall.position.y = default_y / 2;
front_wall.userData.ground = true;
front_wall.receiveShadow = true;
scene.add(front_wall);


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const light = new THREE.PointLight(0xffffff, 0.95, 100);
light.position.set(0, 15, 0);
light.castShadow = true;
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.radius = 10;

function updatePlaySpace() {
    // 1. change scale and position of floor
    //   a. set x and z scale, set y position
    // 2. change positions of planes
    //   a. halve x and z values, then use positive and negative
    //   b. set x or z positions of 4 planes, ignore y
    changeFloorWrap(menu_params.space_x / 20, menu_params.space_z / 20);
    changeSideWallWrap(menu_params.space_z / 20, 1);
    changeWallWrap(menu_params.space_x / 20, 1);
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

window.addEventListener("mouseup", () => {
    controls.saveState();
    if (draggable != null) {
        console.log(`dropping draggable ${draggable.userData.name}`);
        draggable = null;
    }
    controls.reset();
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
let radius = 4;
let pos = {x: 5, y: radius, z: 0};

let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
    new THREE.MeshPhongMaterial({color: 0x43a1f4, side: THREE.FrontSide}));
sphere.position.set(pos.x, pos.y, pos.z);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

sphere.userData.draggable = true;
sphere.userData.name = "SPHERE";

// region GUI setup...
let menu_params = {
    space_x: default_x,
    space_z: default_z,
    floor_y: 0,
};

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

const gui = new GUI();
const pointsFolder = gui.addFolder("Play Space");
pointsFolder.add(menu_params, "space_x", 10, 100).onChange(updatePlaySpace);
pointsFolder.add(menu_params, "space_z", 10, 100).onChange(updatePlaySpace);
pointsFolder.add(menu_params, "floor_y", 0, 10).onChange(updatePlaySpace);
pointsFolder.open();
const sphereFolder = gui.addFolder("Sphere");
sphereFolder.addColor(new ColorGUIHelper(sphere.material, "color"), "value");
sphereFolder.open();
const viewFolder = gui.addFolder("View");
viewFolder.add(camera, "fov", 30, 175).onChange(updateCamera);
viewFolder.open();

// endregion

const animate = function () {
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();