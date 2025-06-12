import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import dat from 'dat.gui'
import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

export const initScene = function (): void {  
  const scene = new THREE.Scene();

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-25, 30, -40);
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( (time: any) => {
    const mesh = scene.getObjectByName( 'meshKnot' );
    if (mesh) {
      mesh.rotation.y = time / 1000;
    }
    renderer.render( scene, camera );
  });
  renderer.outputEncoding = THREE.sRGBEncoding;

  RectAreaLightUniformsLib.init();

  const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 4, 10 );
  rectLight1.position.set( - 5, 5, 5 );
  scene.add( rectLight1 );

  const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
  rectLight2.position.set( 0, 5, 5 );
  scene.add( rectLight2 );

  const rectLight3 = new THREE.RectAreaLight( 0x0000ff, 5, 4, 10 );
  rectLight3.position.set( 5, 5, 5 );
  scene.add( rectLight3 );

  scene.add( new RectAreaLightHelper( rectLight1 ) );
  scene.add( new RectAreaLightHelper( rectLight2 ) );
  scene.add( new RectAreaLightHelper( rectLight3 ) );

  const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
  const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
  const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
  scene.add( mshStdFloor );

  const geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 200, 16 );
  const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
  const meshKnot = new THREE.Mesh( geoKnot, matKnot );
  meshKnot.name = 'meshKnot';
  meshKnot.position.set( 0, 5, 0 );
  scene.add( meshKnot );

  // const axes = new THREE.AxesHelper(60);
  // scene.add(axes);
 
  // 轨道控制器
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);
    
  const renderScene = () => {
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if ( hasControlsUpdated ) {
      console.log(camera.position)
      renderer.render( scene, camera );
    }
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
