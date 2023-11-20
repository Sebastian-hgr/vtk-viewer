from imports import *

from py.slicer import clip_with_deg, clip_on_z
from py.converter import convert_vtk_to_stl
# from prototype.prototype import extract_cylinder_section

start_file_path = "public/models/blast-furnace.vtk"
goal_file_path = "public/models/output-clipped.vtk"
output_file_path = "public/models"

if __name__ == "__main__":
    deg = sys.argv[1] if len(sys.argv) > 1 else 0
    print(f"Received input: {deg}")

    start_time = time.time()
    clip_with_deg(start_file_path, goal_file_path, float(deg))
    convert_vtk_to_stl(goal_file_path, output_file_path)
    end_time = time.time()

    print(end_time-start_time)