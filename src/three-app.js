import {
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  Vector3
} from "three";
import * as dat from 'dat.gui';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { Viewer } from './viewer.js';

import skyscraperMeshSrc from '../static/skyscraper.glb'

export class ThreeApp {
  _viewer;

  _light;

  _gui;

  constructor({ canvasDomElement }) {
    this._viewer = new Viewer({ canvasDomElement });

    this._projectorMaterials = [];

    this.initScene();

    this.initGui();

    this._viewer.update();
  }

  initScene() {
    const planeWidth = 25;
    const planeHeight = 25;

    const sceneNode = new Object3D();

    // Planes

    const planeGeometry = new PlaneGeometry(planeWidth, planeHeight, 1, 1);
    const planeWhiteMaterial = this.createMaterial(0xffffff);

    const planeFloor = new Mesh(planeGeometry, planeWhiteMaterial);
    planeFloor.rotateX(-Math.PI / 2);
    planeFloor.receiveShadow = true;
    sceneNode.add(planeFloor);

    const planeRear = new Mesh(planeGeometry, planeWhiteMaterial);
    planeRear.position.z = -planeHeight / 2;
    planeRear.position.y = planeHeight / 2;
    planeRear.receiveShadow = true;
    sceneNode.add(planeRear);

    const planeLeft = new Mesh(planeGeometry, planeWhiteMaterial);
    planeLeft.rotateY(Math.PI / 2);
    planeLeft.position.x = -planeWidth / 2;
    planeLeft.position.y = planeHeight / 2;
    planeLeft.receiveShadow = true;
    sceneNode.add(planeLeft);

    const planeRight = new Mesh(planeGeometry, planeWhiteMaterial);
    planeRight.rotateY(-Math.PI / 2);
    planeRight.position.x = planeWidth / 2;
    planeRight.position.y = planeHeight / 2;
    planeRight.receiveShadow = true;
    sceneNode.add(planeRight);

    const sphereGeometry = new SphereGeometry(1, 20, 20);
    const sphereMaterial = this.createMaterial(0x44aa88);
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 1;
    sphere.castShadow = true;

    // Sphere

    sceneNode.add(sphere);

    // Mesh

    const loader = new GLTFLoader();
    loader.load(skyscraperMeshSrc, (gltf) => {
      const meshMaterial  = this.createMaterial(0xcccccc);

      meshMaterial.map = gltf.scene.children[0].material.map;

      gltf.scene.children[0].material = meshMaterial;
      gltf.scene.children[0].castShadow = true;
      gltf.scene.children[0].receiveShadow = true;
      gltf.scene.position.set(4, 5.25, -3);
      gltf.scene.scale.set(3, 3 ,3);

      sceneNode.add(gltf.scene);

      this._viewer.update();
    });

    // Light
    this._light = new PointLight(0xffffff);
    this._light.position.copy(new Vector3(2, 8, 5));
    sceneNode.add(this._light);

    this._viewer.addSceneObject(sceneNode);
  }

  createMaterial(colour) {
    const material = new MeshPhongMaterial({ color: colour });

    return material;
  }

  initGui() {
    this._gui = new dat.GUI();

    const params = {
      'Light colour': this._light.color.getHex(),
    };

    this._gui.addColor(params, 'Light colour').onChange(c => {
      this._light.color.setHex(c);
      this._viewer.update();
    });

    this._gui.open();
  }
}
