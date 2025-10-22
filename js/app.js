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
    const cardScene = document.querySelector(".card-scene");

    const prevButtonSVG = document.getElementById("prev-button-svg");
    const nextButtonSVG = document.getElementById("next-button-svg");
    const shuffleButtonBebas = document.getElementById("shuffle-button-bebas");

    // REVISI: Ambil tombol 'prev' dari mode test juga
    const prevButtonTestSVG = document.getElementById("prev-button-svg-test");
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
    let correctAnswers = 0; // REVISI: Ini sekarang melacak total jawaban benar per putaran
    let totalCardCount = 0; // REVISI: Untuk melacak total kartu di awal sesi test
    let isFlipped = false;
    let isShuffled = false;

    if (typeof dataString === "undefined" || dataString.trim() === "") {
      cardFront.textContent = "Data kosong atau tidak valid.";
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
        originalFlashcards.push({ front, back, answered: null }); // REVISI: Tambah status 'answered'
      } catch (e) {
        console.error("Gagal mem-parsing baris:", line, e);
      }
    }
    totalCardCount = originalFlashcards.length; // Simpan total kartu

    // Fungsi Modal Kustom
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

    // Fungsi localStorage
    function saveProgress() {
      try {
        const progress = {
          currentFlashcards: currentFlashcards,
          wrongPile: wrongPile,
          currentCardIndex: currentCardIndex,
          sessionProgress: sessionProgress, // Untuk mode bebas
          correctAnswers: correctAnswers, // Untuk mode test
          totalCardCount: totalCardCount, // Untuk mode test
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
            totalCardCount =
              progress.totalCardCount || originalFlashcards.length;
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

    // Fungsi Inti Aplikasi
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
        // REVISI: Tampilkan progres jawaban benar / total kartu sesi ini
        cardCounter.textContent = `${correctAnswers} / ${totalCardCount}`;
      }
    }

    // REVISI: showCard tidak lagi membalik kartu
    function showCard(index) {
      if (!currentFlashcards || currentFlashcards.length === 0) return;
      currentCardIndex =
        (index + currentFlashcards.length) % currentFlashcards.length;
      const newCardData = currentFlashcards[currentCardIndex];
      if (!newCardData) return;
      cardFront.textContent = newCardData.front;
      cardBack.innerHTML = newCardData.back;
      updateCounter();
      // Logika flip dihapus dari sini
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

    // REVISI: (PERBAIKAN BUG VISUAL)
    // Logika flip dipindah ke sini. Kartu akan dibalik ke depan DULU,
    // baru ganti konten.
    function transitionToCard(newIndex) {
      if (appContainer.classList.contains("is-changing")) return;

      const flipFirst = isFlipped; // Cek apakah kartu sedang terbalik

      // Fungsi untuk ganti konten kartu
      const changeCardContent = () => {
        appContainer.classList.add("is-changing");
        try {
          setTimeout(() => {
            showCard(newIndex); // Panggil showCard yang sudah bersih
          }, 150);
        } catch (e) {
          console.error("Error saat transisi kartu:", e);
        } finally {
          setTimeout(() => {
            appContainer.classList.remove("is-changing");
          }, 200);
        }
      };

      if (flipFirst) {
        // Jika kartu terbalik, balikkan ke depan dulu
        isFlipped = false;
        card.classList.remove("is-flipped");
        // Beri jeda 300ms (setengah dari animasi flip 0.6s) sebelum ganti konten
        setTimeout(changeCardContent, 300);
      } else {
        // Jika kartu sudah di depan, langsung ganti konten
        changeCardContent();
      }
    }

    // --- Logika Navigasi BARU ---

    // REVISI: Logika 'prevCard' sekarang berfungsi di kedua mode
    function prevCard() {
      if (currentCardIndex > 0) {
        if (learningMode === "bebas" && sessionProgress > 1) {
          sessionProgress--;
        }
        transitionToCard(currentCardIndex - 1);
        saveProgress();
      }
    }

    function nextCard() {
      // Hanya untuk mode BEBAS
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

    // REVISI: Logika 'checkTestRound' dipanggil saat di akhir dek
    function checkTestRound() {
      // Cek apakah kita sudah di akhir dek
      if (currentCardIndex + 1 >= currentFlashcards.length) {
        // Ya, ini akhir putaran
        if (wrongPile.length > 0) {
          // Masih ada kartu salah, mulai putaran baru
          showModal(
            `Putaran selesai. Anda masih salah ${wrongPile.length} kartu. Mulai putaran baru?`,
            () => {
              currentFlashcards = [...wrongPile]; // Dek baru = kartu yang salah
              wrongPile = []; // Kosongkan tumpukan salah
              currentCardIndex = 0;
              correctAnswers = 0; // Reset counter jawaban benar
              totalCardCount = currentFlashcards.length; // Update total kartu
              if (isShuffled) shuffleArray(currentFlashcards);
              saveProgress();
              transitionToCard(0);
            },
            () => {
              // Pengguna tidak mau lanjut
              window.location.href = "../index.html";
            }
          );
        } else {
          // Tidak ada kartu salah, sesi selesai!
          clearProgress();
          showModal("Sesi Tes Selesai! Anda Benar Semua.", () => {
            window.location.href = "../index.html";
          });
        }
        return true; // Akhir putaran
      }
      return false; // Belum akhir putaran
    }

    // REVISI: Logika 'handleCorrect' (Mode Test)
    function handleCorrect() {
      if (learningMode !== "test" || currentFlashcards.length === 0) return;

      // Tandai kartu sebagai 'benar' HANYA jika belum dijawab
      if (currentFlashcards[currentCardIndex].answered !== "correct") {
        currentFlashcards[currentCardIndex].answered = "correct";
        correctAnswers++;
      }

      saveProgress();

      // Cek apakah ini akhir putaran, JANGAN lanjut jika ya
      if (checkTestRound()) return;

      // Lanjut ke kartu berikutnya
      transitionToCard(currentCardIndex + 1);
    }

    // REVISI: Logika 'handleWrong' (Mode Test)
    function handleWrong() {
      if (learningMode !== "test" || currentFlashcards.length === 0) return;

      const card = currentFlashcards[currentCardIndex];

      // Tandai kartu sebagai 'salah'
      card.answered = "wrong";

      // Pastikan kartu hanya ada SATU kali di wrongPile
      if (!wrongPile.find((c) => c.front === card.front)) {
        wrongPile.push(card);
      }

      // Jika sebelumnya dijawab benar, kurangi counter
      if (card.answered === "correct") {
        correctAnswers--;
      }

      saveProgress();

      // Cek apakah ini akhir putaran, JANGAN lanjut jika ya
      if (checkTestRound()) return;

      // Lanjut ke kartu berikutnya
      transitionToCard(currentCardIndex + 1);
    }

    // Fungsi Tema
    function handleThemeToggle() {
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }

    // Event Listeners
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
          // Tombol kiri sekarang berfungsi di kedua mode
          prevCard();
          break;
      }
    });

    if (card) card.addEventListener("click", flipCard);
    if (themeToggle) themeToggle.addEventListener("change", handleThemeToggle);

    // Mode Bebas
    if (prevButtonSVG) prevButtonSVG.addEventListener("click", prevCard);
    if (nextButtonSVG) nextButtonSVG.addEventListener("click", nextCard);
    if (shuffleButtonBebas)
      shuffleButtonBebas.addEventListener("click", toggleShuffle);

    // Mode Test
    if (prevButtonTestSVG)
      prevButtonTestSVG.addEventListener("click", prevCard); // REVISI: Tambah listener
    if (correctButtonSVG)
      correctButtonSVG.addEventListener("click", handleCorrect);
    if (wrongButtonSVG) wrongButtonSVG.addEventListener("click", handleWrong);
    if (shuffleButtonTest)
      shuffleButtonTest.addEventListener("click", toggleShuffle);

    // Inisialisasi UI
    if (document.body.classList.contains("dark-mode")) {
      if (themeToggle) themeToggle.checked = true;
    }

    // Muat Progres dan Mulai Aplikasi
    loadProgress((progresDimuat) => {
      if (!progresDimuat) {
        currentFlashcards = [...originalFlashcards];
        totalCardCount = originalFlashcards.length;
        if (learningMode === "test" || isShuffled) {
          shuffleArray(currentFlashcards);
        }
      }
      updateCounter();
      showCard(currentCardIndex);
    });
  }
});
