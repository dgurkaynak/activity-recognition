var ActionRecognizer = require('./ActionRecognizer');

var walking = require('../traindata/walking.json'),
    wavingHands = require('../traindata/waving-hands.json'),
    wavingLeftHand = require('../traindata/waving-left-hand.json'),
    wavingRightHand = require('../traindata/waving-right-hand.json');

var trainData = ActionRecognizer.preprocessTrainData({
    'walking': walking,
    'waving-hands': wavingHands,
    'waving-left-hand': wavingLeftHand,
    'waving-right-hand': wavingRightHand
});

ActionRecognizer.train(trainData);
