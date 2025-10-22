document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const babId = urlParams.get("bab");
  const learningMode = urlParams.get("mode") || "bebas";

  if (!babId) {
    document.getElementById("card-front").textContent = "Bab tidak ditemukan.";
    console.error("Parameter 'bab' tidak ada di URL.");
    return;
  }

  const storageKey = `flashcardProgress_bab${babId}_mode${learningMode}`;

  function loadDataScript(callback) {
    const script = document.createElement("script");
    script.src = `../js/data_${babId}.js`;
    script.onload = () => {
      console.log(`data_${babId}.js loaded successfully.`);
      callback();
    };
    script.onerror = () => {
      console.error(`Failed to load data_${babId}.js.`);
      document.getElementById(
        "card-front"
      ).textContent = `Data untuk Bab ${babId} tidak ditemukan.`;
    };
    document.head.appendChild(script);
  }

  loadDataScript(initializeApp);

  function initializeApp() {
    document.body.classList.add("mode-" + learningMode);

    const appContainer = document.getElementById("app");
    const card = document.getElementById("flashcard");
    // ... (sisa const elemen) ...
    const cardFront = document.getElementById("card-front");
    const cardBack = document.getElementById("card-back");
    const cardCounter = document.getElementById("card-counter");
    const themeToggle = document.getElementById("checkbox");
    const themeLabel = document.getElementById("theme-label");
    const cardScene = document.querySelector(".card-scene");
    const prevButtonSVG = document.getElementById("prev-button-svg");
    const nextButtonSVG = document.getElementById("next-button-svg");
    const shuffleButtonBebas = document.getElementById("shuffle-button-bebas");
    const correctButtonSVG = document.getElementById("correct-button-svg");
    const wrongButtonSVG = document.getElementById("wrong-button-svg");
    const shuffleButtonTest = document.getElementById("shuffle-button-test");

    // --- PERBAIKAN: Referensi Elemen Modal ---
    const modal = document.getElementById("custom-modal");
    const modalText = document.getElementById("modal-text");
    const modalButtonYes = document.getElementById("modal-button-yes");
    const modalButtonNo = document.getElementById("modal-button-no");

    let originalFlashcards = [];
    let currentFlashcards = [];
    // ... (sisa let variabel) ...
    let wrongPile = [];
    let currentCardIndex = 0;
    let sessionProgress = 1;
    let correctAnswers = 0;
    let isFlipped = false;
    let isShuffled = false;

    if (typeof dataString === "undefined" || dataString.trim() === "") {
      // ... (kode parsing data sama) ...
      cardFront.textContent = "Data kosong atau tidak valid.";
      console.error(
        "Variabel dataString tidak ada atau kosong setelah script dimuat."
      );
      return;
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
        let definition = parts
          .slice(2, parts.length - 1)
          .join(",")
          .trim();
        if (definition.startsWith('"') && definition.endsWith('"')) {
          definition = definition.substring(1, definition.length - 1);
        }
        const back = `<div class="hiragana">${hiragana}</div><div class="definition">${definition}</div><div class="level">${level}</div>`;
        originalFlashcards.push({ front, back });
      } catch (e) {
        console.error("Gagal mem-parsing baris:", line, e);
      }
    }

    // --- PERBAIKAN: FUNGSI MODAL KUSTOM (Logika Jauh Lebih Bersih) ---
    function showModal(text, yesCallback, noCallback) {
      modalText.textContent = text;
      modal.style.display = "flex";

      // Gunakan addEventListener dengan { once: true }
      // Ini adalah cara modern & bersih untuk memastikan event hanya berjalan sekali
      // dan mencegah bug "freeze" atau penumpukan event.

      modalButtonYes.addEventListener(
        "click",
        function handleYes() {
          modal.style.display = "none";
          if (yesCallback) yesCallback();
        },
        { once: true }
      ); // Penting: { once: true }

      if (noCallback) {
        modalButtonNo.style.display = "inline-block";
        modalButtonNo.addEventListener(
          "click",
          function handleNo() {
            modal.style.display = "none";
            noCallback();
          },
          { once: true }
        ); // Penting: { once: true }
      } else {
        // Jika hanya modal "OK" (tidak ada callback 'no')
        modalButtonNo.style.display = "none";
      }
    }

    // --- FUNGSI localStorage (Tetap sama) ---
    function saveProgress() {
      // ... (kode sama) ...
      try {
        const progress = {
          currentFlashcards: currentFlashcards,
          wrongPile: wrongPile,
          currentCardIndex: currentCardIndex,
          sessionProgress: sessionProgress,
          correctAnswers: correctAnswers,
          isShuffled: isShuffled,
        };
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch (e) {
        console.error("Gagal menyimpan progres ke localStorage:", e);
      }
    }
    function clearProgress() {
      // ... (kode sama) ...
      localStorage.removeItem(storageKey);
    }
    function loadProgress(onProgressLoaded) {
      // ... (kode sama) ...
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        showModal(
          "Ditemukan sesi terakhir yang belum selesai. Lanjutkan?",
          () => {
            // YES
            const progress = JSON.parse(savedData);
            currentFlashcards = progress.currentFlashcards;
            wrongPile = progress.wrongPile;
            currentCardIndex = progress.currentCardIndex;
            sessionProgress = progress.sessionProgress;
            correctAnswers = progress.correctAnswers;
            isShuffled = progress.isShuffled;

            shuffleButtonBebas.classList.toggle("active", isShuffled);
            shuffleButtonTest.classList.toggle("active", isShuffled);
            onProgressLoaded(true); // Progres berhasil dimuat
          },
          () => {
            // NO
            clearProgress();
            onProgressLoaded(false); // Tidak ada progres yang dimuat
          }
        );
      } else {
        onProgressLoaded(false); // Tidak ada progres yang dimuat
      }
    }

    // --- CORE APP FUNCTIONS (Tetap sama) ---
    function shuffleArray(array) {
      // ... (kode sama) ...
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    function updateCounter() {
      // ... (kode sama) ...
      if (learningMode === "bebas") {
        cardCounter.textContent = `${sessionProgress} / ${originalFlashcards.length}`;
      } else {
        cardCounter.textContent = `${correctAnswers} / ${originalFlashcards.length}`;
      }
    }
    function showCard(index) {
      // ... (kode sama) ...
      if (currentFlashcards.length === 0) return;
      currentCardIndex =
        (index + currentFlashcards.length) % currentFlashcards.length;
      const newCardData = currentFlashcards[currentCardIndex];
      cardFront.textContent = newCardData.front;
      cardBack.innerHTML = newCardData.back;
      updateCounter();
      if (isFlipped) {
        isFlipped = false;
        card.classList.remove("is-flipped");
      }
    }
    function toggleShuffle() {
      // ... (kode sama) ...
      isShuffled = !isShuffled;
      shuffleButtonBebas.classList.toggle("active", isShuffled);
      shuffleButtonTest.classList.toggle("active", isShuffled);
      if (isShuffled) {
        shuffleArray(currentFlashcards);
      }
      saveProgress();
    }
    function flipCard() {
      // ... (kode sama) ...
      if (currentFlashcards.length > 0) {
        isFlipped = !isFlipped;
        card.classList.toggle("is-flipped");
      }
    }
    function transitionToCard(newIndex) {
      // ... (kode sama) ...
      if (!appContainer.classList.contains("is-changing")) {
        appContainer.classList.add("is-changing");
        setTimeout(() => {
          showCard(newIndex);
          appContainer.classList.remove("is-changing");
        }, 150);
      }
    }

    // --- NAVIGATION LOGIC (Tetap sama) ---
    function nextCard() {
      // ... (kode sama) ...
      if (learningMode !== "bebas" || currentFlashcards.length === 0) return;
      if (sessionProgress >= originalFlashcards.length) {
        clearProgress();
        window.location.href = "../index.html";
      } else {
        sessionProgress++;
        transitionToCard(currentCardIndex + 1);
        saveProgress();
      }
    }
    function prevCard() {
      // ... (kode sama) ...
      if (learningMode !== "bebas" || currentFlashcards.length === 0) return;
      if (sessionProgress > 1) {
        sessionProgress--;
      }
      transitionToCard(currentCardIndex - 1);
      saveProgress();
    }
    function handleCorrect() {
      // ... (kode sama) ...
      if (learningMode !== "test" || currentFlashcards.length === 0) return;
      correctAnswers++;
      currentFlashcards.splice(currentCardIndex, 1);
      saveProgress();
      checkTestRound();
    }
    function handleWrong() {
      // ... (kode sama) ...
      if (learningMode !== "test" || currentFlashcards.length === 0) return;
      const wrongCard = currentFlashcards.splice(currentCardIndex, 1)[0];
      wrongPile.push(wrongCard);
      saveProgress();
      checkTestRound();
    }
    function checkTestRound() {
      // ... (kode sama) ...
      if (currentFlashcards.length === 0) {
        if (wrongPile.length > 0) {
          currentFlashcards = [...wrongPile];
          wrongPile = [];
          if (isShuffled) shuffleArray(currentFlashcards);
          transitionToCard(0);
          saveProgress();
        } else {
          clearProgress();
          showModal("Sesi Tes Selesai! Anda Benar Semua.", () => {
            window.location.href = "../index.html";
          });
        }
      } else {
        currentCardIndex %= currentFlashcards.length;
        transitionToCard(currentCardIndex);
      }
    }
    function handleThemeToggle() {
      // ... (kode sama) ...
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      if (themeLabel)
        themeLabel.textContent = isDarkMode ? "Mode Terang" : "Mode Gelap";
    }

    // --- Event Listeners (Tetap sama) ---
    document.addEventListener("keydown", (e) => {
      // ... (kode sama) ...
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          flipCard();
          break;
        case "ArrowRight":
          learningMode === "bebas" ? nextCard() : handleCorrect();
          break;
        case "ArrowLeft":
          learningMode === "bebas" ? prevCard() : handleWrong();
          break;
      }
    });
    if (card) card.addEventListener("click", flipCard);
    // ... (sisa event listener sama) ...
    if (themeToggle) themeToggle.addEventListener("change", handleThemeToggle);
    if (prevButtonSVG) prevButtonSVG.addEventListener("click", prevCard);
    if (nextButtonSVG) nextButtonSVG.addEventListener("click", nextCard);
    if (shuffleButtonBebas)
      shuffleButtonBebas.addEventListener("click", toggleShuffle);
    if (correctButtonSVG)
      correctButtonSVG.addEventListener("click", handleCorrect);
    if (wrongButtonSVG) wrongButtonSVG.addEventListener("click", handleWrong);
    if (shuffleButtonTest)
      shuffleButtonTest.addEventListener("click", toggleShuffle);

    // --- Initialize UI (Tetap sama) ---
    if (document.body.classList.contains("dark-mode")) {
      // ... (kode sama) ...
      if (themeToggle) themeToggle.checked = true;
    }
    if (themeLabel) {
      // ... (kode sama) ...
      themeLabel.textContent =
        themeToggle && themeToggle.checked ? "Mode Terang" : "Mode Gelap";
    }

    // --- Load Progress & Initialize (Tetap sama) ---
    loadProgress((progresDimuat) => {
      // ... (kode sama) ...
      if (!progresDimuat) {
        currentFlashcards = [...originalFlashcards];
        if (learningMode === "test") {
          shuffleArray(currentFlashcards);
        }
      }
      updateCounter();
      showCard(currentCardIndex);
    });
  }
});
