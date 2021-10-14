class FourierSeries {
    
    #box
    #counter = 0
    
    signalY = []
    signalX = []
    
    signalY_DFT;
    signalX_DFT;

    epicyclesColor = '#00CCFF';
    linesColor = '#FFFFFF';
    pathColor = '#FFFF00';

    constructor(name, container, height, width) {
        this.#box = new InteractiveBox(name, container, height, width)
    
        this.#box.draw = (ctx, refresh) => {
            if (!refresh) {
                if (++this.#counter >= this.signalX.length) {
                    this.#counter = 0;
                }
            }
            
            this.#box.setTime(this.#counter / this.signalY.length);
            
            // name these variables properly
            var a = 300;
            var b = 300;
            var c = 100;
            var d = 100;
            
            this.#box.clearCanvas();
            
            var lastPointX = this.drawEpicycles(ctx, this.signalX_DFT, a, c, 0);
            var lastPointY = this.drawEpicycles(ctx, this.signalY_DFT, d, b, Math.PI * 0.5);
            
            ctx.strokeStyle = this.linesColor;
            ctx.beginPath();
            
            ctx.moveTo(d + lastPointY.x, b + lastPointY.y);
            // since the horizontal line oscillates vertically,
            // it gives the impression of being bigger with
            // repect to the other one.            
            ctx.lineWidth = 0.25;
            ctx.lineTo(a + lastPointX.x, b + lastPointY.y);
            
            ctx.stroke();
            ctx.lineWidth = 0.5;
            ctx.lineTo(a + lastPointX.x, c + lastPointX.y);
            ctx.stroke();
            
            
            ctx.beginPath();
            //ctx.lineWidth = 1.0;
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = this.pathColor;
            ctx.moveTo(a + this.signalX[0], this.signalY[0] + b);
            for (var i = 1; i < this.#counter; i++) {
                ctx.lineTo(a + this.signalX[i], this.signalY[i] + b);
            }
            ctx.stroke();
        };

        this.#box.onTimeTravel = value => {
            this.#counter = value * this.signalY.length | 0;
        }

        this.#box.setPoints = points => {
            this.signalX = [];
            this.signalY = [];

            // remove offset
            var minX = 999999;
            var minY = 999999;
            for (var i = 0; i < points.length; i++) {
                if (points[i].x < minX) {
                    minX = points[i].x;
                }

                if (points[i].y < minY) {
                    minY = points[i].y;
                }
            }

            for (var i = 0; i < points.length; i++) {
                this.signalX[i] = points[i].x - minX;
                this.signalY[i] = points[i].y - minY;
            }

            this.#counter = 0;

            this.signalY_DFT = Fourier.dft(this.signalY);
            this.signalX_DFT = Fourier.dft(this.signalX);
        };

        this.#box.setPoints(this.#getDefaultPath());

        this.#box.resume();
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

            var arg = freq * this.#counter / this.signalY.length * 2 * Math.PI + phase + rot;
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
        var circle = [];
        for (var i = 0; i < 100; i++) {
            circle[i] = {
                x: 250 + 50 * Math.cos(Math.PI * 2 / 100 * i),
                y: 250 + 50 * Math.sin(Math.PI * 2 / 100 * i)
            }
        }
        return circle;
    }

}