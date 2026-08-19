// =================================
// CLIMATE: ZERO
// JAVASCRIPT
// =================================

// Biblioteki załadowane:
// Leaflet.js  → L
// Chart.js    → Chart
// Lucide      → lucide
// GSAP        → gsap

console.log("Climate: Zero uruchomione!");
console.log("Leaflet:", typeof L !== "undefined");
console.log("Chart.js:", typeof Chart !== "undefined");
console.log("Lucide:", typeof lucide !== "undefined");
console.log("GSAP:", typeof gsap !== "undefined");

let co2 = 75;
let cleanliness = 40;

const button = document.getElementById("reduce-emission");

button.addEventListener("click", function() {

    co2 -= 5;
    cleanliness += 5;

    document.getElementById("co2").textContent = co2 + "%";
    document.getElementById("cleanliness").textContent = cleanliness + "%";

});