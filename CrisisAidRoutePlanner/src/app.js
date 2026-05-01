// CrisisAid Route Planner
// This app uses a modified version of Dijkstra's Algorithm.
// Each road cost = distance + (risk level * risk importance).
// The route with the lowest total cost is recommended.

let roads = [];
let locations = [];

function loadDefaultData() {
  roads = [
    { from: "Supply Center", to: "Checkpoint A", distance: 4, risk: 3 },
    { from: "Supply Center", to: "Clinic", distance: 6, risk: 2 },
    { from: "Checkpoint A", to: "Bridge", distance: 3, risk: 7 },
    { from: "Clinic", to: "Bridge", distance: 4, risk: 3 },
    { from: "Clinic", to: "Shelter", distance: 8, risk: 2 },
    { from: "Bridge", to: "Shelter", distance: 2, risk: 5 },
    { from: "Checkpoint A", to: "Shelter", distance: 10, risk: 8 }
  ];
  refreshPage();
}

function updateLocations() {
  const set = new Set();
  roads.forEach(road => {
    set.add(road.from);
    set.add(road.to);
  });
  locations = Array.from(set);
}

function fillDropdowns() {
  const start = document.getElementById("start");
  const end = document.getElementById("end");
  start.innerHTML = "";
  end.innerHTML = "";
  locations.forEach(location => {
    start.innerHTML += `<option value="${location}">${location}</option>`;
    end.innerHTML += `<option value="${location}">${location}</option>`;
  });
  start.value = "Supply Center";
  end.value = "Shelter";
}

function roadCost(road) {
  const riskWeight = Number(document.getElementById("riskWeight").value);
  return road.distance + road.risk * riskWeight;
}

function displayRoads() {
  const table = document.getElementById("roadTable");
  table.innerHTML = "";
  roads.forEach(road => {
    table.innerHTML += `
      <tr>
        <td>${road.from}</td>
        <td>${road.to}</td>
        <td>${road.distance}</td>
        <td>${road.risk}</td>
        <td>${roadCost(road)}</td>
      </tr>
    `;
  });
}

function buildGraph() {
  const graph = {};
  locations.forEach(location => graph[location] = []);
  roads.forEach(road => {
    const cost = roadCost(road);
    graph[road.from].push({ node: road.to, cost: cost });
    graph[road.to].push({ node: road.from, cost: cost });
  });
  return graph;
}

function dijkstra(start, end) {
  const graph = buildGraph();
  const distances = {};
  const previous = {};
  const unvisited = new Set(locations);

  locations.forEach(location => {
    distances[location] = Infinity;
    previous[location] = null;
  });
  distances[start] = 0;

  while (unvisited.size > 0) {
    let current = null;
    unvisited.forEach(location => {
      if (current === null || distances[location] < distances[current]) {
        current = location;
      }
    });

    if (current === end) break;
    if (distances[current] === Infinity) break;

    unvisited.delete(current);

    graph[current].forEach(neighbor => {
      const newDistance = distances[current] + neighbor.cost;
      if (newDistance < distances[neighbor.node]) {
        distances[neighbor.node] = newDistance;
        previous[neighbor.node] = current;
      }
    });
  }

  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return { path: path, cost: distances[end] };
}

function calculateRoute() {
  displayRoads();
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (start === end) {
    document.getElementById("result").innerHTML = "Start and destination are the same location.";
    return;
  }

  const answer = dijkstra(start, end);
  if (answer.cost === Infinity) {
    document.getElementById("result").innerHTML = "No route found.";
    return;
  }

  document.getElementById("result").innerHTML = `
    <strong>Best Route:</strong> ${answer.path.join(" → ")}<br>
    <strong>Total Cost:</strong> ${answer.cost}<br>
    <strong>Explanation:</strong> This path has the lowest combined cost based on distance and road risk.
  `;
  drawMap(answer.path);
}

function addRoad() {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const distance = Number(document.getElementById("distance").value);
  const risk = Number(document.getElementById("risk").value);

  if (!from || !to || distance <= 0 || risk < 1 || risk > 10) {
    alert("Please enter valid road information. Risk must be from 1 to 10.");
    return;
  }

  roads.push({ from, to, distance, risk });
  document.getElementById("from").value = "";
  document.getElementById("to").value = "";
  document.getElementById("distance").value = "";
  document.getElementById("risk").value = "";
  refreshPage();
}

function drawMap(path = []) {
  const map = document.getElementById("map");
  map.innerHTML = "";
  if (path.length === 0) {
    locations.forEach((location, index) => {
      map.innerHTML += `<div class="node">${location}</div>`;
      if (index < locations.length - 1) map.innerHTML += `<div class="edge">↔</div>`;
    });
  } else {
    path.forEach((location, index) => {
      map.innerHTML += `<div class="node">${location}</div>`;
      if (index < path.length - 1) map.innerHTML += `<div class="edge">→</div>`;
    });
  }
}

function refreshPage() {
  updateLocations();
  fillDropdowns();
  displayRoads();
  drawMap();
  document.getElementById("result").innerHTML = "Click “Find Best Route” to begin.";
}

loadDefaultData();
