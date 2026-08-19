// =========================
// ZMIENNE GRY
// =========================

let co2 = 75;
let cleanliness = 40;
let budget = 1000;

let factoryModernized = false;


// =========================
// ELEMENTY STRONY
// =========================

const factory = document.getElementById("factory-1");
const infoPanel = document.getElementById("info-panel");

const resetBudgetButton = document.getElementById("reset-budget");
const reduceEmissionButton = document.getElementById("reduce-emission");


// =========================
// AKTUALIZACJA STATYSTYK
// =========================

function updateStats() {

    co2 = Math.max(0, Math.min(100, co2));
    cleanliness = Math.max(0, Math.min(100, cleanliness));
    budget = Math.max(0, budget);

    document.getElementById("co2").textContent = co2 + "%";
    document.getElementById("cleanliness").textContent = cleanliness + "%";
    document.getElementById("budget").textContent = budget + " $";

    updatePollutionBar();
}


// =========================
// PASEK ZANIECZYSZCZENIA
// =========================

function updatePollutionBar() {

    document.getElementById("pollution-value").textContent =
        co2 + "%";

    document.getElementById("pollution-fill").style.width =
        co2 + "%";
}


// =========================
// ZAPIS GRY
// =========================

function saveGame() {

    localStorage.setItem(
        "climateZero",
        JSON.stringify({
            co2: co2,
            cleanliness: cleanliness,
            budget: budget,
            factoryModernized: factoryModernized
        })
    );
}


// =========================
// WCZYTYWANIE GRY
// =========================

function loadGame() {

    const savedGame = localStorage.getItem("climateZero");

    if (!savedGame) {
        updateStats();
        return;
    }

    const game = JSON.parse(savedGame);

    co2 = game.co2;
    cleanliness = game.cleanliness;
    budget = game.budget;
    factoryModernized = game.factoryModernized || false;

    updateStats();
}


// =========================
// KLIKNIĘCIE FABRYKI
// =========================

factory.addEventListener("click", function() {

    if (factoryModernized) {

        infoPanel.innerHTML = `
            <h2>🏭 Fabryka chemiczna</h2>

            <p>
                Emisja CO₂:
                <strong>8%</strong>
            </p>

            <p>
                Zużycie energii:
                <strong>25 MW</strong>
            </p>

            <button id="modernize-factory" disabled>
                ✅ Zmodernizowana
            </button>
        `;

        return;
    }


    infoPanel.innerHTML = `
        <h2>🏭 Fabryka chemiczna</h2>

        <p>
            Emisja CO₂:
            <strong id="factory-emission">
                18%
            </strong>
        </p>

        <p>
            Zużycie energii:
            <strong>
                25 MW
            </strong>
        </p>

        <button id="modernize-factory">
            🔧 Modernizuj fabrykę — 300 $
        </button>
    `;


    const modernizeButton =
        document.getElementById("modernize-factory");


    modernizeButton.addEventListener("click", function() {

        const cost = 300;


        if (budget < cost) {

            alert("❌ Nie masz wystarczająco pieniędzy!");

            return;
        }


        budget -= cost;
        co2 -= 5;
        cleanliness += 5;

        factoryModernized = true;


        updateStats();


        document.getElementById("factory-emission")
            .textContent = "8%";


        modernizeButton.textContent =
            "✅ Zmodernizowana";

        modernizeButton.disabled = true;


        saveGame();

    });

});


// =========================
// ZMNIEJSZ EMISJĘ
// =========================

reduceEmissionButton.addEventListener("click", function() {

    if (co2 <= 0) {
        return;
    }

    co2 -= 5;
    cleanliness += 5;

    updateStats();

    saveGame();

    alert("🌱 Emisja została zmniejszona!");

});


// =========================
// RESET GRY — TEST
// =========================

resetBudgetButton.addEventListener("click", function() {

    // Przywracamy wartości początkowe
    co2 = 75;
    cleanliness = 40;
    budget = 1000;

    factoryModernized = false;


    // Aktualizujemy wszystko na stronie
    updateStats();


    // Przywracamy panel fabryki
    infoPanel.innerHTML = `
        <h2>🏭 Fabryka</h2>

        <p>
            Kliknij obiekt w mieście,
            aby zobaczyć informacje.
        </p>
    `;


    // Zapisujemy stan początkowy
    saveGame();

});


// =========================
// START GRY
// =========================

loadGame();