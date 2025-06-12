import * as THREE from "three";
import dat from 'dat.gui'

export const initScene = function (): void {  
  // 创建一个场景对象
  const scene = new THREE.Scene();

  // 创建一个透视摄像机
  let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // 设置透视摄像机在Z轴上的距离（它与我们屏幕春指的距离）
  camera.position.x = -30;     
  camera.position.y = 80;
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

  // 创建一个地面，接受立方体投影
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  // 新建一个 Lambert 材质，指定颜色。(需要 Lambert 光源)
  // 这个材质可以接受并反射场景中各种光源发射出来的光线
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xAAAAAA })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  // 旋转 90°
  plane.rotation.x = -0.5 * Math.PI;
  // 位置
  plane.position.set(15, 0, 0)
  // 作为地面接受阴影的对象，必须设置 receiveShadow 的属性为真
  plane.receiveShadow = true;
  // 添加地面网格到场景
  scene.add(plane);

  // 将地板铺上 5x5 方格
  for (let i = 0; i < (planeGeometry.parameters.height / 5); i++) {
    for (let j = 0; j < (planeGeometry.parameters.width / 5); j++) {
      // 创建一个正方体
      const cubeGeo = new THREE.BoxGeometry(4, 4, 4);
      const cubeMaterial = new THREE.MeshLambertMaterial();
      cubeMaterial.color = new THREE.Color(0, Math.random() * 0.25 + 0.5, 0.5);
      const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial); 

      cubeMesh.position.x = -(planeGeometry.parameters.width / 2) + 18 + (j * 5);
      cubeMesh.position.z = -(planeGeometry.parameters.height / 2) + 2 + (i * 5);
      cubeMesh.position.y = 2; 

      scene.add(cubeMesh);
    }
  }

  // 添加平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff,0.7)
  // 添加阴影
  directionalLight.castShadow = true;
  // 设置阴影属性
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048; 
  // 调整光源位置
  directionalLight.position.set(-20, 40, 60)
  scene.add(directionalLight)
  
  const ctrlObj = {
    showText: '透视投影摄像机',
    changeCamera: () => {
      if (camera instanceof THREE.PerspectiveCamera){
          camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16,  -200, 500)
          camera.position.x = -30;     
          camera.position.y = 80;
          camera.position.z = 30;
          camera.lookAt(scene.position); 
          ctrlObj.showText = '正交投影摄像机';
      } else {
          camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
          camera.position.x = -30;     
          camera.position.y = 80;
          camera.position.z = 30;
          camera.lookAt(scene.position); 
          ctrlObj.showText = '透视投影摄像机';
      }
    }
  }

  const ctrl = new dat.GUI();
  ctrl.add(ctrlObj, 'showText').listen();
  ctrl.add(ctrlObj, 'changeCamera');

  // 创建一个焦点球
  const focusOnTheBall = new THREE.SphereGeometry(2)
  const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const focusBallMesh = new THREE.Mesh(focusOnTheBall, ballMaterial)
  focusBallMesh.position.y = 10;
  scene.add(focusBallMesh)

  let pos = 0;
  // 封装一个刷新页面的方法
  const renderScene = () => {
    // 改变相机lookAt
    pos += 0.01
    // 通过正弦函数使得该正方体能够在X轴方向上来回移动
    focusBallMesh.position.x = 10 + (100 * (Math.sin(pos)))
    camera.lookAt(focusBallMesh.position)

    // 将场景和摄像机传入渲染器
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene()

  // 加入页面
  document.body.appendChild(renderer.domElement);

};
