import * as THREE from 'three'
import { AxesHelper, MathUtils, Matrix3, Matrix4, Mesh, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const initScene = function (): void {
  let orbitControls: OrbitControls
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  camera.position.set(180, 180, 0)
  camera.lookAt(new Vector3(0, 0, 0))
  const renderer = new THREE.WebGL1Renderer()
  scene.background = new THREE.Color(0xffffff)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const AxesHelper = new THREE.AxesHelper(200)
  scene.add(AxesHelper)

  const planeGeometry = new THREE.GridHelper(200, 20, 0x888888)
  scene.add(planeGeometry)

  const cubeGeometry = new THREE.BoxGeometry(40, 40, 40)
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(40, 0, 40);
  // 修改中心原点
  cubeGeometry.translate(20, 20, -20)
  // 沿中心原点旋转
  // cube.rotation.y = Math.PI / 3

  // cube.position.add(new Vector3(-40, 0, -40))
  
  // cube.position.addScalar(1)

  // cube.position.addScaledVector(new Vector3(-40, 0, -40), 1)

  // cube.position.addVectors(new Vector3(-20, 0, -20), new Vector3(20, 0, 20))

  // const a = new THREE.Euler(1, 1, 1)

  // cube.position.applyEuler(a);

  // const test = (x, y, z);
  // const res = ( (1x + 2y + 3z), (4x + 5y + 6z), (7x + 8y + 9z) )

  // const m3 = new Matrix3();
  // m3.set(
  //   1, 2, 3, 
  //   4, 5, 6, 
  //   7, 8, 9
  // )
  // cube.position.applyMatrix3(m3)
  // console.log(m3)

  // const test = (x, y, z);
  // const w = (1111x + 2222y + 3333z + 4444)
  // const res = ( ((1x + 2y + 3z + 4) / w), ((11x + 22y + 33z + 44) / w), ((111x + 222y + 333z + 444) / w) )

  // const m4 = new Matrix4();
  // m4.set(
  //   1, 2, 3, 4, 
  //   11,22, 33, 44, 
  //   111, 222, 333, 444, 
  //   1111, 2222, 3333, 4444
  // )
  // cube.position.applyMatrix4(m4)
  // console.log(m4)


  scene.add(cube)

  const cubeHelper = new THREE.AxesHelper(100)
  cubeHelper.position.copy(cube.position)
  cubeHelper.rotation.copy(cube.rotation)
  scene.add(cubeHelper)

  console.log(cube)



  const directionalLigtht = new THREE.DirectionalLight(0xffffff, 0.7)
  directionalLigtht.position.set(180, 180, 0)
  scene.add(directionalLigtht)
  // eslint-disable-next-line prefer-const
  orbitControls = new OrbitControls(camera, document.body)
  document.body.appendChild(renderer.domElement)

  render()

  function render() {
    orbitControls.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
}