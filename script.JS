// =====================================================
// CLIMATE: ZERO
// ZARZĄDZANIE MIASTEM + ENERGIA
// =====================================================


// =====================================================
// STATYSTYKI
// =====================================================

let co2 = 75;
let cleanliness = 40;
let satisfaction = 60;
let budget = 1000;
let turn = 1;

let cityName = "Moje miasto";


// =====================================================
// BLOKADA TUR
// =====================================================

let turnTimes = [];
let turnWarningShown = false;
let turnLockedUntil = 0;

const TURN_LIMIT = 5;
const TURN_TIME_WINDOW = 7000;
const TURN_WARNING_TIME = 3000;
const TURN_LOCK_TIME = 5 * 60 * 1000;


// =====================================================
// OBIEKTY
// =====================================================

let offices = {
    "office-1": 0,
    "office-2": 0
};

let parks = {
    "park-1": 0,
    "park-2": 0,
    "park-3": 0
};

let cars = {
    "car-1": 0,
    "car-2": 0
};

let factories = {
    "factory-1": 0,
    "factory-2": 0
};

let houseLevel = 0;

let recyclingLevel = 0;
let busLevel = 0;
let hospitalLevel = 0;


// =====================================================
// ELEKTROWNIE
// =====================================================

let powerPlants = {

    coal: {
        name: "Elektrownia węglowa",
        emoji: "🏭",
        power: 25,
        maxProduction: 100,
        baseCO2: 22,
        costMultiplier: 1.5,
        cleanliness: -2
    },

    wind: {
        name: "Elektrownia wiatrowa",
        emoji: "🌬️",
        power: 15,
        maxProduction: 80,
        baseCO2: 1,
        costMultiplier: 0.35,
        cleanliness: 3
    },

    water: {
        name: "Elektrownia wodna",
        emoji: "💧",
        power: 35,
        maxProduction: 120,
        baseCO2: 2,
        costMultiplier: 0.4,
        cleanliness: 4
    },

    solar: {
        name: "Elektrownia słoneczna",
        emoji: "☀️",
        power: 40,
        maxProduction: 70,
        baseCO2: 1,
        costMultiplier: 0.3,
        cleanliness: 3
    },

    nuclear: {
        name: "Elektrownia jądrowa",
        emoji: "☢️",
        power: 60,
        maxProduction: 180,
        baseCO2: 2,
        costMultiplier: 0.6,
        cleanliness: 5
    }

};


// =====================================================
// COOLDOWN
// =====================================================

let cooldowns = {};

const COOLDOWN_TIME = 15000;


// =====================================================
// ELEMENTY HTML
// =====================================================

const infoPanel =
    document.getElementById("info-panel");

const resetButton =
    document.getElementById("reset-budget");

const endTurnButton =
    document.getElementById("end-turn");

const cityNameDisplay =
    document.getElementById("city-name-display");

const cityTitle =
    document.getElementById("city-title");

const cityNameInput =
    document.getElementById("city-name-input");

const saveCityNameButton =
    document.getElementById("save-city-name");


// =====================================================
// NAZWA MIASTA
// =====================================================

function updateCityName() {

    if (cityNameDisplay) {
        cityNameDisplay.textContent =
            "🏙️ " + cityName;
    }

    if (cityTitle) {
        cityTitle.textContent =
            cityName;
    }

    if (cityNameInput) {
        cityNameInput.value =
            cityName;
    }

}


function changeCityName() {

    const newName =
        cityNameInput
            ? cityNameInput.value
            : prompt(
                "🏙️ Podaj nową nazwę miasta:",
                cityName
            );

    if (newName === null) {
        return;
    }

    const trimmedName =
        newName.trim();

    if (!trimmedName.length) {

        alert(
            "❌ Nazwa miasta nie może być pusta!"
        );

        return;
    }

    if (trimmedName.length > 30) {

        alert(
            "❌ Nazwa może mieć maksymalnie 30 znaków!"
        );

        return;
    }

    cityName = trimmedName;

    updateCityName();
    saveGame();

}


if (cityNameDisplay) {

    cityNameDisplay.addEventListener(
        "click",
        function() {

            if (cityNameInput) {
                cityNameInput.focus();
                cityNameInput.select();
            }

        }
    );

}


if (saveCityNameButton) {

    saveCityNameButton.addEventListener(
        "click",
        changeCityName
    );

}


if (cityNameInput) {

    cityNameInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                changeCityName();
            }

        }
    );

}


// =====================================================
// STATYSTYKI
// =====================================================

function updateStats() {

    co2 =
        Math.max(
            0,
            Math.min(100, Math.round(co2))
        );

    cleanliness =
        Math.max(
            0,
            Math.min(100, Math.round(cleanliness))
        );

    satisfaction =
        Math.max(
            0,
            Math.min(100, Math.round(satisfaction))
        );

    budget =
        Math.max(
            0,
            Math.round(budget)
        );


    document.getElementById("co2").textContent =
        co2 + "%";

    document.getElementById("cleanliness").textContent =
        cleanliness + "%";

    document.getElementById("satisfaction").textContent =
        satisfaction + "%";

    document.getElementById("budget").textContent =
        budget + " $";

    document.getElementById("turn").textContent =
        turn;


    const factoryCount =
        Object.values(factories)
            .filter(level => level > 0)
            .length;

    document.getElementById("factories").textContent =
        factoryCount;


    updatePollutionBar();
    updateCityStatus();
    updateTurnStatus();
    updateCityName();

}


// =====================================================
// CO2 BAR
// =====================================================

function updatePollutionBar() {

    const value =
        document.getElementById("pollution-value");

    const fill =
        document.getElementById("pollution-fill");

    if (value) {
        value.textContent =
            co2 + "%";
    }

    if (fill) {
        fill.style.width =
            co2 + "%";
    }

}


// =====================================================
// STATUS MIASTA
// =====================================================

function getCityStatus() {

    if (co2 >= 80) {

        return {
            name: "KRYTYCZNY",
            emoji: "🔴"
        };

    }

    if (co2 >= 65) {

        return {
            name: "ZŁY",
            emoji: "🟠"
        };

    }

    if (co2 >= 45) {

        return {
            name: "ŚREDNI",
            emoji: "🟡"
        };

    }

    if (co2 >= 25) {

        return {
            name: "DOBRY",
            emoji: "🟢"
        };

    }

    return {
        name: "ŚWIETNY",
        emoji: "🔵"
    };

}


function updateCityStatus() {

    const element =
        document.getElementById("city-status");

    if (!element) {
        return;
    }

    const status =
        getCityStatus();

    element.textContent =
        `${status.emoji} ${status.name}`;

}


// =====================================================
// TUR
// =====================================================

function isTurnLocked() {

    return Date.now() < turnLockedUntil;

}


function getTurnLockRemaining() {

    return Math.max(
        0,
        turnLockedUntil - Date.now()
    );

}


function updateTurnStatus() {

    const element =
        document.getElementById("turn-status");

    if (!element) {
        return;
    }

    if (isTurnLocked()) {

        const seconds =
            Math.ceil(
                getTurnLockRemaining() / 1000
            );

        element.textContent =
            `⛔ Tury zablokowane — ${seconds}s`;

        if (endTurnButton) {
            endTurnButton.disabled = true;
        }

        return;
    }

    element.textContent =
        "🟢 Możesz zakończyć turę.";

    if (endTurnButton) {
        endTurnButton.disabled = false;
    }

}


// =====================================================
// KOSZT ULEPSZEŃ
// =====================================================

function getCost(start, level) {

    return start + level * 50;

}


// =====================================================
// COOLDOWN
// =====================================================

function getRemainingCooldown(id) {

    if (!cooldowns[id]) {
        return 0;
    }

    return Math.max(
        0,
        COOLDOWN_TIME -
        (Date.now() - cooldowns[id])
    );

}


function startCooldown(id) {

    cooldowns[id] =
        Date.now();

}


// =====================================================
// IKONY EFEKTÓW
// =====================================================

function getUpgradeIcon(action) {

    const icons = {

        chemical: "🌫️",
        industrial: "🌫️",

        office: "⚡",
        house: "⚡",

        park: "🌱",

        car: "🌫️",

        recycling: "🌱",

        bus: "😊",

        hospital: "😊"

    };

    return icons[action] || "🔧";

}


// =====================================================
// INFORMACJA O EFEKCIE
// =====================================================

function getEffectText(action) {

    const effects = {

        chemical:
            "🌫️ Zmniejsza emisję CO₂",

        industrial:
            "🌫️ Zmniejsza emisję CO₂",

        office:
            "⚡ Zużywa energię",

        house:
            "⚡ Zużywa energię",

        park:
            "🌱 Poprawia czystość",

        car:
            "🌫️ Zmniejsza wpływ transportu",

        recycling:
            "🌱 Poprawia czystość",

        bus:
            "😊 Zwiększa zadowolenie",

        hospital:
            "😊 Zwiększa zadowolenie"

    };

    return effects[action] || "";
}


// =====================================================
// PRZYCISK ULEPSZENIA
// =====================================================

function upgradeButton(action, id, cost) {

    const remaining =
        getRemainingCooldown(id);

    const icon =
        getUpgradeIcon(action);

    const effect =
        getEffectText(action);


    if (remaining > 0) {

        const seconds =
            Math.ceil(
                remaining / 1000
            );

        return `
            <button
                class="upgrade-button"
                disabled
            >
                ⏳ Dostępne za ${seconds}s
                <span class="upgrade-icon">
                    ${icon}
                </span>
            </button>
        `;

    }


    return `
        <button
            class="upgrade-button"
            data-action="${action}"
            data-id="${id}"
            title="${effect}"
        >
            🔧 Ulepsz — ${cost} $

            <span class="upgrade-icon">
                ${icon}
            </span>
        </button>
    `;

}


// =====================================================
// FABRYKA CHEMICZNA
// =====================================================

function showChemicalFactory() {

    const id = "factory-1";

    const level =
        factories[id];

    const cost =
        getCost(300, level);

    const emission =
        Math.max(
            3,
            18 - level * 3
        );


    infoPanel.innerHTML = `

        <h2>🏭 Fabryka chemiczna</h2>

        <p>
            🌫️ Emisja CO₂:
            <strong>
                ${emission}%
            </strong>
        </p>

        <p>
            ⚡ Zużycie:
            <strong>
                25 MW
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${level}
            </strong>
        </p>

        ${upgradeButton(
            "chemical",
            id,
            cost
        )}

    `;

}


// =====================================================
// FABRYKA PRZEMYSŁOWA
// =====================================================

function showIndustrialFactory() {

    const id = "factory-2";

    const level =
        factories[id];

    const cost =
        getCost(350, level);

    const emission =
        Math.max(
            3,
            15 - level * 3
        );


    infoPanel.innerHTML = `

        <h2>🏭 Fabryka przemysłowa</h2>

        <p>
            🌫️ Emisja CO₂:
            <strong>
                ${emission}%
            </strong>
        </p>

        <p>
            ⚡ Zużycie:
            <strong>
                20 MW
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${level}
            </strong>
        </p>

        ${upgradeButton(
            "industrial",
            id,
            cost
        )}

    `;

}


// =====================================================
// BIUROWIEC
// =====================================================

function showOffice(id) {

    const level =
        offices[id];

    const cost =
        getCost(100, level);

    const energy =
        10 + level * 2;


    infoPanel.innerHTML = `

        <h2>🏢 Biurowiec</h2>

        <p>
            🆔 ${id}
        </p>

        <p>
            👥 Pracownicy:
            <strong>
                250
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                ${energy} MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${level}
            </strong>
        </p>

        ${upgradeButton(
            "office",
            id,
            cost
        )}

    `;

}


// =====================================================
// DOM
// =====================================================

function showHouse() {

    const id =
        "house-1";

    const cost =
        getCost(
            150,
            houseLevel
        );

    const houseCount =
        1 + houseLevel;

    const energy =
        houseCount * 5;


    infoPanel.innerHTML = `

        <h2>🏠 Dom mieszkalny</h2>

        <p>
            👥 Mieszkańcy:
            <strong>
                ${houseCount * 5}
            </strong>
        </p>

        <p>
            🏠 Liczba domów:
            <strong>
                ${houseCount}
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                ${energy} MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${houseLevel}
            </strong>
        </p>

        ${upgradeButton(
            "house",
            id,
            cost
        )}

    `;

}


// =====================================================
// PARK
// =====================================================

function showPark(id) {

    const level =
        parks[id];

    const cost =
        getCost(200, level);


    infoPanel.innerHTML = `

        <h2>🌳 Park miejski</h2>

        <p>
            🆔 ${id}
        </p>

        <p>
            🌱 Wpływ na czystość:
            <strong>
                +${5 + level * 3}%
            </strong>
        </p>

        <p>
            👥 Odwiedzający:
            <strong>
                ${120 + level * 20}
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${level}
            </strong>
        </p>

        ${upgradeButton(
            "park",
            id,
            cost
        )}

    `;

}


// =====================================================
// SAMOCHÓD
// =====================================================

function showCar(id) {

    const level =
        cars[id];

    const cost =
        getCost(250, level);


    infoPanel.innerHTML = `

        <h2>🚗 Ruch drogowy</h2>

        <p>
            🆔 ${id}
        </p>

        <p>
            🌫️ Wpływ na CO₂:
            <strong>
                ${Math.max(0, 3 - level)}%
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                2 MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${level}
            </strong>
        </p>

        ${upgradeButton(
            "car",
            id,
            cost
        )}

    `;

}


// =====================================================
// ELEKTROWNIE — OBLICZENIA
// =====================================================

function calculatePlantStats(id) {

    const plant =
        powerPlants[id];

    const power =
        plant.power;

    const production =
        Math.round(
            plant.maxProduction *
            power / 100
        );

    const cost =
        Math.round(
            Math.pow(
                power / 20,
                1.35
            ) *
            10 *
            plant.costMultiplier
        );

    const emission =
        power <= 0
            ? 0
            : Math.max(
                1,
                Math.round(
                    plant.baseCO2 *
                    Math.pow(
                        power / 100,
                        1.35
                    )
                )
            );

    const clean =
        power > 0
            ? Math.max(
                0,
                Math.round(
                    plant.cleanliness *
                    power / 100
                )
            )
            : 0;


    return {
        production,
        cost,
        emission,
        clean
    };

}


// =====================================================
// ZUŻYCIE ENERGII MIASTA
// =====================================================

function calculateCityEnergyDemand() {

    let demand = 0;


    // DOMY

    demand +=
        (1 + houseLevel) * 5;


    // BIUROWCE

    Object.values(offices)
        .forEach(level => {

            demand +=
                10 + level * 2;

        });


    // FABRYKI

    Object.values(factories)
        .forEach(level => {

            if (level > 0) {

                demand +=
                    20 + level * 4;

            }

        });


    // SAMOCHODY

    Object.values(cars)
        .forEach(level => {

            demand +=
                2 + level;

        });


    // RECYKLING

    if (recyclingLevel > 0) {

        demand +=
            8 + recyclingLevel * 2;

    }


    // AUTOBUSY

    if (busLevel > 0) {

        demand +=
            10 + busLevel * 2;

    }


    // SZPITAL

    if (hospitalLevel > 0) {

        demand +=
            15 + hospitalLevel * 3;

    }


    return Math.round(demand);

}


// =====================================================
// CAŁY SYSTEM ENERGII
// =====================================================

function calculateEnergySystem() {

    let production = 0;
    let plantCost = 0;
    let plantCO2 = 0;
    let plantClean = 0;


    Object.keys(powerPlants)
        .forEach(function(id) {

            const stats =
                calculatePlantStats(id);

            production +=
                stats.production;

            plantCost +=
                stats.cost;

            plantCO2 +=
                stats.emission;

            plantClean +=
                stats.clean;

        });


    const demand =
        calculateCityEnergyDemand();


    const shortage =
        Math.max(
            0,
            demand - production
        );


    const emergencyCost =
        shortage * 2;


    const totalCost =
        plantCost +
        emergencyCost;


    return {

        production,
        demand,
        shortage,

        plantCost,
        emergencyCost,
        totalCost,

        co2: plantCO2,
        clean: plantClean

    };

}


// =====================================================
// PANEL ELEKTROWNI
// =====================================================

function showPowerPlant(id) {

    const plant =
        powerPlants[id];

    if (!plant) {

        showAllPowerPlants();

        return;
    }


    const stats =
        calculatePlantStats(id);

    const energy =
        calculateEnergySystem();


    infoPanel.innerHTML = `

        <h2>
            ${plant.emoji}
            ${plant.name}
        </h2>

        <p>
            ⚡ Produkcja:
            <strong>
                ${stats.production} MW
            </strong>
        </p>

        <p>
            🌫️ CO₂:
            <strong>
                +${stats.emission}%
            </strong>
        </p>

        <p>
            💰 Koszt działania:
            <strong>
                ${stats.cost} $ / turę
            </strong>
        </p>

        <p>
            🌱 Wpływ na czystość:
            <strong>
                ${stats.clean >= 0 ? "+" : ""}
                ${stats.clean}%
            </strong>
        </p>

        <p>
            🏙️ Zużycie miasta:
            <strong>
                ${energy.demand} MW
            </strong>
        </p>

        <p>
            ⚡ Bilans energii:
            <strong>
                ${energy.production - energy.demand} MW
            </strong>
        </p>

        <p>
            ⚙️ Moc:
            <strong id="single-power-${id}">
                ${plant.power}%
            </strong>
        </p>


        <div class="energy-row">

            <div class="energy-row-top">

                <span class="energy-name">
                    ⚡ Moc elektrowni
                </span>

                <span
                    class="energy-percent"
                    id="single-percent-${id}"
                >
                    ${plant.power}%
                </span>

            </div>


            <input
                class="energy-slider"
                type="range"
                min="0"
                max="100"
                step="5"
                value="${plant.power}"
                data-plant="${id}"
            >


            <div class="energy-details">

                <span>
                    0%
                </span>

                <span>
                    Przesuń suwak
                </span>

                <span>
                    100%
                </span>

            </div>

        </div>


        <br>


        <button class="show-all-energy">
            ⚡ Wszystkie elektrownie
        </button>

    `;


    setupEnergySliders();

}


// =====================================================
// PANEL WSZYSTKICH ELEKTROWNI
// =====================================================

function showAllPowerPlants() {

    const energy =
        calculateEnergySystem();


    let html = `

        <div class="energy-panel">

            <h3>
                ⚡ Zarządzanie energią
            </h3>

            <p>
                Ustaw moc każdej elektrowni.
                Większa moc = więcej energii,
                ale także większe koszty i CO₂.
            </p>

    `;


    Object.keys(powerPlants)
        .forEach(function(id) {

            const plant =
                powerPlants[id];

            const stats =
                calculatePlantStats(id);


            html += `

                <div class="energy-row">

                    <div class="energy-row-top">

                        <span class="energy-name">
                            ${plant.emoji}
                            ${plant.name}
                        </span>

                        <span
                            class="energy-percent"
                            id="percent-${id}"
                        >
                            ${plant.power}%
                        </span>

                    </div>


                    <input
                        class="energy-slider"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value="${plant.power}"
                        data-plant="${id}"
                    >


                    <div class="energy-details">

                        <span>
                            ⚡ ${stats.production} MW
                        </span>

                        <span>
                            🌫️ +${stats.emission}% CO₂
                        </span>

                        <span>
                            💰 ${stats.cost} $ / turę
                        </span>

                    </div>

                </div>

            `;

        });


    const balance =
        energy.production -
        energy.demand;


    html += `

            <div class="energy-summary">

                <div>
                    ⚡ Produkcja
                    <strong>
                        ${energy.production} MW
                    </strong>
                </div>

                <div>
                    🏙️ Zużycie
                    <strong>
                        ${energy.demand} MW
                    </strong>
                </div>

                <div>
                    📊 Bilans
                    <strong>
                        ${balance} MW
                    </strong>
                </div>

                <div>
                    💰 Koszt elektrowni
                    <strong>
                        ${energy.plantCost} $
                    </strong>
                </div>

                <div>
                    🚨 Niedobór
                    <strong>
                        ${energy.shortage} MW
                    </strong>
                </div>

                <div>
                    💵 Łączny koszt
                    <strong>
                        ${energy.totalCost} $ / turę
                    </strong>
                </div>

            </div>

    `;


    if (energy.shortage > 0) {

        html += `

            <div class="critical-message">

                🚨
                <strong>
                    Brak wystarczającej energii!
                </strong>

                <br><br>

                Miasto potrzebuje
                <strong>
                    ${energy.demand} MW
                </strong>,

                ale produkuje tylko
                <strong>
                    ${energy.production} MW
                </strong>.

                <br>

                Awaryjna energia kosztuje:
                <strong>
                    ${energy.emergencyCost} $
                </strong>
                / turę.

            </div>

        `;

    }

    else {

        html += `

            <p>
                🟢 Produkcja energii pokrywa
                całe zapotrzebowanie miasta.
            </p>

        `;

    }


    html += `

        </div>

    `;


    infoPanel.innerHTML =
        html;


    setupEnergySliders();

}


// =====================================================
// SUWAKI
// =====================================================

function setupEnergySliders() {

    document
        .querySelectorAll(".energy-slider")
        .forEach(function(slider) {

            slider.addEventListener(
                "input",
                function() {

                    const id =
                        slider.dataset.plant;

                    const value =
                        Number(
                            slider.value
                        );


                    if (!powerPlants[id]) {
                        return;
                    }


                    powerPlants[id].power =
                        value;


                    updateSliderDisplay(
                        slider,
                        id
                    );

                }
            );

        });


    document
        .querySelectorAll(".show-all-energy")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                showAllPowerPlants
            );

        });

}


function updateSliderDisplay(
    slider,
    id
) {

    const value =
        Number(
            slider.value
        );


    const percent =
        document.getElementById(
            "percent-" + id
        );

    const singlePercent =
        document.getElementById(
            "single-percent-" + id
        );

    const singlePower =
        document.getElementById(
            "single-power-" + id
        );


    if (percent) {

        percent.textContent =
            value + "%";

    }


    if (singlePercent) {

        singlePercent.textContent =
            value + "%";

    }


    if (singlePower) {

        singlePower.textContent =
            value + "%";

    }


    const row =
        slider.closest(
            ".energy-row"
        );


    if (row) {

        const stats =
            calculatePlantStats(id);

        const details =
            row.querySelector(
                ".energy-details"
            );


        if (details) {

            details.innerHTML = `

                <span>
                    ⚡ ${stats.production} MW
                </span>

                <span>
                    🌫️ +${stats.emission}% CO₂
                </span>

                <span>
                    💰 ${stats.cost} $ / turę
                </span>

            `;

        }

    }


    saveGame();

}


// =====================================================
// RECYKLING
// =====================================================

function showRecycling() {

    const id =
        "recycling-1";

    const cost =
        getCost(
            250,
            recyclingLevel
        );


    infoPanel.innerHTML = `

        <h2>
            ♻️ Centrum recyklingu
        </h2>

        <p>
            🌱 Czystość:
            <strong>
                +${5 + recyclingLevel * 3}%
            </strong>
        </p>

        <p>
            😊 Zadowolenie:
            <strong>
                +${2 + recyclingLevel}%
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                ${8 + recyclingLevel * 2}
                MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${recyclingLevel}
            </strong>
        </p>

        ${upgradeButton(
            "recycling",
            id,
            cost
        )}

    `;

}


// =====================================================
// AUTOBUS
// =====================================================

function showBus() {

    const id =
        "bus-1";

    const cost =
        getCost(
            300,
            busLevel
        );


    infoPanel.innerHTML = `

        <h2>
            🚌 Zajezdnia autobusowa
        </h2>

        <p>
            🌫️ CO₂:
            <strong>
                -${4 + busLevel * 2}%
            </strong>
        </p>

        <p>
            😊 Zadowolenie:
            <strong>
                +${3 + busLevel}%
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                ${10 + busLevel * 2}
                MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${busLevel}
            </strong>
        </p>

        ${upgradeButton(
            "bus",
            id,
            cost
        )}

    `;

}


// =====================================================
// SZPITAL
// =====================================================

function showHospital() {

    const id =
        "hospital-1";

    const cost =
        getCost(
            350,
            hospitalLevel
        );


    infoPanel.innerHTML = `

        <h2>
            🏥 Szpital
        </h2>

        <p>
            ❤️ Zadowolenie:
            <strong>
                +${5 + hospitalLevel * 2}%
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                ${15 + hospitalLevel * 3}
                MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${hospitalLevel}
            </strong>
        </p>

        ${upgradeButton(
            "hospital",
            id,
            cost
        )}

    `;

}


// =====================================================
// KLIKANIE OBIEKTÓW
// =====================================================

document
    .querySelectorAll(
        ".city-view [data-type]"
    )
    .forEach(function(object) {

        object.addEventListener(
            "click",
            function() {

                const type =
                    object.dataset.type;

                const id =
                    object.dataset.id;


                if (
                    type ===
                    "chemical-factory"
                ) {

                    showChemicalFactory();

                }

                else if (
                    type ===
                    "industrial-factory"
                ) {

                    showIndustrialFactory();

                }

                else if (
                    type ===
                    "office"
                ) {

                    showOffice(id);

                }

                else if (
                    type ===
                    "house"
                ) {

                    showHouse();

                }

                else if (
                    type ===
                    "park"
                ) {

                    showPark(id);

                }

                else if (
                    type ===
                    "car"
                ) {

                    showCar(id);

                }

                else if (
                    type ===
                    "power-plant"
                ) {

                    showPowerPlant(id);

                }

                else if (
                    type ===
                    "recycling"
                ) {

                    showRecycling();

                }

                else if (
                    type ===
                    "bus"
                ) {

                    showBus();

                }

                else if (
                    type ===
                    "hospital"
                ) {

                    showHospital();

                }

            }
        );

    });


// =====================================================
// ULEPSZENIA
// =====================================================

infoPanel.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".upgrade-button"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;

        const id =
            button.dataset.id;


        if (
            getRemainingCooldown(id) > 0
        ) {

            return;

        }


        // =================================================
        // FABRYKA CHEMICZNA
        // =================================================

        if (
            action ===
            "chemical"
        ) {

            const level =
                factories[id];

            const cost =
                getCost(
                    300,
                    level
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 5;

            cleanliness += 5;

            satisfaction += 2;

            factories[id]++;


            startCooldown(id);

            updateStats();

            saveGame();

            showChemicalFactory();

            return;

        }


        // =================================================
        // FABRYKA PRZEMYSŁOWA
        // =================================================

        if (
            action ===
            "industrial"
        ) {

            const level =
                factories[id];

            const cost =
                getCost(
                    350,
                    level
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 6;

            cleanliness += 5;

            satisfaction += 2;

            factories[id]++;


            startCooldown(id);

            updateStats();

            saveGame();

            showIndustrialFactory();

            return;

        }


        // =================================================
        // BIUROWIEC
        // =================================================

        if (
            action ===
            "office"
        ) {

            const level =
                offices[id];

            const cost =
                getCost(
                    100,
                    level
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 2;

            cleanliness += 1;

            satisfaction += 2;

            offices[id]++;


            startCooldown(id);

            updateStats();

            saveGame();

            showOffice(id);

            return;

        }


        // =================================================
        // DOM
        // =================================================

        if (
            action ===
            "house"
        ) {

            const cost =
                getCost(
                    150,
                    houseLevel
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 3;

            cleanliness += 2;

            satisfaction += 3;


            houseLevel++;


            startCooldown(
                "house-1"
            );

            updateStats();

            saveGame();

            showHouse();

            return;

        }


        // =================================================
        // PARK
        // =================================================

        if (
            action ===
            "park"
        ) {

            const level =
                parks[id];

            const cost =
                getCost(
                    200,
                    level
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 2;

            cleanliness +=
                5 + level * 2;

            satisfaction +=
                3 + level;


            parks[id]++;


            startCooldown(id);

            updateStats();

            saveGame();

            showPark(id);

            return;

        }


        // =================================================
        // SAMOCHÓD
        // =================================================

        if (
            action ===
            "car"
        ) {

            const level =
                cars[id];

            const cost =
                getCost(
                    250,
                    level
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 5;

            cleanliness += 2;

            satisfaction += 4;


            cars[id]++;


            startCooldown(id);

            updateStats();

            saveGame();

            showCar(id);

            return;

        }


        // =================================================
        // RECYKLING
        // =================================================

        if (
            action ===
            "recycling"
        ) {

            const cost =
                getCost(
                    250,
                    recyclingLevel
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 2;

            cleanliness += 7;

            satisfaction += 4;


            recyclingLevel++;


            startCooldown(
                "recycling-1"
            );

            updateStats();

            saveGame();

            showRecycling();

            return;

        }


        // =================================================
        // AUTOBUS
        // =================================================

        if (
            action ===
            "bus"
        ) {

            const cost =
                getCost(
                    300,
                    busLevel
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 5;

            cleanliness += 3;

            satisfaction += 6;


            busLevel++;


            startCooldown(
                "bus-1"
            );

            updateStats();

            saveGame();

            showBus();

            return;

        }


        // =================================================
        // SZPITAL
        // =================================================

        if (
            action ===
            "hospital"
        ) {

            const cost =
                getCost(
                    350,
                    hospitalLevel
                );


            if (budget < cost) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            satisfaction +=
                7 +
                hospitalLevel * 2;


            hospitalLevel++;


            startCooldown(
                "hospital-1"
            );

            updateStats();

            saveGame();

            showHospital();

            return;

        }

    }
);


// =====================================================
// KONIEC TURY
// =====================================================

if (endTurnButton) {

    endTurnButton.addEventListener(
        "click",
        function() {

            if (isTurnLocked()) {

                const seconds =
                    Math.ceil(
                        getTurnLockRemaining()
                        / 1000
                    );


                alert(
                    "⛔ Tury są zablokowane!\n\n" +
                    "Spróbuj ponownie za " +
                    seconds +
                    " sekund."
                );

                return;

            }


            const now =
                Date.now();


            turnTimes =
                turnTimes.filter(
                    time =>
                        now - time <=
                        TURN_TIME_WINDOW
                );


            turnTimes.push(now);


            if (
                turnTimes.length >=
                TURN_LIMIT &&
                !turnWarningShown
            ) {

                turnWarningShown = true;


                infoPanel.innerHTML = `

                    <h2>
                        ⚠️ Zwolnij trochę!
                    </h2>

                    <p>
                        Wykonujesz tury bardzo szybko.
                    </p>

                    <p>
                        Jeśli będziesz kontynuować,
                        tury zostaną zablokowane.
                    </p>

                `;


                setTimeout(
                    function() {

                        const current =
                            Date.now();


                        turnTimes =
                            turnTimes.filter(
                                time =>
                                    current - time <=
                                    TURN_TIME_WINDOW
                            );


                        if (
                            turnTimes.length >=
                            TURN_LIMIT
                        ) {

                            turnLockedUntil =
                                Date.now() +
                                TURN_LOCK_TIME;


                            turnTimes = [];

                            turnWarningShown =
                                false;


                            infoPanel.innerHTML = `

                                <h2>
                                    ⛔ TURY ZABLOKOWANE
                                </h2>

                                <p>
                                    Za szybko wykonywałeś
                                    kolejne tury.
                                </p>

                                <p>
                                    🔒 Blokada potrwa
                                    <strong>
                                        5 minut
                                    </strong>.
                                </p>

                            `;

                        }

                        else {

                            turnWarningShown =
                                false;

                        }


                        updateTurnStatus();

                    },
                    TURN_WARNING_TIME
                );

            }


            // =================================================
            // DOCHÓD
            // =================================================

            const status =
                getCityStatus();

            let income = 0;


            if (
                status.name ===
                "KRYTYCZNY"
            ) {

                income = 0;

            }

            else if (
                status.name ===
                "ZŁY"
            ) {

                income = 250;

            }

            else if (
                status.name ===
                "ŚREDNI"
            ) {

                income = 350;

            }

            else if (
                status.name ===
                "DOBRY"
            ) {

                income = 450;

            }

            else {

                income = 550;

            }


            if (
                satisfaction >= 80
            ) {

                income += 100;

            }

            else if (
                satisfaction >= 60
            ) {

                income += 50;

            }


            // =================================================
            // ENERGIA
            // =================================================

            const energy =
                calculateEnergySystem();


            co2 +=
                Math.round(
                    energy.co2 / 3
                );


            cleanliness +=
                Math.round(
                    energy.clean / 3
                );


            const realEnergyCost =
                energy.totalCost;


            budget += income;

            budget -= realEnergyCost;


            // =================================================
            // BRAK ENERGII
            // =================================================

            if (
                energy.shortage > 0
            ) {

                co2 +=
                    Math.ceil(
                        energy.shortage / 20
                    );


                satisfaction -=
                    Math.ceil(
                        energy.shortage / 15
                    );

            }


            // =================================================
            // NOWA TURA
            // =================================================

            turn++;


            // Naturalne pogarszanie

            co2 += 3;

            cleanliness -= 2;

            satisfaction -= 3;


            updateStats();

            saveGame();


            const newStatus =
                getCityStatus();


            infoPanel.innerHTML = `

                <h2>
                    📊 Raport miasta
                </h2>

                <p>
                    🏙️
                    <strong>
                        ${cityName}
                    </strong>
                </p>

                <p>
                    📅 Tura:
                    <strong>
                        ${turn}
                    </strong>
                </p>

                <p>
                    ${newStatus.emoji}
                    Stan miasta:
                    <strong>
                        ${newStatus.name}
                    </strong>
                </p>

                <p>
                    🌫️ CO₂:
                    <strong>
                        ${co2}%
                    </strong>
                </p>

                <p>
                    🌱 Czystość:
                    <strong>
                        ${cleanliness}%
                    </strong>
                </p>

                <p>
                    😊 Zadowolenie:
                    <strong>
                        ${satisfaction}%
                    </strong>
                </p>

                <hr>

                <p>
                    ⚡ Produkcja energii:
                    <strong>
                        ${energy.production} MW
                    </strong>
                </p>

                <p>
                    🏙️ Zużycie energii:
                    <strong>
                        ${energy.demand} MW
                    </strong>
                </p>

                <p>
                    📊 Bilans:
                    <strong>
                        ${energy.production - energy.demand} MW
                    </strong>
                </p>

                <p>
                    💰 Koszt elektrowni:
                    <strong>
                        -${energy.plantCost} $
                    </strong>
                </p>

                ${
                    energy.shortage > 0
                    ? `
                        <p>
                            🚨 Kara za brak energii:
                            <strong>
                                -${energy.emergencyCost} $
                            </strong>
                        </p>
                    `
                    : ""
                }

                <p>
                    ⚡
                    <strong>
                        Łączny koszt energii:
                    </strong>

                    <strong>
                        -${realEnergyCost} $
                    </strong>
                </p>

                <p>
                    💰 Dochód:
                    <strong>
                        +${income} $
                    </strong>
                </p>

                <p>
                    💵 Budżet:
                    <strong>
                        ${budget} $
                    </strong>
                </p>

                ${
                    energy.shortage > 0
                    ? `
                        <div class="critical-message">

                            🚨
                            <strong>
                                Niedobór energii!
                            </strong>

                            <br><br>

                            Miasto potrzebuje
                            ${energy.demand} MW,
                            ale produkuje tylko
                            ${energy.production} MW.

                            <br><br>

                            Rozważ zwiększenie
                            mocy elektrowni.

                        </div>
                    `
                    : `
                        <p>
                            🟢 Energia pokrywa
                            całe zapotrzebowanie miasta.
                        </p>
                    `
                }

                <button
                    class="show-all-energy"
                >
                    ⚡ Zarządzaj elektrowniami
                </button>

            `;


            document
                .querySelector(
                    ".show-all-energy"
                )
                ?.addEventListener(
                    "click",
                    showAllPowerPlants
                );

        }
    );

}


// =====================================================
// RESET
// =====================================================

if (resetButton) {

    resetButton.addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "⚠️ Czy na pewno chcesz zresetować całą grę?"
                );


            if (!confirmed) {
                return;
            }


            co2 = 75;

            cleanliness = 40;

            satisfaction = 60;

            budget = 1000;

            turn = 1;

            cityName =
                "Moje miasto";


            turnTimes = [];

            turnWarningShown = false;

            turnLockedUntil = 0;


            offices = {
                "office-1": 0,
                "office-2": 0
            };


            parks = {
                "park-1": 0,
                "park-2": 0,
                "park-3": 0
            };


            cars = {
                "car-1": 0,
                "car-2": 0
            };


            factories = {
                "factory-1": 0,
                "factory-2": 0
            };


            houseLevel = 0;

            recyclingLevel = 0;

            busLevel = 0;

            hospitalLevel = 0;

            cooldowns = {};


            powerPlants.coal.power = 25;

            powerPlants.wind.power = 15;

            powerPlants.water.power = 35;

            powerPlants.solar.power = 40;

            powerPlants.nuclear.power = 60;


            updateStats();


            infoPanel.innerHTML = `

                <h2>
                    🏙️ ${cityName}
                </h2>

                <p>
                    ✅ Gra została zresetowana.
                </p>

                <p>
                    Kliknij elektrownię,
                    aby zarządzać jej mocą.
                </p>

            `;


            saveGame();

        }
    );

}


// =====================================================
// ZAPIS
// =====================================================

function saveGame() {

    localStorage.setItem(
        "climateZero",
        JSON.stringify({

            co2,

            cleanliness,

            satisfaction,

            budget,

            turn,

            cityName,

            offices,

            parks,

            cars,

            factories,

            houseLevel,

            recyclingLevel,

            busLevel,

            hospitalLevel,

            powerPlants

        })
    );

}


// =====================================================
// WCZYTANIE
// =====================================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "climateZero"
        );


    if (!saved) {

        updateStats();

        return;

    }


    try {

        const game =
            JSON.parse(saved);


        co2 =
            game.co2 ?? 75;

        cleanliness =
            game.cleanliness ?? 40;

        satisfaction =
            game.satisfaction ?? 60;

        budget =
            game.budget ?? 1000;

        turn =
            game.turn ?? 1;

        cityName =
            game.cityName ??
            "Moje miasto";


        offices =
            game.offices ??
            offices;

        parks =
            game.parks ??
            parks;

        cars =
            game.cars ??
            cars;

        factories =
            game.factories ??
            factories;


        houseLevel =
            game.houseLevel ?? 0;

        recyclingLevel =
            game.recyclingLevel ?? 0;

        busLevel =
            game.busLevel ?? 0;

        hospitalLevel =
            game.hospitalLevel ?? 0;


        if (game.powerPlants) {

            Object.keys(powerPlants)
                .forEach(function(id) {

                    if (
                        game.powerPlants[id]
                    ) {

                        powerPlants[id].power =
                            game.powerPlants[id].power;

                    }

                });

        }


        updateStats();

    }

    catch (error) {

        console.error(
            "Błąd wczytywania:",
            error
        );


        localStorage.removeItem(
            "climateZero"
        );


        updateStats();

    }

}


// =====================================================
// AUTOMATYCZNE COOLDOWNY
// =====================================================

setInterval(
    function() {

        const active =
            document.querySelector(
                ".upgrade-button:disabled"
            );


        if (!active) {
            return;
        }


        const parent =
            active.parentElement;


        if (!parent) {
            return;
        }

    },
    1000
);


// =====================================================
// STATUS TURY
// =====================================================

setInterval(
    function() {

        updateTurnStatus();

    },
    1000
);


// =====================================================
// START
// =====================================================

loadGame();