class InteractiveBox {

    name;
    height;
    width;
    #schedulerTask = -1;
    #canvas;
    #ctx;
    #timeline;

    constructor(name, container, height, width) {
        this.name = name;
        this.height = height;
        this.width = width;

        document.getElementById(container).innerHTML = ''
            + '<canvas id="' + name + '_canvas" width="' + width + '" height="' + height + '"></canvas>'
            + '<br>'
            + '<button id="' + name + '_playButton">&#10074;&#10074;</button>'
            + '<input id="' + name + '_timeline" type="range" min="0" max="1" step="0.01"></input>';

        this.#timeline = document.getElementById(name + '_timeline')
        this.#canvas = document.getElementById(name + '_canvas');
        this.#ctx = this.#canvas.getContext('2d');

        document.getElementById(name + '_playButton').onclick = () => {
            document.getElementById(name + '_playButton').innerHTML = this.toggle() ? '&#10074;&#10074;' : '&#9658;'
        };

        this.#initTimeline();
        this.#initDrawablePath();
    }

    setTime(value) {
        this.#timeline.value = value;
    }

    resume() {
        this.#schedulerTask = setInterval(() => this.draw(this.#ctx), 25);
    }

    pause() {
        clearInterval(this.#schedulerTask);
        this.#schedulerTask = -1;
    }

    isPlaying() {
        return this.#schedulerTask != -1;
    }
    
    toggle() {
        this.isPlaying() ? this.pause() : this.resume();
        return this.isPlaying();
    }

    draw(ctx, refresh) {
        throw 'The function draw() has not been overwritten'
    }

    // {x,y}
    setPoints(points) {
        throw 'The function setPoints(points) has not been overwritten'
    }

    onTimeTravel(value) {
        throw 'The function onTimeTravel(value) has not been overwritten'
    }

    clearCanvas() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    // drawable path
    #drawingPath = false;
    #points = [];

    #initDrawablePath() {
        this.#canvas.onmousedown = () => {
            this.#drawingPath = true;
            this.pause();
            this.clearCanvas();
            
            // show path being drawn
            this.#ctx.beginPath();
        };

        this.#canvas.onmouseup = () => {
            this.#drawingPath = false;
            
            while (this.#points.length > 100) {
                //remove random points
                this.#points.splice((Math.random() * this.#points.length) | 0, 1);
            }

            if (this.#points.length > 2) {
                this.setPoints(this.#points);
            }
            this.#points = [];

            this.resume();

            // update button icon
            document.getElementById(this.name + '_playButton').innerHTML = '&#10074;&#10074;';
        };

        this.#canvas.onmousemove = e => {
            if (!this.#drawingPath) {
                return;
            }

            // show path being drawn
            if (this.#points.length == 0) {
                this.#ctx.moveTo(e.offsetX, e.offsetY);
            } else {
                this.#ctx.lineTo(e.offsetX, e.offsetY);
                this.#ctx.stroke();
            }

            this.#points.push({
                x: e.offsetX,
                y: e.offsetY
            });
        };
    }

    #wasPlaying = false;
    #initTimeline() {
        this.#timeline.onmousedown = _ => {
            this.#wasPlaying = this.isPlaying();
            this.pause();
        };

        this.#timeline.onmouseup = _ => {
            if (this.#wasPlaying) {
                this.resume();
            }
        };

        this.#timeline.oninput = () => {
            this.onTimeTravel(this.#timeline.value);
            this.setTime(this.#timeline.value);
            this.draw(this.#ctx);
        }
    }

}