<template>
  <div class="home">
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { ref } from 'vue';

const deltaY = ref(0)

window.addEventListener('mousewheel', function(e: any) {
  if (e.deltaY > 0) {
    deltaY.value += 0.01
  } else {
    deltaY.value -= 0.01
  }
})

// 创建一个场景对象
const scene = new THREE.Scene();
// 添加雾化
// scene.fog = new THREE.Fog(0x000000, 0.015, 100);
scene.fog = new THREE.FogExp2(0x000000, 0.015);

// 创建一个透视摄像机
const camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16,  -200, 600)
// 设置透视摄像机在Z轴上的距离（它与我们屏幕春指的距离）
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 0;
camera.lookAt(scene.position);

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建一个坐标系
const axes = new THREE.AxesHelper(60);
scene.add(axes);

// 圆柱几何体
const cylinderGeo1 = new THREE.CylinderGeometry(window.innerWidth/8/Math.sqrt(3),window.innerWidth/8/Math.sqrt(3),window.innerHeight/8,160,4,true,0,Math.PI*2/3);
const cylinderMat1 = new THREE.MeshLambertMaterial({color:0xff0000, opacity:0.1, transparent:true});
const cylinder1 = new THREE.Mesh(cylinderGeo1, cylinderMat1);
scene.add(cylinder1);
// 圆柱几何体
const cylinderGeo2 = new THREE.CylinderGeometry(window.innerWidth/8/Math.sqrt(3),window.innerWidth/8/Math.sqrt(3),window.innerHeight/8,160,4,true,Math.PI*2/3,Math.PI*2/3);
const cylinderMat2 = new THREE.MeshLambertMaterial({color:0x00ff00, opacity:0.1, transparent:true});
const cylinder2 = new THREE.Mesh(cylinderGeo2, cylinderMat2);
scene.add(cylinder2);
// 圆柱几何体
const cylinderGeo3 = new THREE.CylinderGeometry(window.innerWidth/8/Math.sqrt(3),window.innerWidth/8/Math.sqrt(3),window.innerHeight/8,160,4,true, -Math.PI*2/3,Math.PI*2/3);
const cylinderMat3 = new THREE.MeshLambertMaterial({color:0x0000ff, opacity:0.1, transparent:true});
const cylinder3 = new THREE.Mesh(cylinderGeo3, cylinderMat3);
scene.add(cylinder3);

// 制作三维物体投影效果
// 创建有产应阴影的光源，创建聚光灯光源对象
const spotLight = new THREE.SpotLight(0xffffff, 200);
spotLight.position.set(-30, 40, -30)
scene.add(spotLight)

// 创建 Lambert 光源（该光源没有特殊的来源方向，并且他不会生成阴影，所以不能作为唯一光源）
const ambienLight = new THREE.AmbientLight(0xffffff, 200);
scene.add(ambienLight);


// 添加轨道控制器
// const clock = new THREE.Clock();
// const cameraControls = new CameraControls(camera, renderer.domElement);

// let step = 0;
// 封装一个刷新页面的方法
const renderScene = () => {

  // step += 0.001;


  camera.rotation.y = Math.PI * (deltaY.value);
  spotLight.position.copy(camera.position);
  ambienLight.position.copy(camera.position);

  // const delta = clock.getDelta();
  // const hasControlsUpdated = cameraControls.update(delta);
  // if ( hasControlsUpdated ) {
  //   renderer.render( scene, camera );
  // }

  // 将场景和摄像机传入渲染器
  renderer.render(scene, camera);
  requestAnimationFrame(renderScene);
}
renderScene()

// 加入页面
document.body.appendChild(renderer.domElement);


</script>

<style>
.home{
  position: fixed;
  z-index: 999;
  width: 100%;
}
</style>
