const express = require('express')
const app = express()
const port = 8080
const path = require('path')

const { exec } = require('child_process')
const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
    onstartup()
})

app.post('/getCut', (req, res) => {
    const formData = req.body
    const { input } = formData // Assuming the form field is named 'input'

    // Modify the Python script to handle the input
    const command = `python3 getFormData.py ${input}`

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`clip exec error: ${error}`)

            return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    })
    res.redirect('/')

})

function onstartup() {

    const command = `python3 getFormData.py`

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`clip exec error: ${error}`)

            return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    })
}