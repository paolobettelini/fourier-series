class FourierTransform extends InteractiveBox {

    #dtf_abs;
    #counter;

    constructor(name, container, height, width) {
        super(name, container, height, width)

        this.setPoints(this.#getSineWave());
    }

    draw(ctx) {
        this.clearCanvas();

        this.setTime(this.#counter++ / (this.#dtf_abs.length - 1));
        if (this.#counter > this.#dtf_abs.length) {
            this.#counter = 0;
        }

        ctx.beginPath();
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = 'red';
        ///////////////////////////////////
        ctx.moveTo(0, this.#dtf_abs[0]);
        for (var i = 1; i < this.#counter; i++) {
            //ctx.lineTo(this.#signal_DFT[i].Re, this.#signal_DFT[i].Im);
            ctx.lineTo(i, this.#dtf_abs[i]);
        }
        ///////////////////////////////////
        ctx.stroke();
    }

    onTimeTravel(value) {
        // onTimeTravel function
    }

    setPoints(points) {
        if (points.length < 3) {
            return;
        }
        this.#counter = 0;

        this.#dtf_abs = [];
        let signal_DFT = Fourier.dft(points);

        for (var i = 0; i < signal_DFT.length; i++) {
            this.#dtf_abs[i] = signal_DFT[i].Im * signal_DFT[i].Im + signal_DFT[i].Re * signal_DFT[i].Re;
        }

        console.log(this.#dtf_abs);
    }

    #getSineWave() {
        var path = [];
        for (var i = 0; i < 100; i++) {
            path[i] = 100 * Math.sin(Math.PI * 2 / 100 * i)
        }
        return path;
    }

}