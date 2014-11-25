// Create namespace if not created.
if (!ar)
    var ar = {};


/**
 * Recorder class.
 * @constructor
 */
ar.Recorder = function() {
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

    // App variables
    var isRecording = false;
    var countdown = 10000; // in ms
    var skeleton = new ar.Skeleton();
    var users = [];
    var db = [];

    ar.Skeleton.Joints.forEach(function(jointName) {
        cubes[jointName] = new THREE.Mesh(geometry, material);
        scene.add(cubes[jointName]);
    });

    // Camera position
    camera.position.z = 2;

    // Update method for skeleton on scene.
    function updateSkeletonPosition() {
        for (var jointName in skeleton.relativeData) {
            cubes[jointName].position.set(
                skeleton.relativeData[jointName].elements[0], 
                skeleton.relativeData[jointName].elements[1],
                skeleton.relativeData[jointName].elements[2]
            );
        }
    }

    // Render method
    var lastRenderedDate = new Date().getTime();
    function render() {
        // requestAnimationFrame( render );
        updateSkeletonPosition();
        renderer.render(scene, camera);

        // Fps
        var fps = parseInt(1000 / ((new Date().getTime()) - lastRenderedDate), 10);
        $('#fps').text('FPS: ' + fps);
        lastRenderedDate = new Date().getTime();
    }
    render(); // initial render

    // Read skeletal data
    var engager = zig.EngageUsersWithSkeleton(1);

    engager.addEventListener('userengaged', function(user) {
        // Just allow one user
        if (users.length == 0)
            users.push(user.id);
        else
            return;

        console.log('User engaged: ' + user.id);
     
        function onUserUpdate(user) {
            // Skeletal data is ready.
            skeleton.updateData(user.skeleton);

            // Record
            if (isRecording) {
                var skeletonCopy = new ar.Skeleton(user.skeleton);
                db.push(skeletonCopy);
            }

            // Render
            render();
        }

        user.addEventListener('userupdate', onUserUpdate);
        // user.addEventListener('userupdate', _.throttle(onUserUpdate, 1000 / 15));
    });

    // On user out of camera
    engager.addEventListener('userdisengaged', function(user) {
        users = [];
        console.log('User disengaged: ' + user.id);
    });

    zig.addListener(engager);

    // jQuery part
    $('#record').click(function() {
        var that = this;

        if (isRecording) {
            // Stop
            isRecording = false;
            $(this).text('Record');
            console.log('Recording stopped.');
        }
        else {
            // Start
            console.log('Recording will start in ' + (countdown/1000) + ' seconds.');
            setTimeout(function() {
                isRecording = true;
                $(that).text('STOP');
                console.log('Recording started!');
            }, countdown);
        }
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

        // Clear db
        db = [];

        console.log('Saved into localstorage and current history is cleared.');
    });
};
