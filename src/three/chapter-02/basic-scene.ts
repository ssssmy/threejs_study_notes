import * as THREE from "three";
import dat from 'dat.gui'

export const initScene = function (): void {  
  // 创建一个场景对象
  const scene = new THREE.Scene();
  // 添加雾化
  // scene.fog = new THREE.Fog(0x000000, 0.015, 100);
  scene.fog = new THREE.FogExp2(0x000000, 0.015);

  // 创建一个透视摄像机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // 设置透视摄像机在Z轴上的距离（它与我们屏幕春指的距离）
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  // 创建一个渲染器
  const renderer = new THREE.WebGLRenderer();
  // 启用阴影
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 创建一个坐标系
  const axes = new THREE.AxesHelper(60);
  scene.add(axes);

  // 创建一个地板
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  // 作为地面接受阴影的对象，必须设置 receiveShadow 的属性为真
  plane.receiveShadow = true;
  scene.add(plane);

  // 制作三维物体投影效果
  // 创建有产应阴影的光源，创建聚光灯光源对象
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-30, 40, -30)
  // 需要设置 castShadow 为真，才会让聚光灯产生阴影
  spotLight.castShadow = true;
  // 设置阴影效果
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight)

  // 创建 Lambert 光源（该光源没有特殊的来源方向，并且他不会生成阴影，所以不能作为唯一光源）
  const ambienLight = new THREE.AmbientLight(0xAAAAAA);
  scene.add(ambienLight);


  // let step = 0;
  const ctrlObj = {
    // 设置旋转对象
    rotationStep: 0.02,
    // 场景中对象数组长度
    numberofObject: scene.children.length,
    // 移除对象
    removeCube: () => {
      const allChildren = scene.children;
      const lastObject = allChildren[scene.children.length - 1];
      if (lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject);
        ctrlObj.numberofObject = scene.children.length
      }
    },
    // 添加对象
    addCube: () => {
      const cubeSize = Math.ceil(Math.random() * 3)
      // 创建一个立方几何体
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      // 创建一个材质
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color()
        // wireframe: true,
      });
      // 把立方体和基础材质进行组合后，创建出一个新的网格对象
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
      cube.position.y = Math.round(Math.random() * 30);
      cube.position.z = Math.round(Math.random() * planeGeometry.parameters.height);
      // 设置立方体的 castShadow 为真(启用阴影)
      cube.castShadow = true;
      // 把立方体网格添加到场景
      scene.add(cube);
      ctrlObj.numberofObject = scene.children.length
    },
    // 输出场景中对象
    outputObject: () => {
      console.log(scene.children)
    }
  }
  // 创建 datGUI对象
  const ctrl = new dat.GUI();
  ctrl.add(ctrlObj, 'rotationStep', 0, 0.5)
  ctrl.add(ctrlObj, 'numberofObject').listen()
  ctrl.add(ctrlObj, 'removeCube')
  ctrl.add(ctrlObj, 'addCube')
  ctrl.add(ctrlObj, 'outputObject')


  // 封装一个刷新页面的方法
  const renderScene = () => {
    scene.traverse(function (obj) {
      if (obj instanceof THREE.Mesh && obj != plane) {
          obj.rotation.x += ctrlObj.rotationStep;
          obj.rotation.y += ctrlObj.rotationStep;
          obj.rotation.z += ctrlObj.rotationStep;
      }
    });
    // 将场景和摄像机传入渲染器
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene()

  // 加入页面
  document.body.appendChild(renderer.domElement);

};
