import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDirectory } from "../redux/slices/directorySlice";

const FileExplorer: React.FC = () => {
  const dispatch = useDispatch();
  const currentDirectory = useSelector((state: any) => state.directory.path);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    // Fetch files and directories in the current directory
    const fetchedItems = window.api.listDirectory(currentDirectory);
    setFiles(fetchedItems);
  }, [currentDirectory]);

  const handleFolderClick = (folder: string) => {
    dispatch(setDirectory(`${currentDirectory}\\${folder}`));
  };

  const handleBackClick = () => {
    const parentDirectory = currentDirectory.substring(0, currentDirectory.lastIndexOf("\\"));
    dispatch(setDirectory(parentDirectory || "D:\\"));
  };

  return (
    <div>
      <button onClick={handleBackClick} className="cursor-pointer text-green-500 hover:underline">Back</button>
      <ul>
        {files.map((file) => (
            <li key={file} onClick={() => handleFolderClick(file)} className="cursor-pointer text-blue-500 hover:underline">
            {file}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
