class PolarPlot extends InteractiveBox {

    axisColor = '#FF0000';
    plotColor = '#FFFF00';
    axisWidth = 1.0;
    plotWidth = 2.0;
    freq = 1;

    #signal = [];
    #counter = 0;

    constructor(name, container, height, width) {
        super(name, container, height, width);
        
        this.setPoints(this.#getSineWave());

        this.#loadAdditionalContent();
    }

    draw(ctx) {
        if (this.#signal.length < 2)
            return;

        this.setTime(this.#counter++ / (this.#signal.length - 1));
        if (this.#counter > this.#signal.length) {
            this.#counter = 0;
        }

        this.clearCanvas();
        
        ctx.beginPath();
        ctx.lineWidth = this.axisWidth;
        ctx.strokeStyle = this.axisColor;
        
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2, this.height);
        ctx.moveTo(0, this.height / 2);
        ctx.lineTo(this.width, this.height / 2);
        ctx.stroke();
        
        ctx.lineWidth = this.plotWidth;
        ctx.strokeStyle = this.plotColor;
        ctx.beginPath();
        ctx.moveTo(this.width / 2, this.height / 2 + this.#signal[0]);
        for (var i = 1; i < this.#counter; i++) {
            var angle = 2 * Math.PI / this.#signal.length * i * this.freq + Math.PI / 2;
            ctx.lineTo(this.width / 2 + this.#signal[i] * Math.cos(angle), this.height / 2 + this.#signal[i] * Math.sin(angle));
        }
        ctx.stroke();
    };

    onTimeTravel(value) {
        this.#counter = value * this.#signal.length | 0;
    }

    setPoints(points) {
        this.#signal = [];

        var minY = 10E5;
        for (var i = 0; i < points.length; i++) {
            if (points[i].y < minY) {
                minY = points[i].y;
            }
        }

        for (var i = 0; i < points.length; i++) {
            this.#signal[i] = minY - points[i].y;
        }

        this.#counter = 0;
    };

    #loadAdditionalContent() {
        // todo: refactor
        this.container.insertAdjacentHTML(
            'beforeend', '<br><p id=' + this.name + '_frequencyLabel>Frequency: 1</p><input id="' + this.name + '_frequency" type="range" min="0.5" value="1" step="0.25" max="3"><button id="' + this.name + '_sinewave">sine</button>');

        // Frequency input
        let freqInput = document.getElementById(this.name + '_frequency');
        let frequencyLabel = document.getElementById(this.name + '_frequencyLabel');
        freqInput.oninput = () => {
            this.freq = freqInput.value;
            this.#counter = 0; // restart
            frequencyLabel.innerHTML = 'Frequency: ' + this.freq;
        }

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