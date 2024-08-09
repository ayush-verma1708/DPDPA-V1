// // src/components/ControlList.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ControlList = ({ controlFamilyId }) => {
//     const [controls, setControls] = useState([]);

//     useEffect(() => {
//         const fetchControls = async () => {
//             try {
//                 const response = await axios.get(`/api/v1/controls?controlFamilyId=${controlFamilyId}`);
//                 setControls(response.data);
//             } catch (error) {
//                 console.error('Error fetching controls:', error);
//             }
//         };

//         if (controlFamilyId) {
//             fetchControls();
//         }
//     }, [controlFamilyId]);

//     return (
//         <div>
//             <h2>Controls</h2>
//             <ul>
//                 {controls.map((control) => (
//                     <li key={control._id}>
//                         {control.name}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default ControlList;
