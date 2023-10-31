import vtk

# Replace "input.vtk" with the actual path to your VTK file
input_filename = "models/output_clipped_x.vtk"
output_filename = "models/output-converted-to-stl.stl"

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
stl_writer.SetFileName(output_filename)
stl_writer.SetInputConnection(geometry_filter.GetOutputPort())
stl_writer.Write()

print(f"converted the file {input_filename} to stl")
