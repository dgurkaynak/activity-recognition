/**
 * Main class for 3d visualisation.
 * @constructor
 */
ar.ui = function() {
    ar.ui.Scene = new THREE.Scene();
    ar.ui.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    ar.ui.Renderer = new THREE.WebGLRenderer();

    // Append renderer into dom.
    ar.ui.Renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(ar.ui.Renderer.domElement);
};


/**
 * Scene object.
 * @type {THREE.Scene}
 */
ar.ui.Scene = null;


/**
 * Camera object.
 * @type {THREE.PerspectiveCamera}
 */
ar.ui.Camera = null;


/**
 * Renderer.
 * @type {THREE.WebGLRenderer}
 */
ar.ui.Renderer = null;


/**
 * Render method.
 */
ar.ui.prototype.render = function() {
    ar.ui.Renderer.render(ar.ui.Scene, ar.ui.Camera);
};
