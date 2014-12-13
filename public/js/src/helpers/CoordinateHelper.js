/**
 * Constructor of coordinate helper class.
 */
ar.CoordinateHelper = function() {

};


/**
 * Convert cartesian vector to sphrical vector.
 * @param {Vector} cartesianVector
 * @return {Array} [r, theta, phi]
 *                     r: radius [0, Infinite)
 *                     theta: [0, 2PI] in radians
 *                     phi: [0, PI] in radians
 */
ar.CoordinateHelper.convertCartesianToSpherical = function(cartesianVector) {
    var r = cartesianVector.modulus(),
        theta = Math.atan2(cartesianVector.elements[1], cartesianVector.elements[0]) + Math.PI,
        phi = Math.asin(cartesianVector.elements[2] / r) + (Math.PI / 2);

    return [r, theta, phi];
};


/**
 * Displacement vectors can be in two direction for repeating joints. 
 * To remove this difference, we work in positive half space.
 * This method converts vectors in negative space to positive space.
 * @param {Array} cartesianVector
 * @return {Array} 
 */
ar.CoordinateHelper.getAbsoluteCartesianVector = function(cartesianVector) {
    var vector = _.clone(cartesianVector);

    if (vector[2] < 0) {
        vector = [
            cartesianVector[0] * -1,
            cartesianVector[1] * -1,
            cartesianVector[2] * -1
        ];
    }

    return vector;
};


/**
 * Displacement vectors can be in two direction for repeating joints. 
 * To remove this difference, we work in positive half space.
 * This method converts vectors in negative space to positive space.
 * @param {Array} sphericalVector
 * @return {Array} [r, theta, phi]
 *                     r: radius [0, Infinite)
 *                     theta: [0, PI] in radians
 *                     phi: [0, PI] in radians
 */
ar.CoordinateHelper.getAbsoluteSphericalVector = function(sphericalVector) {
    var vector = _.clone(sphericalVector);

    if (vector[1] > Math.PI) {
        vector[1] -= Math.PI;
        vector[2] = Math.PI - vector[2];
    }

    return vector;
};


/**
 * Normalizes spherical vector. Maximum modulus is 1, if higher than 1, it will be considered as 1.
 * @param {Array} sphericalVector
 * @return {Array} [r, theta, phi]
 *                     r: radius [0, 1]
 *                     theta: [0, 1] in radians
 *                     phi: [0, 1] in radians
 */
ar.CoordinateHelper.getNormalizedSphericalVector = function(sphericalVector) {
    var vector = _.clone(sphericalVector);

    vector[0] = Math.min(vector[0], 1);
    vector[1] /= Math.PI;
    vector[2] /= Math.PI;

    return vector;
};
