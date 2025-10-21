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
  const prevButtonSvg = document.getElementById("prev-btn-svg");
  const nextButtonSvg = document.getElementById("next-btn-svg");

  // --- Parsing Data ---
  let originalFlashcards = [];
  const dataToParse = typeof dataString !== "undefined" ? dataString : "";
  const lines = dataToParse.trim().split("\n");

  for (const line of lines) {
    if (line.trim() === "" || line.startsWith(";")) continue;
    try {
      const firstComma = line.indexOf(",");
      const front = line.substring(0, firstComma).trim();
      const lastComma = line.lastIndexOf(",");
      const level = line.substring(lastComma + 1).trim();
      const middlePart = line.substring(firstComma + 1, lastComma).trim();
      const middleComma = middlePart.indexOf(",");
      const hiragana = middlePart.substring(0, middleComma).trim();
      let definition = middlePart.substring(middleComma + 1).trim();
      if (definition.startsWith('"') && definition.endsWith('"')) {
        definition = definition.substring(1, definition.length - 1);
      }
      const back = `<div class="hiragana">${hiragana}</div><div class="definition">${definition}</div><div class="level">${level}</div>`;
      originalFlashcards.push({ front: front, back: back });
    } catch (e) {
      console.error("Gagal mem-parsing baris:", line, e);
    }
  }

  // DIUBAH: `displayedFlashcards` akan selalu menjadi array yang ditampilkan, baik teracak maupun tidak.
  let displayedFlashcards = [...originalFlashcards];
  let currentCardIndex = 0;
  let isFlipped = false;
  let isShuffled = false;

  // --- Fungsi Mode Gelap ---
  function handleThemeToggle() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (themeLabel) {
      themeLabel.textContent = isDarkMode ? "Mode Terang" : "Mode Gelap";
    }
  }

  // --- Fungsi Flashcard ---
  function showCard(index) {
    if (displayedFlashcards.length === 0) {
      cardFront.textContent = "Data Kosong";
      cardBack.innerHTML = "";
      cardCounter.textContent = "0 / 0";
      return;
    }
    currentCardIndex = (index + displayedFlashcards.length) % displayedFlashcards.length;
    const cardData = displayedFlashcards[currentCardIndex];
    cardFront.textContent = cardData.front;
    cardBack.innerHTML = cardData.back;
    cardCounter.textContent = `${currentCardIndex + 1} / ${displayedFlashcards.length}`;
    if (isFlipped) {
      isFlipped = false;
      card.classList.remove("is-flipped");
    }
  }
  
  // Fungsi untuk mengacak array (Algoritma Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // DIUBAH: Logika toggle acak untuk menjaga posisi counter
  function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleButton.classList.toggle('active', isShuffled);
    
    // Simpan index saat ini untuk menjaga posisi di counter
    const savedIndex = currentCardIndex;

    if (isShuffled) {
      // Saat acak diaktifkan, acak salinan baru dari kartu asli.
      displayedFlashcards = shuffleArray([...originalFlashcards]);
    } else {
      // Saat acak dinonaktifkan, kembali ke urutan kartu asli.
      displayedFlashcards = [...originalFlashcards];
    }

    // Tampilkan kartu pada index yang sama. Konten kartu akan berubah,
    // tapi nomor counter akan tetap sama.
    showCard(savedIndex);
  }

  function flipCard() {
    if (displayedFlashcards.length > 0) {
      isFlipped = !isFlipped;
      card.classList.toggle("is-flipped");
    }
  }
  function nextCard() {
    if (displayedFlashcards.length > 0) transitionToCard(currentCardIndex + 1);
  }
  function prevCard() {
    if (displayedFlashcards.length > 0) transitionToCard(currentCardIndex - 1);
  }
  function transitionToCard(newIndex) {
    if (!appContainer.classList.contains("is-changing")) {
      appContainer.classList.add("is-changing");
      setTimeout(() => {
        showCard(newIndex);
        appContainer.classList.remove("is-changing");
      }, 200);
    }
  }

  // --- Event Listeners ---
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

  if(prevButtonSvg) prevButtonSvg.addEventListener("click", prevCard);
  if(nextButtonSvg) nextButtonSvg.addEventListener("click", nextCard);

  let touchStartX = 0;
  let touchStartY = 0;

  if (cardScene) {
    cardScene.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );
    cardScene.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const swipeDistX = touchEndX - touchStartX;
        const swipeDistY = touchEndY - touchStartY;
        if (
          Math.abs(swipeDistX) > Math.abs(swipeDistY) &&
          Math.abs(swipeDistX) > 50
        ) {
          if (swipeDistX < 0) {
            nextCard();
          } else {
            prevCard();
          }
        }
      },
      { passive: true }
    );
  }

  // --- Inisialisasi ---
  if (document.body.classList.contains("dark-mode")) {
    if (themeToggle) themeToggle.checked = true;
  }
  if (themeLabel) {
    themeLabel.textContent = themeToggle.checked ? "Mode Terang" : "Mode Gelap";
  }
  showCard(0);
});

