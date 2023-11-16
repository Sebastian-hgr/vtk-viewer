import * as THREE from 'three'
import { STLLoader } from './jsm/loaders/STLLoader.js'
import {OrbitControls} from './jsm/controls/OrbitControls.js'
import {WebGLRenderer} from "three";

// window.onload = init

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
    console.log("init")
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
        mesh.scale.set(0.1,0.1,0.1)
        geometry.center()
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