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
    const cardFront = document.getElementById("card-front");
    const cardBack = document.getElementById("card-back");
    const cardCounter = document.getElementById("card-counter");
    const themeToggle = document.getElementById("checkbox");
    // REVISI: Hapus referensi ke themeLabel
    // const themeLabel = document.getElementById("theme-label");
    const cardScene = document.querySelector(".card-scene");

    const prevButtonSVG = document.getElementById("prev-button-svg");
    const nextButtonSVG = document.getElementById("next-button-svg");
    const shuffleButtonBebas = document.getElementById("shuffle-button-bebas");
    const correctButtonSVG = document.getElementById("correct-button-svg");
    const wrongButtonSVG = document.getElementById("wrong-button-svg");
    const shuffleButtonTest = document.getElementById("shuffle-button-test");

    const modal = document.getElementById("custom-modal");
    const modalText = document.getElementById("modal-text");
    const modalButtonYes = document.getElementById("modal-button-yes");
    const modalButtonNo = document.getElementById("modal-button-no");

    let originalFlashcards = [];
    let currentFlashcards = [];
    let wrongPile = [];
    let currentCardIndex = 0;
    let sessionProgress = 1;
    let correctAnswers = 0;
    let isFlipped = false;
    let isShuffled = false;

    if (typeof dataString === "undefined" || dataString.trim() === "") {
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

    function showModal(text, yesCallback, noCallback) {
      modalText.textContent = text;
      modal.style.display = "flex";

      modalButtonYes.addEventListener(
        "click",
        function handleYes() {
          modal.style.display = "none";
          if (yesCallback) yesCallback();
        },
        { once: true }
      );

      if (noCallback) {
        modalButtonNo.style.display = "inline-block";
        modalButtonNo.addEventListener(
          "click",
          function handleNo() {
            modal.style.display = "none";
            noCallback();
          },
          { once: true }
        );
      } else {
        modalButtonNo.style.display = "none";
      }
    }

    function saveProgress() {
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
      localStorage.removeItem(storageKey);
    }

    function loadProgress(onProgressLoaded) {
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
            onProgressLoaded(true);
          },
          () => {
            // NO
            clearProgress();
            onProgressLoaded(false);
          }
        );
      } else {
        onProgressLoaded(false);
      }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function updateCounter() {
      if (learningMode === "bebas") {
        cardCounter.textContent = `${sessionProgress} / ${originalFlashcards.length}`;
      } else {
        cardCounter.textContent = `${correctAnswers} / ${originalFlashlabels.length}`;
      }
    }

    function showCard(index) {
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
      isShuffled = !isShuffled;
      shuffleButtonBebas.classList.toggle("active", isShuffled);
      shuffleButtonTest.classList.toggle("active", isShuffled);
      if (isShuffled) {
        shuffleArray(currentFlashcards);
      }
      saveProgress();
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
        }, 150);
      }
    }

    function nextCard() {
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
      if (learningMode !== "bebas" || currentFlashcards.length === 0) return;
      if (sessionProgress > 1) {
        sessionProgress--;
      }
      transitionToCard(currentCardIndex - 1);
      saveProgress();
    }

    function handleCorrect() {
      if (learningMode !== "test" || currentFlashcards.length === 0) return;
      correctAnswers++;
      currentFlashcards.splice(currentCardIndex, 1);
      saveProgress();
      checkTestRound();
    }

    function handleWrong() {
      if (learningMode !== "test" || currentFlashcards.length === 0) return;
      const wrongCard = currentFlashcards.splice(currentCardIndex, 1)[0];
      wrongPile.push(wrongCard);
      saveProgress();
      checkTestRound();
    }

    function checkTestRound() {
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
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      // REVISI: Hapus logika themeLabel
      // if (themeLabel)
      //   themeLabel.textContent = isDarkMode ? "Mode Terang" : "Mode Gelap";
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
          learningMode === "bebas" ? nextCard() : handleCorrect();
          break;
        case "ArrowLeft":
          learningMode === "bebas" ? prevCard() : handleWrong();
          break;
      }
    });

    if (card) card.addEventListener("click", flipCard);
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

    if (document.body.classList.contains("dark-mode")) {
      if (themeToggle) themeToggle.checked = true;
    }
    // REVISI: Hapus logika themeLabel
    // if (themeLabel) {
    //   themeLabel.textContent =
    //     themeToggle && themeToggle.checked ? "Mode Terang" : "Mode Gelap";
    // }

    loadProgress((progresDimuat) => {
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
