// Create namespace if not created.
if (!ar)
    var ar = {};


/**
 * Viewer class.
 * @constructor
 */
ar.Viewer = function() {
    // Crate 3d world with white background for capturing
    var ui = new ar.ui({
        alphaRenderer: true
    });
    ar.ui.Renderer.setClearColor(0xffffff, 1); 

    // Camera position
    ar.ui.Camera.position.z = 2;

    // Main skeleton model
    var skeletonModel = new ar.ui.Skeleton(null, { 
        relative: true, 
        color: '#000',
        lineWidth: 8
    });

    // Recording
    var db = localStorage.getItem('data');
    db = db ? JSON.parse(db) : [];
    var selectedIndex = 0;
    var maxDisplacement = window.maxDisplacement = new ar.SkeletonMaxDisplacement();

    // Import db!
    db.forEach(function(skeleton) {
        for (var dataKey in skeleton) {
            for (var jointName in skeleton[dataKey]) {
                skeleton[dataKey][jointName] = $V(skeleton[dataKey][jointName]);
            }
        }
    });

    // Update skeleton on scene.
    var displayedSkeletonDataKey = 'relativeData';
    function updateSkeletonPosition() {
        for (var jointName in db[selectedIndex][displayedSkeletonDataKey]) {
            cubes[jointName].position.set(
                db[selectedIndex][displayedSkeletonDataKey][jointName].elements[0], 
                db[selectedIndex][displayedSkeletonDataKey][jointName].elements[1],
                db[selectedIndex][displayedSkeletonDataKey][jointName].elements[2]
            );
        }
    }

    // Render function
    function render() {
        skeletonModel.skeleton = db[selectedIndex];
        skeletonModel.update();
        ui.render();
    }

    // Db functions
    function updateRecordList() {
        var optionsHtml = '',
            i = 0;

        db.forEach(function(item) {
            optionsHtml += '<option value="' + i + '">Record #' + i + '</option>';
            i++;
        });
        $('#recordList').html(optionsHtml);
    };
    updateRecordList(); // Initial

    function updateMaxDisplacementPerJointHistogram() {
        $('[id^="histogramBar"]').css('height', '2px');

        var i = 0;
        for (var jointName in maxDisplacement.sphericalData) {
            var height0 = Math.round(maxDisplacement.sphericalData[jointName][0] * 300);
            var height1 = Math.round(maxDisplacement.sphericalData[jointName][1] * 50 * maxDisplacement.sphericalData[jointName][0]);
            var height2 = Math.round(maxDisplacement.sphericalData[jointName][2] * 50 * maxDisplacement.sphericalData[jointName][0]);
            if (height0 == 0) height0 = 2;
            if (height1 == 0) height1 = 2;
            if (height2 == 0) height2 = 2;
            $('#histogramBarR'+i).css('height', height0 + 'px');
            $('#histogramBarT'+i).css('height', height1 + 'px');
            $('#histogramBarP'+i).css('height', height2 + 'px');
            i++;
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // jQuery part
    $('#recordList').change(function() {
        selectedIndex = parseInt(this.value, 10);
        render();
    });

    $('#removeItem').click(function() {
        _.forEachRight($("select option:selected"), function(el) {
            db.splice(parseInt(el.value, 10), 1);
        });

        selectedIndex = 0;
        updateRecordList();
    });

    $('#calcMaxDisplacement').click(function() {
        var skeletons = [];

        _.forEach($("select option:selected"), function(el) {
            skeletons.push(db[parseInt(el.value, 10)]);
        });

        maxDisplacement.updateData(skeletons);

        updateMaxDisplacementPerJointHistogram();
    });

    $('#save').click(function() {
        var data = db.map(function(skeleton) {
            for (var jointName in skeleton.relativeData) {
                skeleton.relativeData[jointName] = skeleton.relativeData[jointName].elements;
                skeleton.absoluteData[jointName] = skeleton.absoluteData[jointName].elements;
            }

            return skeleton;
        });

        // Save it to local storage.
        localStorage.setItem('data', JSON.stringify(data));

        console.log('Saved into localstorage.');
    });

    $('#colorize').click(function() {
        var color = getRandomColor();
        $("select option:selected").css('background-color', color);
    });

    $('#calcRelativeSphericalData').click(function() {
        var data = {};

        for (var jointName in db[selectedIndex].relativeData) {
            var jointData = db[selectedIndex].relativeData[jointName];
            data[jointName] = ar.CoordinateHelper.convertCartesianToSpherical(jointData);
        }

        window.skeletonData = data;
    });
};
