document.addEventListener("DOMContentLoaded", function () {
    console.log("Search Ride Page Loaded");
});

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
                results.innerHTML = "<p class='text-gray-500'>No rides found.</p>";
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
        })
        .catch(error => console.error("Error fetching rides:", error));
}
