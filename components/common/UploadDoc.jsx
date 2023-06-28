// import React, { useState, useRef } from "react";

// function UploadDoc() {
//   const [file, setfile] = useState({
//     businessProof: "",
//     gst: "",
//     panCard: "",
//     adharCard: "",
//     lightBill: "",
//     itr: "",
//     bankStatement: "",
//   });
//   const aRef = useRef(null);
//   const handleFileChange = (event) => {
//     const fileObj = event.target.files && event.target.files[0];
//     if (!fileObj) {
//       return;
//     }
//     setfile(fileObj);
//   };
//   const resetInput = () => {
//     aRef.current.value = null;
//     setfile("");
//   };
//   return (
//     <>
//       <form action="">
//         <div class="row">
//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4>Business proof</h4>

//             <div class="input-box ">
//               <input
//                 type="file"
//                 class="upload-box"
//                 multiple
//                 // hidden
//                 ref={aRef}
//                 onChange={handleFileChange}
//               />
//               <i
//                 class="fa-solid fa-xmark"
//                 onClick={resetInput}
//                 style={{ cursor: "pointer" }}
//               ></i>
//             </div>
//             <div>
//               {file?.name}
//               {/* {console.log(file)} */}
//               {/* {file.length &&
//                 file.map((fileName, index) => {
//                   <p key={index}>{fileName}</p>;
//                 })} */}
//               {/* {fileNames.map((fileName, index) => (
//                 <div key={index}>{fileName}</div>
//               ))} */}
//             </div>
//           </div>

//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4> GST certi or MSME</h4>

//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>

//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4>PAN Card</h4>
//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>

//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4>Adhar card</h4>
//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>

//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4>Light Bill</h4>
//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>

//           {/* <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4>Car quotation</h4>
//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div> */}

//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4>2 year ITR</h4>
//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>

//           <div class="my-5 col-lg-6 col-md-6 col-sm-12">
//             <h4> 1 Year bank statement</h4>
//             <div class="input-box">
//               <input type="file" class="upload-box" name="files[]" multiple />
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>
//         </div>
//         {/* <div class="btn-section ">
//           <button type="submit">Submit</button>
//         </div> */}
//       </form>
//     </>
//   );
// }

// export default UploadDoc;

import React, { useState, useRef } from "react";

function UploadDoc() {
  const [docFiles, setdocFiles] = useState([]);
  const aRef = useRef(null);
  const handlePanFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    setdocFiles([...docFiles, ...fileArray]);
  };

  const handleRemoveFile = (index) => {
    setdocFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      if (updatedFiles.length === 1) aRef.current.value = null;
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
  return (
    <>
      <form action="">
        <div class="row">
          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4>Business proof</h4>

            <div class="input-box ">
              <input
                type="file"
                multiple
                ref={aRef}
                class="upload-box"
                onChange={handlePanFileChange}
              />
            </div>
            {docFiles.length > 0 && (
              <div>
                <h4>Selected files:</h4>
                {docFiles &&
                  docFiles?.map((file, index) => (
                    <div key={index} className="selectfile">
                      <p>{file?.name}</p>
                      <i
                        class="fa-solid fa-xmark"
                        onClick={() => handleRemoveFile(index)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4> GST certi or MSME</h4>

            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4>PAN Card</h4>
            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4>Adhar card</h4>
            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4>Light Bill</h4>
            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          {/* <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4>Car quotation</h4>
            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div> */}

          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4>2 year ITR</h4>
            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div class="my-5 col-lg-6 col-md-6 col-sm-12">
            <h4> 1 Year bank statement</h4>
            <div class="input-box">
              <input type="file" class="upload-box" name="files[]" multiple />
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
        {/* <div class="btn-section ">
          <button type="submit">Submit</button>
        </div> */}
      </form>
    </>
  );
}

export default UploadDoc;
