const fs = require('fs');
const https = require('https');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../constants/IngredientData.json');

const fetchIngredients = () => {
    return new Promise((resolve, reject) => {
        const url = `https://www.themealdb.com/api/json/v1/1/list.php?i=list`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.meals || []);
                } catch (e) {
                    console.error(`Error parsing JSON:`, e);
                    resolve([]);
                }
            });
        }).on('error', (err) => {
            console.error(`Error fetching ingredients:`, err);
            reject(err);
        });
    });
};

const main = async () => {
    console.log('Fetching ingredient data...');

    const ingredients = await fetchIngredients();

    const formattedIngredients = ingredients.map(ing => ({
        id: ing.idIngredient,
        name: ing.strIngredient,
        image: `https://www.themealdb.com/images/ingredients/${ing.strIngredient.replace(/ /g, '%20')}.png`,
        status: null,
        description: ing.strDescription // Optional, preserving if useful later with ?
    })).filter(i => i.name && i.id); // Basic validation

    console.log(`Fetched ${formattedIngredients.length} ingredients.`);

    // Shuffle
    for (let i = formattedIngredients.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [formattedIngredients[i], formattedIngredients[j]] = [formattedIngredients[j], formattedIngredients[i]];
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedIngredients, null, 2));
    console.log(`Saved to ${OUTPUT_FILE}`);
};

main();
