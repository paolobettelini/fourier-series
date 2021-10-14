class CenterOfMass /*extends InteractiveBox*/ {

    #box
    
    #signal = [];
    #counter = 0;
    #freq = 1;

    constructor(name, container, height, width) {
        this.#box = new InteractiveBox(name, container, height, width)
    
        this.#box.draw = (ctx, refresh) => {
            if (this.#signal.length < 2)
                return;

            this.#box.clearCanvas();
            
            
            ctx.beginPath();
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = 'red';
            
            ctx.moveTo(this.#box.width / 2, 0);
            ctx.lineTo(this.#box.width / 2, this.#box.height);
            ctx.moveTo(0, this.#box.height / 2);
            ctx.lineTo(this.#box.width, this.#box.height / 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.#box.width / 2 + this.#signal[0] * Math.cos(angle), this.#box.height / 2 + this.#signal[0] * Math.sin(angle));
            for (var i = 1; i < this.#counter; i++) {
                var angle = 2 * Math.PI / this.#signal.length * i * this.#freq;
                ctx.lineTo(this.#box.width / 2 + this.#signal[i] * Math.cos(angle), this.#box.height / 2 + this.#signal[i] * Math.sin(angle));
            }
            ctx.stroke();

            if (!refresh) {
                if (this.#counter++ >= this.#signal.length) {
                    this.#counter = 0;
                }
                this.#box.setTime(this.#counter / this.#signal.length);
            }
        };

        this.#box.onTimeTravel = value => {
            this.#counter = value * this.#signal.length | 0;
        }

        this.#box.setPoints = points => {
            this.#signal = [];

            var minY = 99999;
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

        this.#box.setPoints(this.#getDefaultPath());
        this.#box.resume();
    }

    #getDefaultPath() {
        var path = [];
        for (var i = 0; i < 100; i++) {
            path[i] = {
                x: 0,
                y: 100 * Math.sin(Math.PI * 2 / 100 * i)
            }
        }
        return path;
    }

    /*
    ottimizzare i disegni
    usare ereditarietà
    implementare stop/resume a seconda dello visiblità
    
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    */

}