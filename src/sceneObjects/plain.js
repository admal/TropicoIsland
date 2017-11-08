class Plane extends SceneObject {

    constructor(initialPosition, color, size) {
        super(initialPosition, color);
        this.color = color;
        this.size = size;
        this.initialPosition = initialPosition;
    }

    _initData() {
        var width = this.size[0];
        var height = this.size[1];
        var x1 = -width/2;
        var x2 = width/2;
        var y1 = -height/2;
        var y2 = height/2;
        var z = 0;

        this.vertexPositions = [
            y1,z, x1,
            y1,z, x2,
            y2,z,  x1,
            y2,z,  x1,
            y1,z,  x2,
            y2,z,  x2,
        ];

        this.normalData = this.vertexPositions;
        this.indexData = [
            0, 1, 2, 3, 4, 5
        ];
    };
}