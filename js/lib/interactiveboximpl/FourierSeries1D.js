class FourierSeries1D extends InteractiveBox {

    epicyclesColor = '#00ccff';
    linesColor = '#ffffff';
    pathColor = '#ffff00';

    epicyclesXOffset = 100;
    epicyclesYOffset = 250;

    #counter = 0;
    #signal = [];
    #signal_DFT;

    constructor(name, container, height, width) {
        super(name, container, height, width)

        this.setPoints(this.#getDefaultPath());
    }

    draw(ctx) {
        // Set time
        this.setTime(this.#counter++ / (this.#signal.length - 1));
        if (this.#counter > this.#signal.length) {
            this.#counter = 0;
        }

        this.clearCanvas();
        
        // Draw epicycles
        var lastPoint = this.drawEpicycles(ctx, this.#signal_DFT, this.epicyclesXOffset, this.epicyclesYOffset, 0);
        
        ctx.strokeStyle = this.linesColor;
        ctx.beginPath();
        
        ctx.moveTo(this.epicyclesXOffset + lastPoint.x, this.epicyclesYOffset + lastPoint.y);
        ctx.lineWidth = 0.25;
        //ctx.lineTo(this.epicyclesXOffset + lastPoint.x, this.epicyclesYOffset + lastPoint.y);
        
        ctx.stroke();
        ctx.lineWidth = 0.5;
        //ctx.lineTo(this.verticalEpicyclesXOffset + lastPointX.x, this.verticalEpicyclesYOffset + lastPointX.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = this.pathColor;
        ctx.moveTo(this.epicyclesXOffset + 100 + (this.#counter - 1), this.#signal[0] + this.epicyclesYOffset);
        for (var i = 1; i < this.#counter; i++) {
            ctx.lineTo(this.epicyclesXOffset + 100 + (this.#counter - i - 1), this.#signal[i] + this.epicyclesYOffset);
        }
        
        ctx.stroke();
    };

    onTimeTravel(value) {
        this.#counter = value * this.#signal.length | 0;
    }

    setPoints(points) {
        this.#signal = [];

        // remove offset
        var minY = 10E5;
        for (var i = 0; i < points.length; i++) {
            if (points[i].y < minY) {
                minY = points[i].y;
            }
        }

        for (var i = 0; i < points.length; i++) {
            this.#signal[i] = points[i].y - minY;
        }

        this.#counter = 0;

        this.#signal_DFT = Fourier.dft(this.#signal);
    }

    drawEpicycles(ctx, fourier, xOff, yOff, rot) {
        var x = 0;
        var y = 0;

        for (var i = 0; i < fourier.length; i++) {
            var prevX = x;
            var prevY = y;

            // precompute these values
            var freq = i;
            var ampl = Math.sqrt(fourier[i].Re * fourier[i].Re + fourier[i].Im * fourier[i].Im);                
            var phase = Math.atan2(fourier[i].Im, fourier[i].Re);

            var arg = freq * this.#counter / this.#signal.length * 2 * Math.PI + phase + rot;
            x += ampl * Math.cos(arg);
            y += ampl * Math.sin(arg);

            ctx.lineWidth = 1.0;
            ctx.strokeStyle = this.epicyclesColor;
            ctx.beginPath();
            ctx.arc(xOff + prevX, yOff + prevY, ampl, 0, Math.PI * 2);
            ctx.stroke();
           
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = this.linesColor;
            ctx.beginPath();
            ctx.moveTo(xOff + prevX, yOff + prevY);
            ctx.lineTo(xOff + x, yOff + y);
            ctx.stroke();
        }

        return {x, y}
    }

    #getDefaultPath() {
        let result = [];

        for (var i = 0; i < 100; i++) {
            result[i] = 100 * Math.sin(i / 200 * Math.PI / 2);
        }

        return result;
    }

}