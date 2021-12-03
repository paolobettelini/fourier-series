class InteractiveBox {

    static PAUSED = '&#9658;';
    static PLAYING = '&#10074;&#10074;';

    static #names = [];

    name;
    height;
    width;
    container;
    
    #schedulerTask = -1;
    #canvas;
    #ctx;
    #timeline;
    #playButton;

    #wasPlaying;

    constructor(name, container, height, width) {
        // check for name conflict
        if (InteractiveBox.#names.includes(name)) {
            throw 'The name \'' + name + '\' is already being used! Names should be unique to avoid conflicts.'
        }

        // Add name to static list
        InteractiveBox.#names.push(name);

        this.name = name;
        this.height = height;
        this.width = width;
        this.#wasPlaying = true;
        this.container = document.getElementById(container);

        this.container.innerHTML = ''
            + '<canvas class="box" id="' + name + '_canvas" width="' + width + '" height="' + height + '"></canvas>'
            + '<br>'
            + '<button class="box" id="' + name + '_playButton">&#10074;&#10074;</button>'
            + '<input class="box" id="' + name + '_timeline" type="range" min="0" max="1" step="0.01"></input>';

        this.#timeline = document.getElementById(name + '_timeline')
        this.#canvas = document.getElementById(name + '_canvas');
        this.#ctx = this.#canvas.getContext('2d');
        this.#playButton = document.getElementById(name + '_playButton');

        this.#playButton.onclick = () => {
            this.#playButtonClick();
        };

        this.#initTimeline();
        this.#initDrawablePath();

        // Pause/Resume based on visibility
        document.addEventListener('scroll', () => this.#onScroll());

        // Start if visible
        this.#onScroll();
    }

    #playButtonClick() {
        this.#playButton.innerHTML = this.toggle() ? InteractiveBox.PLAYING : InteractiveBox.PAUSED
    }

    setTime(value) {
        this.#timeline.value = value;
    }

    resume() {
        if (this.#isElementInViewport(this.#canvas)) {
            this.#schedulerTask = setInterval(() => this.draw(this.#ctx), 25);
            this.#playButton.innerHTML = InteractiveBox.PLAYING;
        }
    }

    pause() {
        clearInterval(this.#schedulerTask);
        this.#schedulerTask = -1;
        this.#playButton.innerHTML = InteractiveBox.PAUSED;
    }

    isPlaying() {
        return this.#schedulerTask != -1;
    }
    
    toggle() {
        this.isPlaying() ? this.pause() : this.resume();
        return this.isPlaying();
    }

    draw(ctx) {
        throw 'The function draw() has not been overwritten'
    }

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
                this.resume();
            } else {
                // toggle state (?)
            }

            this.#points = [];
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

    #wasTimelinePlaying = false;
    #initTimeline() {
        this.#timeline.onmousedown = _ => {
            this.#wasTimelinePlaying = this.isPlaying();
            this.pause();
        };

        this.#timeline.onmouseup = _ => {
            if (this.#wasTimelinePlaying) {
                this.resume();
            }
        };

        this.#timeline.oninput = () => {
            this.onTimeTravel(this.#timeline.value);
            this.setTime(this.#timeline.value);
            this.draw(this.#ctx);
        }
    }

    // Checks if the elements is at least a bit visible in the viewport
    #isElementInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) ||
            rect.bottom >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    // Pause/Resume rendering if not visible
    // The status of the box is preserved
    #onScroll() {
        if (this.#isElementInViewport(this.#canvas)) {
            if (!this.isPlaying() && this.#wasPlaying) {
                this.resume();
                this.#wasPlaying = false;
            }
        } else {
            if (this.isPlaying()) {
                this.#wasPlaying = true;
                this.pause();
            }
        }
    }

}