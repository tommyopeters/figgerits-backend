export class TrieNode {
    end: boolean;
    children: { [key: string]: TrieNode };

    constructor() {
        this.end = false;
        this.children = {};
    }
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string) {
        let node = this.root;
        for(let char of word) {
            if(!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.end = true;
    }

    search(word: string) {
        let node = this.root;
        for(let char of word) {
            if(!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.end;
    }

    startsWith(prefix: string) {
        let node = this.root;
        for(let char of prefix) {
            if(!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return true;
    }
}