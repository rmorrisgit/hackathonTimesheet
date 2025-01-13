import jwt from 'jsonwebtoken'


const secret = 'mylittlesecretkey'


const token = jwt.sign({ message: 'Hi from Ryan!' }, secret)

console.log(token)


jwt.verify(token, secret, (err, data) => {
    if(err) {console.log(err.message)
    console.log(data)}
})