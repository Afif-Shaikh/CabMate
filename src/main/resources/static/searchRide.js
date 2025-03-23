document.addEventListener("DOMContentLoaded", function() {
	// Initialize the map and set view to India
	let map = L.map('map').setView([20.5937, 78.9629], 5);

	// Add OpenStreetMap Tile Layer
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; OpenStreetMap contributors'
	}).addTo(map);

	// Function to update map with selected location
	function updateMap(lat, lon, label) {
		map.setView([lat, lon], 10);
		L.marker([lat, lon]).addTo(map)
			.bindPopup(label)
			.openPopup();
	}

	console.log("Search Ride Page Loaded");
});

async function fetchLocationSuggestions(query, elementId) {
	if (query.length < 3) {
		document.getElementById(elementId).innerHTML = "";
		return;
	}

	let url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=IN&limit=5&addressdetails=1	`;

	try {
		let response = await fetch(url);
		let data = await response.json();
		let suggestions = document.getElementById(elementId);
		suggestions.innerHTML = "";
		suggestions.classList.remove("hidden");

		let seenLocations = new Set(); // To remove duplicates

		data.forEach(place => {
			let city = place.address.city || place.address.town || place.address.village || "";
			let displayName = city ? `${place.name || place.display_name}, ${city}` : place.display_name;

			if (!seenLocations.has(displayName)) {
				seenLocations.add(displayName);

				let div = document.createElement("div");
				div.textContent = displayName;
				div.className = "px-2 py-1 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 text-sm truncate w-full overflow-hidden";
				div.onclick = function() {
					document.getElementById(elementId.replace("Suggestions", "")).value = place.display_name;
					suggestions.innerHTML = "";
					suggestions.classList.add("hidden");
					updateMap(place.lat, place.lon, displayName);
				};
				suggestions.appendChild(div);
			}
		});
	} catch (error) {
		console.error("Error fetching location suggestions:", error);
	}
}

function searchRide() {
	let pickup = document.getElementById("pickup").value;
	let dropoff = document.getElementById("dropoff").value;

	if (!pickup || !dropoff) {
		alert("Please enter both pickup and drop-off locations.");
		return;
	}

	fetch(`http://localhost:8080/rides/search?pickup=${pickup}&dropoff=${dropoff}`)
		.then(response => response.json())
		.then(data => {
			let results = document.getElementById("rideResults");
			results.innerHTML = "";
			if (data.length === 0) {
				results.innerHTML = "<p class='text-gray-500 text-center mt-2'>No rides available for this route.</p>";
				return;
			}

			data.forEach(ride => {
				results.innerHTML += `
                    <div class="p-3 border-b">
                        <p><strong>${ride.pickupLocation}</strong> to <strong>${ride.dropoffLocation}</strong></p>
                        <p>Departure: ${ride.departureTime}</p>
                        <p>Price: ₹${ride.price}</p>
                    </div>
                `;
			});
			drawRoute(pickup, dropoff);

		})
		.catch(error => console.error("Error fetching rides:", error));

	async function drawRoute(pickup, dropoff) {
		try {
			let pickupResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${pickup}&countrycodes=IN&limit=1`);
			let dropoffResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${dropoff}&countrycodes=IN&limit=1`);

			let pickupData = await pickupResponse.json();
			let dropoffData = await dropoffResponse.json();

			if (pickupData.length === 0 || dropoffData.length === 0) {
				console.error("Invalid locations for routing.");
				return;
			}

			let pickupCoords = [pickupData[0].lat, pickupData[0].lon];
			let dropoffCoords = [dropoffData[0].lat, dropoffData[0].lon];

			// Clear previous markers and routes
			map.eachLayer(layer => {
				if (layer instanceof L.Marker || layer instanceof L.Polyline) {
					map.removeLayer(layer);
				}
			});

			// Add new markers
			L.marker(pickupCoords).addTo(map).bindPopup(`<b>Pickup:</b> ${pickup}`).openPopup();
			L.marker(dropoffCoords).addTo(map).bindPopup(`<b>Drop-off:</b> ${dropoff}`).openPopup();

			// OSRM Routing API (No API key needed)
			let routeUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`;

			let routeResponse = await fetch(routeUrl);
			let routeData = await routeResponse.json();

			if (routeData.routes && routeData.routes.length > 0) {
				let routeCoords = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
				L.polyline(routeCoords, { color: 'blue', weight: 4 }).addTo(map);
				map.fitBounds([pickupCoords, dropoffCoords]);
			} else {
				console.error("No route found.");
			}
		} catch (error) {
			console.error("Error fetching route:", error);
		}
	}

}
