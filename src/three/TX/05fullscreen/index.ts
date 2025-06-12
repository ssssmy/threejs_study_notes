import * as THREE from 'three'
import { AxesHelper, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const initScene = function (): void {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  camera.position.set(150, 150, 0);
  camera.lookAt(new Vector3(0, 0, 0));
  const renderer = new THREE.WebGL1Renderer();
  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cube.position.x = 0;
  cube.position.y = 0;
  cube.position.z = 10;

  const cubeHelper = new AxesHelper(50);
  cubeHelper.position.set(0,0,0);

  scene.add(cubeHelper);

  scene.add(cube);

  // eslint-disable-next-line prefer-const
  document.body.appendChild(renderer.domElement);

  // 轨道控制器
  const orbitControls: OrbitControls = new OrbitControls(camera, document.body);
  // 设置控制器阻尼
  orbitControls.enableDamping = true;

  function render() {

    orbitControls.update();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();

  // 监听画面变化，更新渲染画面
  window.addEventListener('resize', () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  })

  // 双击控制全屏与退出全屏
  window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      renderer.domElement.requestFullscreen();
    }
    // renderer.domElement.requestFullscreen();
    // document.exitFullscreen();
  })

}