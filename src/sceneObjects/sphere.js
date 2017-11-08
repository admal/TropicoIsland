class Sphere extends SceneObject {
    constructor(initialPosition, color, radius){
        super(initialPosition, color);
        this.radius = radius;
    }

    _initData(){
        var radius = this.radius;

        var latitudeBands = radius;
        var longitudeBands = radius;

        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                this.normalData.push(x);
                this.normalData.push(y);
                this.normalData.push(z);

                this.vertexPositions.push(radius * x);
                this.vertexPositions.push(radius * y);
                this.vertexPositions.push(radius * z);
            }
        }

        for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                this.indexData.push(first);
                this.indexData.push(second);
                this.indexData.push(first + 1);

                this.indexData.push(second);
                this.indexData.push(second + 1);
                this.indexData.push(first + 1);
            }
        }
    };
}