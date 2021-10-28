class CenterOfMass extends InteractiveBox {

    axisColor = '#FF0000';
    plotColor = '#FFFF00';
    centerOfMassColor = "#3385ff";
    axisWidth = 1.0;
    plotWidth = 2.0;
    centerOfMassWidth = 10;

    #signal = [];

    #freq = 1;
    #freqStep = 0.01;
    #minFreq = 0.25;
    #maxFreq = 5;

    constructor(name, container, height, width) {
        super(name, container, height, width);
        
        this.setPoints(this.#getSineWave());

        this.#loadAdditionalContent();
    }

    gay = 0;

    draw(ctx) {
        if (this.#signal.length < 2)
            return;

        this.setTime(((this.#freq += this.#freqStep) - this.#minFreq) / (this.#maxFreq - this.#freqStep - this.#minFreq));
        if (this.#freq > this.#maxFreq) {
            this.#freq = this.#minFreq;
        }

        this.clearCanvas();

        // constants
        const HALF_WIDTH = this.width / 2;
        const HALF_HEIGHT = this.height / 2;
        const HALF_PI = Math.PI / 2
        
        ctx.beginPath();
        ctx.lineWidth = this.axisWidth;
        ctx.strokeStyle = this.axisColor;
        
        ctx.moveTo(HALF_WIDTH, 0);
        ctx.lineTo(HALF_WIDTH, this.height);
        ctx.moveTo(0, HALF_HEIGHT);
        ctx.lineTo(this.width, HALF_HEIGHT);
        ctx.stroke();

        ctx.lineWidth = this.plotWidth;
        ctx.strokeStyle = this.plotColor;
        ctx.beginPath();

        let centerOfMassX = 0;
        let centerOfMassY = 0;

        // Double rotation

        // todo: refactor
        let a = 2 * Math.PI / this.#signal.length * this.#freq;
        ctx.moveTo(HALF_WIDTH, HALF_HEIGHT + this.#signal[0]);
        for (var i = 1; i < this.#signal.length; i++) {
            let angle = a * i + HALF_PI;
            let x = HALF_WIDTH + this.#signal[i] * Math.cos(angle); 
            let y = HALF_HEIGHT + this.#signal[i] * Math.sin(angle);
            ctx.lineTo(x, y);
            centerOfMassX += x;
            centerOfMassY += y;
        }
        for (var i = 1; i < this.#signal.length; i++) {
            let angle = a * (i + this.#signal.length) + HALF_PI;
            let index = i % this.#signal.length;
            let x = HALF_WIDTH + this.#signal[index] * Math.cos(angle);
            let y = HALF_HEIGHT + this.#signal[index] * Math.sin(angle);
            ctx.lineTo(x, y);
            centerOfMassX += x;
            centerOfMassY += y;
        }
        ctx.stroke();

        centerOfMassX /= this.#signal.length * 2;
        centerOfMassY /= this.#signal.length * 2;

        
        ctx.strokeStyle = this.centerOfMassColor;
        ctx.lineWidth = this.centerOfMassWidth;
        ctx.beginPath();
        ctx.arc(centerOfMassX, centerOfMassY, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = this.axisWidth;
    };

    onTimeTravel(value) {
        this.#freq = this.#minFreq + value * (this.#maxFreq - this.#minFreq) | 0;
    }

    setPoints(points) {
        this.#signal = [];

        var minY = 1E6;
        for (var i = 0; i < points.length; i++) {
            if (points[i].y < minY) {
                minY = points[i].y;
            }
        }

        for (var i = 0; i < points.length; i++) {
            this.#signal[i] = minY - points[i].y;
        }

        this.#freq = this.#minFreq;
    };

    #loadAdditionalContent() {
        // todo: refactor
        this.container.insertAdjacentHTML(
            'beforeend', '<button id="' + this.name + '_sinewave">sine</button>');

        // Sine Wave Button
        document.getElementById(this.name + '_sinewave').onclick = () => this.setPoints(this.#getSineWave());
    }

    #getSineWave() {
        var path = [];
        for (var i = 0; i < 100; i++) {
            path[i] = {
                x: 0,
                y: 100 * Math.sin(Math.PI * 2 / 100 * i)
            }
        }
        return path;
    }

}