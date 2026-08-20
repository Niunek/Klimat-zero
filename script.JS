// =====================================================
// CLIMATE: ZERO
// =====================================================


// =====================================================
// STATYSTYKI
// =====================================================

let co2 = 75;

let cleanliness = 40;

let satisfaction = 60;

let budget = 1000;

let turn = 1;


// =====================================================
// POZIOMY OBIEKTÓW
// =====================================================

// Każdy obiekt jest osobny.

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


let powerPlantLevel = 0;


let recyclingLevel = 0;


let busLevel = 0;


let hospitalLevel = 0;


// =====================================================
// COOLDOWN
// =====================================================

let cooldowns = {};

const COOLDOWN_TIME = 15000;


// =====================================================
// ELEMENTY
// =====================================================

const infoPanel =
    document.getElementById(
        "info-panel"
    );


const resetButton =
    document.getElementById(
        "reset-budget"
    );


const endTurnButton =
    document.getElementById(
        "end-turn"
    );


// =====================================================
// AKTUALIZACJA STATYSTYK
// =====================================================

function updateStats() {

    co2 =
        Math.max(
            0,
            Math.min(
                100,
                co2
            )
        );


    cleanliness =
        Math.max(
            0,
            Math.min(
                100,
                cleanliness
            )
        );


    satisfaction =
        Math.max(
            0,
            Math.min(
                100,
                satisfaction
            )
        );


    budget =
        Math.max(
            0,
            budget
        );


    document.getElementById(
        "co2"
    ).textContent =
        co2 + "%";


    document.getElementById(
        "cleanliness"
    ).textContent =
        cleanliness + "%";


    document.getElementById(
        "satisfaction"
    ).textContent =
        satisfaction + "%";


    document.getElementById(
        "budget"
    ).textContent =
        budget + " $";


    document.getElementById(
        "turn"
    ).textContent =
        turn;


    updatePollutionBar();

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
// STAN MIASTA
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
// CENA
// =====================================================

function getCost(
    start,
    level
) {

    return start +
        level * 50;

}


// =====================================================
// COOLDOWN
// =====================================================

function getRemainingCooldown(id) {

    if (!cooldowns[id]) {

        return 0;

    }


    const remaining =
        COOLDOWN_TIME -
        (
            Date.now() -
            cooldowns[id]
        );


    return Math.max(
        0,
        remaining
    );

}


// =====================================================
// START COOLDOWNU
// =====================================================

function startCooldown(id) {

    cooldowns[id] =
        Date.now();

}


// =====================================================
// PRZYCISK ULEPSZENIA
// =====================================================

function upgradeButton(
    action,
    id,
    cost
) {

    const remaining =
        getRemainingCooldown(
            id
        );


    if (remaining > 0) {

        const seconds =
            Math.ceil(
                remaining / 1000
            );


        return `

            <button disabled>

                ⏳ Dostępne za
                ${seconds}s

            </button>

        `;

    }


    return `

        <button
            class="upgrade-button"
            data-action="${action}"
            data-id="${id}"
        >

            🔧 Ulepsz —
            ${cost} $

        </button>

    `;

}


// =====================================================
// PANEL FABRYKI CHEMICZNEJ
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
            18 -
            level * 3
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
// PANEL FABRYKI PRZEMYSŁOWEJ
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
            15 -
            level * 3
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
                ${Math.max(
                    3,
                    10 -
                    level
                )} MW
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


    infoPanel.innerHTML = `

        <h2>
            🏠 Dom mieszkalny
        </h2>

        <p>
            👥 Mieszkańcy:
            <strong>
                5
            </strong>
        </p>

        <p>
            ⚡ Zużycie:
            <strong>
                ${Math.max(
                    1,
                    2 -
                    houseLevel
                )} MW
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
                dziennie
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
                    3 -
                    level
                )}%
            </strong>
        </p>

        <p>
            ⭐ Poziom komunikacji:
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
// ELEKTROWNIA
// =====================================================

function showPowerPlant() {

    const id =
        "power-plant-1";


    const cost =
        getCost(
            400,
            powerPlantLevel
        );


    infoPanel.innerHTML = `

        <h2>
            ⚡ Elektrownia
        </h2>

        <p>
            Energia:
            <strong>
                ${
                    powerPlantLevel === 0
                    ? "Węglowa"
                    : powerPlantLevel === 1
                    ? "Gazowa"
                    : powerPlantLevel === 2
                    ? "Słoneczna"
                    : "Zielona"
                }
            </strong>
        </p>

        <p>
            🌫️ Wpływ na CO₂:
            <strong>
                -${powerPlantLevel * 3}%
            </strong>
        </p>

        <p>
            ⭐ Poziom:
            <strong>
                ${powerPlantLevel}
            </strong>
        </p>

        ${upgradeButton(
            "power",
            id,
            cost
        )}

    `;

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
// ZAJEZDNIA
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
            ❤️ Zadowolenie mieszkańców:
            <strong>
                +${5 + hospitalLevel * 2}%
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
    .forEach(
        function(object) {

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
                        type === "office"
                    ) {

                        showOffice(id);

                    }


                    else if (
                        type === "house"
                    ) {

                        showHouse();

                    }


                    else if (
                        type === "park"
                    ) {

                        showPark(id);

                    }


                    else if (
                        type === "car"
                    ) {

                        showCar(id);

                    }


                    else if (
                        type === "power-plant"
                    ) {

                        showPowerPlant();

                    }


                    else if (
                        type === "recycling"
                    ) {

                        showRecycling();

                    }


                    else if (
                        type === "bus"
                    ) {

                        showBus();

                    }


                    else if (
                        type === "hospital"
                    ) {

                        showHospital();

                    }

                }
            );

        }
    );


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


        // ---------------------------------------------
        // FABRYKA CHEMICZNA
        // ---------------------------------------------

        if (
            action === "chemical"
        ) {

            const level =
                factories[id];


            const cost =
                getCost(
                    300,
                    level
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // FABRYKA PRZEMYSŁOWA
        // ---------------------------------------------

        if (
            action === "industrial"
        ) {

            const level =
                factories[id];


            const cost =
                getCost(
                    350,
                    level
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // BIUROWIEC
        // ---------------------------------------------

        if (
            action === "office"
        ) {

            const level =
                offices[id];


            const cost =
                getCost(
                    100,
                    level
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // DOM
        // ---------------------------------------------

        if (
            action === "house"
        ) {

            const cost =
                getCost(
                    150,
                    houseLevel
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // PARK
        // ---------------------------------------------

        if (
            action === "park"
        ) {

            const level =
                parks[id];


            const cost =
                getCost(
                    200,
                    level
                );


            if (
                budget < cost
            ) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 2;

            cleanliness +=
                5 +
                level * 2;

            satisfaction +=
                3 +
                level;


            parks[id]++;

            startCooldown(id);


            updateStats();

            saveGame();

            showPark(id);

            return;

        }


        // ---------------------------------------------
        // SAMOCHÓD / KOMUNIKACJA
        // ---------------------------------------------

        if (
            action === "car"
        ) {

            const level =
                cars[id];


            const cost =
                getCost(
                    250,
                    level
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // ELEKTROWNIA
        // ---------------------------------------------

        if (
            action === "power"
        ) {

            const cost =
                getCost(
                    400,
                    powerPlantLevel
                );


            if (
                budget < cost
            ) {

                alert(
                    "❌ Za mało pieniędzy!"
                );

                return;

            }


            budget -= cost;

            co2 -= 7;

            cleanliness += 4;

            satisfaction += 2;


            powerPlantLevel++;

            startCooldown(
                "power-plant-1"
            );


            updateStats();

            saveGame();

            showPowerPlant();

            return;

        }


        // ---------------------------------------------
        // RECYKLING
        // ---------------------------------------------

        if (
            action === "recycling"
        ) {

            const cost =
                getCost(
                    250,
                    recyclingLevel
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // AUTOBUSY
        // ---------------------------------------------

        if (
            action === "bus"
        ) {

            const cost =
                getCost(
                    300,
                    busLevel
                );


            if (
                budget < cost
            ) {

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


        // ---------------------------------------------
        // SZPITAL
        // ---------------------------------------------

        if (
            action === "hospital"
        ) {

            const cost =
                getCost(
                    350,
                    hospitalLevel
                );


            if (
                budget < cost
            ) {

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
// ZAKOŃCZENIE TURY
// =====================================================

endTurnButton.addEventListener(
    "click",
    function() {

        const status =
            getCityStatus();


        let income = 0;


        // KRYTYCZNY
        if (
            status.name ===
            "KRYTYCZNY"
        ) {

            income = 0;

        }


        // ZŁY
        else if (
            status.name ===
            "ZŁY"
        ) {

            income = 100;

        }


        // ŚREDNI
        else if (
            status.name ===
            "ŚREDNI"
        ) {

            income = 200;

        }


        // DOBRY
        else if (
            status.name ===
            "DOBRY"
        ) {

            income = 300;

        }


        // ŚWIETNY
        else {

            income = 450;

        }


        // Bonus za zadowolenie

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


        budget += income;


        turn++;


        updateStats();

        saveGame();


        infoPanel.innerHTML = `

            <h2>
                📊 Raport miasta
            </h2>

            <p>
                📅 Tura:
                <strong>
                    ${turn}
                </strong>
            </p>

            <p>
                ${status.emoji}
                Stan miasta:
                <strong>
                    ${status.name}
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

            <p>
                💰 Dochód:
                <strong>
                    +${income} $
                </strong>
            </p>

            ${
                income === 0
                ? `
                    <p>
                        🔴 Miasto jest w stanie
                        krytycznym.
                        Nie otrzymujesz dochodu.
                    </p>
                  `
                : ""
            }

        `;

    }
);


// =====================================================
// RESET
// =====================================================

resetButton.addEventListener(
    "click",
    function() {

        co2 = 75;

        cleanliness = 40;

        satisfaction = 60;

        budget = 1000;

        turn = 1;


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

        powerPlantLevel = 0;

        recyclingLevel = 0;

        busLevel = 0;

        hospitalLevel = 0;


        cooldowns = {};


        updateStats();


        infoPanel.innerHTML = `

            <h2>
                🏙️ Miasto
            </h2>

            <p>
                Gra została zresetowana.
            </p>

            <p>
                Kliknij obiekt, aby rozpocząć.
            </p>

        `;


        saveGame();

    }
);


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

            offices,

            parks,

            cars,

            factories,

            houseLevel,

            powerPlantLevel,

            recyclingLevel,

            busLevel,

            hospitalLevel

        })

    );

}


// =====================================================
// WCZYTYWANIE
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


        offices =
            game.offices ?? {
                "office-1": 0,
                "office-2": 0
            };


        parks =
            game.parks ?? {
                "park-1": 0,
                "park-2": 0,
                "park-3": 0
            };


        cars =
            game.cars ?? {
                "car-1": 0,
                "car-2": 0
            };


        factories =
            game.factories ?? {
                "factory-1": 0,
                "factory-2": 0
            };


        houseLevel =
            game.houseLevel ?? 0;


        powerPlantLevel =
            game.powerPlantLevel ?? 0;


        recyclingLevel =
            game.recyclingLevel ?? 0;


        busLevel =
            game.busLevel ?? 0;


        hospitalLevel =
            game.hospitalLevel ?? 0;


        updateStats();

    }

    catch (error) {

        console.error(
            "Błąd zapisu:",
            error
        );

        localStorage.removeItem(
            "climateZero"
        );

        updateStats();

    }

}


// =====================================================
// START
// =====================================================

loadGame();