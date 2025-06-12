
let a = { age: 18 }
let b = { name: 'xiaohong' }

const change = (m, n) => {
    let temp;
    temp = m;
    m = n;
    n = temp

    return {
        m: m,
        n: n
    }
}

const changeObj = change(a ,b)

a = changeObj.m
b = changeObj.n

console.log(a)
console.log(b)


