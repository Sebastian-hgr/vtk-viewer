import vtk
import math


def extract_cylinder_section(input_file, output_file, angle):

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
            else:
                new_pid = point_map[pid]

            new_cell_pids.InsertId(i, new_pid)

        # If the cell is within the required angles, add it to the new grid
        if keep_cell:
            new_cells.InsertNextCell(new_cell_pids)

    # Set the points and cells in the new grid
    new_grid.SetPoints(new_points)
    new_grid.SetCells(grid.GetCellType(0), new_cells)

    # Write the new unstructured grid to an output file
    writer = vtk.vtkUnstructuredGridWriter()
    writer.SetFileName(output_file)
    writer.SetInputData(new_grid)
    writer.Write()

    print("Section extracted and written to ", output_file)
