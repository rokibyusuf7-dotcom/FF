let camera, scene, renderer, gun, flash;
let keys = {};
let speed = 0.1;
let started = false;

const startScreen = document.getElementById("startScreen");
const crosshair = document.getElementById("crosshair");

startScreen.onclick = () => {
    startScreen.style.display = "none";
    crosshair.style.display = "block";
    started = true;
    document.body.requestPointerLock();
};

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshBasicMaterial({ color: 0x228B22 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    let wall = new THREE.Mesh(
        new THREE.BoxGeometry(20, 5, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    wall.position.set(0, 2.5, -10);
    wall.name = "target";
    scene.add(wall);

    let gunGeometry = new THREE.BoxGeometry(0.5, 0.2, 1);
    let gunMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    gun = new THREE.Mesh(gunGeometry, gunMaterial);
    gun.position.set(0.5, -0.5, -1);
    camera.add(gun);
    scene.add(camera);

    let flashGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    let flashMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.set(0.5, -0.5, -0.5);
    flash.visible = false;
    camera.add(flash);

    camera.position.set(0, 2, 5);

    document.addEventListener("keydown", (e) => keys[e.key] = true);
    document.addEventListener("keyup", (e) => keys[e.key] = false);

    document.addEventListener("mousedown", shoot);

    animate();
}

function shoot() {
    if (!started) return;

    flash.visible = true;
    setTimeout(() => flash.visible = false, 100);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);

    let hits = raycaster.intersectObjects(scene.children);

    if (hits.length > 0) {
        console.log("Hit:", hits[0].object.name);
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (started) {
        if (keys["w"]) camera.position.z -= speed;
        if (keys["s"]) camera.position.z += speed;
        if (keys["a"]) camera.position.x -= speed;
        if (keys["d"]) camera.position.x += speed;
    }

    renderer.render(scene, camera);
}

window.addEventListener("mousemove", (e) => {
    if (started && document.pointerLockElement === document.body) {
        camera.rotation.y -= e.movementX * 0.002;
        camera.rotation.x -= e.movementY * 0.002;
    }
});

init();
