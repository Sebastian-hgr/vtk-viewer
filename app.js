const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const {exec} = require('child_process')

const app = express()
const port = 8080

app
    .use(express
        .static(path
            .join(__dirname, 'public')))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))
app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
    onstartup()
})

app.post('/getCut', (req, res) => {
    const formData = req.body
    const {input} = formData // Assuming the form field is named 'input'
    const range = formData.range
    // console.log('select: ' + select)
    console.log(`range value = ${range}`)
    //Modify the Python script to handle the input
    const command = `python3 getFormData.py ${range}`

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

app.post('/getZ', (req,res) => {
    const formEighth = req.body
    console.log(`app.js ${formEighth}`)

    const command = 'python3 clipZ.py'

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`eighth error: ${error}`)
            return
        }
        console.log(`eight: ${stdout}`)
        console.log(`eight: ${stderr}`)
    })
    res.redirect('/')
})
app.post('/reset', (req,res) => {
    const formEighth = req.body
    console.log(`app.js ${formEighth}`)

    const command = 'python3 reset.py'

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`eighth error: ${error}`)
            return
        }
        console.log(`eight: ${stdout}`)
        console.log(`eight: ${stderr}`)
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
        console.log(`startup stdout: ${stdout}`)
        console.error(`startup stderr: ${stderr}`)
    })
}
