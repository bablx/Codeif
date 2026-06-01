export type Difficulty = 'easy' | 'medium' | 'extreme';

export interface Question {
  id: number;
  title: string;
  topic: string;
  difficulty: Difficulty;
  acceptance: number;
  tags: string[];
}

export const easyQuestions: Question[] = [
  { id: 1,  title: "Two Sum",                          topic: "Arrays",              difficulty: "easy", acceptance: 49, tags: ["Array", "Hash Table"] },
  { id: 2,  title: "Reverse String",                   topic: "Strings",             difficulty: "easy", acceptance: 75, tags: ["String", "Two Pointers"] },
  { id: 3,  title: "FizzBuzz",                         topic: "Math",                difficulty: "easy", acceptance: 68, tags: ["Math", "String"] },
  { id: 4,  title: "Palindrome Number",                topic: "Math",                difficulty: "easy", acceptance: 54, tags: ["Math"] },
  { id: 5,  title: "Contains Duplicate",               topic: "Arrays",              difficulty: "easy", acceptance: 61, tags: ["Array", "Hash Table"] },
  { id: 6,  title: "Maximum Subarray",                 topic: "Dynamic Programming", difficulty: "easy", acceptance: 50, tags: ["Array", "DP"] },
  { id: 7,  title: "Best Time to Buy and Sell Stock",  topic: "Arrays",              difficulty: "easy", acceptance: 54, tags: ["Array", "DP"] },
  { id: 8,  title: "Single Number",                    topic: "Bit Manipulation",    difficulty: "easy", acceptance: 70, tags: ["Array", "Bit Manipulation"] },
  { id: 9,  title: "Climbing Stairs",                  topic: "Dynamic Programming", difficulty: "easy", acceptance: 52, tags: ["Math", "DP"] },
  { id: 10, title: "Fibonacci Sequence",               topic: "Math",                difficulty: "easy", acceptance: 67, tags: ["Math", "Recursion"] },
  { id: 11, title: "Reverse Linked List",              topic: "Linked Lists",        difficulty: "easy", acceptance: 73, tags: ["Linked List", "Recursion"] },
  { id: 12, title: "Maximum Depth of Binary Tree",     topic: "Trees",               difficulty: "easy", acceptance: 74, tags: ["Tree", "DFS", "BFS"] },
  { id: 13, title: "Valid Parentheses",                topic: "Stack",               difficulty: "easy", acceptance: 41, tags: ["String", "Stack"] },
  { id: 14, title: "Merge Sorted Arrays",              topic: "Arrays",              difficulty: "easy", acceptance: 47, tags: ["Array", "Two Pointers"] },
  { id: 15, title: "Binary Search",                    topic: "Searching",           difficulty: "easy", acceptance: 56, tags: ["Array", "Binary Search"] },
  { id: 16, title: "Invert Binary Tree",               topic: "Trees",               difficulty: "easy", acceptance: 76, tags: ["Tree", "DFS", "BFS"] },
  { id: 17, title: "Majority Element",                 topic: "Arrays",              difficulty: "easy", acceptance: 65, tags: ["Array", "Hash Table", "Sorting"] },
  { id: 18, title: "Valid Anagram",                    topic: "Strings",             difficulty: "easy", acceptance: 63, tags: ["Hash Table", "String", "Sorting"] },
  { id: 19, title: "Pascal's Triangle",                topic: "Arrays",              difficulty: "easy", acceptance: 71, tags: ["Array", "DP"] },
  { id: 20, title: "Count Primes",                     topic: "Math",                difficulty: "easy", acceptance: 33, tags: ["Array", "Math"] },
  { id: 21, title: "Move Zeroes",                      topic: "Arrays",              difficulty: "easy", acceptance: 61, tags: ["Array", "Two Pointers"] },
  { id: 22, title: "First Unique Character in String", topic: "Strings",             difficulty: "easy", acceptance: 59, tags: ["Hash Table", "String", "Queue"] },
  { id: 23, title: "Find the Missing Number",          topic: "Bit Manipulation",    difficulty: "easy", acceptance: 63, tags: ["Array", "Math", "Bit Manipulation"] },
  { id: 24, title: "Is Subsequence",                   topic: "Strings",             difficulty: "easy", acceptance: 65, tags: ["Two Pointers", "String", "DP"] },
  { id: 25, title: "Happy Number",                     topic: "Math",                difficulty: "easy", acceptance: 55, tags: ["Hash Table", "Math", "Two Pointers"] },
  { id: 26, title: "Sum of Digits",                    topic: "Math",                difficulty: "easy", acceptance: 78, tags: ["Math"] },
  { id: 27, title: "Intersection of Two Arrays",       topic: "Arrays",              difficulty: "easy", acceptance: 70, tags: ["Array", "Hash Table", "Sorting"] },
  { id: 28, title: "Roman to Integer",                 topic: "Math",                difficulty: "easy", acceptance: 60, tags: ["Hash Table", "Math", "String"] },
  { id: 29, title: "Longest Common Prefix",            topic: "Strings",             difficulty: "easy", acceptance: 42, tags: ["String", "Trie"] },
  { id: 30, title: "Symmetric Tree",                   topic: "Trees",               difficulty: "easy", acceptance: 55, tags: ["Tree", "DFS", "BFS"] },
  { id: 31, title: "Count and Say",                    topic: "Strings",             difficulty: "easy", acceptance: 58, tags: ["String"] },
  { id: 32, title: "Excel Sheet Column Number",        topic: "Math",                difficulty: "easy", acceptance: 67, tags: ["Math", "String"] },
  { id: 33, title: "Plus One",                         topic: "Arrays",              difficulty: "easy", acceptance: 45, tags: ["Array", "Math"] },
  { id: 34, title: "Remove Duplicates from Sorted Array", topic: "Arrays",           difficulty: "easy", acceptance: 53, tags: ["Array", "Two Pointers"] },
  { id: 35, title: "Power of Two",                     topic: "Bit Manipulation",    difficulty: "easy", acceptance: 46, tags: ["Math", "Bit Manipulation", "Recursion"] },
];

export const mediumQuestions: Question[] = [
  { id: 101, title: "Longest Substring Without Repeating Characters", topic: "Sliding Window",       difficulty: "medium", acceptance: 34, tags: ["Hash Table", "String", "Sliding Window"] },
  { id: 102, title: "Add Two Numbers",                                 topic: "Linked Lists",         difficulty: "medium", acceptance: 41, tags: ["Linked List", "Math", "Recursion"] },
  { id: 103, title: "3Sum",                                            topic: "Arrays",               difficulty: "medium", acceptance: 33, tags: ["Array", "Two Pointers", "Sorting"] },
  { id: 104, title: "Container With Most Water",                       topic: "Two Pointers",         difficulty: "medium", acceptance: 55, tags: ["Array", "Two Pointers", "Greedy"] },
  { id: 105, title: "Longest Palindromic Substring",                   topic: "Dynamic Programming",  difficulty: "medium", acceptance: 33, tags: ["String", "DP"] },
  { id: 106, title: "Jump Game",                                       topic: "Greedy",               difficulty: "medium", acceptance: 39, tags: ["Array", "DP", "Greedy"] },
  { id: 107, title: "Merge Intervals",                                 topic: "Sorting",              difficulty: "medium", acceptance: 47, tags: ["Array", "Sorting"] },
  { id: 108, title: "Unique Paths",                                    topic: "Dynamic Programming",  difficulty: "medium", acceptance: 64, tags: ["Math", "DP", "Combinatorics"] },
  { id: 109, title: "Word Search",                                     topic: "Backtracking",         difficulty: "medium", acceptance: 40, tags: ["Array", "Backtracking", "Matrix"] },
  { id: 110, title: "Binary Tree Level Order Traversal",               topic: "Trees",                difficulty: "medium", acceptance: 66, tags: ["Tree", "BFS", "Binary Tree"] },
  { id: 111, title: "Validate Binary Search Tree",                     topic: "Trees",                difficulty: "medium", acceptance: 32, tags: ["Tree", "DFS", "BST"] },
  { id: 112, title: "Maximum Product Subarray",                        topic: "Dynamic Programming",  difficulty: "medium", acceptance: 35, tags: ["Array", "DP"] },
  { id: 113, title: "Find Minimum in Rotated Sorted Array",            topic: "Binary Search",        difficulty: "medium", acceptance: 49, tags: ["Array", "Binary Search"] },
  { id: 114, title: "Combination Sum",                                 topic: "Backtracking",         difficulty: "medium", acceptance: 70, tags: ["Array", "Backtracking"] },
  { id: 115, title: "Permutations",                                    topic: "Backtracking",         difficulty: "medium", acceptance: 77, tags: ["Array", "Backtracking"] },
  { id: 116, title: "Letter Combinations of Phone Number",             topic: "Backtracking",         difficulty: "medium", acceptance: 60, tags: ["Hash Table", "String", "Backtracking"] },
  { id: 117, title: "Generate Parentheses",                            topic: "Backtracking",         difficulty: "medium", acceptance: 74, tags: ["String", "DP", "Backtracking"] },
  { id: 118, title: "Subsets",                                         topic: "Backtracking",         difficulty: "medium", acceptance: 77, tags: ["Array", "Backtracking", "Bit Manipulation"] },
  { id: 119, title: "Decode Ways",                                     topic: "Dynamic Programming",  difficulty: "medium", acceptance: 31, tags: ["String", "DP"] },
  { id: 120, title: "Coin Change",                                     topic: "Dynamic Programming",  difficulty: "medium", acceptance: 44, tags: ["Array", "DP", "BFS"] },
  { id: 121, title: "Longest Increasing Subsequence",                  topic: "Dynamic Programming",  difficulty: "medium", acceptance: 54, tags: ["Array", "Binary Search", "DP"] },
  { id: 122, title: "Course Schedule",                                 topic: "Graph",                difficulty: "medium", acceptance: 46, tags: ["DFS", "BFS", "Graph", "Topological Sort"] },
  { id: 123, title: "Number of Islands",                               topic: "Graph",                difficulty: "medium", acceptance: 58, tags: ["Array", "DFS", "BFS", "Graph"] },
  { id: 124, title: "Implement Trie (Prefix Tree)",                    topic: "Trie",                 difficulty: "medium", acceptance: 65, tags: ["Hash Table", "String", "Design", "Trie"] },
  { id: 125, title: "Search in Rotated Sorted Array",                  topic: "Binary Search",        difficulty: "medium", acceptance: 39, tags: ["Array", "Binary Search"] },
  { id: 126, title: "Flatten Binary Tree to Linked List",              topic: "Trees",                difficulty: "medium", acceptance: 64, tags: ["Linked List", "Stack", "Tree", "DFS"] },
  { id: 127, title: "Minimum Path Sum",                                topic: "Dynamic Programming",  difficulty: "medium", acceptance: 62, tags: ["Array", "DP", "Matrix"] },
  { id: 128, title: "Clone Graph",                                     topic: "Graph",                difficulty: "medium", acceptance: 55, tags: ["Hash Table", "DFS", "BFS", "Graph"] },
  { id: 129, title: "House Robber",                                    topic: "Dynamic Programming",  difficulty: "medium", acceptance: 50, tags: ["Array", "DP"] },
  { id: 130, title: "Design HashSet",                                  topic: "Design",               difficulty: "medium", acceptance: 67, tags: ["Array", "Hash Table", "Linked List", "Design"] },
  { id: 131, title: "Group Anagrams",                                  topic: "Strings",              difficulty: "medium", acceptance: 67, tags: ["Array", "Hash Table", "String", "Sorting"] },
  { id: 132, title: "Spiral Matrix",                                   topic: "Arrays",               difficulty: "medium", acceptance: 48, tags: ["Array", "Matrix", "Simulation"] },
  { id: 133, title: "Rotate Image",                                    topic: "Arrays",               difficulty: "medium", acceptance: 74, tags: ["Array", "Math", "Matrix"] },
  { id: 134, title: "Top K Frequent Elements",                         topic: "Sorting",              difficulty: "medium", acceptance: 65, tags: ["Array", "Hash Table", "Sorting", "Heap"] },
  { id: 135, title: "Product of Array Except Self",                    topic: "Arrays",               difficulty: "medium", acceptance: 65, tags: ["Array", "Prefix Sum"] },
];

export const extremeQuestions: Question[] = [
  { id: 201, title: "Median of Two Sorted Arrays",             topic: "Binary Search",        difficulty: "extreme", acceptance: 40, tags: ["Array", "Binary Search", "Divide & Conquer"] },
  { id: 202, title: "Regular Expression Matching",             topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 28, tags: ["String", "DP", "Recursion"] },
  { id: 203, title: "Merge k Sorted Lists",                    topic: "Linked Lists",         difficulty: "extreme", acceptance: 51, tags: ["Linked List", "Divide & Conquer", "Heap"] },
  { id: 204, title: "Trapping Rain Water",                     topic: "Two Pointers",         difficulty: "extreme", acceptance: 60, tags: ["Array", "Two Pointers", "Stack", "DP"] },
  { id: 205, title: "N-Queens",                                topic: "Backtracking",         difficulty: "extreme", acceptance: 67, tags: ["Array", "Backtracking"] },
  { id: 206, title: "Wildcard Matching",                       topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 28, tags: ["String", "DP", "Greedy", "Recursion"] },
  { id: 207, title: "Word Ladder II",                          topic: "Graph",                difficulty: "extreme", acceptance: 28, tags: ["Hash Table", "String", "BFS", "Backtracking"] },
  { id: 208, title: "Binary Tree Maximum Path Sum",            topic: "Trees",                difficulty: "extreme", acceptance: 39, tags: ["DP", "Tree", "DFS"] },
  { id: 209, title: "Longest Consecutive Sequence",            topic: "Hash Table",           difficulty: "extreme", acceptance: 48, tags: ["Array", "Hash Table", "Union Find"] },
  { id: 210, title: "Reverse Nodes in k-Group",               topic: "Linked Lists",         difficulty: "extreme", acceptance: 56, tags: ["Linked List", "Recursion"] },
  { id: 211, title: "Minimum Window Substring",               topic: "Sliding Window",       difficulty: "extreme", acceptance: 42, tags: ["Hash Table", "String", "Sliding Window"] },
  { id: 212, title: "Sudoku Solver",                          topic: "Backtracking",         difficulty: "extreme", acceptance: 58, tags: ["Array", "Hash Table", "Backtracking", "Matrix"] },
  { id: 213, title: "First Missing Positive",                 topic: "Arrays",               difficulty: "extreme", acceptance: 38, tags: ["Array", "Hash Table"] },
  { id: 214, title: "Serialize and Deserialize Binary Tree",  topic: "Trees",                difficulty: "extreme", acceptance: 57, tags: ["String", "Tree", "DFS", "BFS", "Design"] },
  { id: 215, title: "Word Break II",                          topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 47, tags: ["Hash Table", "String", "DP", "Backtracking", "Trie"] },
  { id: 216, title: "Largest Rectangle in Histogram",         topic: "Stack",                difficulty: "extreme", acceptance: 44, tags: ["Array", "Stack", "Monotonic Stack"] },
  { id: 217, title: "Sliding Window Maximum",                 topic: "Sliding Window",       difficulty: "extreme", acceptance: 46, tags: ["Array", "Queue", "Sliding Window", "Heap"] },
  { id: 218, title: "Find Median from Data Stream",           topic: "Design",               difficulty: "extreme", acceptance: 52, tags: ["Two Pointers", "Design", "Sorting", "Heap"] },
  { id: 219, title: "LRU Cache Implementation",               topic: "Design",               difficulty: "extreme", acceptance: 42, tags: ["Hash Table", "Linked List", "Design"] },
  { id: 220, title: "Burst Balloons",                         topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 57, tags: ["Array", "DP"] },
  { id: 221, title: "Palindrome Partitioning II",             topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 33, tags: ["String", "DP"] },
  { id: 222, title: "Alien Dictionary",                       topic: "Graph",                difficulty: "extreme", acceptance: 35, tags: ["Array", "String", "Graph", "Topological Sort"] },
  { id: 223, title: "Maximum Gap",                            topic: "Sorting",              difficulty: "extreme", acceptance: 44, tags: ["Array", "Sorting", "Bucket Sort"] },
  { id: 224, title: "Count of Smaller Numbers After Self",    topic: "Sorting",              difficulty: "extreme", acceptance: 43, tags: ["Array", "Binary Search", "Divide & Conquer", "Segment Tree"] },
  { id: 225, title: "Edit Distance Optimization",             topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 36, tags: ["String", "DP"] },
  { id: 226, title: "Cut Off Trees for Golf Event",           topic: "Graph",                difficulty: "extreme", acceptance: 36, tags: ["Array", "BFS", "Sorting", "Matrix", "Heap"] },
  { id: 227, title: "Candy Distribution",                     topic: "Greedy",               difficulty: "extreme", acceptance: 41, tags: ["Array", "Greedy"] },
  { id: 228, title: "Scramble String",                        topic: "Dynamic Programming",  difficulty: "extreme", acceptance: 39, tags: ["String", "DP"] },
  { id: 229, title: "Maximal Rectangle",                      topic: "Stack",                difficulty: "extreme", acceptance: 45, tags: ["Array", "Stack", "Matrix", "DP", "Monotonic Stack"] },
  { id: 230, title: "Basic Calculator",                       topic: "Stack",                difficulty: "extreme", acceptance: 43, tags: ["Math", "String", "Stack", "Recursion"] },
];

// Total question counts (simulating a larger bank)
export const TOTAL_COUNTS = {
  easy: 350,
  medium: 420,
  extreme: 280,
} as const;

export const questionsByDifficulty: Record<Difficulty, Question[]> = {
  easy: easyQuestions,
  medium: mediumQuestions,
  extreme: extremeQuestions,
};
