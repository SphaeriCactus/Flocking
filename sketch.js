let flock;

let alignmentSlider, cohesionSlider, separationSlider;
let alignmentValue, cohesionValue, separationValue;

function setup() {
    createCanvas(windowWidth, 800);

    alignmentSlider = select("#alignmentSlider");
    cohesionSlider = select("#cohesionSlider");
    separationSlider = select("#separationSlider");
    alignmentSlider.value(1);
    cohesionSlider.value(1);
    separationSlider.value(2);

    alignmentValue = select("#alignmentValue");
    cohesionValue = select("#cohesionValue");
    separationValue = select("#separationValue");

    alignmentValue.html(alignmentSlider.value());
    cohesionValue.html(cohesionSlider.value());
    separationValue.html(separationSlider.value());

    flock = new Flock(300);
}

function draw() {
    background(0);

    flock.update();
    flock.show();

    alignmentValue.html(alignmentSlider.value());
    cohesionValue.html(cohesionSlider.value());
    separationValue.html(separationSlider.value());
}