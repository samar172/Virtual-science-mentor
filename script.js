document.addEventListener('DOMContentLoaded', () => {
    const interestInput = document.getElementById('interest-input');
    const generateIdeasBtn = document.getElementById('generate-ideas-btn');
    const projectIdeasOutput = document.getElementById('project-ideas-output');

    const projectTitleInput = document.getElementById('project-title-input');
    const getGuidanceBtn = document.getElementById('get-guidance-btn');
    const guidanceOutput = document.getElementById('guidance-output');

    const databaseQueryInput = document.getElementById('database-query-input');
    const searchDatabaseBtn = document.getElementById('search-database-btn');
    const databaseResultsOutput = document.getElementById('database-results-output');

    // WARNING: Never expose your API key publicly in production
    const apiKey = 'AIzaSyBY41nYjS2JKVsnyBgFhrXjHkq1dfVDT1Q';
    const geminiProModel = 'gemini-1.5-flash';
    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    generateIdeasBtn.addEventListener('click', async () => {
        const interests = interestInput.value.trim();
        if (interests) {
            projectIdeasOutput.textContent = 'Generating project ideas...';
            const prompt = `Suggest 3 science fair project ideas based on the interests: ${interests}. Format as a numbered list.`;
            const response = await callGeminiApi(geminiProModel, prompt);
            projectIdeasOutput.textContent = response || 'Could not generate project ideas at this time.';
        } else {
            projectIdeasOutput.textContent = 'Please enter your interests.';
        }
    });

    getGuidanceBtn.addEventListener('click', async () => {
        const projectTitle = projectTitleInput.value.trim();
        if (projectTitle) {
            guidanceOutput.textContent = 'Fetching experiment guidance...';
            const prompt = `Provide step-by-step guidance for the science fair project: "${projectTitle}". Include a brief list of materials and a clear procedure.`;
            const response = await callGeminiApi(geminiProModel, prompt);
            guidanceOutput.textContent = response || 'Could not retrieve guidance for this project.';
        } else {
            guidanceOutput.textContent = 'Please enter your project title.';
        }
    });

    searchDatabaseBtn.addEventListener('click', async () => {
        const query = databaseQueryInput.value.trim();
        if (query) {
            databaseResultsOutput.textContent = 'Searching database...';
            const results = await searchScienceDatabase(query);
            displayDatabaseResults(results);
        } else {
            databaseResultsOutput.textContent = 'Please enter a search term.';
        }
    });

    async function callGeminiApi(modelName, prompt) {
        const url = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 200,
                        temperature: 0.7,
                        topP: 0.8,
                        topK: 40,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gemini API Error:', errorData);
                return `Error: ${response.statusText} - ${JSON.stringify(errorData)}`;
            }

            const data = await response.json();
            const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return generatedText || 'Could not parse Gemini API response.';
        } catch (error) {
            console.error('Fetch error:', error);
            return `Error communicating with AI: ${error.message}`;
        }
    }

    async function searchScienceDatabase(query) {
        // Replace with actual API or DB call
        return [
            `Result 1 for "${query}"`,
            `Result 2 for "${query}"`,
            `Result 3 for "${query}"`
        ];
    }

    function displayDatabaseResults(results) {
        databaseResultsOutput.innerHTML = '';
        if (results && results.length > 0) {
            const ul = document.createElement('ul');
            results.forEach(result => {
                const li = document.createElement('li');
                li.textContent = result;
                ul.appendChild(li);
            });
            databaseResultsOutput.appendChild(ul);
        } else {
            databaseResultsOutput.textContent = 'No results found.';
        }
    }
});