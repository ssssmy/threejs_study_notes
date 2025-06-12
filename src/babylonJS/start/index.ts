import * as BABYLON from 'babylonjs';


export const initScene = function (): void {  
    const canvas = document.createElement("canvas");   // 创建画布
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.padding = '0';
    canvas.style.margin = '0';
    canvas.style.overflow = 'unset';
    canvas.style.border = 'none';
    canvas.style.outline = 'none';
    canvas.style.display = 'block';
    document.body.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas, true);   // 创建渲染引擎

    const create_scene = function(){

        // 创建一个场景并返回
        const scene = new BABYLON.Scene(engine);  // 创建场景
        scene.useRightHandedSystem = true

        /* 创建一个弧形旋转摄像机. 参数说明如下:
        * "Camera": 摄像机名称
        * 第一个 Math.PI / 2 : alpha, 可以理解为水平角度.具体请看文档
        * 第二个 Math.PI / 2 : beta, 可以理解为垂直角度.具体请看文档
        * 2: radius, 这个是半径的意思.
        * new BABYLON.Vector3(0, 0, 5) : target position.目标点的三维位置,可以理解为中心.这是一个向量类的实例
        * scene: scene,场景变量.
        * 详细文档请看这里: 看着图比较好理解的.https://doc.babylonjs.com/babylon101/cameras#arc-rotate-camera
        */
        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene);

        /* 让摄像机控制画布.
        * canvas: element 是一个dom对象.
        * true: noPreventDefault 是否阻止元素的默认事件.
        * api: https://doc.babylonjs.com/api/classes/babylon.targetcamera
        */
        camera.attachControl(canvas, true);

        /* 创建2个光源. HemisphericLight是半球形光源.PointLight是点光源.
        * 第一个参数: name. 名字.
        * 第二个参数: direction, 方向,是一个向量的实例.
        * 第三个参数: scene, 场景.
        * api: https://doc.babylonjs.com/api/classes/babylon.hemisphericlight#constructor
        */
        const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        const light2 = new BABYLON.PointLight("light3", new BABYLON.Vector3(0, 1, -1), scene);

        /* 创建一个球形的控制网格. options参数,请看api
         * 第一个参数 name: 字符串, 名字
         * 第二个参数 options: object, 参数对象.
         * 第三个参数 scene: 场景
         * api: https://doc.babylonjs.com/api/classes/babylon.meshbuilder#createsphere
         */
        // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
        // sphere.rotation.x = - Math.PI / 2;
        // sphere.rotation = new BABYLON.Vector3(- Math.PI / 2, 0, 0)

        /* 
         * 创建一个圆柱的控制网格
         */
        const cone = BABYLON.MeshBuilder.CreateCylinder("cone", { diameterTop:0, height: 1, tessellation: 96 }, scene);
        cone.rotation.x = - Math.PI / 2;
        cone.rotation = new BABYLON.Vector3(- Math.PI / 2, 0, 0)

        // 地面
        const myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 4}, scene);

        // 坐标系
        new BABYLON.AxesViewer(scene)

        return scene;
    };

    const scene = create_scene();
    /* 不停的渲染场景.
    * runRenderLoop 是一个渲染循环.
    * api: https://doc.babylonjs.com/api/classes/babylon.engine#runrenderloop
    */
    engine.runRenderLoop(function(){
        scene.render();   // 渲染场景
    });

    window.addEventListener("resize", function(){
        engine.resize();
    });
};


