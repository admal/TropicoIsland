class Plane extends SceneObject {

    constructor(initialPosition, color, size, material) {
        super(initialPosition, color, material);
        this.color = color;
        this.size = size;
    }

    _initData() {
        // var r = 100;
        // var c = 100;
        // var xsize = this.size[0];
        // var zsize = this.size[1];
        //
        // var stepX = xsize / r;
        // var stepY = zsize / c;
        // for(var i = 0; i < r; i++) {
        //     for(var j = 0; j < c; j++){
        //         var posX = stepX * i;
        //         var posY = stepY * j;
        //
        //         this.vertexPositions.push(posX, 0, posY);
        //         this.normalData.push(posX, 0, posY);
        //
        //         this.textureData.push(posX, posY);
        //         this.indexData.push(i * r + j);
        //     }
        // }

        // for (var x = 0; x < 240; x++) {
        //     for (var z = 0; z < 240; z++) {
        //         this.vertexPositions.push(
        //             x * 10 - 1200,
        //             0,
        //             (z * 10 - 1200) * (x % 2 * 2 - 1),
        //         );
        //         this.indexData.push(x * 240 + z);
        //         this.normalData.push(
        //             x * 10 - 1200,
        //             0,
        //             (z * 10 - 1200) * (x % 2 * 2 - 1),
        //         );
        //     }
        // }

        // console.log("plane", this.vertexPositions.length);

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