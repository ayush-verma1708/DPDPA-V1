import os

def count_loc_in_file(file_path):
    """Count lines of code, blank lines, and comment lines in a file."""
    total_lines = 0
    blank_lines = 0
    comment_lines = 0
    in_multiline_comment = False

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        for line in file:
            stripped_line = line.strip()
            total_lines += 1

            if not stripped_line:
                blank_lines += 1
            elif stripped_line.startswith("#") or stripped_line.startswith("//"):
                comment_lines += 1
            elif stripped_line.startswith("/*") and not stripped_line.endswith("*/"):
                comment_lines += 1
                in_multiline_comment = True
            elif in_multiline_comment:
                comment_lines += 1
                if stripped_line.endswith("*/"):
                    in_multiline_comment = False

    return total_lines, blank_lines, comment_lines


def count_loc_in_directory(directory_path):
    """Recursively count lines of code in all files in a directory, ignoring specific folders."""
    total_lines = 0
    total_blank_lines = 0
    total_comment_lines = 0

    # Folders to ignore
    ignore_folders = {'node_modules', 'dist', 'build', '.git'}

    for root, dirs, files in os.walk(directory_path):
        # Skip ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_folders]

        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json')):  # Add extensions of files to analyze
                file_path = os.path.join(root, file)
                
                # Display the file being processed
                print(f"Processing: {file_path}")
                
                loc, blank, comments = count_loc_in_file(file_path)
                total_lines += loc
                total_blank_lines += blank
                total_comment_lines += comments

    return total_lines, total_blank_lines, total_comment_lines


if __name__ == "__main__":
    project_dir = os.path.dirname(os.path.abspath(__file__))  # Use the current directory as project root
    total_loc, total_blank, total_comments = count_loc_in_directory(project_dir)

    print(f"\nSummary for project directory: {project_dir}")
    print(f"Total lines of code: {total_loc}")
    print(f"Total blank lines: {total_blank}")
    print(f"Total comment lines: {total_comments}")
    print(f"Effective lines of code (excluding blank and comment lines): {total_loc - total_blank - total_comments}")
