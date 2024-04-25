export function processStrings(string1, string2) {
    // Concatenate the strings and split them into an array of characters
    const combinedChars = (string1 + string2).split('');

    // Remove duplicates by converting the array to a Set and back to an array
    const uniqueChars = [...new Set(combinedChars)];

    // Sort the array of unique characters in alphabetical order
    const sortedChars = uniqueChars.sort();

    // Join the sorted characters back into a single string
    const sortedString = sortedChars.join('');

    return sortedString;
}
export function setIntersection(set1, set2) {
    const intersection = new Set();
    for (const item of set1) {
        if (set2.has(item)) {
            intersection.add(item);
        }
    }
    return intersection;
}

export function generateIntersections(dictionary) {
    const intersections = {};

    // Iterate through each character in the dictionary
    const chars = Object.keys(dictionary);
    for (let i = 0; i < chars.length; i++) {
        for (let j = i + 1; j < chars.length; j++) {
            const char1 = chars[i];
            const char2 = chars[j];
            // Ensure char1 is lexically smaller than char2
            const key = processStrings(char1, char2);

            // Intersection of sets containing words for char1 and char2
            const intersection = setIntersection(dictionary[char1], dictionary[char2]);

            // If intersection is not empty, save it to intersections object
            if (intersection.size > 0) {
                intersections[key] = intersection;
            }
        }
    }

    return intersections;
}

export function recursivelyGenerateIntersections(dictionary) {
    const finalResult = {}
    let order = 1;
    let intersection = generateIntersections(dictionary);
    finalResult[order] = intersection;

    while (Object.keys(intersection).length > 0) {
        order++;
        intersection = generateIntersections(intersection);
        if (Object.keys(intersection).length > 0) { finalResult[order] = intersection; }
    }
    return finalResult
}

export function createUnionOfSets(dictionary) {
    const unionSet = new Set();

    // Iterate through each key in the dictionary
    for (const key in dictionary) {
        // Iterate through each string in the set of the current key
        for (const str of dictionary[key]) {
            // Add the string to the union set
            unionSet.add(str);
        }
    }

    return unionSet;
}
