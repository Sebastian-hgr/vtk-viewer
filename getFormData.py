import sys
import time

from py.slicer import clip_vtk_file
from py.converter import convert_vtk_to_stl
from prototype.prototype import extract_cylinder_section

start_file_path = "public/models/blast-furnace.vtk"
goal_file_path = "public/models/output-clipped.vtk"
output_file_path = "public/models"

if __name__ == "__main__":
    axis = sys.argv[1] if len(sys.argv) > 1 else 360
    print(f"Received input: {axis}")

    extract_cylinder_section(start_file_path, goal_file_path, 70)
    convert_vtk_to_stl(goal_file_path, output_file_path)
