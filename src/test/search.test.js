// Search function (from plant catalog)

const search = (searchString, allPlants) => {
    // Don't search when searchString is blank or whitespace
    if (searchString.replaceAll(" ", "") === "") {
        return [];
    }

    // Find plants with searchString as a substring (case-insensitive)
    return allPlants.filter(plant => plant.toLowerCase().replaceAll(" ", "").includes(searchString.toLowerCase().replaceAll(" ", "")));
}

// Function for testing if two arrays contain the same elements
const areArraysEqual = (arr1, arr2) => {
    // Shallow copies, sorted for comparing to see if same items
    a1 = [...arr1].sort();
    a2 = [...arr2].sort();

    // Arrays are equal if same length and same items 
    return arr1.length == arr2.length && a1.every((value, idx) => value === a2[idx]);
}

// Simulated plant catalog
const plantSet = ["Sunflower", "Daisy", "Rose", "Poinsettia", "Sundew", "Aloe Vera", "Begonia", "Lavender", "Rosemary"];

// Test valid search results, should succeed
console.log("Test 1:");
areArraysEqual(search("sun", plantSet), ["Sunflower", "Sundew"])
    ? console.log("Success")
    : console.log("Fail");
console.log();

// Test invalid search results (should also include "Rose"), should fail
console.log("Test 2:");
areArraysEqual(search("rose", plantSet), ["Rosemary"])
    ? console.log("Success")
    : console.log("Fail");
console.log();

// Test boundary case: whitespace search string, should succeed
console.log("Test 3:");
areArraysEqual(search("   ", plantSet), [])
    ? console.log("Success")
    : console.log("Fail");
console.log();

// Test edge case: empty search string, should succeed
console.log("Test 4:");
areArraysEqual(search("", plantSet), [])
    ? console.log("Success")
    : console.log("Fail");
console.log();
