function fibonacci(n) {
  let n1 = 0;
  let n2 = 1;
  let sum = 0;

  for (let i = 2; i < n; i++) {
    sum = n1 + n2;
    n1 = n2;
    n2 = sum;
  }

  return n === 0 ? n1 : n2;
}

const result = fibonacci(5);
console.log(result);