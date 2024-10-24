import React, { useState, useEffect } from 'react';
import {
  getUserResponsesByCompanyId,
  addUserResponse,
} from '../api/productFamilyApi';
import { getAllProductFamilies } from '../api/productFamilyApi';
import UserPreferencesForm from './UserPreferencesForm'; // Import the UserPreferencesForm component
import './UserResponsesManager.css';

const UserResponsesManager = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productFamilies, setProductFamilies] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  const fetchUserResponses = async () => {
    try {
      const response = await getUserResponsesByCompanyId(companyId);
      setResponses(response.data);
    } catch (err) {
      // Check if the error is a 404 error
      if (err.response && err.response.status === 404) {
        setShowForm(true); // Show the form if no responses found
      } else {
        setError('Failed to fetch user responses.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const families = await getAllProductFamilies();
        setProductFamilies(families);
      } catch (err) {
        setError('Failed to fetch product families.');
      }
    };

    fetchProductFamilies();
    fetchUserResponses();
  }, [companyId]);

  const handleFormSubmit = () => {
    // Fetch user responses again after the form is submitted
    fetchUserResponses();
    setShowForm(false); // Hide the form after submission
  };

  if (loading) return <div className='loading'>Loading...</div>;
  if (error) return <div className='error'>{error}</div>;

  return (
    <div className='responses-container'>
      {responses.length > 0 ? (
        <div className='responses-list'>
          {productFamilies.map((family) => {
            // Find the corresponding user response for the current product family
            const userResponse = responses.find(
              (response) => response.productFamily?._id === family._id
            );

            return (
              <div className='response-card' key={family._id}>
                <h3>{family.family_name}</h3>
                {userResponse ? (
                  <>
                    <strong>Selected Software:</strong>{' '}
                    {userResponse.selectedSoftware} <br />
                    {userResponse.otherSoftware && (
                      <>
                        <strong>Other Software:</strong>{' '}
                        {userResponse.otherSoftware} <br />
                      </>
                    )}
                  </>
                ) : (
                  <div>No user preferences for this family.</div>
                )}
              </div>
            );
          })}
        </div>
      ) : showForm ? ( // Display the form if no responses and the form state is true
        <div>
          <UserPreferencesForm
            className='user-form'
            companyId={companyId}
            onFormSubmit={handleFormSubmit}
          />
        </div>
      ) : (
        <div>No product families found.</div>
      )}
    </div>
  );
};

export default UserResponsesManager;
