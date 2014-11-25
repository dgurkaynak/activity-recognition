/**
 * Constructor of joints max displacement class.
 * @constructor
 * @param {Array.<ar.Skeleton>} opt_skeletons Array of skeletons.
 */
ar.SkeletonMaxDisplacement = function(opt_skeletons) {
    this.cartesianData = {};
    this.sphericalData = {};

    if (opt_skeletons)
        this.updateData(opt_skeletons);
};


/**
 * Updates data.
 * @param {Array.<ar.Skeleton>} skeleton
 */
ar.SkeletonMaxDisplacement.prototype.updateData = function(skeletons) {
    if (skeletons.length == 0) 
        return;

    var cartesianData = {},
        sphericalData = {},
        firstSkeletonData = skeletons[0].relativeData;

    if (_.isEmpty(firstSkeletonData))
        return;

    // Collect position vectors for each joint
    // and calculate maximum displacement vector
    for (var jointName in firstSkeletonData) {
        var jointPositions = skeletons.map(function(skeleton) {
            return skeleton.relativeData[jointName];
        });

        var maxDisplacement = this.findMaxDisplacement(jointPositions);
        cartesianData[jointName] = maxDisplacement.cartesian;
        sphericalData[jointName] = maxDisplacement.spherical;
    }

    this.cartesianData = cartesianData;
    this.sphericalData = sphericalData;
};


/**
 * Finds max displacement vector in both cartesian and spherical space.
 * @param {Array} vectors
 * @return {{cartesian: Vector, spherical: Array}}
 */
ar.SkeletonMaxDisplacement.prototype.findMaxDisplacement = function(vectors) {
    var maxDisplacementVector,
        maxDisplacementModulus = 0;

    for (var i = 0; i < vectors.length; i++) {
        for (var j = 0; j < vectors.length; j++) {
            var displacementVector = vectors[i].subtract(vectors[j]),
                displacementModulus = displacementVector.modulus();

            if (displacementModulus > maxDisplacementModulus) {
                // Find max, save it
                maxDisplacementVector = displacementVector;
                maxDisplacementModulus = displacementModulus;
            }
        }
    }

    // Convert cartesian vector to spherical
    var sphericalVector = ar.CoordinateHelper.convertCartesianToSpherical(maxDisplacementVector);
    sphericalVector = ar.CoordinateHelper.getAbsoluteSphericalVector(sphericalVector);

    return {
        cartesian: ar.CoordinateHelper.getAbsoluteCartesianVector(maxDisplacementVector.elements),
        spherical: sphericalVector
    };
};
