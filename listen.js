const app = require('../be-nc-games/app.js')

const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
})