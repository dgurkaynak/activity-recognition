// Create namespace if not created.
if (!ar)
    var ar = {};


/**
 * Viewer class.
 * @constructor
 */
ar.Viewer = function() {
    // Craete secene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cubes
    var geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cubes = {};

    // Recording
    var db = localStorage.getItem('data');
    db = db ? JSON.parse(db) : [];
    var selectedIndex = 0;

    ar.Skeleton.Joints.forEach(function(jointName) {
        cubes[jointName] = new THREE.Mesh(geometry, material);
        scene.add(cubes[jointName]);
    });

    // Camera poisiton
    camera.position.z = 2;

    // Update skeleton on scene.
    var displayedSkeletonDataKey = 'relativeData';
    function updateSkeletonPosition() {
        for (var jointName in db[selectedIndex][displayedSkeletonDataKey]) {
            cubes[jointName].position.set(
                db[selectedIndex][displayedSkeletonDataKey][jointName][0], 
                db[selectedIndex][displayedSkeletonDataKey][jointName][1],
                db[selectedIndex][displayedSkeletonDataKey][jointName][2]
            );
        }
    }

    // Render function
    function render() {
        updateSkeletonPosition();
        renderer.render(scene, camera);
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
};
