const fs = require('fs');

const CHUNK_SIZE = 1024; // Number of bytes to read at a time

function findRhymingWords(filePath, word, limit = Infinity) {
    const rhymePart = getRhymePart(word); // Get the rhyme part of the word
    const matchingWords = [];
    let buffer = ''; //temporary storage area where chunks of data are stored as they are read from the file.

    const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1024 });

    stream.on('data', (chunk) => {
        //  When reading a file in chunks, it is possible for a line to be split between two chunks. 
        buffer += chunk;
        let words = buffer.split('\n');
        buffer = words.pop();

        for (let word of words) {
            if (matchingWords.length >= limit) {
                stream.close();
                return;
            }

            // check if a word ends with the same rhyme part as the input word
            const currentWord = word.trim();
            if (currentWord.endsWith(rhymePart)) {
                matchingWords.push(currentWord);
            }
        }
    });

    stream.on('close', () => {
        // preventing any potential valid rhyming words from being missed.
        if (buffer.trim() && matchingWords.length < limit) {
            const currentWord = buffer.trim();
            if (currentWord.endsWith(rhymePart)) {
                matchingWords.push(currentWord);
            }
        }

        console.log(`Words that rhyme with "${word}":`);
        console.log(matchingWords.join(', '));
        console.log(matchingWords.length);
    });

    stream.on('error', (err) => {
        console.error(`Error reading file: ${err.message}`);
    });
};

// Helper function to extract the rhyme part of the word (last syllable)
function getRhymePart(word) {
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




// Example usage
const filePath = './wordlist.txt'; // Path to your sorted .txt file
const inputWord = 'up';      // The word to find rhymes for
const limit = 8;              // Optional limit for the number of words required
findRhymingWords(filePath, inputWord);