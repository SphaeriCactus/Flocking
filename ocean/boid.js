class Boid {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(1.5, 3));
        this.acceleration = createVector(0, 0);

        this.size = 2;
        this.perception = 100;

        this.maxSpeed = 4;
        this.maxForce = 0.2;

        this.hue = random(0, 360);
    }

    flock(boids) {
        let alignmentForce = this.alignment(boids);
        let cohesionForce = this.cohesion(boids);
        let separationForce = this.separation(boids);

        alignmentForce.mult(alignmentSlider.value());
        cohesionForce.mult(cohesionSlider.value());
        separationForce.mult(separationSlider.value());

        this.acceleration.add(alignmentForce);
        this.acceleration.add(cohesionForce);
        this.acceleration.add(separationForce);
    }

    alignment(boids) {
        let flockmates = this.getLocalFlockmates(boids, this.perception);
        let total = flockmates.length;

        let steering = createVector(0, 0);

        if (total > 0) {
            let desired = flockmates.map(b => b.velocity);
            desired = desired.reduce((a, b) => a.add(b), createVector(0, 0));
            desired.div(total);
            desired.setMag(this.maxSpeed);
            steering = p5.Vector.sub(desired, this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    cohesion(boids) {
        let flockmates = this.getLocalFlockmates(boids, this.perception);
        let total = flockmates.length;

        let steering = createVector(0, 0);

        if (total > 0) {
            let desiredPosition = flockmates.map(b => b.position);
            desiredPosition = desiredPosition.reduce((a, b) => a.add(b), createVector(0, 0));
            desiredPosition.div(total);
            let desired = p5.Vector.sub(desiredPosition, this.position);
            desired.setMag(this.maxSpeed);
            steering = p5.Vector.sub(desired, this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    separation(boids) {
        let flockmates = this.getLocalFlockmates(boids, this.perception/2);
        let total = 0;
        let desired = createVector();
        let steering = createVector();

        for (let i = 0; i < flockmates.length; i ++) {
            let difference = p5.Vector.sub(this.position, flockmates[i].position);
            difference.div(difference.mag ^ 2);
            desired.add(difference);
            total ++;
        }

        if (total > 0) {
            desired.div(total);
            desired.setMag(this.maxSpeed);
            steering = p5.Vector.sub(desired, this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    getLocalFlockmates(boids, perception) {
        let localFlockmates = [];

        for (let i = 0; i < boids.length; i ++) {
            if (boids[i] != this) {
                if (this.getDistance(boids[i]) <= perception) {
                    localFlockmates.push(boids[i]);
                }
            }
        }

        return localFlockmates;
    }

    getDistance(other) {
        //return sqrt(pow(min(abs(this.position.x - other.position.x), width - abs(this.position.x - other.position.x)), 2) + pow(min(abs(this.position.y - other.position.y), height - abs(this.position.y - other.position.y)), 2));
        return dist(this.position.x, this.position.y, other.position.x, other.position.y);
    }

    edges() {
        if (this.position.x < -10 && (this.velocity.heading() >= 1.5 || this.velocity.heading() <= -1.5)) this.position.x = width + 10;
        if (this.position.x > width + 10 && (this.velocity.heading() >= -1.5 && this.velocity.heading() <= 1.5)) this.position.x = -10;

        if (this.position.y < -10 && (this.velocity.heading() <= 0)) this.position.y = height + 10;
        if (this.position.y > height + 10 && (this.velocity.heading() > 0)) this.position.y = -10;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);

        this.edges();

        this.velocity.limit(this.maxSpeed);
    }

    show() {
        push();
            translate(this.position.x, this.position.y);
            rotate(this.velocity.heading());

            noStroke();
            fill(this.hue, 20, 87, 20);
            circle(0, 0, 100);
            circle(0, 0, 70);
            circle(0, 0, 40);
            circle(0, 0, 10);

            stroke(255);
            fill(255, 0, 100, 100);
            triangle(0, this.size / 3, 0, -this.size / 3, this.size, 0);
        pop();
    }
}