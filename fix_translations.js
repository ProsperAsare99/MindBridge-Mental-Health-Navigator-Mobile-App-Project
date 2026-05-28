const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mindbridge-mobile', 'src', 'utils', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const missingKeys = {
    weeklyPulse: "Weekly Pulse",
    emotionalRhythm: "Emotional Rhythm",
    viewJourney: "View Journey",
    moodSeed: "Mood Seed",
    reflect: "Reflect",
    breathe: "Breathe",
    dailyRituals: "Daily Rituals",
    plantSeed: "Plant a Seed",
    checkInMood: "Check in with your mood",
    dailyReflection: "Daily Reflection",
    writeJournalEntry: "Write a journal entry",
    completeBreathing: "Complete a breathing exercise",
    latestReflection: "Latest Reflection",
    viewAll: "View All",
    oracleInsights: "Oracle Insights",
    chatNow: "Chat Now",
    recentConversation: "Recent Conversation",
    latestGuidance: "Latest Guidance",
    moodGarden: "Mood Garden",
    seeds: "seeds",
    activity: "Activity",
    todaysSteps: "Today's Steps",
    steps: "steps",
    assessments: "Assessments",
    ready: "Ready",
    done: "done",
    resources: "Resources",
    discoveryHub: "Discovery Hub",
    crisisSupport: "Crisis Support",
    "247Help": "24/7 Help",
    tools: "Tools",
    therapeutic: "Therapeutic",
    journal: "Journal",
    reflections: "Reflections",
    community: "Community",
    connect: "Connect",
    recommendedForYou: "Recommended for You",
    basedOnReflections: "Based on your reflections"
};

const getPropName = (k) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;

// 1. Inject into TranslationSchema
const schemaInjection = Object.keys(missingKeys).map(k => `    ${getPropName(k)}: string;`).join('\n');
content = content.replace(
    /(export interface TranslationSchema \{[\s\S]*?dashboard: \{)(\s*greetingMorning)/,
    `$1\n${schemaInjection}$2`
);

// 2. Inject into every language object
const langs = ['English', 'French', 'Twi', 'Ga', 'Ewe', 'Hausa'];
for (const lang of langs) {
    const injection = Object.entries(missingKeys).map(([k, v]) => {
        const translated = lang === 'English' ? v : `${v} (${lang})`;
        return `      ${getPropName(k)}: '${translated.replace(/'/g, "\\'")}',`;
    }).join('\n');
    
    // Find the dashboard object for the language
    const regex = new RegExp(`(${lang}: \\{[\\s\\S]*?dashboard: \\{)`);
    content = content.replace(regex, `$1\n${injection}`);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Translations patched successfully.');
