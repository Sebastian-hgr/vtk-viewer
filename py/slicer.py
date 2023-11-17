import vtk
import math


def clip_vtk_file(start_file_path, goal_file_path, axis='x'):
    reader = vtk.vtkUnstructuredGridReader()
    reader.SetFileName(start_file_path)
    reader.Update()
    unstructured_grid = reader.GetOutput()

    bounds = unstructured_grid.GetBounds()
    slice_position = (bounds[0] + bounds[1]) / 2 if axis == 'x' else (bounds[2] + bounds[3]) / 2 if axis == 'y' else (bounds[4] + bounds[5]) / 2
    clip_function = vtk.vtkClipDataSet()
    clip_function.SetInputData(unstructured_grid)
    clip_function.SetClipFunction(vtk.vtkPlane())

    origin = [0.0, 0.0, 0.0]
    normal = [0.0, 0.0, 0.0]
    normal[0] = 1.0 if axis == 'x' else 0.0
    normal[1] = 1.0 if axis == 'y' else 0.0
    normal[2] = 1.0 if axis == 'z' else 0.0
    origin[0] = slice_position if axis == 'x' else 0.0
    origin[1] = slice_position if axis == 'y' else 0.0
    origin[2] = slice_position if axis == 'z' else 0.0

    clip_function.GenerateClipScalarsOn()
    clip_function.GenerateClippedOutputOn()
    clip_function.SetValue(0)
    clip_function.SetInsideOut(1)
    clip_function.GetClipFunction().SetNormal(normal)
    clip_function.GetClipFunction().SetOrigin(origin)
    clip_function.Update()

    writer = vtk.vtkUnstructuredGridWriter()
    writer.SetInputData(clip_function.GetOutput())
    writer.SetFileName(f"{goal_file_path}")
    writer.Update()

    print(f"File clipped along the {axis}-axis. New VTK file created.")
