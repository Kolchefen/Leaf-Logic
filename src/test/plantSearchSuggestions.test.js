const chai = require('chai');
const expect = chai.expect;
const plantDatabase = require('../plantDatabase');

// Use the same mock plant database as in your main implementation
const plantDatabase = [
    'Aloe Vera',
    'Fiddle Leaf Fig',
    'Spider Plant',
    'Basil',
    'Rosemary',
    'Pothos',
    'Peace Lily',
    'Succulent',
    'Dracaena',
    'Snake Plant',
    'Philodendron',
    'Bird of Paradise',
    'Chinese Evergreen',
    'Rubber Plant',
    'Jade Plant',
    'Monstera',
    'Orchid',
    'Calathea',
    'Lavender',
    'Chrysanthemum',
    'Daisy',
    'Petunia',
    'Maranta',
    'Hoya',
    'Cactus',
    'Geranium',
    'Clover',
    'Carnivorous Plant',
    'Coleus'
];

// Function that returns plant suggestions based on user input
function getPlantSuggestions(input) {
    if (!input.trim()) {
        return [];  // Return an empty array if the input is empty or just whitespace
    }
    const lowerCaseInput = input.toLowerCase();
    return plantDatabase.filter(plant => plant.toLowerCase().startsWith(lowerCaseInput));
}

describe('Plant Search Suggestions', function() {
    it('should return matching plant suggestions for valid input', function() {
        expect(getPlantSuggestions('Al')).to.deep.equal(['Aloe Vera']);
        expect(getPlantSuggestions('Fid')).to.deep.equal(['Fiddle Leaf Fig']);
    });

    it('should return multiple suggestions when multiple plants match', function() {
        expect(getPlantSuggestions('B')).to.deep.equal(['Basil', 'Bird of Paradise']); 
    });

    it('should return an empty array for input with no matches', function() {
        expect(getPlantSuggestions('Zebra')).to.deep.equal([]);
    });

    it('should return suggestions case-insensitively', function() {
        expect(getPlantSuggestions('alo')).to.deep.equal(['Aloe Vera']);
        expect(getPlantSuggestions('fid')).to.deep.equal(['Fiddle Leaf Fig']);
        expect(getPlantSuggestions('b')).to.deep.equal(['Basil', 'Bird of Paradise']); 
    });

    it('should return an empty array for empty input', function() {
        expect(getPlantSuggestions('')).to.deep.equal([]);
    });
});

module.exports = { getPlantSuggestions };
