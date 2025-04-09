// Exercise 1: Check if subarray with 0 sum exists
function hasZeroSumSubarray(arr) {
  const set = new Set();
  let sum = 0;
  for (let num of arr) {
    sum += num;
    if (sum === 0 || set.has(sum)) return true;
    set.add(sum);
  }
  return false;
}

// Exercise 2: Max subarray sum (Kadane's Algorithm)
function maxSubarraySum(arr) {
  let maxSoFar = arr[0];
  let currentMax = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currentMax = Math.max(arr[i], currentMax + arr[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}

// Exercise 3: Valid parentheses
function isValid(str) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (let char of str) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.length === 0;
       }
