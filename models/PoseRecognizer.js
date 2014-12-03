var brain = require('brain'),
    net = new brain.NeuralNetwork(),
    PoseRecognizer = {};


PoseRecognizer.preprocessSkeleton = function(skeleton) {
    var rv = {};

    for (var jointName in skeleton) {
        rv[jointName + 'R'] = skeleton[jointName][0];
        rv[jointName + 'T'] = skeleton[jointName][1] / (Math.PI * 2);
        rv[jointName + 'P'] = skeleton[jointName][2] / Math.PI;
    }

    return rv;
};


PoseRecognizer.preprocessTrainData = function(data) {
    var rv = [];

    for (var actionName in data) {
        // data[actionName] => Array of skeletons
        data[actionName].forEach(function(skeleton) {
            var trainRow = {
                input: PoseRecognizer.preprocessSkeleton(skeleton),
                output: {}
            };
            trainRow.output[actionName] = 1;
            rv.push(trainRow);            
        });
    }

    return rv;
};


/**
 * Trainer method.
 * @param {Array} data 
 *        Ex: [{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
           {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
           {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}]
 */
PoseRecognizer.train = function(data) {
    var trainOutput = net.train(data);
    console.log('Pose recognizer train complete.', trainOutput);
};


/**
 * Recognize an action with processed data.
 * @param {Array} data An array of max displacement vector in spherical world.
 * @return {Object} Result.
 */
PoseRecognizer.run = function(data) {
    var output = net.run(data);
    return output;
};


/**
 * Recognize an action with skeleton data.
 * @param {Object} skeleton
 * @return {Object} Result.
 */
PoseRecognizer.runWithSkeleton = function(skeleton) {
    var output = net.run(PoseRecognizer.preprocessSkeleton(skeleton));
    return output;
};


module.exports = PoseRecognizer;
