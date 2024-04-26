const initOpen = () => {
  const loader = document.getElementById("loader");
  const dotContainer = document.querySelector(".dot-container");
  const circle = document.getElementById("circle");
  const timerElement = document.getElementById("timer");

  // Check if the timer element exists before accessing its dataset
  if (!timerElement) {
    console.error("Timer element not found");
    return;
  }

  let counter = parseInt(timerElement.dataset.count);

  let dotCount;
  switch (counter) {
    case 10:
      dotCount = 40;
      break;
    case 20:
      dotCount = 40;
      break;
    case 30:
      dotCount = 30;
      break;
    case 40:
      dotCount = 40;
      break;
    default:
      dotCount = 40; // Default value
      break;
  }

  const dots = [];
  let duration = 1.5;

  const dotsPerSecond = dotCount / counter;

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    dot.style.transform = `rotate(${
      i * (360 / dotCount)
    }deg) translate(0, -140px)`;
    dot.style.animationDuration = `${duration}s`;
    dots.push(dot);
    dotContainer.appendChild(dot);
    if (
      (counter === 10 || counter === 20 || counter === 40) &&
      (i === 0 || i === 10 || i === 20 || i === 30)
    ) {
      dot.classList.add("large");
    }

    if (counter === 30 && (i === 0 || i === 7 || i === 15 || i === 22)) {
      dot.classList.add("large-dots");
    }
  }

  // Start the timer
  const timer = setInterval(() => {
    counter--;
    if (counter >= 0) {
      fillNextDots();
      timerElement.innerText = counter;
    } else {
      clearInterval(timer);
      fillNextDots(dots.length); // Fill all remaining dots
      circle.style.display = "block";
    }
  }, 1000);

  let currentDotIndex = 0;

  function fillNextDots() {
    const dotsToFill = Math.min(
      Math.ceil(dotsPerSecond),
      dots.length - currentDotIndex
    );
    for (let i = 0; i < dotsToFill; i++) {
      dots[currentDotIndex].classList.add("filled");
      currentDotIndex++;
    }
    duration = counter >= 0 ? 1 / dotsPerSecond : 1; // Calculate new duration
    dots.forEach((dot) => (dot.style.animationDuration = `${duration}s`));
  }
};
