// import React, { useEffect, useState } from 'react';
// import { fetchControlFamilies, addControlFamily, editControlFamily, deleteControlFamily } from '../api/controlFamilyAPI';

// const ControlFamilyList = ({ onSelectFamily }) => {
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [newFamily, setNewFamily] = useState({ name: '', description: '' });
//   const [editingFamily, setEditingFamily] = useState(null);
//   const [editFamily, setEditFamily] = useState({ name: '', description: '' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchControlFamilies();
//         console.log('Fetched control families:', response.data);
//         setControlFamilies(response.data);
//       } catch (error) {
//         console.error('Error fetching control families:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAddFamily = async () => {
//     try {
//       const response = await addControlFamily(newFamily);
//       console.log('Added new control family:', response.data);
//       setControlFamilies([...controlFamilies, response.data]);
//       setNewFamily({ name: '', description: '' });
//     } catch (error) {
//       console.error('Error adding control family:', error);
//     }
//   };

//   const handleEditFamily = async () => {
//     try {
//       await editControlFamily(editingFamily._id, editFamily);
//       setControlFamilies(controlFamilies.map(family =>
//         family._id === editingFamily._id ? { ...family, ...editFamily } : family
//       ));
//       setEditingFamily(null);
//     } catch (error) {
//       console.error('Error updating control family:', error);
//     }
//   };

//   const handleDeleteFamily = async (id) => {
//     try {
//       await deleteControlFamily(id);
//       setControlFamilies(controlFamilies.filter(family => family._id !== id));
//     } catch (error) {
//       console.error('Error deleting control family:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Control Families</h2>
//       <ul>
//         {controlFamilies.length > 0 ? (
//           controlFamilies.map((cf) => (
//             <li key={cf._id}>
//               <span onClick={() => onSelectFamily(cf._id)}>{cf.name}</span>
//               <button onClick={() => setEditingFamily(cf)}>Edit</button>
//               <button onClick={() => handleDeleteFamily(cf._id)}>Delete</button>
//             </li>
//           ))
//         ) : (
//           <li>No control families found.</li>
//         )}
//       </ul>
//       <div>
//         <h3>Add New Control Family</h3>
//         <input
//           type="text"
//           value={newFamily.name}
//           onChange={(e) => setNewFamily({ ...newFamily, name: e.target.value })}
//           placeholder="Name"
//         />
//         <input
//           type="text"
//           value={newFamily.description}
//           onChange={(e) => setNewFamily({ ...newFamily, description: e.target.value })}
//           placeholder="Description"
//         />
//         <button onClick={handleAddFamily}>Add</button>
//       </div>
//       {editingFamily && (
//         <div>
//           <h3>Edit Control Family</h3>
//           <input
//             type="text"
//             value={editFamily.name}
//             onChange={(e) => setEditFamily({ ...editFamily, name: e.target.value })}
//             placeholder="Name"
//           />
//           <input
//             type="text"
//             value={editFamily.description}
//             onChange={(e) => setEditFamily({ ...editFamily, description: e.target.value })}
//             placeholder="Description"
//           />
//           <button onClick={handleEditFamily}>Save</button>
//           <button onClick={() => setEditingFamily(null)}>Cancel</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ControlFamilyList;
