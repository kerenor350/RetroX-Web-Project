const profileImage = localStorage.getItem("selectedPersonaImage");

let map;
let markerGroup;
let allMovies = [];

if (profileImage) {
    document.querySelector(".profile-img").src = profileImage;
}

initMapPage();

function initLeafletMap() {

    map = L.map("map").setView([32.0853, 34.7818], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

        maxZoom: 19,
        attribution:
            "&copy; OpenStreetMap contributors"

    }).addTo(map);

    markerGroup = L.layerGroup().addTo(map);

}

async function initMapPage() {

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

    document
        .getElementById("location-form")
        .addEventListener("submit", saveLocation);

    initLeafletMap();
    await loadMoviesForSelect();
    await loadLocations();

}

async function loadMoviesForSelect() {

    const response = await fetch("/movies/all");
    allMovies = await response.json();

    const select = document.getElementById("location-movie");
    select.innerHTML = "";

    allMovies.forEach(movie => {

        const option = document.createElement("option");
        option.value = movie._id;
        option.textContent = movie.title;
        select.appendChild(option);

    });

    select.addEventListener("change", fillLocationForm);

    if (allMovies.length) {
        fillLocationForm();
    }

}

function fillLocationForm() {

    const movieId = document.getElementById("location-movie").value;
    const movie = allMovies.find(item => item._id === movieId);

    if (!movie) {
        return;
    }

    document.getElementById("location-address").value =
        movie.address || "";

    document.getElementById("location-city").value =
        movie.city || "";

}

async function loadLocations() {

    const response = await fetch("/locations");
    const result = await response.json();

    if (!result.success) {
        return;
    }

    renderLocationsList(result.locations || []);
    renderMapMarkers(result.locations || []);

}

function renderLocationsList(locations) {

    const list = document.getElementById("locations-list");
    list.innerHTML = "";

    if (!locations.length) {
        list.innerHTML = "<li>No locations yet.</li>";
        return;
    }

    locations.forEach(location => {

        const item = document.createElement("li");

        item.textContent =
            `${location.title} — ${location.city || location.address}`;

        item.addEventListener("click", () => {

            if (map && location.lat && location.lng) {
                map.setView([location.lat, location.lng], 10);
            }

        });

        list.appendChild(item);

    });

}

function renderMapMarkers(locations) {

    if (!map || !markerGroup) {
        return;
    }

    markerGroup.clearLayers();

    const points = [];

    locations.forEach(location => {

        if (!location.lat || !location.lng) {
            return;
        }

        const marker = L.marker([location.lat, location.lng])
            .bindPopup(`
                <strong>${location.title}</strong><br>
                ${location.address}<br>
                ${location.city || ""}
            `);

        markerGroup.addLayer(marker);
        points.push([location.lat, location.lng]);

    });

    if (points.length) {
        map.fitBounds(points, { padding: [40, 40] });
    }

}

async function saveLocation(event) {

    event.preventDefault();

    const movieId = document.getElementById("location-movie").value;
    const address = document.getElementById("location-address").value.trim();
    const city = document.getElementById("location-city").value.trim();
    const message = document.getElementById("location-message");

    const response = await fetch(`/locations/${movieId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ address, city })

    });

    const result = await response.json();

    if (result.success) {

        message.textContent =
            `Saved: ${result.location.geocodedName || address}`;

        await loadMoviesForSelect();
        await loadLocations();

    } else {

        message.textContent = result.message;

    }

}

function logout() {

    fetch("/logout", { method: "POST" })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                window.location.href = "/";
            }

        });

}
