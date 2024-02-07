const fs = require("fs");

async function fetchData() {
  try {
    const rawText = fs.readFileSync("./data/ddo-fullform/ddo_fullforms_2023-10-11.csv", "utf8");

    const globalArrayOfWords = rawText.split("\n").filter(line => line.trim()).map(line => {
      const parts = line.split("\t");
      return {
        variant: parts[0],
        headword: parts[1],
        homograph: parts[2],
        partofspeech: parts[3],
        id: parts[4]
      };
    });

    function binarySearch(targetWord) {
      let left = 0;
      let right = globalArrayOfWords.length - 1;
      let mid;

      do {
        mid = Math.floor((left + right) / 2);
        let comparison = compare(targetWord, globalArrayOfWords[mid]);

        // console.log( `left: ${ globalArrayOfWords[left].variant } (${ left }) | mid: ${ globalArrayOfWords[mid].variant } (${ mid }) | right: ${ globalArrayOfWords[right].variant } (${ right }) | compare: ${ comparison }` )
        if (comparison === 0) {
          return mid; // word found at index mid
        } else if (comparison === -1) {
          right = mid; // search in the left half
        } else {
          left = mid; // search in the right half
        }
      } while (left != right - 1);
      return -1; // word not found
    }

    function compare(targetWord, wordObject) {
      if (targetWord === wordObject.variant) {
        return 0; // target word matches word object
      } else if (targetWord < wordObject.variant) {
        return -1; // target word comes before word object
      } else {
        return 1; // target word comes after word object
      }
    }

    function performBinarySearch(targetWord) {
      const start = performance.now();
      const indexBinarySearch = binarySearch(targetWord);
      const end = performance.now();
      console.log("Binary Search Duration:", end - start, "milliseconds");
      return indexBinarySearch;
    }

    function performFindIndex(targetWord) {
      const start = performance.now();
      const indexFindIndex = globalArrayOfWords.findIndex(wordObject => wordObject.variant === targetWord);
      const end = performance.now();
      console.log(".findIndex Duration:", end - start, "milliseconds");
      return indexFindIndex;
    }

    const targetWord = "hestevogn";

    // Perform Binary Search and measure duration
    const indexBinarySearch = performBinarySearch(targetWord);

    // Perform .findIndex and measure duration
    const indexFindIndex = performFindIndex(targetWord);

    console.log("Binary Search Result:", indexBinarySearch);
    console.log(".findIndex Result:", indexFindIndex);

  } catch (err) {
    console.error('Error reading file:', err);
  }
}

fetchData();