/**
 * Skeleton class.
 * @constructor
 * @param {Object=} opt_rawData
 */
ar.Skeleton = function(opt_rawData) {
    this.absoluteData = {};
    this.relativeData = {};

    if (opt_rawData)
        this.updateData(opt_rawData);
};


/**
 * Joints.
 * @type {Array}
 */
ar.Skeleton.Joints = [
    'Head',
    'LeftElbow',
    'LeftFoot',
    'LeftHand',
    'LeftHip',
    'LeftKnee',
    'LeftShoulder',
    'Neck',
    'RightElbow',
    'RightFoot',
    'RightHand',
    'RightHip',
    'RightKnee',
    'RightShoulder',
    'Torso'
];


/**
 * Base joint. Relative skeleton data will be calculated relative to this joint.
 * @type {string}
 */
ar.Skeleton.BaseJoint = 'Torso';


/**
 * All the numbers in mm, so convert to meters.
 * @type {number}
 */
ar.Skeleton.MetricDivider = 1000;


/**
 * Update all the skeleton data.
 * @param {Object} rawData
 */
ar.Skeleton.prototype.updateData = function(rawData) {
    this.preprocessRawData(rawData);

    this.absoluteData = this.mapAbsoluteData(rawData);
    this.relativeData = this.mapRelativeData(rawData);
};


/**
 * Handle all the metrics.
 * @param {Object} rawData
 */
ar.Skeleton.prototype.preprocessRawData = function(rawData) {
    if (rawData.isPreprocessed)
        return;

    ar.Skeleton.Joints.forEach(function(jointName) {
        rawData[zig.Joint[jointName]].position[0] /= ar.Skeleton.MetricDivider;
        rawData[zig.Joint[jointName]].position[1] /= ar.Skeleton.MetricDivider;
        rawData[zig.Joint[jointName]].position[2] /= ar.Skeleton.MetricDivider;
    });

    rawData.isPreprocessed = true;
};


/**
 * Map the absolute skeleton data.
 * @param {Object} rawData
 * @return {Object}
 */
ar.Skeleton.prototype.mapAbsoluteData = function(rawData) {
    var data = {};

    ar.Skeleton.Joints.forEach(function(jointName) {
        data[jointName] = $V(rawData[zig.Joint[jointName]].position);
    });

    return data;
};


/**
 * Maps the relative skeleton data.
 * @param {Object} rawData
 * @return {Object}
 */
ar.Skeleton.prototype.mapRelativeData = function(rawData) {
    var data = {};

    ar.Skeleton.Joints.forEach(function(jointName) {
        if (jointName == ar.Skeleton.BaseJoint)
            return;

        var relativePosition = [
            rawData[zig.Joint[jointName]].position[0] - rawData[zig.Joint[ar.Skeleton.BaseJoint]].position[0],
            rawData[zig.Joint[jointName]].position[1] - rawData[zig.Joint[ar.Skeleton.BaseJoint]].position[1],
            rawData[zig.Joint[jointName]].position[2] - rawData[zig.Joint[ar.Skeleton.BaseJoint]].position[2]
        ];

        data[jointName] = $V(relativePosition);
    });

    return data;
};


/**
 * Get total relative joint data differences.
 * @param {ar.Skeleton} otherSkeleton
 * @return {number}
 */
ar.Skeleton.prototype.getRelativeDiff = function(otherSkeleton) {
    if (_.isEmpty(otherSkeleton.relativeData))
        return;

    var diff = 0;

    for (var jointName in this.relativeData) {
        var diffVector = this.relativeData[jointName].subtract(otherSkeleton.relativeData[jointName]),
            diffModulus = diffVector.modulus();

        diff += diffModulus;
    }

    return diff;
};
