class FourierTransform extends InteractiveBox {

    #counter;
    #values;

    constructor(name, container, height, width) {
        super(name, container, height, width)

        this.setPoints(this.#getSineWave());
    }

    draw(ctx) {
        this.clearCanvas();

        this.setTime(this.#counter++ / (this.#values.length - 1));
        if (this.#counter > this.#values.length) {
            this.#counter = 0;
        }

        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'blue';
        ctx.moveTo(0, this.height / 2);
        ctx.lineTo(this.width, this.height / 2);
        ctx.stroke();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3.0;
        ctx.beginPath();

        ctx.moveTo(0, this.height / 2 - this.#values[0]);
        for (var i = 1; i < this.#counter; i++) {
            ctx.lineTo(i * 10, this.height / 2 - this.#values[i]);
        }
        ctx.stroke();
    }

    onTimeTravel(value) {
        this.#counter = value * this.#values.length | 0;
    }

    setPoints(points) {
        if (points.length < 3) {
            return;
        }
        
        this.#counter = 0;
        
        let minY = 10E5;
        let maxY = -10E5;
        for (var i = 0; i < points.length; i++) {
            if (points[i].y < minY) {
                minY = points[i].y;
            }

            if (points[i].y > maxY) {
                maxY = points[i].y;
            }
        }

        this.#values = [];

        let offset = (minY - maxY) * 0.5;

        // Computer fourier transform in [0;5]
        for (var k = 0; k < 5; k += 0.1) {
            var sumRe = 0;
            var sumIm = 0;

            for (var n = 0; n < points.length; n++) {
                var angle = 2 * Math.PI * k * n / points.length;
                sumRe += (points[n].y - minY + offset) * Math.cos(angle);
                sumIm -= (points[n].y - minY + offset) * Math.sin(angle);
            }

            sumRe /= points.length;
            sumIm /= points.length;

            let mul = 3; // increase change
            this.#values.push(Math.sqrt(sumRe * sumRe + sumIm * sumIm) * mul);
        }


    }

    #getSineWave() {
        var path = [];
        for (var i = 0; i < 100; i++) {
            path[i] = {
                x: i,
                y: 100 * Math.sin(Math.PI * 2 / 100 * i),
            };
        }
        return path;
    }

}