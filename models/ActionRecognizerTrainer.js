var ActionRecognizer = require('./ActionRecognizer'),
    fs = require('fs'),
    filePath = './traindata',
    files = fs.readdirSync(filePath),
    trainData = {};

files.forEach(function(fileName) {
    var actionName = fileName.split('.')[0],
        data = JSON.parse(fs.readFileSync(filePath + '/' + fileName));

    trainData[actionName] = data;
});

trainData = ActionRecognizer.preprocessTrainData(trainData);
ActionRecognizer.train(trainData);
