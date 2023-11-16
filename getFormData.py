import sys
from py.slicer import clip_vtk_file
from py.converter import convert_vtk_to_stl

start_file_path = "public/models/blast-furnace.vtk"
goal_file_path = "public/models/output-clipped.vtk"
output_file_path = "public/models"

if __name__ == "__main__":
    axis = sys.argv[1] if len(sys.argv) > 1 else "default_value"
    print(f"Received input: {axis}")
    clip_vtk_file(start_file_path, goal_file_path, axis)  # Call the clip_vtk_file function with the provided data
    convert_vtk_to_stl(goal_file_path, output_file_path)
