class Template {

    #box

    constructor(name, container, height, width) {
        this.#box = new InteractiveBox(name, container, height, width)
    
        this.#box.draw = (ctx, refresh) => {
            // draw fuction
        };

        this.#box.onTimeTravel = value => {
            // onTimeTravel function
        }

        this.#box.setPoints = points => {
            // setPoints function
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