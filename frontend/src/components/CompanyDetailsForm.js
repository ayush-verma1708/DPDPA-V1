import React, { useState, useEffect } from 'react';
import { createCompanyForm } from '../api/companyFormApi';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../api/userApi';

const CompanyDetailsForm = ({ phoneNumber, otp }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [industryType, setIndustryType] = useState(''); // Default value set here
  const [customIndustryType, setCustomIndustryType] = useState('');
  const [numberOfEmployees, setNumberOfEmployees] = useState(''); // Default value set here
  const [userId, setUserId] = useState('');

  // Load user ID from the token when the component mounts
  useEffect(() => {
    (async () => {
      const { data } = await fetchCurrentUser(
        window.localStorage.getItem('token')
      );
      setUserId(data._id); // Set userId from API response
    })();
  }, []);

  const navigate = useNavigate();

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = {
  //     userId,
  //     phoneNumber,
  //     organizationName,
  //     industryType,
  //     customIndustryType,
  //     numberOfEmployees,
  //     otp,
  //   };

  //   try {
  //     // Attempt to create the company form
  //     const createdForm = await createCompanyForm(data);
  //     console.log('Company form created successfully:', createdForm);

  //     // Assuming form creation is successful, update user form completion status
  //     // You can call updateFormCompletionStatus here (if required)
  //     console.log('Form completion status updated successfully');

  //     // Navigate to dashboard after success
  //     // navigate('/dashboard');
  //   } catch (error) {
  //     console.error(
  //       'Error during form submission process:',
  //       error.message || error
  //     );
  //     // You can add UI feedback or logging here to inform the user of the error
  //     alert('Failed to submit the form');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      userId,
      phoneNumber,
      companyDetails: {
        organizationName,
        industryType,
        customIndustryType:
          industryType === 'Others' ? customIndustryType : undefined, // Send customIndustryType only if "Others"
        numberOfEmployees,
      },
      otp, // Ensure otp is passed if required
    };

    try {
      // Attempt to create the company form
      const createdForm = await createCompanyForm(formData, userId);
      console.log('Company form created successfully:', createdForm);

      alert('Company form submitted successfully');

      navigate('/dashboard'); // Redirect to dashboard or another page
    } catch (error) {
      console.error('Error during form submission process:', error);
      alert('Failed to submit the form');
    }
  };

  return (
    <form
      className='max-w-1/2 w-1/2 flex flex-col gap-3'
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor='organizationName'>Organization Name:</label>
        <input
          type='text'
          id='organizationName'
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
        />
      </div>
      <div className='w-full flex justify-between items-center gap-3'>
        <label htmlFor='industryType'>Industry Type:</label>
        <select
          id='industryType'
          value={industryType}
          onChange={(e) => setIndustryType(e.target.value)}
          required
          className='w-full py-2'
        >
          <option value=''>Select...</option>
          <option value='Healthcare'>Healthcare</option>
          <option value='Finance'>Finance</option>
          <option value='Education'>Education</option>
          <option value='Others'>Others</option>
        </select>
      </div>
      {industryType === 'Others' && (
        <div>
          <label htmlFor='customIndustryType'>Custom Industry Type:</label>
          <input
            type='text'
            id='customIndustryType'
            value={customIndustryType}
            onChange={(e) => setCustomIndustryType(e.target.value)}
          />
        </div>
      )}
      <div className='w-full flex justify-between items-center gap-3'>
        <label htmlFor='numberOfEmployees'>Number of Employees:</label>
        <select
          id='numberOfEmployees'
          value={numberOfEmployees}
          onChange={(e) => setNumberOfEmployees(e.target.value)}
          required
          className='w-full py-2'
        >
          <option value=''>Select...</option>
          <option value='0-10'>0-10</option>
          <option value='10-100'>10-100</option>
          <option value='100-10000'>100-10000</option>
          <option value='Others'>Others</option>
        </select>
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default CompanyDetailsForm;

// import React, { useState, useEffect } from 'react';
// import { createCompanyForm } from '../api/companyFormApi';
// import { useNavigate } from 'react-router-dom';
// import { fetchCurrentUser } from '../api/userApi';

// const CompanyDetailsForm = ({ phoneNumber, otp }) => {
//   const [organizationName, setOrganizationName] = useState('');
//   const [industryType, setIndustryType] = useState('');
//   const [customIndustryType, setCustomIndustryType] = useState('');
//   const [numberOfEmployees, setNumberOfEmployees] = useState('');
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     (async () => {
//       const { data } = await fetchCurrentUser(
//         window.localStorage.getItem('token')
//       );
//       setUserId(data._id);
//     })();
//   }, []);

//   const navigate = useNavigate();

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const data = {
//   //     userId,
//   //     phoneNumber,
//   //     organizationName,
//   //     industryType,
//   //     customIndustryType,
//   //     numberOfEmployees,
//   //     otp,
//   //   };

//   //   try {
//   //     // Create company form entry
//   //     await updateFormCompletionStatus(userId);
//   //     await createCompanyForm(data);
//   //     alert('Company form submitted successfully');
//   //     navigate('/dashboard'); // Redirect to a success page or another component
//   //   } catch (error) {
//   //     console.error('Error submitting company form:', error);
//   //     alert('Failed to submit the form');
//   //   }
//   // };

//   const handleSubmit = async (formData, phoneNumber, otp, userId) => {
//     console.log(formData, phoneNumber, otp, userId);
//     // try {
//     //   // Attempt to create the company form
//     //   const createdForm = await createCompanyForm({
//     //     ...formData,
//     //     phoneNumber,
//     //     otp,
//     //     userId,
//     //   });
//     //   console.log('Company form created successfully:', createdForm);

//     //   console.log('Form completion status updated successfully:');
//     // } catch (error) {
//     //   console.error(
//     //     'Error during form submission process:',
//     //     error.message || error
//     //   );
//     //   // You can add UI feedback or logging here to inform the user of the error
//     // }
//   };

//   return (
//     <form
//       className='max-w-1/2 w-1/2 flex flex-col gap-3'
//       onSubmit={handleSubmit}
//     >
//       <div>
//         <label htmlFor='organizationName'>Organization Name:</label>
//         <input
//           type='text'
//           id='organizationName'
//           value={organizationName}
//           onChange={(e) => setOrganizationName(e.target.value)}
//           required
//         />
//       </div>
//       <div className='w-full flex justify-between items-center gap-3'>
//         <label htmlFor='industryType'>Industry Type:</label>
//         <select
//           id='industryType'
//           value={industryType}
//           onChange={(e) => setIndustryType(e.target.value)}
//           required
//           className='w-full py-2'
//         >
//           <option value=''>Select...</option>
//           <option value='Healthcare'>Healthcare</option>
//           <option value='Finance'>Finance</option>
//           <option value='Education'>Education</option>
//           <option value='Others'>Others</option>
//         </select>
//       </div>
//       {industryType === 'Others' && (
//         <div>
//           <label htmlFor='customIndustryType'>Custom Industry Type:</label>
//           <input
//             type='text'
//             id='customIndustryType'
//             value={customIndustryType}
//             onChange={(e) => setCustomIndustryType(e.target.value)}
//           />
//         </div>
//       )}
//       <div className='w-full flex justify-between items-center gap-3'>
//         <label htmlFor='numberOfEmployees'>Number of Employees:</label>
//         <select
//           id='numberOfEmployees'
//           value={numberOfEmployees}
//           onChange={(e) => setNumberOfEmployees(e.target.value)}
//           required
//           className='w-full py-2'
//         >
//           <option value=''>Select...</option>
//           <option value='0-10'>0-10</option>
//           <option value='10-100'>10-100</option>
//           <option value='100-10000'>100-10000</option>
//           <option value='Others'>Others</option>
//         </select>
//       </div>
//       <button type='submit'>Submit</button>
//     </form>
//   );
// };

// export default CompanyDetailsForm;
