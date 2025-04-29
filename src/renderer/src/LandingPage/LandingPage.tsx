/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { TestPlanEditorPage } from "../components/TestPlanEditor/TestPlanEditorPage";

export const LandingPage = (): JSX.Element => {
  useEffect(() => {
    // Example usage of file operations
    const filePath = "example.txt";

    // Write to a file
    window.api.writeFile(filePath, "Hello, Electron!");

    // Read from the file
    const content = window.api.readFile(filePath);
    console.log("File Content:", content);

    // Get file name
    const fileName = window.api.getFileName(filePath);
    console.log("File Name:", fileName);

    // Delete the file
    window.api.deleteFile(filePath);
    console.log("File deleted");
  }, []);

  return (
    <>
      <TestPlanEditorPage />
    </>
  );
};
