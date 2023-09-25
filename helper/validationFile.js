export const checkFileErrors = (files, allowedFileTypes, maxFileSize) => {
  let validFiles = [];
  let unsupportedFileType = false;
  let exceededFileSize = false;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileType = "." + file.name.split(".").pop().toLowerCase();

    if (allowedFileTypes.includes(fileType) && file.size <= maxFileSize) {
      validFiles.push(file);
    } else {
      if (!allowedFileTypes.includes(fileType)) {
        unsupportedFileType = true;
      }
      if (file.size > maxFileSize) {
        exceededFileSize = true;
      }
    }
  }

  let errorMessage = "";
  if (unsupportedFileType && exceededFileSize) {
    errorMessage = "Some files are not supported and exceed the size limit.";
  } else if (unsupportedFileType) {
    errorMessage = "Some files are not supported.";
  } else if (exceededFileSize) {
    errorMessage = "Some files exceed the size limit.";
  }

  return { validFiles, errorMessage };
};
