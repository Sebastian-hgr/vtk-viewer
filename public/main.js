import * as THREE from 'three'
import {STLLoader} from './jsm/loaders/STLLoader.js'
import {OrbitControls} from './jsm/controls/OrbitControls.js'


window.onload = function (){
    setTimeout(init, 5000)
    move()
    addLog()
}
let storedValues = JSON.parse(localStorage.getItem('myValues')) || [];



const scene = new THREE.Scene()
const loader = new STLLoader()
const camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.5,
    1000)

let submit = document.getElementById('submit')
// submit.addEventListener('click', storeValue)

let range = document.getElementById('range')

range.oninput = function () {
    document.getElementById('getRange').textContent = range.value
}

document.getElementById('form').addEventListener('submit', onSubmit)

function onSubmit() {
    console.log('value insert')
    storedValues.push(range.value);
    localStorage.setItem('myValues', JSON.stringify(storedValues));

}

function init() {
    console.log("init")
    setSceneDef()
    setLight()
    setCamera()
    loadModel()
    addLog()
}

function setSceneDef() {
    scene.background = new THREE.Color()
    scene.add(new THREE.AxesHelper(5))
}

function setLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light from the back
    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(0, 1, -1); // Renamed for clarity and moved behind to shine forward
    scene.add(backLight);

    // Hemisphere light to simulate sky lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    // Directional light from the front
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 0, 1); // Placed in front to illuminate from the front
    scene.add(frontLight);
}


function setCamera() {
    camera.position.z = 2
}

const container = document.getElementById('modelContainer')
const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.useLegacyLights = false
renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.style.width = '100%'
renderer.domElement.style.height = 'auto'
document.body.appendChild(container);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


function loadModel() {
    loader.load('./models/blast-furnace.stl', function (geometry) {
        var material = new THREE.MeshNormalMaterial()
        var mesh = new THREE.Mesh(geometry, material)
        mesh.scale.set(0.1, 0.1, 0.1)
        geometry.center()
        scene.add(mesh)
    }, function (xhr) {
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        console.log('loading model')
    }, function (error) {
        console.log(error)
    })
}


window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()


//progess bar
// document.getElementById('load').addEventListener('click', move)

let elem = document.getElementById("myBar");
let i = 0;
let width = 0
let id

function move() {
    console.log('progress bar')
    if (i === 0) {
        i = 1;
        width = 0;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
        id = setInterval(frame, 50);
    }
}
function frame() {
    if (width >= 100) {
        clearInterval(id);

        i = 0;
    } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
        if (width <= 40) {
            elem.style.background = 'red'
        } else if (width < 80 && width > 40) {
            elem.style.background = 'orange';
        } else {
            elem.style.background = '#04AA6D'
        }
    }
}
function addLog() {
    let textBackground = document.getElementById('log-text-background')

    console.log(`all stored from add log:  ${storedValues}`);

    document.getElementById('log-window').innerHTML = '';

    localStorage.clear()
    for (let i = storedValues.length - 1; i >= 0; i--) {
        document.getElementById('log-window').innerHTML += `<div class="log-text" id="log-text-background">Render: ${storedValues[i]} deg</div>`;
    }
}

document.getElementById('clear-storage').addEventListener('click', function () {
    localStorage.clear()
    document.getElementById('log-window').innerHTML = ''
})