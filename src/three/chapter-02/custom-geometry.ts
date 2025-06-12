import * as THREE from "three";
import dat from 'dat.gui'

export const initScene = function (): void {  
  // 创建一个场景对象
  const scene = new THREE.Scene();

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

  // 自定义几何体
  const bufferGeometry = new THREE.BufferGeometry();
  // 创建点数组
  const vertices = new Float32Array([
      //第一个面
      0,0,0,
      10,0,0,
      0,10,0,
      10,0,0,
      0,10,0,
      10,10,0,
      //第二个面
      0,0,0,
      0,10,0,
      0,10,10,
      0,10,10,
      0,0,0,
      0,0,10,
      //第三个面
      10,0,0,
      10,10,0,
      10,10,10,
      10,0,0,
      10,0,10,
      10,10,10,
      //第四个面
      0,0,0,
      0,0,10,
      10,0,0,
      10,0,0,
      10,0,10,
      0,0,10,
      //第五个面
      0,10,0,
      0,10,10,
      10,10,0,
      10,10,0,
      10,10,10,
      0,10,10,
      //第六个面
      0,0,10,
      10,0,10,
      0,10,10,
      10,0,10,
      0,10,10,
      10,10,10,
  ]);
  // 新建 BufferAttribute 类存储与 BufferGeometry 关联的属性
  const attribue = new THREE.BufferAttribute(vertices, 3);
  // 把 BufferAttribute 对象设置几何体的位置
  bufferGeometry.setAttribute('position',attribue)
  // 给自定义几何体新建材质，我们需要该几何体两面均可视
  // 要使用两面均可视材质的话，需要导入 DobbleSide 属性
  const bufferMaterial = new THREE.MeshBasicMaterial({ 
      color: 'red',
      side: THREE.DoubleSide,
  })
  // const bufferMaterial = [
  //   new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x002299, wireframe: true, side: THREE.DoubleSide,}),
  //   new THREE.MeshBasicMaterial({color: 0x002299, wireframe: true, side: THREE.DoubleSide,})
  // ]
  // 合并为网格，添加到场景
  const bufferMesh = new THREE.Mesh(bufferGeometry, bufferMaterial);
  bufferMesh.name = 'bufferGeometry';
  scene.add(bufferMesh);
  // 为了让这个立方体更加立体，我们给他添加线条
  // 先通过几何体对象来构造一个线条框架
  const wireFrame = new THREE.WireframeGeometry(bufferGeometry)
  // 新建框架的线条
  const line = new THREE.LineSegments(wireFrame);
  // 对线条的材质属性进行修改
  // depthTest 属性表示允许修改深度测试
  // line.material.depthTest = true;
  // transparent 属性表示该线条的透明与否
  // line.material.transparent = false;
  // 当 transparent 属性为真时， opacity 才会生效，否则无效
  // line.material.opacity = 0.25;
  // 将线条添加到场景
  scene.add(line)
  

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


  // 用于保存网格属性值
  const ctrlObjCube = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    positionX: -20,
    positionY: 10,
    positionZ: 10,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    visible: true,
    translateX: 0,
    translateY: 0,
    translateZ: 0
  }
  const ctrlCube = new dat.GUI();
  ctrlCube.add(ctrlObjCube, 'scaleX', 0, 5)
  ctrlCube.add(ctrlObjCube, 'scaleY', 0, 5)
  ctrlCube.add(ctrlObjCube, 'scaleZ', 0, 5)
  // 添加 position 属性，其决定对象相对于父对象的位置
  // 通常父对象是 THREE.Scene对象 或者是 THREE.Object3D对象
  ctrlCube.add(ctrlObjCube, 'positionX', -30, 30)
  ctrlCube.add(ctrlObjCube, 'positionY', -30, 30)
  ctrlCube.add(ctrlObjCube, 'positionZ', -30, 30)
  // 添加 rotation 属性
  ctrlCube.add(ctrlObjCube, 'rotationX', -5, 5)
  ctrlCube.add(ctrlObjCube, 'rotationY', -5, 5)
  ctrlCube.add(ctrlObjCube, 'rotationZ', -5, 5)
  // 添加 visible 属性 控制显示隐藏
  ctrlCube.add(ctrlObjCube, 'visible')
  // 添加 translateX 属性
  ctrlCube.add(ctrlObjCube, 'translateX', -25, 25)
  ctrlCube.add(ctrlObjCube, 'translateY', -25, 25)
  ctrlCube.add(ctrlObjCube, 'translateZ', -25, 25)


  // 封装一个刷新页面的方法
  const renderScene = () => {
    // 对对象进行属性替换
    bufferMesh.scale.set(ctrlObjCube.scaleX, ctrlObjCube.scaleY, ctrlObjCube.scaleZ)
    bufferMesh.position.set(ctrlObjCube.positionX, ctrlObjCube.positionY, ctrlObjCube.positionZ)
    bufferMesh.rotation.set(ctrlObjCube.rotationX, ctrlObjCube.rotationY, ctrlObjCube.rotationZ)
    bufferMesh.visible = ctrlObjCube.visible
    bufferMesh.translateX(ctrlObjCube.translateX)
    bufferMesh.translateY(ctrlObjCube.translateY)
    bufferMesh.translateZ(ctrlObjCube.translateZ)
    line.scale.set(ctrlObjCube.scaleX, ctrlObjCube.scaleY, ctrlObjCube.scaleZ)
    line.position.set(ctrlObjCube.positionX, ctrlObjCube.positionY, ctrlObjCube.positionZ)
    line.rotation.set(ctrlObjCube.rotationX, ctrlObjCube.rotationY, ctrlObjCube.rotationZ)
    line.visible = ctrlObjCube.visible
    line.translateX(ctrlObjCube.translateX)
    line.translateY(ctrlObjCube.translateY)
    line.translateZ(ctrlObjCube.translateZ)

    // 将场景和摄像机传入渲染器
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene()

  // 加入页面
  document.body.appendChild(renderer.domElement);

};
