// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ActionsList = ({ controlId }) => {
//   const [actions, setActions] = useState([]);

//   useEffect(() => {
//     if (controlId) {
//       const fetchActions = async () => {
//         const response = await axios.get(`http://localhost:8021/api/v1/actions?controlId=${controlId}`);
//         setActions(response.data);
//       };
//       fetchActions();
//     }
//   }, [controlId]);

//   return (
//     <div className="actions-list">
//       <h2>List of Actions</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Description</th>
//             {/* Add more fields as needed */}
//           </tr>
//         </thead>
//         <tbody>
//           {actions.map((action) => (
//             <tr key={action.id}>
//               <td>{action.id}</td>
//               <td>{action.name}</td>
//               <td>{action.description}</td>
//               {/* Add more fields as needed */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ActionsList;
