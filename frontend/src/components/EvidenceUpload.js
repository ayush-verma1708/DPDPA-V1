import React, { useState } from 'react';
import {
  TableCell,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const EvidenceUpload = ({
  status,
  isCompleted,
  handleUploadEvidence,
  actionId,
  controlId,
}) => {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Unified file state

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsDragging(false); // Reset dragging state on close
    setSelectedFile(null); // Reset file state on close
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    setIsDragging(true); // Set dragging state to true
  };

  const handleDragLeave = () => {
    setIsDragging(false); // Set dragging state to false when leaving the drop area
  };

  const handleDrop = (event) => {
    event.preventDefault(); // Prevent default behavior
    const droppedFile = event.dataTransfer.files[0]; // Get the first file
    if (droppedFile) {
      setSelectedFile(droppedFile); // Set the dropped file
    }
    setIsDragging(false); // Reset dragging state
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      // Call the function to upload evidence with selectedFile
      await handleUploadEvidence(actionId, controlId, selectedFile);
      handleClose(); // Close modal after upload
    }
  };

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]); // Set the selected file from input
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file); // Set the selected file from input
    console.log('Selected file:', file); // Log the file object to check if it's properly selected
  };

  return (
    <>
      <TableCell>
        <Tooltip title='Upload Evidence'>
          <Button
            onClick={handleClickOpen}
            disabled={isCompleted || status.isEvidenceUploaded}
          >
            Upload Here
          </Button>
        </Tooltip>
      </TableCell>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Evidence</DialogTitle>
        <DialogContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            <p>Drag and drop your files here or click to select</p>
            <input
              type='file'
              onChange={handleFileChange}
              accept='application/pdf, image/*' // Limit to specific file types
              style={{ display: 'none' }} // Hide the default file input
              id='file-upload'
            />
            <label htmlFor='file-upload'>
              <Button variant='outlined' component='span'>
                Select File
              </Button>
            </label>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}{' '}
            {/* Show selected file name */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color='primary'
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EvidenceUpload;

// import React, { useState } from 'react';
// import {
//   TableCell,
//   Button,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';

// const EvidenceUpload = ({
//   status,
//   isCompleted,
//   handleUploadEvidence,
//   actionId,
//   controlId,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setIsDragging(false); // Reset dragging state on close
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
//     setIsDragging(true); // Set dragging state to true
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false); // Set dragging state to false when leaving the drop area
//   };

//   const handleDrop = (event) => {
//     event.preventDefault(); // Prevent default behavior
//     const droppedFile = event.dataTransfer.files[0]; // Get the first file
//     if (droppedFile) {
//       setFile(droppedFile); // Set the dropped file
//     }
//     setIsDragging(false); // Reset dragging state
//   };

//   const handleSubmit = async () => {
//     // Call the function to upload evidence
//     await handleUploadEvidence(actionId, controlId);
//     handleClose(); // Close modal after upload
//     setFile(null); // Reset the file state
//   };
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     console.log('file', selectedFile);
//   };

//   return (
//     <>
//       <TableCell>
//         <Tooltip title='Upload Evidence'>
//           <Button
//             onClick={handleClickOpen}
//             disabled={isCompleted || status.isEvidenceUploaded}
//           >
//             Upload Here
//           </Button>
//         </Tooltip>
//       </TableCell>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Upload Evidence</DialogTitle>
//         <DialogContent>
//           <div
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             style={{
//               border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
//               padding: '20px',
//               textAlign: 'center',
//               marginBottom: '10px',
//             }}
//           >
//             <p>Drag and drop your files here or click to select</p>
//             <input
//               type='file'
//               onChange={handleFileChange}
//               accept='application/pdf, image/*' // Limit to specific file types
//               style={{ display: 'none' }} // Hide the default file input
//               id='file-upload'
//             />
//             <label htmlFor='file-upload'>
//               <Button variant='outlined' component='span'>
//                 Select File
//               </Button>
//             </label>
//             {file && <p>Selected file: {file.name}</p>}{' '}
//             {/* Show selected file name */}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color='primary'>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color='primary' disabled={!file}>
//             Upload
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default EvidenceUpload;
