async function initD3Charts() {

    if (typeof d3 === "undefined") {
        return;
    }

    await Promise.all([
        renderCategoryBarChart(),
        renderPersonaPieChart()
    ]);

}

async function renderCategoryBarChart() {

    const container = document.getElementById("d3-chart-category");

    if (!container) {
        return;
    }

    const response = await fetch("/charts/category-views");
    const result = await response.json();

    if (!result.success || !result.data.length) {
        container.innerHTML = "<p class='empty-row'>No chart data yet.</p>";
        return;
    }

    container.innerHTML = "";

    const width = 420;
    const height = 260;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("class", "d3-chart");

    const data = result.data;

    const x = d3.scaleBand()
        .domain(data.map(item => item.label))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, item => item.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", item => x(item.label))
        .attr("y", item => y(item.value))
        .attr("width", x.bandwidth())
        .attr("height", item => y(0) - y(item.value))
        .attr("fill", "#22a39f")
        .attr("rx", 6);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("fill", "#ccc");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .selectAll("text")
        .attr("fill", "#ccc");

}

async function renderPersonaPieChart() {

    const container = document.getElementById("d3-chart-persona");

    if (!container) {
        return;
    }

    const response = await fetch("/charts/persona-views");
    const result = await response.json();

    if (!result.success || !result.data.length) {
        container.innerHTML = "<p class='empty-row'>No chart data yet.</p>";
        return;
    }

    container.innerHTML = "";

    const width = 420;
    const height = 260;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("class", "d3-chart");

    const group = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(result.data.map(item => item.label))
        .range(["#22a39f", "#e50914", "#f5c518", "#0d6efd"]);

    const pie = d3.pie()
        .value(item => item.value);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    group.selectAll("path")
        .data(pie(result.data))
        .join("path")
        .attr("d", arc)
        .attr("fill", item => color(item.data.label))
        .attr("stroke", "#111")
        .attr("stroke-width", 2);

    group.selectAll("text")
        .data(pie(result.data))
        .join("text")
        .attr("transform", item =>
            `translate(${arc.centroid(item)})`)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "11px")
        .text(item => item.data.label);

}

function renderImdbWidget(data, container) {

    const imdb = data.imdb;
    const votes = imdb.imdbVotes
        ? `${imdb.imdbVotes} votes`
        : "N/A";

    container.innerHTML = `
        ${data.retroxTitle ? `<p class="imdb-widget-row"><strong>RetroX:</strong> ${data.retroxTitle}</p>` : ""}
        <h4 class="imdb-widget-title">${imdb.title} <span>(${imdb.year})</span></h4>
        <div class="imdb-widget-meta">
            <span class="imdb-rating-badge">★ ${imdb.imdbRating || "N/A"}</span>
            <span class="imdb-meta-chip">${votes}</span>
            ${imdb.genre ? `<span class="imdb-meta-chip">${imdb.genre}</span>` : ""}
        </div>
        ${imdb.director ? `<p class="imdb-widget-row"><strong>Director:</strong> ${imdb.director}</p>` : ""}
        ${imdb.actors ? `<p class="imdb-widget-row"><strong>Cast:</strong> ${imdb.actors}</p>` : ""}
        ${imdb.plot ? `<p class="imdb-widget-plot">${imdb.plot}</p>` : ""}
        ${imdb.imdbUrl ? `<a href="${imdb.imdbUrl}" target="_blank" class="imdb-link">View on IMDb →</a>` : ""}
    `;

}

async function loadImdbForTitle(movieTitle, container) {

    if (!container) {
        return;
    }

    container.textContent = "Loading IMDB data...";

    try {

        const response = await fetch(
            `/external/imdb?movieTitle=${encodeURIComponent(movieTitle)}`
        );

        const result = await response.json();

        if (!result.success) {
            container.textContent = result.message;
            return;
        }

        renderImdbWidget(result, container);

    } catch (error) {

        container.textContent = "Could not load IMDB data.";

    }

}

async function initImdbWidget() {

    const select = document.getElementById("imdb-movie-select");
    const widget = document.getElementById("imdb-widget");
    const button = document.getElementById("imdb-load-btn");

    if (!select || !widget || !button) {
        return;
    }

    const response = await fetch("/movies/all");
    const movies = await response.json();

    const uniqueTitles = [...new Set(movies.map(movie => movie.title))];

    select.innerHTML = uniqueTitles
        .map(title => `<option value="${title}">${title}</option>`)
        .join("");

    button.addEventListener("click", () => {
        loadImdbForTitle(select.value, widget);
    });

    if (uniqueTitles.length) {
        loadImdbForTitle(uniqueTitles[0], widget);
    }

}

document.addEventListener("DOMContentLoaded", () => {

    initImdbWidget();

    if (localStorage.getItem("role") !== "admin") {
        return;
    }

    initD3Charts();

});
