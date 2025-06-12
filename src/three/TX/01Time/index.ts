import * as THREE from 'three'
import { AxesHelper, MathUtils, Matrix3, Mesh, Scene, Vector3 } from 'three'

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

  render();

  function render() {
    const time = requestAnimationFrame(render);
    const v = 20;
    const t = time / 1000 %5;
    console.log(time);
    

    cube.position.z = t * v;
    cube.rotation.z = t * v;
    cube.scale.y = t * v;
    if(cube.position.z > 30)
    {
        cube.position.z = 10;
        cube.position.z = t * v;
    }
    if(cube.scale.y > 5)
    {
        cube.scale.y = 1;
        // cube.scale.y = t * v;
    }
    // requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
