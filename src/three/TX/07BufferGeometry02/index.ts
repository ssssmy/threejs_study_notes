import * as THREE from 'three'
import { AxesHelper, Vector3 } from 'three'
import dat from 'dat.gui'
import gsap from 'gsap';

import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );


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


  for (let index = 0; index < 50; index++) {
    // 每个三角形需要三个顶点，每个顶点需要三个值
    const cubeGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(9)
    for (let j = 0; j < 9; j++) {
      vertices[j] = Math.random() * 50 - 25
    }
     // 每三个值作为一个坐标
    cubeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) });
    cubeMaterial.transparent = true;
    cubeMaterial.opacity = 0.6;
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
  }

  const cubeHelper = new AxesHelper(50);
  cubeHelper.position.set(0,0,0);
  scene.add(cubeHelper);

  // eslint-disable-next-line prefer-const
  document.body.appendChild(renderer.domElement);

  
  // 设置动画
  // const animation1 = gsap.to(cube.position, {x: 50, duration: 5, ease: 'power1.inOut', repeat: -1, yoyo: true, delay: 0})
  // const params = {
  //   positionX: cube.position.x,
  //   color: '#0000ff',
  //   isVisible: true,
  //   fn: () => {
  //     if (animation1.isActive()) {
  //       animation1.pause();
  //     } else {
  //       animation1.resume();
  //     }
  //   },
  //   wireframe: false
  // }

  // const ctrl = new dat.GUI();
  // 修改物体位置
  // ctrl.add(params, 'positionX').min(0).max(100).step(0.01).name('移动X轴坐标').onChange((value: number) => {
  //   cube.position.x = value;
  // }).onFinishChange((value: number) => {
  //   console.log('停止修改:', value)
  // })
  // // 设置按钮触发事件
  // ctrl.add(params, 'fn').name('控制运动')
  // // 添加文件夹
  // const folder = ctrl.addFolder('设置物体属性')
  // // 修改物体颜色
  // folder.addColor(params, 'color').onChange((value: string) => {
  //   cube.material.color.set(new THREE.Color(value))
  // }).name('修改物体颜色')
  // // 设置选项框
  // folder.add(params, 'isVisible').onChange((value: boolean) => {
  //   cube.visible = value;
  // }).name('是否显示物体')
  // folder.add(params, 'wireframe').onChange((value: boolean) => {
  //   cube.material.wireframe = value
  // }).name('是否显示物体线框')


  // 轨道控制器
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);
  
  function render() {
    // orbitControls.update();
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if ( hasControlsUpdated ) {
      renderer.render(scene, camera);
    }
    
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
}