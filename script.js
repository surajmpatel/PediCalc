// Original calculation functions for IAP classification
function calculateEstimatedHeight(ageInMonths) {
    if (ageInMonths < 12) {
        return 2 * ageInMonths + 50;
    } else if (ageInMonths < 24) {
        return 75 + (ageInMonths - 12);
    } else {
        return 6 * (ageInMonths / 12) + 77;
    }
}

function calculateEstimatedWeight(ageInMonths) {
    if (ageInMonths < 3) {
        return ageInMonths + 3;
    } else if (ageInMonths < 12) {
        return (ageInMonths + 9) / 2;
    } else if (ageInMonths < 72) {
        return 2 * (ageInMonths / 12) + 8;
    } else {
        return (7 * (ageInMonths / 12) - 5) / 2;
    }
}

function classifyPEM(percentage) {
    if (percentage > 80) return "No PEM";
    if (percentage > 70) return "Mild PEM (G1)";
    if (percentage > 60) return "Moderate PEM (G2)";
    return "Severe PEM (G3)";
}

function classifyStunting(percentage) {
    if (percentage > 95) return "No stunting";
    if (percentage > 90) return "Mild";
    if (percentage > 85) return "Moderate";
    return "Severe";
}

function classifyWHOStatus(zScore) {
    if (zScore > 2) return "Above normal";
    if (zScore > -2) return "Normal";
    if (zScore > -3) return "Moderately low";
    return "Severely low";
}

function loadWHOData() {
    const sex = document.getElementById('sex').value;
    const ageInMonths = (parseInt(document.getElementById('years').value) * 12) + parseInt(document.getElementById('months').value);
    const realWeight = parseFloat(document.getElementById('weight').value);
    const realHeight = parseFloat(document.getElementById('height').value);

    const genderPrefix = sex === 'male' ? 'boys' : 'girls';
    const weightHeightUrl = `https://raw.githubusercontent.com/surajmpatel/PediCalc/main/who-mgrs-data/wfh-${genderPrefix}-zscore-expanded-tables.csv`;
    const heightAgeUrl = `https://raw.githubusercontent.com/surajmpatel/PediCalc/main/who-mgrs-data/lhfa-${genderPrefix}-zscore-expanded-tables.csv`;

    // Load data for weight-for-height and height-for-age
    const loadData = (url) => new Promise((resolve) => {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: (results) => resolve(results.data),
            error: (error) => console.error(error)
        });
    });

    Promise.all([loadData(weightHeightUrl), loadData(heightAgeUrl)])
        .then(([weightHeightData, heightAgeData]) => {
            // Find the closest height row in weight-for-height data
            const weightHeightRow = weightHeightData.reduce((closest, row) => {
                return Math.abs(parseFloat(row.Length) - realHeight) < Math.abs(parseFloat(closest.Length) - realHeight) ? row : closest;
            });

            // Find the row for the given age in height-for-age data
            const heightAgeRow = heightAgeData.find(row => parseInt(row.Length) === ageInMonths);

            if (weightHeightRow && heightAgeRow) {
                const weightMedian = parseFloat(weightHeightRow.M);
                const weightSD = parseFloat(weightHeightRow.S);
                const heightMedian = parseFloat(heightAgeRow.M);
                const heightSD = parseFloat(heightAgeRow.S);

                // Calculate Z-scores
                const weightZScore = (realWeight - weightMedian) / (weightMedian * weightSD);
                const heightZScore = (realHeight - heightMedian) / (heightMedian * heightSD);

                const heightStatus = classifyWHOStatus(heightZScore);
                const weightStatus = classifyWHOStatus(weightZScore);

                // Display WHO results
                const whoResultsDiv = document.getElementById('whoResults');
                whoResultsDiv.innerHTML = `
                    <h2 class="text-xl font-semibold mb-2">Results (WHO MGRS Standards):</h2>
                    <table>
                        <tr><th>Metric</th><th>Value</th><th>Z-Score</th><th>Status</th></tr>
                        <tr>
                            <td>Height</td>
                            <td>${realHeight.toFixed(2)} cm</td>
                            <td>${heightZScore.toFixed(2)}</td>
                            <td>${heightStatus}</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>${realWeight.toFixed(2)} kg</td>
                            <td>${weightZScore.toFixed(2)}</td>
                            <td>${weightStatus}</td>
                        </tr>
                    </table>
                `;
                whoResultsDiv.classList.remove('hidden');
            } else {
                console.error('Unable to find matching data in WHO tables');
            }
        });
}

// Event listener for form submission
document.getElementById('assessmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const years = parseInt(document.getElementById('years').value);
    const months = parseInt(document.getElementById('months').value);
    const ageInMonths = years * 12 + months;
    const sex = document.getElementById('sex').value;
    const realWeight = parseFloat(document.getElementById('weight').value);
    const realHeight = parseFloat(document.getElementById('height').value);

    // IAP calculations
    const estimatedHeight = calculateEstimatedHeight(ageInMonths);
    const estimatedWeight = calculateEstimatedWeight(ageInMonths);

    if (estimatedWeight === null || estimatedHeight === null) {
        document.getElementById('error').innerHTML = 'Error: Unable to calculate for the given age. Please ensure the age is between 0 and 12 years.';
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('whoResults').classList.add('hidden');
        return;
    }

    const weightPercentage = (realWeight / estimatedWeight) * 100;
    const heightPercentage = (realHeight / estimatedHeight) * 100;

    const pemClassification = classifyPEM(weightPercentage);
    const stuntingClassification = classifyStunting(heightPercentage);

    // Display IAP results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2 class="text-xl font-semibold mb-2">Results (IAP Classification):</h2>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Age</td><td>${years} years and ${months} months</td></tr>
            <tr><td>Estimated Height</td><td>${estimatedHeight.toFixed(2)} cm</td></tr>
            <tr><td>Estimated Weight</td><td>${estimatedWeight.toFixed(2)} kg</td></tr>
            <tr><td>Weight Percentage</td><td>${weightPercentage.toFixed(2)}%</td></tr>
            <tr><td>Height Percentage</td><td>${heightPercentage.toFixed(2)}%</td></tr>
            <tr><td>PEM Classification</td><td>${pemClassification}</td></tr>
            <tr><td>Stunting Classification</td><td>${stuntingClassification}</td></tr>
        </table>
    `;
    resultsDiv.classList.remove('hidden');

    // Load WHO data and calculate results
    loadWHOData();
    document.getElementById('error').classList.add('hidden');
});function loadWHOData() {
    // ... (rest of the function)

    Promise.all([loadData(weightHeightUrl), loadData(heightAgeUrl)])
        .then(([weightHeightData, heightAgeData]) => {
            // Find the closest height row in weight-for-height data
            // ... (this part remains the same)

            // Find the row for the given age in height-for-age data
            const heightAgeRow = heightAgeData.find(row => parseInt(row.Length) === ageInMonths); // Corrected line

            // ... (rest of the function)
        });
}

// ... (your existing JavaScript code)

// Add this section to create the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(registration) {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });
  });
}
