import { words } from "./words"

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

export function getFarewellText(language) {
    const options = [
        `Farewell, ${language}`,
        `Adios, ${language}`,
        `Error: ${language} not found`,
        `We'll miss you, ${language}`,
        `Oh no, not ${language}!`,
        `${language} bites the dust`,
        `Gone but not forgotten, ${language}`,
        `The end of ${language} as we know it`,
        `Final commit for ${language}`,
        `Resting in brackets, ${language}`,
        `${language}, your watch has ended`,
        `${language} threw its last exception`
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return  options[randomIndex];
}