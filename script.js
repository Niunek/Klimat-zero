// =====================================================
// CLIMATE: ZERO
// PEŁNY SCRIPT.JS
// ZARZĄDZANIE MIASTEM + ENERGIA + MISJE + OSIĄGNIĘCIA
// + WYDARZENIA + SZKOŁA + DUŻY PARK + ZAPIS GRY
// =====================================================


// =====================================================
// STATYSTYKI GRY
// =====================================================

let co2 = 75;

let cleanliness = 40;

let satisfaction = 60;

let budget = 1000;

let turn = 1;

let cityName = "Moje miasto";


// =====================================================
// BLOKADA SZYBKICH TUR
// =====================================================

let turnTimes = [];

let turnWarningShown = false;

let turnLockedUntil = 0;

const TURN_LIMIT = 5;

const TURN_TIME_WINDOW = 7000;

const TURN_WARNING_TIME = 3000;

const TURN_LOCK_TIME = 5 * 60 * 1000;


// =====================================================
// OBIEKTY MIASTA
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

let schoolLevel = 0;

let bigParkLevel = 0;


// =====================================================
// DODATKOWE SYSTEMY
// =====================================================

let eventsCompleted = 0;

let missionsCompleted = 0;

let currentMission = 0;

let activeEvent = null;


// =====================================================
// OSIĄGNIĘCIA
// =====================================================

let achievements = {

    firstTurn: false,

    firstUpgrade: false,

    cleanCity: false,

    happyCity: false,

    richCity: false,

    energyPositive: false,

    lowCO2: false,

    allBuildings: false,

    eventMaster: false,

    missionMaster: false

};


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
// COOLDOWN ULEPSZEŃ
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


// =====================================================
// ZMIANA NAZWY MIASTA
// =====================================================

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


    cityName =
        trimmedName;


    updateCityName();

    saveGame();

}


// =====================================================
// EVENT — NAZWA MIASTA
// =====================================================

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
// AKTUALIZACJA STATYSTYK
// =====================================================

function updateStats() {

    co2 =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(co2)
            )
        );


    cleanliness =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(cleanliness)
            )
        );


    satisfaction =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(satisfaction)
            )
        );


    budget =
        Math.max(
            0,
            Math.round(budget)
        );


    const co2Element =
        document.getElementById("co2");


    const cleanlinessElement =
        document.getElementById("cleanliness");


    const satisfactionElement =
        document.getElementById("satisfaction");


    const budgetElement =
        document.getElementById("budget");


    const turnElement =
        document.getElementById("turn");


    const factoriesElement =
        document.getElementById("factories");


    if (co2Element) {

        co2Element.textContent =
            co2 + "%";

    }


    if (cleanlinessElement) {

        cleanlinessElement.textContent =
            cleanliness + "%";

    }


    if (satisfactionElement) {

        satisfactionElement.textContent =
            satisfaction + "%";

    }


    if (budgetElement) {

        budgetElement.textContent =
            budget + " $";

    }


    if (turnElement) {

        turnElement.textContent =
            turn;

    }


    const factoryCount =
        Object.values(factories)
            .filter(
                level => level > 0
            )
            .length;


    if (factoriesElement) {

        factoriesElement.textContent =
            factoryCount;

    }


    updatePollutionBar();

    updateCityStatus();

    updateTurnStatus();

    updateCityName();

}


// =====================================================
// PASEK CO2
// =====================================================

function updatePollutionBar() {

    const value =
        document.getElementById(
            "pollution-value"
        );


    const fill =
        document.getElementById(
            "pollution-fill"
        );


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


// =====================================================
// AKTUALIZACJA STATUSU
// =====================================================

function updateCityStatus() {

    const element =
        document.getElementById(
            "city-status"
        );


    if (!element) {

        return;

    }


    const status =
        getCityStatus();


    element.textContent =
        `${status.emoji} ${status.name}`;

}


// =====================================================
// BLOKADA TUR
// =====================================================

function isTurnLocked() {

    return Date.now() < turnLockedUntil;

}


// =====================================================
// POZOSTAŁY CZAS BLOKADY
// =====================================================

function getTurnLockRemaining() {

    return Math.max(
        0,
        turnLockedUntil - Date.now()
    );

}


// =====================================================
// STATUS BLOKADY TUR
// =====================================================

function updateTurnStatus() {

    const element =
        document.getElementById(
            "turn-status"
        );


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

            endTurnButton.disabled =
                true;

        }


        return;

    }


    element.textContent =
        "🟢 Możesz zakończyć turę.";


    if (endTurnButton) {

        endTurnButton.disabled =
            false;

    }

}


// =====================================================
// KOSZT ULEPSZENIA
// =====================================================

function getCost(start, level) {

    return start + level * 50;

}


// =====================================================
// COOLDOWN — POZOSTAŁY CZAS
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


// =====================================================
// ROZPOCZĘCIE COOLDOWNU
// =====================================================

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

        bigPark: "🌲",

        car: "🌫️",

        recycling: "🌱",

        bus: "😊",

        hospital: "😊",

        school: "🏫"

    };


    return icons[action] || "🔧";

}


// =====================================================
// OPIS EFEKTU
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

        bigPark:
            "🌲 Mocno poprawia czystość",

        car:
            "🌫️ Zmniejsza wpływ transportu",

        recycling:
            "🌱 Poprawia czystość",

        bus:
            "😊 Zwiększa zadowolenie",

        hospital:
            "😊 Zwiększa zadowolenie",

        school:
            "🏫 Poprawia zadowolenie i edukację"

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

    const id =
        "factory-1";


    const level =
        factories[id];


    const cost =
        getCost(
            300,
            level
        );


    const emission =
        Math.max(
            3,
            18 - level * 3
        );


    infoPanel.innerHTML = `

        <h2>
            🏭 Fabryka chemiczna
        </h2>

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

    const id =
        "factory-2";


    const level =
        factories[id];


    const cost =
        getCost(
            350,
            level
        );


    const emission =
        Math.max(
            3,
            15 - level * 3
        );


    infoPanel.innerHTML = `

        <h2>
            🏭 Fabryka przemysłowa
        </h2>

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
        getCost(
            100,
            level
        );


    const energy =
        10 + level * 2;


    infoPanel.innerHTML = `

        <h2>
            🏢 Biurowiec
        </h2>

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

        <h2>
            🏠 Dom mieszkalny
        </h2>

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
        getCost(
            200,
            level
        );


    infoPanel.innerHTML = `

        <h2>
            🌳 Park miejski
        </h2>

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
// DUŻY PARK
// =====================================================

function showBigPark() {

    const id =
        "big-park-1";


    const cost =
        getCost(
            400,
            bigParkLevel
        );


    infoPanel.innerHTML = `

        <h2>
            🌲 Duży park miejski
        </h2>

        <p>
            🌱 Wpływ na czystość:
            <strong>
                +${10 + bigParkLevel * 4}%
            </strong>
        </p>

        <p>
            😊 Zadowolenie:
            <strong>
                +${6 + bigParkLevel * 2}%
            </strong>
        </p>

        <p>
            🌳 Powierzchnia:
            <strong>
                ${500 + bigParkLevel * 100} m²
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${bigParkLevel}
            </strong>
        </p>

        ${upgradeButton(
            "bigPark",
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
        getCost(
            250,
            level
        );


    infoPanel.innerHTML = `

        <h2>
            🚗 Ruch drogowy
        </h2>

        <p>
            🆔 ${id}
        </p>

        <p>
            🌫️ Wpływ na CO₂:
            <strong>
                ${Math.max(
                    0,
                    3 - level
                )}%
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
// OBLICZENIA ELEKTROWNI
// =====================================================

function calculatePlantStats(id) {

    const plant =
        powerPlants[id];


    if (!plant) {

        return {

            production: 0,

            cost: 0,

            emission: 0,

            clean: 0

        };

    }


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

            ? Math.round(
                plant.cleanliness *
                power / 100
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
// ZAPOTRZEBOWANIE ENERGETYCZNE MIASTA
// =====================================================

function calculateCityEnergyDemand() {

    let demand = 0;


    demand +=
        (1 + houseLevel) * 5;


    Object.values(offices)
        .forEach(
            level => {

                demand +=
                    10 + level * 2;

            }
        );


    Object.values(factories)
        .forEach(
            level => {

                if (level > 0) {

                    demand +=
                        20 + level * 4;

                }

            }
        );


    Object.values(cars)
        .forEach(
            level => {

                demand +=
                    2 + level;

            }
        );


    if (recyclingLevel > 0) {

        demand +=
            8 + recyclingLevel * 2;

    }


    if (busLevel > 0) {

        demand +=
            10 + busLevel * 2;

    }


    if (hospitalLevel > 0) {

        demand +=
            15 + hospitalLevel * 3;

    }


    if (schoolLevel > 0) {

        demand +=
            7 + schoolLevel * 2;

    }


    return Math.round(
        demand
    );

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
        .forEach(
            id => {

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

            }
        );


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
// PANEL POJEDYNCZEJ ELEKTROWNI
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
                ${
                    stats.clean >= 0
                        ? "+"
                        : ""
                }${stats.clean}%
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
                ${
                    energy.production -
                    energy.demand
                } MW
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
        .forEach(
            id => {

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

            }
        );


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
// OBSŁUGA SUWAKÓW ELEKTROWNI
// =====================================================

function setupEnergySliders() {

    document
        .querySelectorAll(
            ".energy-slider"
        )
        .forEach(
            slider => {

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

            }
        );


    document
        .querySelectorAll(
            ".show-all-energy"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    showAllPowerPlants
                );

            }
        );

}


// =====================================================
// AKTUALIZACJA SUWAKA
// =====================================================

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
// SZKOŁA
// =====================================================

function showSchool() {

    const id =
        "school-1";


    const cost =
        getCost(
            300,
            schoolLevel
        );


    const students =
        100 +
        schoolLevel * 50;


    infoPanel.innerHTML = `

        <h2>
            🏫 Szkoła
        </h2>

        <p>
            👨‍🎓 Uczniowie:
            <strong>
                ${students}
            </strong>
        </p>

        <p>
            😊 Wpływ na zadowolenie:
            <strong>
                +${4 + schoolLevel * 2}%
            </strong>
        </p>

        <p>
            🌱 Edukacja ekologiczna:
            <strong>
                Poziom ${schoolLevel}
            </strong>
        </p>

        <p>
            ⚡ Zużycie energii:
            <strong>
                ${7 + schoolLevel * 2}
                MW / turę
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${schoolLevel}
            </strong>
        </p>

        ${upgradeButton(
            "school",
            id,
            cost
        )}

    `;

}


// =====================================================
// KLIKANIE OBIEKTÓW MIASTA
// =====================================================

document
    .querySelectorAll(
        ".city-view [data-type]"
    )
    .forEach(
        object => {

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
                        "big-park"
                    ) {

                        showBigPark();

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

                    else if (
                        type ===
                        "school"
                    ) {

                        showSchool();

                    }

                }
            );

        }
    );


// =====================================================
// ULEPSZENIA — GŁÓWNY HANDLER
// =====================================================

if (infoPanel) {

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


            if (button.disabled) {

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

                checkAchievements();

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

                checkAchievements();

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

                checkAchievements();

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

                checkAchievements();

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

                checkAchievements();

                saveGame();

                showPark(id);

                return;

            }


            // =================================================
            // DUŻY PARK
            // =================================================

            if (
                action ===
                "bigPark"
            ) {

                const cost =
                    getCost(
                        400,
                        bigParkLevel
                    );


                if (budget < cost) {

                    alert(
                        "❌ Za mało pieniędzy!"
                    );

                    return;

                }


                budget -= cost;

                co2 -= 4;

                cleanliness +=
                    10 +
                    bigParkLevel * 4;

                satisfaction +=
                    6 +
                    bigParkLevel * 2;


                bigParkLevel++;


                startCooldown(
                    "big-park-1"
                );

                updateStats();

                checkAchievements();

                saveGame();

                showBigPark();

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

                checkAchievements();

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

                checkAchievements();

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

                checkAchievements();

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

                checkAchievements();

                saveGame();

                showHospital();

                return;

            }


            // =================================================
            // SZKOŁA
            // =================================================

            if (
                action ===
                "school"
            ) {

                const cost =
                    getCost(
                        300,
                        schoolLevel
                    );


                if (budget < cost) {

                    alert(
                        "❌ Za mało pieniędzy!"
                    );

                    return;

                }


                budget -= cost;

                satisfaction +=
                    4 +
                    schoolLevel * 2;

                cleanliness += 2;

                schoolLevel++;


                startCooldown(
                    "school-1"
                );

                updateStats();

                checkAchievements();

                saveGame();

                showSchool();

                return;

            }

        }
    );

}


// =====================================================
// WYDARZENIA
// =====================================================

const cityEvents = [

    {

        title: "🌧️ Ulewa",

        description:
            "Silne opady powodują problemy w mieście.",

        effect:
            "Czystość -3%, zadowolenie -2%.",

        co2: 0,

        cleanliness: -3,

        satisfaction: -2

    },


    {

        title: "☀️ Słoneczny dzień",

        description:
            "Panele słoneczne mogą pracować wydajniej.",

        effect:
            "CO₂ -2%, czystość +2%.",

        co2: -2,

        cleanliness: 2,

        satisfaction: 0

    },


    {

        title: "🌱 Zielona inicjatywa",

        description:
            "Mieszkańcy wspólnie sadzą drzewa.",

        effect:
            "CO₂ -2%, czystość +6%, zadowolenie +4%.",

        co2: -2,

        cleanliness: 6,

        satisfaction: 4

    },


    {

        title: "🏭 Awaria fabryki",

        description:
            "Jedna z fabryk ma problem z filtrami.",

        effect:
            "CO₂ +6%, czystość -4%, zadowolenie -1%.",

        co2: 6,

        cleanliness: -4,

        satisfaction: -1

    },


    {

        title: "🚲 Dzień bez samochodu",

        description:
            "Mieszkańcy wybierają rowery i komunikację miejską.",

        effect:
            "CO₂ -5%, czystość +2%, zadowolenie +5%.",

        co2: -5,

        cleanliness: 2,

        satisfaction: 5

    }

];


// =====================================================
// POKAŻ WYDARZENIE
// =====================================================

function showEvents() {

    const event =
        cityEvents[
            Math.floor(
                Math.random() *
                cityEvents.length
            )
        ];


    activeEvent =
        event;


    infoPanel.innerHTML = `

        <h2>
            🎲 ${event.title}
        </h2>

        <p>
            ${event.description}
        </p>

        <p>
            📊 Efekt:
            <strong>
                ${event.effect}
            </strong>
        </p>

        <button
            id="accept-event"
            type="button"
        >
            ✅ Zastosuj wydarzenie
        </button>

    `;


    const button =
        document.getElementById(
            "accept-event"
        );


    if (button) {

        button.addEventListener(
            "click",
            acceptEvent
        );

    }

}


// =====================================================
// ZASTOSOWANIE WYDARZENIA
// =====================================================

function acceptEvent() {

    if (!activeEvent) {

        return;

    }


    co2 +=
        activeEvent.co2;


    cleanliness +=
        activeEvent.cleanliness;


    satisfaction +=
        activeEvent.satisfaction;


    eventsCompleted++;


    activeEvent =
        null;


    updateStats();

    checkAchievements();

    saveGame();


    infoPanel.innerHTML = `

        <h2>
            🎲 Wydarzenie zakończone!
        </h2>

        <p>
            ✅ Efekty zostały zastosowane.
        </p>

        <p>
            🎲 Ukończone wydarzenia:
            <strong>
                ${eventsCompleted}
            </strong>
        </p>

    `;

}


// =====================================================
// MISJE
// =====================================================

const missions = [

    {

        title: "🌱 Zielone miasto",

        description:
            "Osiągnij co najmniej 60% czystości.",

        reward: 250,

        check:
            () =>
                cleanliness >= 60

    },


    {

        title: "😊 Zadowoleni mieszkańcy",

        description:
            "Osiągnij co najmniej 80% zadowolenia.",

        reward: 300,

        check:
            () =>
                satisfaction >= 80

    },


    {

        title: "🌫️ Czyste powietrze",

        description:
            "Zmniejsz CO₂ poniżej 50%.",

        reward: 350,

        check:
            () =>
                co2 < 50

    },


    {

        title: "⚡ Energia dla miasta",

        description:
            "Osiągnij dodatni bilans energii.",

        reward: 400,

        check:
            () => {

                const energy =
                    calculateEnergySystem();

                return (
                    energy.production >
                    energy.demand
                );

            }

    },


    {

        title: "💰 Bogate miasto",

        description:
            "Zgromadź 2000 $.",

        reward: 500,

        check:
            () =>
                budget >= 2000

    }

];


// =====================================================
// SPRAWDZANIE MISJI
// =====================================================

function checkMissions() {

    let changed =
        false;


    missions.forEach(
        (mission, index) => {

            if (
                mission.check() &&
                currentMission <= index
            ) {

                if (
                    currentMission === index
                ) {

                    budget +=
                        mission.reward;

                    missionsCompleted++;

                    currentMission++;

                    changed =
                        true;

                    alert(
                        "🎯 MISJA UKOŃCZONA!\n\n" +
                        mission.title +
                        "\n\n" +
                        "💰 Nagroda: +" +
                        mission.reward +
                        " $"
                    );

                }

            }

        }
    );


    if (changed) {

        updateStats();

        saveGame();

    }

}


// =====================================================
// PANEL MISJI
// =====================================================

function showMissions() {

    let html = `

        <h2>
            🎯 Misje
        </h2>

        <p>
            Wykonuj zadania i zdobywaj nagrody.
        </p>

    `;


    missions.forEach(
        (mission, index) => {

            const completed =
                currentMission > index;


            const active =
                currentMission === index;


            html += `

                <div class="mission-card">

                    <h3>
                        ${mission.title}
                    </h3>

                    <p>
                        ${mission.description}
                    </p>

                    <p>
                        💰 Nagroda:
                        <strong>
                            ${mission.reward} $
                        </strong>
                    </p>

                    <strong>
                        ${
                            completed
                                ? "✅ Ukończono"
                                : active
                                    ? "🎯 Aktualna misja"
                                    : "🔒 Zablokowana"
                        }
                    </strong>

                </div>

            `;

        }
    );


    html += `

        <p>
            🎯 Ukończone:
            <strong>
                ${missionsCompleted}
                /
                ${missions.length}
            </strong>
        </p>

    `;


    infoPanel.innerHTML =
        html;

}


// =====================================================
// OSIĄGNIĘCIA — SPRAWDZANIE
// =====================================================

function checkAchievements() {

    let changed =
        false;


    if (
        turn > 1 &&
        !achievements.firstTurn
    ) {

        achievements.firstTurn =
            true;

        changed =
            true;

    }


    const hasUpgrade =
        Object.values(offices)
            .some(level => level > 0) ||

        Object.values(parks)
            .some(level => level > 0) ||

        Object.values(cars)
            .some(level => level > 0) ||

        Object.values(factories)
            .some(level => level > 0) ||

        houseLevel > 0 ||

        recyclingLevel > 0 ||

        busLevel > 0 ||

        hospitalLevel > 0 ||

        schoolLevel > 0 ||

        bigParkLevel > 0;


    if (
        hasUpgrade &&
        !achievements.firstUpgrade
    ) {

        achievements.firstUpgrade =
            true;

        changed =
            true;

    }


    if (
        cleanliness >= 80 &&
        !achievements.cleanCity
    ) {

        achievements.cleanCity =
            true;

        changed =
            true;

    }


    if (
        satisfaction >= 90 &&
        !achievements.happyCity
    ) {

        achievements.happyCity =
            true;

        changed =
            true;

    }


    if (
        budget >= 3000 &&
        !achievements.richCity
    ) {

        achievements.richCity =
            true;

        changed =
            true;

    }


    const energy =
        calculateEnergySystem();


    if (
        energy.production >
        energy.demand &&
        !achievements.energyPositive
    ) {

        achievements.energyPositive =
            true;

        changed =
            true;

    }


    if (
        co2 <= 30 &&
        !achievements.lowCO2
    ) {

        achievements.lowCO2 =
            true;

        changed =
            true;

    }


    const allBuildings =
        schoolLevel > 0 &&
        bigParkLevel > 0 &&
        recyclingLevel > 0 &&
        busLevel > 0 &&
        hospitalLevel > 0 &&

        Object.values(offices)
            .some(level => level > 0) &&

        Object.values(parks)
            .some(level => level > 0) &&

        Object.values(cars)
            .some(level => level > 0) &&

        Object.values(factories)
            .some(level => level > 0);


    if (
        allBuildings &&
        !achievements.allBuildings
    ) {

        achievements.allBuildings =
            true;

        changed =
            true;

    }


    if (
        eventsCompleted >= 5 &&
        !achievements.eventMaster
    ) {

        achievements.eventMaster =
            true;

        changed =
            true;

    }


    if (
        missionsCompleted >= missions.length &&
        !achievements.missionMaster
    ) {

        achievements.missionMaster =
            true;

        changed =
            true;

    }


    if (changed) {

        saveGame();

    }

}


// =====================================================
// PANEL OSIĄGNIĘĆ
// =====================================================

function showAchievements() {

    checkAchievements();


    const achievementList = [

        [

            "firstTurn",

            "🎮 Pierwszy krok",

            "Zakończ pierwszą turę."

        ],

        [

            "firstUpgrade",

            "🔧 Modernizator",

            "Ulepsz pierwszy obiekt."

        ],

        [

            "cleanCity",

            "🌱 Zielona metropolia",

            "Osiągnij 80% czystości."

        ],

        [

            "happyCity",

            "😊 Raj dla mieszkańców",

            "Osiągnij 90% zadowolenia."

        ],

        [

            "richCity",

            "💰 Bogacz",

            "Zgromadź 3000 $."

        ],

        [

            "energyPositive",

            "⚡ Nadwyżka energii",

            "Produkuj więcej energii niż zużywa miasto."

        ],

        [

            "lowCO2",

            "🌍 Czyste powietrze",

            "Zejdź z CO₂ do 30% lub mniej."

        ],

        [

            "allBuildings",

            "🏙️ Pełne miasto",

            "Ulepsz wszystkie rodzaje budynków."

        ],

        [

            "eventMaster",

            "🎲 Mistrz wydarzeń",

            "Ukończ 5 wydarzeń."

        ],

        [

            "missionMaster",

            "🎯 Mistrz misji",

            "Ukończ wszystkie misje."

        ]

    ];


    const unlockedCount =
        achievementList.filter(
            achievement =>
                achievements[
                    achievement[0]
                ]
        ).length;


    let html = `

        <h2>
            🏆 Osiągnięcia
        </h2>

        <p>
            Zdobyte:
            <strong>
                ${unlockedCount}
                /
                ${achievementList.length}
            </strong>
        </p>

    `;


    achievementList.forEach(
        achievement => {

            const id =
                achievement[0];

            const title =
                achievement[1];

            const description =
                achievement[2];

            const unlocked =
                achievements[id];


            html += `

                <div
                    class="achievement-card"
                    style="
                        opacity:
                        ${
                            unlocked
                                ? "1"
                                : "0.5"
                        };
                    "
                >

                    <h3>
                        ${
                            unlocked
                                ? "🏆"
                                : "🔒"
                        }

                        ${title}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <strong>
                        ${
                            unlocked
                                ? "✅ Odblokowano"
                                : "🔒 Zablokowane"
                        }
                    </strong>

                </div>

            `;

        }
    );


    infoPanel.innerHTML =
        html;

}


// =====================================================
// PRZYCISKI SYSTEMÓW
// =====================================================

const eventsButton =
    document.getElementById(
        "show-events"
    );


const missionsButton =
    document.getElementById(
        "show-missions"
    );


const achievementsButton =
    document.getElementById(
        "show-achievements"
    );


const energyButton =
    document.getElementById(
        "show-energy"
    );


if (eventsButton) {

    eventsButton.addEventListener(
        "click",
        showEvents
    );

}


if (missionsButton) {

    missionsButton.addEventListener(
        "click",
        showMissions
    );

}


if (achievementsButton) {

    achievementsButton.addEventListener(
        "click",
        showAchievements
    );

}


if (energyButton) {

    energyButton.addEventListener(
        "click",
        showAllPowerPlants
    );

}


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

                turnWarningShown =
                    true;


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
            // DOCHÓD MIASTA
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
            // SYSTEM ENERGII
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


            budget +=
                income;


            budget -=
                realEnergyCost;


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


            // =================================================
            // NATURALNE POGARSZANIE
            // =================================================

            co2 += 3;

            cleanliness -= 2;

            satisfaction -= 3;


            // =================================================
            // SPRAWDZENIE MISJI
            // =================================================

            checkMissions();


            // =================================================
            // AKTUALIZACJA
            // =================================================

            updateStats();

            checkAchievements();

            saveGame();


            const newStatus =
                getCityStatus();


            // =================================================
            // RAPORT MIASTA
            // =================================================

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
                        ${
                            energy.production -
                            energy.demand
                        } MW
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

                <p>
                    🎯 Misje:
                    <strong>
                        ${missionsCompleted}
                        /
                        ${missions.length}
                    </strong>
                </p>

                <p>
                    🎲 Wydarzenia:
                    <strong>
                        ${eventsCompleted}
                    </strong>
                </p>

                ${
                    energy.shortage > 0

                        ? `

                            <div
                                class="critical-message"
                            >

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


            const reportEnergyButton =
                infoPanel.querySelector(
                    ".show-all-energy"
                );


            if (reportEnergyButton) {

                reportEnergyButton.addEventListener(
                    "click",
                    showAllPowerPlants
                );

            }

        }
    );

}


// =====================================================
// RESET GRY
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

            schoolLevel = 0;

            bigParkLevel = 0;


            eventsCompleted = 0;

            missionsCompleted = 0;

            currentMission = 0;

            activeEvent = null;


            achievements = {

                firstTurn: false,

                firstUpgrade: false,

                cleanCity: false,

                happyCity: false,

                richCity: false,

                energyPositive: false,

                lowCO2: false,

                allBuildings: false,

                eventMaster: false,

                missionMaster: false

            };


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
                    Kliknij dowolny obiekt,
                    aby rozpocząć zarządzanie miastem.
                </p>

            `;


            saveGame();

        }
    );

}


// =====================================================
// ZAPIS GRY
// =====================================================

function saveGame() {

    const gameData = {

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

        schoolLevel,

        bigParkLevel,

        eventsCompleted,

        missionsCompleted,

        currentMission,

        achievements,

        powerPlants

    };


    localStorage.setItem(
        "climateZero",
        JSON.stringify(gameData)
    );

}


// =====================================================
// WCZYTYWANIE GRY
// =====================================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "climateZero"
        );


    if (!saved) {

        updateStats();

        checkAchievements();

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
            game.houseLevel ??
            0;


        recyclingLevel =
            game.recyclingLevel ??
            0;


        busLevel =
            game.busLevel ??
            0;


        hospitalLevel =
            game.hospitalLevel ??
            0;


        schoolLevel =
            game.schoolLevel ??
            0;


        bigParkLevel =
            game.bigParkLevel ??
            0;


        eventsCompleted =
            game.eventsCompleted ??
            0;


        missionsCompleted =
            game.missionsCompleted ??
            0;


        currentMission =
            game.currentMission ??
            0;


        achievements =
            game.achievements ??
            achievements;


        if (game.powerPlants) {

            Object.keys(powerPlants)
                .forEach(
                    id => {

                        if (
                            game.powerPlants[id] &&
                            typeof
                            game.powerPlants[id].power
                            === "number"
                        ) {

                            powerPlants[id].power =
                                Math.max(
                                    0,
                                    Math.min(
                                        100,
                                        game.powerPlants[id].power
                                    )
                                );

                        }

                    }
                );

        }


        updateStats();

        checkAchievements();

    }


    catch (error) {

        console.error(
            "Błąd wczytywania gry:",
            error
        );


        localStorage.removeItem(
            "climateZero"
        );


        updateStats();

    }

}


// =====================================================
// AUTOMATYCZNE ODŚWIEŻANIE COOLDOWNÓW
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


        const id =
            active.dataset.id;


        if (
            getRemainingCooldown(id) <= 0
        ) {

            if (
                document.querySelector(
                    ".city-view"
                )
            ) {

                updateStats();

            }

        }

    },
    1000
);


// =====================================================
// ODŚWIEŻANIE STATUSU TUR
// =====================================================

setInterval(
    function() {

        updateTurnStatus();

    },
    1000
);


// =====================================================
// START GRY
// =====================================================

loadGame();


// =====================================================
// PIERWSZA AKTUALIZACJA
// =====================================================

updateStats();

checkAchievements();
