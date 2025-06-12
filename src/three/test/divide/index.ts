import * as THREE from "three";
import dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const initScene = function (): void {  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  // scene.fog = new THREE.Fog(0x3f7b9d, 0, 60)


  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  camera.position.set(1000, 1000, 1000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  const renderer = new THREE.WebGL1Renderer();
  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const orbitControls: OrbitControls = new OrbitControls(camera, document.body);

  const axes = new THREE.AxesHelper(1000);
  scene.add(axes);

  const ctrlObj = {
    index: 0,
    /**
     * 封装一些方法用于向场景中添加一些正方体
     */
    addCube: function(){
      const layerGroup = scene.getObjectByName('layerGroup')
      const cubeHeight = Math.floor(15 + Math.random() * (30 - 15))
      const cubeGeo = new THREE.BoxGeometry(Math.floor(15 + Math.random() * (30 - 15)), cubeHeight, Math.floor(15 + Math.random() * (30 - 15)));
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, opacity: 0.6 });
      cubeMaterial.transparent = true;
      const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
      cube.name = 'workpiece';
      // cube.position.set(0, 0, 0);
      cube.position.x = Math.floor(50 + Math.random() * (250 - 50));
      cube.position.y = cubeHeight / 2;
      cube.position.z = Math.floor(50 + Math.random() * (250 - 50));
      layerGroup && layerGroup.add(cube);
      this.index++;
    },
    /**
     * 封装一些方法用于向场景中删除一些正方体
     */
    clearCube: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        layerGroup.clear()
      }
    },
    /**
     * 添加tray
     */
    addTray: function(){
      // 托盘
      const trayGroup = new THREE.Group();
      trayGroup.name = 'tray'

      // 托盘几何体
      const cubeGeo = new THREE.BoxGeometry(300, 100, 300);
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });
      const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
      cubeGeo.translate(150, 0, 150)
      cube.position.x = 220
      cube.position.y = 50;
      cube.position.z = 220;
      cube.name = 'trayGeometry';
      trayGroup.add(cube);

      // 基准面
      const planeGeo = new THREE.BoxGeometry(300, 1, 300);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const plane = new THREE.Mesh(planeGeo, planeMaterial);
      planeGeo.translate(150, 0, 150)
      plane.position.x = 220
      plane.position.y = 100;
      plane.position.z = 220;
      plane.name = 'plane';
      trayGroup.add(plane);

      // 垛型
      const stackTypeGroup = new THREE.Group();
      stackTypeGroup.name = 'stackTypeGroup';
      plane.add(stackTypeGroup)
      
      // 层
      const layerGroup = new THREE.Group();
      layerGroup.name = 'layerGroup';
      stackTypeGroup.add(layerGroup)

      scene.add(trayGroup);
    },
    /**
     * 基准面左对齐
     */
    leftAlignment1: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.forEach((workpiece) => {
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpiece);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpiece.position.x = v.x / 2;
        })
      }
    },
    /**
     * 左对齐
     */
    leftAlignment2: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.sort(function(a, b) {
          if (a.position.x > b.position.x) {
            return 1;
          } else if (a.position.x < b.position.x) {
            return -1;
          } else {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          }
        })
        for (let index = 1; index < workpieceArr.length; index++) {
          // 方块包围盒
          const box0 = new THREE.Box3().setFromObject(workpieceArr[0]);
          // 长、宽、高
          const v0 = {
            x: Math.abs(box0.max.x - box0.min.x),
            y: Math.abs(box0.max.y - box0.min.y),
            z: Math.abs(box0.max.z - box0.min.z),
          };
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpieceArr[index].position.x = box0.min.x - scene.getObjectByName('trayGeometry')!.position.x + v.x / 2
          // workpieceArr[index].position.x = workpieceArr[0].position.x
        }
      }
    },
    /**
     * 基准面右对齐
     */
    rightAlignment1: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.forEach((workpiece) => {
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpiece);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpiece.position.x = 300 - v.x / 2;
        })
      }
    },
    /**
     * 右对齐
     */
    rightAlignment2: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.sort(function(a, b) {
          if (a.position.x > b.position.x) {
            return -1;
          } else if (a.position.x < b.position.x) {
            return 1;
          } else {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          }
        })
        for (let index = 1; index < workpieceArr.length; index++) {
          // 方块包围盒
          const box0 = new THREE.Box3().setFromObject(workpieceArr[0]);
          // 长、宽、高
          const v0 = {
            x: Math.abs(box0.max.x - box0.min.x),
            y: Math.abs(box0.max.y - box0.min.y),
            z: Math.abs(box0.max.z - box0.min.z),
          };
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpieceArr[index].position.x = box0.max.x - scene.getObjectByName('trayGeometry')!.position.x - v.x / 2
        }
      }
    },
    /**
     * 基准面上对齐
     */
    topAlignment1: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.forEach((workpiece) => {
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpiece);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpiece.position.z = v.z / 2;
        })
      }
    },
    /**
     * 上对齐
     */
     topAlignment2: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.sort(function(a, b) {
          if (a.position.z > b.position.z) {
            return 1;
          } else if (a.position.z < b.position.z) {
            return -1;
          } else {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          }
        })
        for (let index = 1; index < workpieceArr.length; index++) {
          // 方块包围盒
          const box0 = new THREE.Box3().setFromObject(workpieceArr[0]);
          // 长、宽、高
          const v0 = {
            x: Math.abs(box0.max.x - box0.min.x),
            y: Math.abs(box0.max.y - box0.min.y),
            z: Math.abs(box0.max.z - box0.min.z),
          };
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpieceArr[index].position.z = box0.min.z - scene.getObjectByName('trayGeometry')!.position.z + v.z / 2
        }
      }
    },
    /**
     * 基准面下对齐
     */
    bottomAlignment1: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.forEach((workpiece) => {
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpiece);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpiece.position.z = 300 - v.z / 2;
        })
      }
    },
    /**
     * 下对齐
     */
    bottomAlignment2: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        workpieceArr.sort(function(a, b) {
          if (a.position.z > b.position.z) {
            return -1;
          } else if (a.position.z < b.position.z) {
            return 1;
          } else {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          }
        })
        for (let index = 1; index < workpieceArr.length; index++) {
          // 方块包围盒
          const box0 = new THREE.Box3().setFromObject(workpieceArr[0]);
          // 长、宽、高
          const v0 = {
            x: Math.abs(box0.max.x - box0.min.x),
            y: Math.abs(box0.max.y - box0.min.y),
            z: Math.abs(box0.max.z - box0.min.z),
          };
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          workpieceArr[index].position.z = box0.max.z - scene.getObjectByName('trayGeometry')!.position.z - v.z / 2
        }
      }
    },
    /**
     * 横向均分
     */
    TransverseDivide: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        // 排序
        workpieceArr.sort(function(a, b) {
          if (a.position.x > b.position.x) {
            return 1;
          } else if (a.position.x < b.position.x) {
            return -1;
          } else {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          }
        })
        // 计算间距
        const spaceBoxFirst = new THREE.Box3().setFromObject(workpieceArr[0]);
        const spaceBoxLength = new THREE.Box3().setFromObject(workpieceArr[workpieceArr.length - 1]);
        // 去除首位的所有工件宽度
        let vAll = 0;
        for (let index = 1; index < workpieceArr.length - 1; index++) {
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          vAll += v.x
        }
        const space = (spaceBoxLength.min.x - spaceBoxFirst.max.x - vAll) / (workpieceArr.length - 1)

        // 计算位置
        for (let index = 1; index < workpieceArr.length - 1; index++) {
          // 方块包围盒
          const boxA = new THREE.Box3().setFromObject(workpieceArr[index - 1]);
          // 长、宽、高
          const v0 = {
            x: Math.abs(boxA.max.x - boxA.min.x),
            y: Math.abs(boxA.max.y - boxA.min.y),
            z: Math.abs(boxA.max.z - boxA.min.z),
          };
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };

          workpieceArr[index].position.x = boxA.max.x - scene.getObjectByName('trayGeometry')!.position.x + space + v.x / 2
        }
      }
    },
    /**
     * 纵向均分
     */
    LongitudinalDivide: function(){
      const layerGroup = scene.getObjectByName('layerGroup');
      if (layerGroup) {
        const workpieceArr = layerGroup.children
        // 排序
        workpieceArr.sort(function(a, b) {
          if (a.position.z > b.position.z) {
            return 1;
          } else if (a.position.z < b.position.z) {
            return -1;
          } else {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          }
        })
        // 计算间距
        const spaceBoxFirst = new THREE.Box3().setFromObject(workpieceArr[0]);
        const spaceBoxLength = new THREE.Box3().setFromObject(workpieceArr[workpieceArr.length - 1]);
        // 去除首位的所有工件宽度
        let vAll = 0;
        for (let index = 1; index < workpieceArr.length - 1; index++) {
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };
          vAll += v.z
        }
        const space = (spaceBoxLength.min.z - spaceBoxFirst.max.z - vAll) / (workpieceArr.length - 1)

        // 计算位置
        for (let index = 1; index < workpieceArr.length - 1; index++) {
          // 方块包围盒
          const boxA = new THREE.Box3().setFromObject(workpieceArr[index - 1]);
          // 长、宽、高
          const v0 = {
            x: Math.abs(boxA.max.x - boxA.min.x),
            y: Math.abs(boxA.max.y - boxA.min.y),
            z: Math.abs(boxA.max.z - boxA.min.z),
          };
          // 方块包围盒
          const box = new THREE.Box3().setFromObject(workpieceArr[index]);
          // 长、宽、高
          const v = {
            x: Math.abs(box.max.x - box.min.x),
            y: Math.abs(box.max.y - box.min.y),
            z: Math.abs(box.max.z - box.min.z),
          };

          workpieceArr[index].position.z = boxA.max.z - scene.getObjectByName('trayGeometry')!.position.z + space + v.z / 2
        }
      }
    }
  }
  const ctrl = new dat.GUI();
  const add = ctrl.addFolder('设置托盘与工件');
  add.add(ctrlObj, 'addCube');
  add.add(ctrlObj, 'clearCube');
  add.add(ctrlObj, 'addTray');
  const planeAlignment = ctrl.addFolder('向基准面对齐');
  planeAlignment.add(ctrlObj, 'leftAlignment1');
  planeAlignment.add(ctrlObj, 'rightAlignment1');
  planeAlignment.add(ctrlObj, 'topAlignment1');
  planeAlignment.add(ctrlObj, 'bottomAlignment1');
  const defaultAlignment = ctrl.addFolder('默认对齐');
  defaultAlignment.add(ctrlObj, 'leftAlignment2');
  defaultAlignment.add(ctrlObj, 'rightAlignment2');
  defaultAlignment.add(ctrlObj, 'topAlignment2');
  defaultAlignment.add(ctrlObj, 'bottomAlignment2');
  const divide = ctrl.addFolder('均分');
  divide.add(ctrlObj, 'TransverseDivide');
  divide.add(ctrlObj, 'LongitudinalDivide');

  

  const renderScene = () => {
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
