export class GoldenColorGenerator
{
    private readonly goldenAngle = 137.508;
    private hue = Math.random() * 360;

    constructor({ hue = Math.random() * 360 }: { hue?: number } = { })
    {
        this.hue = hue % 360;
    }

    public next({ lightness, saturation }: { saturation: number, lightness: number }): {
        hue: number,
        saturation: number,
        lightness: number
    }
    {
        this.hue = (this.hue + this.goldenAngle) % 360;
        return {
            hue: this.hue,
            saturation,
            lightness
        };
    }
};