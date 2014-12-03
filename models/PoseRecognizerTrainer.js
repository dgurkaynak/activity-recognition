var PoseRecognizer = require('./PoseRecognizer'),
    fs = require('fs'),
    filePath = './traindata/pose',
    files = fs.readdirSync(filePath),
    trainData = {};

files.forEach(function(fileName) {
    var actionName = fileName.split('.')[0],
        data = JSON.parse(fs.readFileSync(filePath + '/' + fileName));

    trainData[actionName] = data;
});

trainData = PoseRecognizer.preprocessTrainData(trainData);
PoseRecognizer.train(trainData);
