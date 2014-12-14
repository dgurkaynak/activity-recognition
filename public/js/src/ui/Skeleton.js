/**
 * 3D skeleton class.
 * @constructor
 * @param {ar.Skeleton} opt_skeleton
 * @param {Object=} opt_options
 */
ar.ui.Skeleton = function(opt_skeleton, opt_options) {
    this.handleOptions(opt_options);
    this.skeleton = opt_skeleton || new ar.Skeleton();

    this.joints = {};
    this.lines = [];
    this.headLabel = null;

    this.init();   
};


/**
 * Handle options object, defaults etc.
 * @param {Object=} opt_options
 */
ar.ui.Skeleton.prototype.handleOptions = function(opt_options) {
    this.options = opt_options || {};
    this.options.relative = !!this.options.relative;

    if (!this.options.color)
        this.options.color = (!!this.options.randomColor) ? ar.ViewHelper.getRandomColor() : '#0f0';
    
    this.options.lineWidth = this.options.lineWidth || 5;
    this.options.sphereRadius = this.options.sphereRadius || 0.03;
};


/**
 * This creates joint materials.
 */
ar.ui.Skeleton.prototype.init = function() {
    var that = this,
        geometry = new THREE.SphereGeometry(this.options.sphereRadius, this.options.sphereRadius, this.options.sphereRadius),
        material = new THREE.MeshBasicMaterial({ color: this.options.color });

    ar.Skeleton.Joints.forEach(function(jointName) {
        that.joints[jointName] = new THREE.Mesh(geometry, material);
        ar.ui.Scene.add(that.joints[jointName]);
    });
};


/**
 * Creates head label.
 * @param  {String=} opt_text Text to be displayed.
 */
ar.ui.Skeleton.prototype.createHeadLabel = function(opt_text) {
    opt_text = opt_text || '';

    // Remove head label if exists
    if (this.headLabel) {
        ar.ui.Scene.remove(this.headLabel);
        this.headLabel = null;
    }

    this.headLabel = ar.ViewHelper.makeTextSprite(opt_text, {fontsize: 32, fontface: "Verdana", fontColor: this.options.color});
    this.headLabel.position.set(0,0,0);
    ar.ui.Scene.add(this.headLabel);
};


/**
 * Updates skeleton joints and lines.
 */
ar.ui.Skeleton.prototype.update = function() {
    // Update joints
    var data = this.options.relative ? this.skeleton.relativeData : this.skeleton.absoluteData;
    for (var jointName in data) {
        this.joints[jointName].position.set(
            data[jointName].elements[0], 
            data[jointName].elements[1],
            data[jointName].elements[2]
        );
    }

    // Update head label
    if (this.headLabel)
        this.headLabel.position.set(data['Head'].elements[0], data['Head'].elements[1], data['Head'].elements[2]);

    // Update lines
    this.updateLines();
};


/**
 * Updates lines.
 */
ar.ui.Skeleton.prototype.updateLines = function() {
    // Remove all the lines
    this.lines.forEach(function(line) {
        ar.ui.Scene.remove(line);
    });
    this.lines = [];

    // Add new lines
    var that = this,
        data = this.options.relative ? this.skeleton.relativeData : this.skeleton.absoluteData,
        lineMaterial = new THREE.LineBasicMaterial({ color: this.options.color, linewidth: this.options.lineWidth });

    if (_.isEmpty(data))
        return;

    ar.ui.Skeleton.LineBetweenJoints.forEach(function(joints) {
        var geometry = new THREE.Geometry(),
            line = new THREE.Line(geometry, lineMaterial);

        line.geometry.vertices.push(new THREE.Vector3(
                data[joints[0]] ? data[joints[0]].elements[0] : 0, 
                data[joints[0]] ? data[joints[0]].elements[1] : 0,
                data[joints[0]] ? data[joints[0]].elements[2] : 0
        ));

        line.geometry.vertices.push(new THREE.Vector3(
                data[joints[1]] ? data[joints[1]].elements[0] : 0, 
                data[joints[1]] ? data[joints[1]].elements[1] : 0,
                data[joints[1]] ? data[joints[1]].elements[2] : 0
        ));

        that.lines.push(line);
        ar.ui.Scene.add(line);
    });
};


/**
 * Removes from the scene.
 */
ar.ui.Skeleton.prototype.removeFromScene = function() {
    // Remove all the lines
    this.lines.forEach(function(line) {
        ar.ui.Scene.remove(line);
    });
    this.lines = [];

    // Remove all the joints
    for (var jointName in this.joints) {
        ar.ui.Scene.remove(this.joints[jointName]);
    }
    this.joints = {};

    // Remove head label
    ar.ui.Scene.remove(this.headLabel);
    this.headLabel = null;
};


/**
 * Define lines between joints.
 * @type {Array}
 */
ar.ui.Skeleton.LineBetweenJoints = [
    [ar.Skeleton.Joints[0], ar.Skeleton.Joints[7]], // head - neck
    [ar.Skeleton.Joints[7], ar.Skeleton.Joints[13]], // neck - right shoulder
    [ar.Skeleton.Joints[7], ar.Skeleton.Joints[6]], // neck - left shoulder
    [ar.Skeleton.Joints[6], ar.Skeleton.Joints[1]], // left shoulder - elbow
    [ar.Skeleton.Joints[13], ar.Skeleton.Joints[8]], // right shoulder - elbow
    [ar.Skeleton.Joints[1], ar.Skeleton.Joints[3]], // left elbow - hand
    [ar.Skeleton.Joints[8], ar.Skeleton.Joints[10]], // right elbow - hand
    [ar.Skeleton.Joints[7], ar.Skeleton.Joints[14]], // neck - torso
    // [ar.Skeleton.Joints[6], ar.Skeleton.Joints[14]], // left shoulder - torso
    // [ar.Skeleton.Joints[13], ar.Skeleton.Joints[14]], // right shoulder - torso
    [ar.Skeleton.Joints[14], ar.Skeleton.Joints[4]], // torso - left hip
    [ar.Skeleton.Joints[14], ar.Skeleton.Joints[11]], // torso - right hip
    [ar.Skeleton.Joints[4], ar.Skeleton.Joints[11]], // left hip - right hip
    [ar.Skeleton.Joints[4], ar.Skeleton.Joints[5]], // left hip - knee
    [ar.Skeleton.Joints[11], ar.Skeleton.Joints[12]], // right hip - knee
    [ar.Skeleton.Joints[5], ar.Skeleton.Joints[2]], // left knee - foot
    [ar.Skeleton.Joints[12], ar.Skeleton.Joints[9]], // right knee - foot
];
