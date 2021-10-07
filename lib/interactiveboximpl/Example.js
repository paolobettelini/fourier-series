class Example {

    #box
    #points = []
    #counter = 0

    constructor(name, container, height, width) {
        this.#box = new InteractiveBox(name, container, height, width)
    
        this.#box.draw = ctx => {
            if (this.#points.length < 2)
                return;

            this.#box.clearCanvas();

            if (this.#counter++ >= this.#points.length) {
                this.#counter = 0;
            }

            this.#box.setTime(this.#counter / this.#points.length)

            ctx.beginPath();
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = 'red';
            ctx.moveTo(this.#points[0].x, this.#points[0].y);
            for (var i = 0; i < this.#counter; i++) {
                ctx.lineTo(this.#points[i].x, this.#points[i].y);
            }
            ctx.stroke();
        };

        this.#box.onTimeTravel = value => {
            this.#counter = value / this.#points.length
            console.log(this.#counter);
        }

        this.#box.setPoints = points => {
            this.#counter = 0;
            this.#points = points;
        };

        this.#box.setPoints(this.#getDefaultPath());

        this.#box.resume();
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