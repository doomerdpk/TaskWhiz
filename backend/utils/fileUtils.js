const fs = require("fs");

const readFile = (filepath) => fs.promises.readFile(filepath, "utf-8");

const writeFile = (filepath, data) =>
  fs.promises.writeFile(filepath, data, "utf-8");

const createFileIfNotExists = async (filePath, defaultContent = "[]") => {
  try {
    await fs.promises.access(filePath);
  } catch (err) {
    try {
      await fs.promises.writeFile(filePath, defaultContent, "utf-8");
      console.log(`${filePath} created successfully...`);
    } catch (writeErr) {
      console.error(`Error creating file ${filePath}:`, writeErr);
    }
  }
};

const createFolderIfNotExists = async (folderPath) => {
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
    console.log(`${folderPath} folder created successfully...`);
  } catch (error) {
    console.error(`Error creating folder ${folderPath}:`, error);
  }
};

module.exports = {
  readFile,
  writeFile,
  createFileIfNotExists,
  createFolderIfNotExists,
};
