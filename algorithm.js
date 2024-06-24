const fs = require('fs');
const readline = require('readline');

const findRhymingWords = (filePath, word, limit = Infinity) => {
    // Helper function to extract the rhyme part of the word (last syllable)
    const getRhymePart = (word) => {
        const vowels = 'aeiouy';
        let index = word.length - 1;

        while (index >= 0 && !vowels.includes(word[index])) {
            index--;
        }

        while (index >= 0 && vowels.includes(word[index])) {
            index--;
        }

        return word.slice(index + 1);
    };

    const rhymePart = getRhymePart(word);
    const matchingWords = [];
    let count = 0;

    const readInterface = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', (line) => {
        if (count >= limit) {
            readInterface.close();
            return;
        }

        const currentWord = line.trim();
        if (currentWord.endsWith(rhymePart)) {
            matchingWords.push(currentWord);
            count++;
        }
    });

    readInterface.on('close', () => {
        console.log(`Words that rhyme with "${word}":`);
        console.log(matchingWords.join(', '));
    });
};

// Example usage
const filePath = '/Users/oz/Desktop/University of London/Algorithms and Data Structures I/PoetryAssistant/wordlist.txt'; // Path to your sorted .txt file
const inputWord = 'mail';      // The word to find rhymes for
const limit = 5;              // Optional limit for the number of words required
findRhymingWords(filePath, inputWord, limit);