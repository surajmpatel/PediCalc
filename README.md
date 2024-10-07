# PediCalc

# Child Growth Assessment App

## Overview
The Child Growth Assessment App is a simple web application designed to help healthcare providers and parents assess the growth of children aged 0 to 12 years. The app calculates estimated height and weight based on the child's age and provides classifications for protein-energy malnutrition (PEM) and stunting.

## Features
- Input fields for age (in years and months), weight (in kg), and height (in cm).
- Calculates estimated height and weight using age-based formulas.
- Provides classifications for PEM and stunting based on the calculated percentages.
- User-friendly interface built with HTML, CSS, and Tailwind CSS.

## Installation
To use the Child Growth Assessment App, simply open the `index.html` file in a web browser. The app does not require any additional installations or dependencies.

## Usage
1. Enter the child's age in years and months.
2. Enter the child's weight in kilograms.
3. Enter the child's height in centimeters.
4. Click the "Calculate" button to view the results.
5. The app will display the estimated height and weight, along with classifications for PEM and stunting.

## Calculations
- **Estimated Height:** 
  - For children under 12 months: `2 * ageInMonths + 50`
  - For children 12-24 months: `75 + (ageInMonths - 12)`
  - For children over 24 months: `6 * (ageInMonths / 12) + 77`
  
- **Estimated Weight:**
  - For children under 3 months: `ageInMonths + 3`
  - For children 3-12 months: `(ageInMonths + 9) / 2`
  - For children 12-72 months: `2 * (ageInMonths / 12) + 8`
  - For children over 72 months: `(7 * (ageInMonths / 12) - 5) / 2`

- **PEM Classification:**
  - No PEM: > 80%
  - Mild PEM (G1): > 70%
  - Moderate PEM (G2): > 60%
  - Severe PEM (G3): ≤ 60%

- **Stunting Classification:**
  - No stunting: > 95%
  - Mild: > 90%
  - Moderate: > 85%
  - Severe: ≤ 85%

## Note
This app uses the PEM classification based on the IAP (Indian Academy of Pediatrics) classification. It is a small experimental project by [@SurajMPatel](https://github.com/SurajMPatel).

## License
This project is licensed under the MIT License. See the LICENSE file for more information.

## Acknowledgements
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- Indian Academy of Pediatrics for PEM classification.
