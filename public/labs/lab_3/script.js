const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');

// Size parameters for pictures.
const width = 130;
const count = 3;

let position = 0;

function cycleRight() {
  position += width * count;
  position = Math.min(position, 0);
  slider.style.marginLeft = `${position}px`;
}

function cycleLeft() {
  position -= width * count;
  position = Math.max(position, -width * (slides.length - count));
  slider.style.marginLeft = `${position}px`;
}

carousel.querySelector('.prev').onclick = cycleRight;
carousel.querySelector('.next').onclick = cycleLeft;