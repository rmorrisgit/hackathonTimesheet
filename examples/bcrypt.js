import bcrypt from 'bcrypt';

// bcrypt.hash('abc123', (err, hash) => {

//     console.log(hash)
// })

const hash = await bcrypt.hash('abc123', 10)
console.log(hash)