// // ControlSidebar.js
// import React from 'react';

// const ControlSidebar = ({ controlFamilies, onSelectControl }) => {
//   return (
//     <div className="control-sidebar">
//       {controlFamilies.map((family) => (
//         <div key={family._id}>
//           <h3>{family.name}</h3>
//           {family.controls.map((control) => (
//             <div
//               key={control._id}
//               onClick={() => onSelectControl(control._id)}
//               className="control-item"
//             >
//               {control.name}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ControlSidebar;
