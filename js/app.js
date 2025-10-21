document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  const card = document.getElementById("flashcard");
  const cardFront = document.getElementById("card-front");
  const cardBack = document.getElementById("card-back");
  const cardCounter = document.getElementById("card-counter");
  const themeToggle = document.getElementById("checkbox");
  const themeLabel = document.getElementById("theme-label");
  const cardScene = document.querySelector(".card-scene");
  const shuffleButton = document.getElementById("shuffle-button");
  const prevButtonSVG = document.getElementById("prev-button-svg");
  const nextButtonSVG = document.getElementById("next-button-svg");

  const originalFlashcards = [];
  let currentFlashcards = [];
  let currentCardIndex = 0;
  let isFlipped = false;
  let isShuffled = false;

  // Cek jika dataString ada, jika tidak, hentikan eksekusi
  if (typeof dataString === "undefined" || dataString.trim() === "") {
    cardFront.textContent = "Data tidak ditemukan.";
    cardCounter.textContent = "0 / 0";
    console.error("Variabel dataString tidak ada atau kosong.");
    return; // Hentikan script jika tidak ada data
  }

  const lines = dataString.trim().split("\n");

  for (const line of lines) {
    if (line.trim() === "" || line.startsWith(";")) continue;
    try {
      const parts = line.split(",");
      if (parts.length < 3) continue;

      const front = parts[0].trim();
      const hiragana = parts[1].trim();
      const level = parts[parts.length - 1].trim();
      // Gabungkan sisa bagian sebagai definisi
      let definition = parts
        .slice(2, parts.length - 1)
        .join(",")
        .trim();
      // Hapus tanda kutip jika ada
      if (definition.startsWith('"') && definition.endsWith('"')) {
        definition = definition.substring(1, definition.length - 1);
      }
      const back = `<div class="hiragana">${hiragana}</div><div class="definition">${definition}</div><div class="level">${level}</div>`;
      originalFlashcards.push({ front, back });
    } catch (e) {
      console.error("Gagal mem-parsing baris:", line, e);
    }
  }
  currentFlashcards = [...originalFlashcards];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function showCard(index) {
    if (currentFlashcards.length === 0) return;

    currentCardIndex =
      (index + currentFlashcards.length) % currentFlashcards.length;

    const newCardData = currentFlashcards[currentCardIndex];
    cardFront.textContent = newCardData.front;
    cardBack.innerHTML = newCardData.back;
    cardCounter.textContent = `${currentCardIndex + 1} / ${
      currentFlashcards.length
    }`;
    if (isFlipped) {
      isFlipped = false;
      card.classList.remove("is-flipped");
    }
  }

  function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleButton.classList.toggle("active", isShuffled);

    const currentCardBeforeToggle = currentFlashcards[currentCardIndex];

    if (isShuffled) {
      currentFlashcards = [...originalFlashcards];
      shuffleArray(currentFlashcards);
    } else {
      currentFlashcards = [...originalFlashcards];
    }

    const newIndex = currentFlashcards.findIndex(
      (card) =>
        card.front === currentCardBeforeToggle.front &&
        card.back === currentCardBeforeToggle.back
    );
    currentCardIndex = newIndex !== -1 ? newIndex : 0;

    showCard(currentCardIndex);
  }

  function flipCard() {
    if (currentFlashcards.length > 0) {
      isFlipped = !isFlipped;
      card.classList.toggle("is-flipped");
    }
  }

  function transitionToCard(newIndex) {
    if (!appContainer.classList.contains("is-changing")) {
      appContainer.classList.add("is-changing");
      setTimeout(() => {
        showCard(newIndex);
        appContainer.classList.remove("is-changing");
      }, 150); // Durasi sedikit lebih cepat
    }
  }

  function nextCard() {
    if (currentFlashcards.length > 0) transitionToCard(currentCardIndex + 1);
  }

  function prevCard() {
    if (currentFlashcards.length > 0) transitionToCard(currentCardIndex - 1);
  }

  function handleThemeToggle() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (themeLabel) {
      themeLabel.textContent = isDarkMode ? "Mode Terang" : "Mode Gelap";
    }
  }

  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
      e.preventDefault();
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
        flipCard();
        break;
      case "ArrowRight":
        nextCard();
        break;
      case "ArrowLeft":
        prevCard();
        break;
    }
  });

  if (card) card.addEventListener("click", flipCard);
  if (themeToggle) themeToggle.addEventListener("change", handleThemeToggle);
  if (shuffleButton) shuffleButton.addEventListener("click", toggleShuffle);
  if (prevButtonSVG) prevButtonSVG.addEventListener("click", prevCard);
  if (nextButtonSVG) nextButtonSVG.addEventListener("click", nextCard);

  let touchStartX = 0;
  if (cardScene) {
    cardScene.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    cardScene.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const swipeDistX = touchEndX - touchStartX;
        if (Math.abs(swipeDistX) > 50) {
          if (swipeDistX < 0) nextCard();
          else prevCard();
        }
      },
      { passive: true }
    );
  }

  if (document.body.classList.contains("dark-mode")) {
    if (themeToggle) themeToggle.checked = true;
  }
  if (themeLabel) {
    themeLabel.textContent = themeToggle.checked ? "Mode Terang" : "Mode Gelap";
  }
  showCard(0);
});
