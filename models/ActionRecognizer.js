var brain = require('brain'),
    net = new brain.NeuralNetwork(),
    ActionRecognizer = {};


ActionRecognizer.preprocessSkeleton = function(skeleton) {
    var rv = {};

    for (var jointName in skeleton) {
        rv[jointName + 'R'] = skeleton[jointName][0];
        rv[jointName + 'T'] = skeleton[jointName][1] / Math.PI * skeleton[jointName][0];
        rv[jointName + 'P'] = skeleton[jointName][2] / Math.PI * skeleton[jointName][0];
    }

    return rv;
};


ActionRecognizer.preprocessTrainData = function(data) {
    var rv = [];

    for (var actionName in data) {
        // data[actionName] => Array of skeletons
        data[actionName].forEach(function(skeleton) {
            var trainRow = {
                input: ActionRecognizer.preprocessSkeleton(skeleton),
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
ActionRecognizer.train = function(data) {
    var trainOutput = net.train(data);
    console.log('Action recognizer train complete.', trainOutput);
};


/**
 * Recognize an action with processed data.
 * @param {Array} data An array of max displacement vector in spherical world.
 * @return {Object} Result.
 */
ActionRecognizer.run = function(data) {
    var output = net.run(data);
    console.log(output);
    return output;
};


/**
 * Recognize an action with skeleton data.
 * @param {Object} skeleton
 * @return {Object} Result.
 */
ActionRecognizer.runWithSkeleton = function(skeleton) {
    var output = net.run(ActionRecognizer.preprocessSkeleton(skeleton));
    console.log(output);
    return output;
};


module.exports = ActionRecognizer;
