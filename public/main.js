import * as THREE from 'three'
import { STLLoader } from './jsm/loaders/STLLoader.js'
import {OrbitControls} from './jsm/controls/OrbitControls.js'


const scene = new THREE.Scene()
const loader = new STLLoader()
const camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.5,
    1000)

let submit = document.getElementById('submit')
submit.addEventListener('click', init)


function init() {
    setSceneDef()
    setLight()
    setCamera()
    loadModel()
}

function setSceneDef() {
    scene.background = new THREE.Color()
    scene.add(new THREE.AxesHelper(5))
}
function setLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 0); // Adjust the position of the light
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Set up shadow properties for the directional light
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.bias = -0.003;
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
        scene.add(mesh)
    }, function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
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