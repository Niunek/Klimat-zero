
let co2 = 75;
let cleanliness = 40;
let budget = 1000;

let factoryModernized = false;


const factory = document.getElementById("factory-1");

const infoPanel = document.getElementById("info-panel");

const resetBudgetButton =
    document.getElementById("reset-budget");

const reduceEmissionButton =
    document.getElementById("reduce-emission");


function updateStats() {

    // Zabezpieczenie wartości
    co2 = Math.max(0, Math.min(100, co2));
    cleanliness = Math.max(0, Math.min(100, cleanliness));
    budget = Math.max(0, budget);

    document.getElementById("co2").textContent =
        co2 + "%";

    document.getElementById("cleanliness").textContent =
        cleanliness + "%";

    document.getElementById("budget").textContent =
        budget + " $";

    updatePollutionBar();
}

function updatePollutionBar() {

    document.getElementById("pollution-value").textContent =
        co2 + "%";

    document.getElementById("pollution-fill").style.width =
        co2 + "%";
}


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


function loadGame() {

    const savedGame =
        localStorage.getItem("climateZero");

    if (!savedGame) {
        updateStats();
        return;
    }

    const game =
        JSON.parse(savedGame);

    co2 = game.co2;

    cleanliness = game.cleanliness;

    budget = game.budget;

    factoryModernized =
        game.factoryModernized || false;

    updateStats();
}



factory.addEventListener("click", function() {

    if (factoryModernized) {

        infoPanel.innerHTML = `

            <h2>🏭 Fabryka chemiczna</h2>

            <p>
                Emisja CO₂:
                <strong id="factory-emission">
                    8%
                </strong>
            </p>

            <p>
                Zużycie energii:
                <strong>
                    25 MW
                </strong>
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


    modernizeButton.addEventListener(
        "click",
        function() {

            const cost = 300;


            if (budget < cost) {

                alert(
                    "❌ Nie masz wystarczająco pieniędzy!"
                );

                return;
            }


            budget -= cost;

            co2 -= 5;

            cleanliness += 5;

            factoryModernized = true;


            updateStats();


            document.getElementById(
                "factory-emission"
            ).textContent = "8%";


            modernizeButton.textContent =
                "✅ Zmodernizowana";

            modernizeButton.disabled = true;


            saveGame();

        }
    );

});


reduceEmissionButton.addEventListener(
    "click",
    function() {

        if (co2 <= 0) {
            return;
        }

        co2 -= 5;

        cleanliness += 5;

        if (co2 < 0) {
            co2 = 0;
        }

        if (cleanliness > 100) {
            cleanliness = 100;
        }

        updateStats();

        saveGame();

        alert(
            "🌱 Emisja została zmniejszona!"
        );

    }
);

resetBudgetButton.addEventListener(
    "click",
    function() {

        budget = 1000;

        updateStats();

        saveGame();

    }
);


loadGame();