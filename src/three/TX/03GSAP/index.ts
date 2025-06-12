import * as THREE from 'three'
import { AxesHelper, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 导入动画库
import gsap from 'gsap';

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

  const orbitControls: OrbitControls = new OrbitControls(camera, document.body);

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



  const clock = new THREE.Clock();

  // 设置动画
  const animation1 = gsap.to(cube.position, {x: 50, duration: 5, ease: 'power1.inOut', repeat: -1, yoyo: true, delay: 0, onComplete: () => {
    console.log('动画完成');
  }, onStart: () => {
    console.log('动画开始');
  }})
  // gsap.to(cube.rotation, {x: 1 * Math.PI, duration: 5, ease: 'power1.inOut'})
  window.addEventListener('dblclick', () => {
    if (animation1.isActive()) {
      animation1.pause();
    } else {
      animation1.resume();
    }
  })


 
  // eslint-disable-next-line prefer-const
  document.body.appendChild(renderer.domElement);


  function render() {

    orbitControls.update();

    // 获取时钟运行的总时长
    const time = clock.getElapsedTime();
    // console.log("时钟运行总时长：", time);
    // 两次获取时间的间隔时间
    const deltaTime = clock.getDelta();
    // console.log("两次获取时间的间隔时间", deltaTime);

    // const t = time % 5
    // cube.position.x = t * 10


    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();

}