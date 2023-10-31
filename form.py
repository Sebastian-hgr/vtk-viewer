from flask import Flask, render_template, request
from slicer import clip_vtk_file

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/clip', methods=['POST'])
def clip_vtk():
    file_path = request.form['file_path']  # Get the file path from the form
    axis = request.form['axis']  # Get the axis from the form
    clip_vtk_file(file_path, axis)  # Call the clip_vtk_file function with the provided data
    return 'File clipping initiated'


if __name__ == '__main__':
    app.run(debug=True)
