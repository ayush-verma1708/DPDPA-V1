import React, { useState, useEffect } from 'react';
import UserPreferencesForm from './UserPreferencesForm';
import { getUserResponsesByCompanyId } from '../api/userResonseApi'; // Corrected import path
import './UserResponsesManager.css';

const UserResponsesManager = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState(null);

  // Function to fetch user responses
  const fetchUserResponses = async () => {
    try {
      const userResponses = await getUserResponsesByCompanyId(companyId);
      console.log('Fetched user responses:', userResponses); // Debug log
      setResponses(userResponses);
    } catch (err) {
      setError(err.message || 'Error fetching responses');
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  // Fetch user responses on component mount
  useEffect(() => {
    fetchUserResponses(); // Call the fetch function
  }, [companyId]);

  // Call this function on form submission to check for existing responses
  const handleSubmitSuccess = () => {
    fetchUserResponses(); // Re-fetch user responses after submission
  };

  return (
    <div className='responses-container'>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responses.length > 0 ? (
        <div>
          <h2>Your Previous Responses</h2>
          <ul>
            {responses.map((response) => (
              <li key={response.productFamilyId}>
                <strong>{response.productFamily.family_name}: </strong>
                {response.selectedSoftware || 'None of these'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>No Responses Found</h2>
        </div>
      )}

      {/* Show the form if there are no responses */}
      {responses.length === 0 && (
        <UserPreferencesForm
          className='user-form'
          companyId={companyId}
          onSubmitSuccess={handleSubmitSuccess} // Pass success handler
        />
      )}
    </div>
  );
};

export default UserResponsesManager;
