const fs = require('fs');
const https = require('https');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../constants/InitialFoodData.json');
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

const fetchMealsByLetter = (letter) => {
    return new Promise((resolve, reject) => {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.meals || []);
                } catch (e) {
                    console.error(`Error parsing JSON for letter ${letter}:`, e);
                    resolve([]);
                }
            });
        }).on('error', (err) => {
            console.error(`Error fetching letter ${letter}:`, err);
            reject(err);
        });
    });
};

const main = async () => {
    console.log('Fetching food data...');
    let uniqueFoods = new Map();

    for (const letter of ALPHABET) {
        const meals = await fetchMealsByLetter(letter);
        meals.forEach(meal => {
            if (!uniqueFoods.has(meal.idMeal)) {
                uniqueFoods.set(meal.idMeal, {
                    id: meal.idMeal,
                    name: meal.strMeal,
                    image: meal.strMealThumb,
                    status: null
                });
            }
        });
        process.stdout.write(`Fetched ${meals.length} meals for '${letter}'\r`);
    }

    const allFoods = Array.from(uniqueFoods.values());
    console.log(`\nTotal unique foods fetched: ${allFoods.length}`);

    // Shuffle the array to make it fun
    for (let i = allFoods.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allFoods[i], allFoods[j]] = [allFoods[j], allFoods[i]];
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allFoods, null, 2));
    console.log(`Saved to ${OUTPUT_FILE}`);
};

main();
