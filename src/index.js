
import { ThreeApp } from './three-app.js';
import './style.css'

const canvas = document.querySelector('canvas.viewer');

const app = new ThreeApp({ canvasDomElement: canvas });
