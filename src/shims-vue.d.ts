/*
 * @Author: your name
 * @Date: 2021-03-23 19:51:54
 * @LastEditTime: 2021-04-05 22:55:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue6three\src\shims-vue.d.ts
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// declare module 'myThree' {
//   import * as THREE from "three";
//   export default THREE.Scene;
// }

declare module 'dat.gui' {
  import * as dat from 'dat.gui';
 export default dat
}

declare module "three-asciieffect" {
  export default AsciiEffect as any;
}