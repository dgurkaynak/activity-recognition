var ActivityRecognizer = {},
    PoseRecognizer = require('./PoseRecognizer'),
    ActionRecognizer = require('./ActionRecognizer'),
    actionDisplacementThreshold = 0.35; // in meters


/**
 * Run according to total displacement intensity.
 * @param {{skeleton: Object, maxDisplacement: Object}} data
 * @return {Object}
 */
ActivityRecognizer.run = function(data) {
    var totalDisplacement = 0;

    for (var jointName in data.maxDisplacement) {
        totalDisplacement += data.maxDisplacement[jointName][0];
    }

    if (totalDisplacement < actionDisplacementThreshold) 
        return PoseRecognizer.runWithSkeleton(data.skeleton);
    else
        return ActionRecognizer.runWithSkeleton(data.maxDisplacement);
};


module.exports = ActivityRecognizer;
