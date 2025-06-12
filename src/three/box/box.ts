import * as THREE from "three";

import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter";


export const initScene = function (): void {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const redGeometry = new THREE.BoxGeometry(8,8,8);
  const redMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
  const redCube = new THREE.Mesh(redGeometry,redMaterial);
  // redCube.position.x = 3;
  // redCube.position.y = 3;
  // redCube.position.z = 3;

  redGeometry.computeBoundingBox();
  // const redBox = redGeometry.boundingBox as THREE.Box3;
  const redBox = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());

  redBox.setFromObject(redCube);
  const redBoxHelper = new THREE.BoxHelper(redCube, 0x000000);

  redCube.add(redBoxHelper);
  scene.add(redCube);
  
  // --------------------------------------------------------------------------------------------------------------------------------

  const blueGeometry = new THREE.BoxGeometry(8,7,10);
  const blueMaterial = new THREE.MeshBasicMaterial({color:0x0000ff});
  const blueCube = new THREE.Mesh(blueGeometry,blueMaterial);
  // blueCube.position.x = 3;
  // blueCube.position.y = 3;
  // blueCube.position.z = 3;

  blueGeometry.computeBoundingBox();
  // const blueBox = redGeometry.boundingBox as THREE.Box3;
  const blueBox = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());

  blueBox.setFromObject(blueCube);
  const blueBoxHelper = new THREE.BoxHelper(blueCube, 0x000000);

  blueCube.add(blueBoxHelper);
  scene.add(blueCube);


  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  document.body.appendChild(renderer.domElement);

  
  const exporter = new ColladaExporter();
  const data = exporter.parse(scene, (res) => {
    console.log("res", res)
  }, {});
  function downFlie(data: any) {
    // 创建a标签
    const elementA = document.createElement('a');
    
    //文件的名称为时间戳加文件名后缀
    elementA.download = +new Date() + ".dae";
    elementA.style.display = 'none';
    
    //生成一个blob二进制数据，内容为json数据
    const blob = new Blob([JSON.stringify(data)]);
    //生成一个指向blob的URL地址，并赋值给a标签的href属性
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  }
  downFlie(data)

  
  const animate = () => {
      requestAnimationFrame(animate);
      redCube.position.x = Math.sin(Date.now()*0.001)*10;
      redBox.setFromObject(redCube);
      blueCube.position.x = Math.sin(Date.now()*0.001)*-10;
      blueBox.setFromObject(blueCube);

      // if (redBox.intersectsBox(blueBox)){
      //   console.log('相交');
      // } else {
      //   console.log('不相交');
      // }
      renderer.render(scene,camera);
  }
  animate();
};