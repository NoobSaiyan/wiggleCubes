// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases')

const settings = {
  // Make the loop animated
  animate: true,
  dimensions:[1280,1280],
  fps:24,
  duration:4,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes:{antialias:true}
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes)

  const box = new THREE.BoxGeometry(1,1,1)
  for(let i = 0; i < 100 ; i++){
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette)
      })
    )
    mesh.position.set(
      random.range(-1,1),
      random.range(-1,1),
      random.range(-1,1)
    )
    mesh.scale.set(
      random.range(-1,1),
      random.range(-1,1),
      random.range(-1,1)
    )
    mesh.scale.multiplyScalar(0.4)
    scene.add(mesh)
  }

  scene.add(new THREE.AmbientLight('hsl(0,0%,50%)'))
  
  const light = new THREE.DirectionalLight('white',1)
  light.position.set(0,0,4)
  scene.add(light)
  const light2 = new THREE.DirectionalLight('white',0.5)
  light2.position.set(4,0,0)
  scene.add(light2)
  const light3 = new THREE.DirectionalLight('white',0.5)
  light3.position.set(0,0,-2)
  scene.add(light3)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      // Setup an isometric perspective
      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.85;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update camera properties
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI *2)
      scene.rotation.y = eases.elasticInOut(t)
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
