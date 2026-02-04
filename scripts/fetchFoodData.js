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

    // Load existing data if available
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            const existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            existingData.forEach(food => uniqueFoods.set(food.id, food));
            console.log(`Loaded ${uniqueFoods.size} existing foods.`);
        } catch (e) {
            console.log('Starting fresh (no existing data found or corrupt).');
        }
    }

    for (const letter of ALPHABET) {
        const meals = await fetchMealsByLetter(letter);
        if (meals) {
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
        }

        // Save immediately after (and during) fetching
        // Note: Shuffling might be expensive to do every time if the list is huge, 
        // but for < 1000 items it's fine.
        const currentFoods = Array.from(uniqueFoods.values());

        // Shuffle
        for (let i = currentFoods.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentFoods[i], currentFoods[j]] = [currentFoods[j], currentFoods[i]];
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(currentFoods, null, 2));
        process.stdout.write(`Fetched letter '${letter}' - Total saved: ${currentFoods.length}\n`);
    }

    console.log(`\nFinished! Total unique foods: ${uniqueFoods.size}`);
    console.log(`Saved to ${OUTPUT_FILE}`);
};

main();
