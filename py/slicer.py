import vtk
import math


def clip_on_z(start_file_path, goal_file_path, axis='x'):
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


def clip_with_deg(input_file, output_file, angle):
    # Load the unstructured grid file
    reader = vtk.vtkUnstructuredGridReader()
    reader.SetFileName(input_file)
    reader.Update()
    grid = reader.GetOutput()

    # Prepare the new unstructured grid
    new_grid = vtk.vtkUnstructuredGrid()

    # Prepare points and cells to transfer valid data
    new_points = vtk.vtkPoints()
    new_cells = vtk.vtkCellArray()

    # Copy cell data structure from the original grid
    new_grid.GetCellData().CopyAllocate(grid.GetCellData())

    # Copy point data structure from the original grid
    new_grid.GetPointData().CopyAllocate(grid.GetPointData())

    # Calculate radians for the start and end angle
    angle_start_rad = math.radians(0)
    angle_end_rad = math.radians(angle)

    # Keeping a mapping of old to new point IDs
    point_map = {}

    # Iterate over cells, extracting only those within the specified angle range
    for cell_id in range(grid.GetNumberOfCells()):
        cell = grid.GetCell(cell_id)
        cell_pids = cell.GetPointIds()
        cell_pts = cell.GetPoints()

        keep_cell = True
        new_cell_pids = vtk.vtkIdList()

        # Loop over each point in the cell
        for i in range(cell_pids.GetNumberOfIds()):
            pid = cell_pids.GetId(i)
            x, y, z = grid.GetPoint(pid)

            # Convert Cartesian coordinates to cylindrical coordinates to check the angle
            angle = math.atan2(y, x)

            if angle < 0:
                angle += 2 * math.pi

            if not (angle_start_rad <= angle <= angle_end_rad):
                keep_cell = False
                break

            # Avoid duplicating points by reusing them if they've been added already
            if pid not in point_map:
                new_pid = new_points.InsertNextPoint(x, y, z)
                point_map[pid] = new_pid
                # Copy the point data for each new point
                new_grid.GetPointData().CopyData(grid.GetPointData(), pid, new_pid)
            else:
                new_pid = point_map[pid]

            new_cell_pids.InsertId(i, new_pid)

        # If the cell is within the required angles, add it to the new grid
        if keep_cell:
            new_cells.InsertNextCell(new_cell_pids)
            # Copy the cell data for each new cell
            new_grid.GetCellData().CopyData(grid.GetCellData(), cell_id, cell_id)

    # Set the points and cells in the new grid
    new_grid.SetPoints(new_points)
    new_grid.SetCells(grid.GetCellType(0), new_cells)

    # Write the new unstructured grid to an output file
    writer = vtk.vtkUnstructuredGridWriter()
    writer.SetFileName(output_file)
    writer.SetInputData(new_grid)
    writer.Write()

    print("Section extracted and written to ", output_file)
