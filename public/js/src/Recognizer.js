var ar = {};


ar.Recognizer = function() {
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
    var skeleton = new ar.Skeleton();

    // Bindik bi alamete, gidiyoruz kiyamete
    var maxDisplacement = new ar.SkeletonMaxDisplacement();
    var skeletonArray = [];
    var maxDisplacementInterval;
    var maxDisplacementIntervalDuration = 1000; // in ms

    ar.Skeleton.Joints.forEach(function(jointName) {
        cubes[jointName] = new THREE.Mesh(geometry, material);
        scene.add(cubes[jointName]);
    });

    // Camera poisiton
    camera.position.z = 0;
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 5));

    // Update skeleton on scene.
    function updateSkeletonPosition() {
        for (var jointName in skeleton.absoluteData) {
            cubes[jointName].position.set(
                skeleton.absoluteData[jointName].elements[0], 
                skeleton.absoluteData[jointName].elements[1],
                skeleton.absoluteData[jointName].elements[2]
            );
        }
    }

    // Render loop
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
    render();

    // Read skeletal data
    var engager = zig.EngageUsersWithSkeleton(1);
    var users = [];

    engager.addEventListener('userengaged', function(user) {
        if (users.length == 0)
            users.push(user.id);
        else
            return;

        console.log('User engaged: ' + user.id);
     
        function onUserUpdate(user) {
            // Skeletal data is ready.
            skeleton.updateData(user.skeleton);

            // Bindik bi alamete, gidiyoruz kiyamete
            skeletonCopy = new ar.Skeleton(user.skeleton);
            skeletonArray.push(skeletonCopy);

            // Render
            render();
        }

        maxDisplacementInterval = setInterval(function() {
            // Handle max displacement data
            maxDisplacement.updateData(skeletonArray);
            updateMaxDisplacementPerJointHistogram();

            // Handle relative skeleton data
            var lastSkeleton = skeletonArray[skeletonArray.length - 1];
            lastSkeleton.updateSphericalData();

            // Clear skeletons
            skeletonArray = [];

            // Send data to backend for activity recognizing
            socket.emit('recognize', {
                skeleton: lastSkeleton.relativeSphericalData,
                maxDisplacement: maxDisplacement.sphericalData
            }, function (result) {
                var action = null,
                    max = 0;

                for (var actionName in result) {
                    if (result[actionName] > max) {
                        action = actionName;
                        max = result[actionName];
                    }
                }

                $('#actionName').text(action);
            });
        }, maxDisplacementIntervalDuration);

        user.addEventListener('userupdate', onUserUpdate);
        // user.addEventListener('userupdate', _.throttle(onUserUpdate, 1000 / 15));
    });

    engager.addEventListener('userdisengaged', function(user) {
        clearInterval(maxDisplacementInterval);
        console.log('User disengaged: ' + user.id);
    });

    zig.addListener(engager);

    // Update histogram
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
};
