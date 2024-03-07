from imports import *

from py.converter import convert_vtk_to_stl

start_file_path = "public/models/blast-furnace.vtk"
output_file_path = "public/models"

if __name__ == "__main__":
    deg = sys.argv[1] if len(sys.argv) > 1 else 0

    start_time = time.time()
    convert_vtk_to_stl(start_file_path, output_file_path)
    end_time = time.time()

    print(end_time-start_time)