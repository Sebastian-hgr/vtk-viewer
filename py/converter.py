from imports import *



def convert_vtk_to_stl(input_filename, output_filename):
    # Read the VTK file
    reader = vtk.vtkUnstructuredGridReader()
    reader.SetFileName(input_filename)
    reader.Update()

    # Convert unstructured grid to polydata
    geometry_filter = vtk.vtkGeometryFilter()
    geometry_filter.SetInputConnection(reader.GetOutputPort())
    geometry_filter.Update()

    # Write to STL
    stl_writer = vtk.vtkSTLWriter()
    stl_writer.SetFileName(f"{output_filename}/blast-furnace.stl")
    stl_writer.SetInputConnection(geometry_filter.GetOutputPort())
    stl_writer.Write()


    print(f"converted the file {input_filename} to stl")
