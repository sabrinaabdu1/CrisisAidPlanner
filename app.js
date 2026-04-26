// Graph representing locations and routes
// Each value represents the "cost" 
const graph = {
  A: { B: 3, C: 6 },
  B: { C: 2, D: 5 },
  C: { D: 1 },
  D: {}
};

// Dijkstra’s Algorithm function
// Finds the minimum cost from start to end
function dijkstra(start, end) {

  // Store shortest distances
  let distances = {};

  // Track visited nodes
  let visited = {};

  // Initialize all distances to infinity
  for (let node in graph) {
    distances[node] = Infinity;
  }

  // Distance to start is 0
  distances[start] = 0;

  // Loop until all nodes processed
  while (true) {

    let closestNode = null;

    // Find the unvisited node with the smallest distance
    for (let node in distances) {
      if (!visited[node] &&
         (closestNode === null || distances[node] < distances[closestNode])) {
        closestNode = node;
      }
    }

    // Stop if no node found
    if (closestNode === null) break;

    // Stop if we reached destination
    if (closestNode === end) break;

    // Mark node as visited
    visited[closestNode] = true;

    // Update distances of neighbors
    for (let neighbor in graph[closestNode]) {

      // Calculate new distance
      let newDist = distances[closestNode] + graph[closestNode][neighbor];

      // Update if shorter path found
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
      }
    }
  }

  // Return final shortest cost
  return distances[end];
}

// Function triggered when button is clicked
function findRoute() {

  // Get selected start and end values from UI
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  // Call algorithm
  let cost = dijkstra(start, end);

  // Display result on the page
  document.getElementById("result").innerHTML =
    "Best route cost from " + start + " to " + end + " is: " + cost;
}
