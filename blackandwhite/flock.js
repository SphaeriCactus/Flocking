class Flock {
    constructor(numberOfBoids) {
        this.boids = [];
        this.snapshot;
        for (let i = 0; i < numberOfBoids; i ++) {
            this.boids.push(new Boid(random(width), random(height)));
        }
    }

    update() {
        this.snapshot = Array.from(this.boids);
        for (let i = 0; i < this.boids.length; i ++) {
            this.boids[i].flock(this.snapshot);
            this.boids[i].update();
        }
    }

    show() {
        for (let i = 0; i < this.boids.length; i ++) {
            this.boids[i].show();
        }
    }
}
