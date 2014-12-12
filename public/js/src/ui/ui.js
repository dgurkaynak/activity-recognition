/**
 * Main class for 3d visualisation.
 * @constructor
 * @param {Object=} opt_options
 */
ar.ui = function(opt_options) {
    this.handleOptions(opt_options);
    ar.ui.Scene = new THREE.Scene();
    ar.ui.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    ar.ui.Renderer = new THREE.WebGLRenderer({ alpha: this.options.alphaRenderer });

    // Append renderer into dom.
    ar.ui.Renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(ar.ui.Renderer.domElement);
};


ar.ui.prototype.handleOptions = function(opt_options) {
    this.options = opt_options || {};
    this.options.alphaRenderer = !!this.options.alphaRenderer;
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
