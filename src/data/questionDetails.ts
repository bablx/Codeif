export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface QuestionDetails {
  id: number;
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: Record<string, string>;
}

const details: QuestionDetails[] = [
  // ─── EASY ───────────────────────────────────────────────────────────────────
  {
    id: 1,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers that add up to \`target\`.

You may assume that each input has exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6",     output: "[1,2]" },
      { input: "nums = [3,3], target = 6",        output: "[0,1]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
    starterCode: {
      python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass

# Test
sol = Solution()
print(sol.twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(sol.twoSum([3, 2, 4], 6))       # Expected: [1, 2]
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
}

// Test
console.log(twoSum([2, 7, 11, 15], 9));  // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6));       // Expected: [1, 2]
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums1 = {2, 7, 11, 15};
    auto r = sol.twoSum(nums1, 9);
    cout << "[" << r[0] << ", " << r[1] << "]" << endl; // [0, 1]
    return 0;
}
`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))); // [0, 1]
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6)));     // [1, 2]
    }
}
`,
    },
  },
  {
    id: 2,
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ASCII character."],
    starterCode: {
      python: `from typing import List

class Solution:
    def reverseString(self, s: List[str]) -> None:
        # Modify s in-place, do not return anything
        pass

# Test
s1 = ["h","e","l","l","o"]
Solution().reverseString(s1)
print(s1)  # Expected: ['o', 'l', 'l', 'e', 'h']
`,
      javascript: `/**
 * @param {character[]} s
 * @return {void} - Modify s in-place
 */
function reverseString(s) {
    // Write your solution here
}

const s = ["h","e","l","l","o"];
reverseString(s);
console.log(s);  // Expected: ['o','l','l','e','h']
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your solution here
    }
};

int main() {
    Solution sol;
    vector<char> s = {'h','e','l','l','o'};
    sol.reverseString(s);
    for (char c : s) cout << c;
    cout << endl; // olleh
    return 0;
}
`,
      java: `import java.util.*;

class Solution {
    public void reverseString(char[] s) {
        // Write your solution here
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        char[] s = {'h','e','l','l','o'};
        sol.reverseString(s);
        System.out.println(new String(s)); // olleh
    }
}
`,
    },
  },
  {
    id: 3,
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:

- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
    examples: [
      { input: "n = 3",  output: '["1","2","Fizz"]' },
      { input: "n = 5",  output: '["1","2","Fizz","4","Buzz"]' },
      { input: "n = 15", output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    constraints: ["1 <= n <= 10^4"],
    starterCode: {
      python: `from typing import List

class Solution:
    def fizzBuzz(self, n: int) -> List[str]:
        # Write your solution here
        pass

print(Solution().fizzBuzz(15))
`,
      javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
    // Write your solution here
}

console.log(fizzBuzz(15));
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> fizzBuzz(int n) {
        // Write your solution here
        return {};
    }
};

int main() {
    Solution sol;
    auto result = sol.fizzBuzz(15);
    for (auto& s : result) cout << s << " ";
    cout << endl;
    return 0;
}
`,
      java: `import java.util.*;

class Solution {
    public List<String> fizzBuzz(int n) {
        // Write your solution here
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(new Solution().fizzBuzz(15));
    }
}
`,
    },
  },
  {
    id: 4,
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.

An integer is a palindrome when it reads the same forward and backward. For example, 121 is a palindrome while 123 is not.

**Follow up:** Could you solve it without converting the integer to a string?`,
    examples: [
      { input: "x = 121",  output: "true",  explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Not a palindrome." },
      { input: "x = 10",   output: "false", explanation: "Reads 01 from right to left. Not a palindrome." },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: {
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Write your solution here
        pass

print(Solution().isPalindrome(121))   # True
print(Solution().isPalindrome(-121))  # False
print(Solution().isPalindrome(10))    # False
`,
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindrome(x) {
    // Write your solution here
}

console.log(isPalindrome(121));   // true
console.log(isPalindrome(-121));  // false
console.log(isPalindrome(10));    // false
`,
      cpp: `#include <iostream>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        // Write your solution here
        return false;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    cout << sol.isPalindrome(121)  << endl; // true
    cout << sol.isPalindrome(-121) << endl; // false
    cout << sol.isPalindrome(10)   << endl; // false
    return 0;
}
`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.isPalindrome(121));   // true
        System.out.println(sol.isPalindrome(-121));  // false
        System.out.println(sol.isPalindrome(10));    // false
    }
}
`,
    },
  },
  {
    id: 5,
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    examples: [
      { input: "nums = [1,2,3,1]",     output: "true"  },
      { input: "nums = [1,2,3,4]",     output: "false" },
      { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      python: `from typing import List

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        # Write your solution here
        pass

print(Solution().containsDuplicate([1,2,3,1]))  # True
print(Solution().containsDuplicate([1,2,3,4]))  # False
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
    // Write your solution here
}

console.log(containsDuplicate([1,2,3,1]));  // true
console.log(containsDuplicate([1,2,3,4]));  // false
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Write your solution here
        return false;
    }
};

int main() {
    Solution sol;
    vector<int> a = {1,2,3,1}, b = {1,2,3,4};
    cout << boolalpha << sol.containsDuplicate(a) << endl; // true
    cout << boolalpha << sol.containsDuplicate(b) << endl; // false
    return 0;
}
`,
      java: `import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.containsDuplicate(new int[]{1,2,3,1})); // true
        System.out.println(sol.containsDuplicate(new int[]{1,2,3,4})); // false
    }
}
`,
    },
  },
  {
    id: 6,
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return its sum.

A **subarray** is a contiguous part of an array.`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]",                       output: "1" },
      { input: "nums = [5,4,-1,7,8]",              output: "23" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      python: `from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Write your solution here (Kadane's Algorithm hint)
        pass

print(Solution().maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # 6
print(Solution().maxSubArray([5,4,-1,7,8]))               # 23
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Write your solution here (Kadane's Algorithm hint)
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));  // 6
console.log(maxSubArray([5,4,-1,7,8]));               // 23
`,
      cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> a = {-2,1,-3,4,-1,2,1,-5,4};
    cout << sol.maxSubArray(a) << endl; // 6
    return 0;
}
`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
        System.out.println(sol.maxSubArray(new int[]{5,4,-1,7,8}));             // 23
    }
}
`,
    },
  },
  {
    id: 7,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]",   output: "0", explanation: "No transactions give profit, so return 0." },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    starterCode: {
      python: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # Write your solution here
        pass

print(Solution().maxProfit([7,1,5,3,6,4]))  # 5
print(Solution().maxProfit([7,6,4,3,1]))    # 0
`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
    // Write your solution here
}

console.log(maxProfit([7,1,5,3,6,4]));  // 5
console.log(maxProfit([7,6,4,3,1]));    // 0
`,
      cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> p = {7,1,5,3,6,4};
    cout << sol.maxProfit(p) << endl; // 5
    return 0;
}
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().maxProfit(new int[]{7,1,5,3,6,4})); // 5
        System.out.println(new Solution().maxProfit(new int[]{7,6,4,3,1}));   // 0
    }
}
`,
    },
  },
  {
    id: 8,
    description: `Given a **non-empty** array of integers \`nums\`, every element appears **twice** except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    examples: [
      { input: "nums = [2,2,1]",      output: "1" },
      { input: "nums = [4,1,2,1,2]",  output: "4" },
      { input: "nums = [1]",           output: "1" },
    ],
    constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element appears twice except for exactly one element."],
    starterCode: {
      python: `from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        # Hint: XOR all numbers together
        pass

print(Solution().singleNumber([2,2,1]))     # 1
print(Solution().singleNumber([4,1,2,1,2])) # 4
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
    // Hint: XOR all numbers together
}

console.log(singleNumber([2,2,1]));     // 1
console.log(singleNumber([4,1,2,1,2])); // 4
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> a = {2,2,1};
    cout << sol.singleNumber(a) << endl; // 1
    return 0;
}
`,
      java: `class Solution {
    public int singleNumber(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().singleNumber(new int[]{2,2,1}));     // 1
        System.out.println(new Solution().singleNumber(new int[]{4,1,2,1,2})); // 4
    }
}
`,
    },
  },
  {
    id: 9,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: "n = 2", output: "2", explanation: "1 step + 1 step, or 2 steps." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Hint: This is Fibonacci in disguise
        pass

print(Solution().climbStairs(2))  # 2
print(Solution().climbStairs(3))  # 3
print(Solution().climbStairs(10)) # 89
`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Hint: This is Fibonacci in disguise
}

console.log(climbStairs(2));  // 2
console.log(climbStairs(3));  // 3
console.log(climbStairs(10)); // 89
`,
      cpp: `#include <iostream>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    cout << sol.climbStairs(2)  << endl; // 2
    cout << sol.climbStairs(3)  << endl; // 3
    cout << sol.climbStairs(10) << endl; // 89
    return 0;
}
`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.climbStairs(2));  // 2
        System.out.println(sol.climbStairs(3));  // 3
        System.out.println(sol.climbStairs(10)); // 89
    }
}
`,
    },
  },
  {
    id: 10,
    description: `The **Fibonacci sequence** is defined as:
- \`F(0) = 0\`, \`F(1) = 1\`
- \`F(n) = F(n-1) + F(n-2)\` for \`n > 1\`

Given \`n\`, calculate \`F(n)\`.`,
    examples: [
      { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
      { input: "n = 3", output: "2", explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2." },
      { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3." },
    ],
    constraints: ["0 <= n <= 30"],
    starterCode: {
      python: `class Solution:
    def fib(self, n: int) -> int:
        # Write your solution here (recursive or iterative)
        pass

for i in range(8):
    print(f"F({i}) =", Solution().fib(i))
`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function fib(n) {
    // Write your solution here
}

for (let i = 0; i < 8; i++) console.log(\`F(\${i}) = \${fib(i)}\`);
`,
      cpp: `#include <iostream>
using namespace std;

class Solution {
public:
    int fib(int n) {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    for (int i = 0; i < 8; i++)
        cout << "F(" << i << ") = " << sol.fib(i) << endl;
    return 0;
}
`,
      java: `class Solution {
    public int fib(int n) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        for (int i = 0; i < 8; i++)
            System.out.println("F(" + i + ") = " + sol.fib(i));
    }
}
`,
    },
  },
];

// ─── Generic template for questions without full details ───────────────────────
function makeGeneric(id: number, title: string, topic: string): QuestionDetails {
  const fn = title.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/__+/g, '_');
  return {
    id,
    description: `**${title}**\n\nSolve the classic ${topic} problem: **${title}**.\n\nImplement your solution in the function below, then click **Run** to test it against the provided examples.`,
    examples: [
      { input: "See problem description", output: "See expected output" },
    ],
    constraints: ["See constraints in standard problem statement."],
    starterCode: {
      python: `class Solution:
    def ${fn}(self):
        # Write your solution here
        pass

# Add your test cases below
sol = Solution()
`,
      javascript: `function ${fn}() {
    // Write your solution here
}

// Add your test cases below
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    // Write your solution here
};

int main() {
    // Add your test cases here
    return 0;
}
`,
      java: `import java.util.*;

class Solution {
    // Write your solution here

    public static void main(String[] args) {
        // Add your test cases here
    }
}
`,
    },
  };
}

// Build lookup map
import { easyQuestions, mediumQuestions, extremeQuestions } from './questions';

const allQuestions = [...easyQuestions, ...mediumQuestions, ...extremeQuestions];

const detailsMap = new Map<number, QuestionDetails>(details.map((d) => [d.id, d]));

// Fill in generic details for anything not explicitly defined
for (const q of allQuestions) {
  if (!detailsMap.has(q.id)) {
    detailsMap.set(q.id, makeGeneric(q.id, q.title, q.topic));
  }
}

export function getQuestionDetails(id: number): QuestionDetails | null {
  return detailsMap.get(id) ?? null;
}
