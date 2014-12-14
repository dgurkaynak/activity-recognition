ar.ViewHelper = {};


/**
 * Returns random hex color.
 * @return {String} Hex color included "#" char.
 */
ar.ViewHelper.getRandomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


/**
 * Makes text sprite for three.js
 * @param  {String} message
 * @param  {Object} parameters
 * @return {THREE.Sprite}
 */
ar.ViewHelper.makeTextSprite = function(message, parameters)
{
    if ( parameters === undefined ) parameters = {};
    
    var fontface = parameters.hasOwnProperty("fontface") ? 
        parameters["fontface"] : "Arial";
    
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
        parameters["fontsize"] : 18;
        
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    context.textAlign = 'center';
    
    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = 300; //metrics.width

    ar.ViewHelper.roundRect(context, 0, 0, textWidth, fontsize * 1.4, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.
    
    // text color
    context.fillStyle = parameters.fontColor ? parameters.fontColor : "rgba(255,255,255,1)";

    context.fillText(message, textWidth / 2, fontsize);
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( 
        { map: texture, useScreenCoordinates: false } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(1.0,1.0,1.0);
    return sprite;  
}

/**
 * Function for drawing rounded rectangles
 */
ar.ViewHelper.roundRect = function(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();   
}
