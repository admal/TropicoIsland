class RgbColor {
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    getColorVector(){
        return [this.r / 255.0, this.g / 255.0, this.b / 255.0, 1.0];
    }
}