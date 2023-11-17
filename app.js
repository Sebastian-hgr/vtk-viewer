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
    // console.log(`app.js formdata: ${formData}`)
    const { input } = formData // Assuming the form field is named 'input'

    const select = formData.cuts
    // console.log('select: ' + select)

    // Modify the Python script to handle the input
    const command = `python3 getFormData.py`


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

// app.post('/getEighth', (req,res) => {
//     const formEighth = req.body
//     console.log(`app.js ${formEighth}`)
//
//     // const command = 'python3 getFormData.py'
//     //
//     // exec(command, (error, stdout, stderr) => {
//     //     if (error) {
//     //         console.log(`eighth error: ${error}`)
//     //         return
//     //     }
//     //     console.log(`eight: ${stdout}`)
//     //     console.log(`eight: ${stderr}`)
//     // })
//     res.redirect('/')
// })

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