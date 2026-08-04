import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Concierge service using OpenRouter API with gpt-4o-mini model.
 * Produces structured trip itineraries and tailored activity suggestions.
 */
export async function generateAiItinerary({ location, userQuery, preferences = [], durationDays = 1, availableActivities = [] }) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Fallback if no OpenRouter key is configured
    if (!apiKey) {
        console.warn('[aiConcierge] OPENROUTER_API_KEY missing, using intelligent fallback concierge engine.');
        return generateFallbackItinerary({ location, userQuery, availableActivities, durationDays });
    }

    const modelName = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

    const systemPrompt = `You are the Activity Finder AI Concierge — an expert local travel guide and activity curator.
Your task is to take the user's destination, preferences, and request, and create a structured, engaging itinerary.
You must respond with VALID JSON ONLY, strictly following this structure:

{
  "title": "Short catchy title for the itinerary",
  "summary": "2-3 sentence overview tailored to their vibe and interests",
  "estimatedBudget": "e.g. Free - 30€ per person",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "schedule": [
    {
      "timeSlot": "Morning",
      "activityTitle": "Title of recommended activity",
      "category": "Food | Outdoors | Museums | Cultural | Nightlife | Sports | Music | Essentials",
      "description": "Why this place fits their request and what to do there",
      "tip": "Local insider tip (e.g. best time to visit or secret menu item)"
    },
    {
      "timeSlot": "Afternoon",
      "activityTitle": "Title of second activity",
      "category": "...",
      "description": "...",
      "tip": "..."
    },
    {
      "timeSlot": "Evening",
      "activityTitle": "Title of third activity",
      "category": "...",
      "description": "...",
      "tip": "..."
    }
  ]
}

Constraints:
- Respond in the same language as the user query (or Finnish/English if unspecified).
- Strictly output raw JSON without markdown backticks (\`\`\`json).
- Select or adapt from available real local activities whenever available: ${JSON.stringify(availableActivities.slice(0, 10).map(a => ({ id: a.id, title: a.title, category: a.category, address: a.location?.address })))}.`;

    const userPrompt = `Destination: ${location?.name || 'Local Area'} (Lat: ${location?.lat || 'N/A'}, Lng: ${location?.lng || 'N/A'})
User Request: "${userQuery || 'Suggest a fun day out'}"
Preferences / Vibe: ${preferences.join(', ') || 'Mixed / All'}
Duration: ${durationDays} day(s)`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://activityfinder.app',
                'X-Title': 'Activity Finder AI Concierge',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[aiConcierge] OpenRouter API error ${response.status}:`, errText);
            return generateFallbackItinerary({ location, userQuery, availableActivities, durationDays });
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content;
        
        if (!rawContent) {
            throw new Error('Empty response from OpenRouter API');
        }

        const cleanedContent = rawContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanedContent);

        // Attach matching real activity objects if found
        if (parsed.schedule && Array.isArray(parsed.schedule)) {
            parsed.schedule = parsed.schedule.map(item => {
                const match = availableActivities.find(a => 
                    a.title.toLowerCase().includes(item.activityTitle.toLowerCase()) || 
                    item.activityTitle.toLowerCase().includes(a.title.toLowerCase())
                );
                return {
                    ...item,
                    activityRef: match || null
                };
            });
        }

        return parsed;
    } catch (error) {
        console.error('[aiConcierge] Error generating AI itinerary:', error);
        return generateFallbackItinerary({ location, userQuery, availableActivities, durationDays });
    }
}

function generateFallbackItinerary({ location, userQuery, availableActivities = [], durationDays }) {
    const cityName = location?.name || 'the local area';
    const samplePicks = availableActivities.slice(0, 3);

    const schedule = [
        {
            timeSlot: 'Morning',
            activityTitle: samplePicks[0]?.title || `Explore central ${cityName}`,
            category: samplePicks[0]?.category || 'Outdoors',
            description: samplePicks[0]?.description || `Start your day discovering iconic sights and vibrant streets in ${cityName}.`,
            tip: 'Arrive early to avoid crowd peaks and get great photos.',
            activityRef: samplePicks[0] || null
        },
        {
            timeSlot: 'Afternoon',
            activityTitle: samplePicks[1]?.title || `Local Museum & Culture in ${cityName}`,
            category: samplePicks[1]?.category || 'Cultural',
            description: samplePicks[1]?.description || `Immerse yourself in local history, art galleries, and scenic spots.`,
            tip: 'Check for student or family group discounts at entry.',
            activityRef: samplePicks[1] || null
        },
        {
            timeSlot: 'Evening',
            activityTitle: samplePicks[2]?.title || `Dinner & Drinks in ${cityName}`,
            category: samplePicks[2]?.category || 'Food',
            description: samplePicks[2]?.description || `Unwind at a popular local venue featuring regional specialties.`,
            tip: 'Consider reserving a window table in advance.',
            activityRef: samplePicks[2] || null
        }
    ];

    return {
        title: `Curated ${cityName} ${durationDays > 1 ? durationDays + '-Day' : 'Day'} Trip`,
        summary: `A balanced itinerary for ${cityName} focusing on popular local spots and memorable experiences.`,
        estimatedBudget: '20€ - 50€ per person',
        highlights: [
            `Top rated spots in ${cityName}`,
            'Seamless mix of indoor & outdoor activities',
            'Easy walking routes'
        ],
        schedule
    };
}
