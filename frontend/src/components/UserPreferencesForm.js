import React, { useState, useEffect } from 'react';
import {
  getAllProductFamilies,
  addUserResponse,
} from '../api/productFamilyApi';
import './UserPreferencesForm.css'; // Importing the CSS file for styles

const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
  const [productFamilies, setProductFamilies] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const families = await getAllProductFamilies();
        setProductFamilies(families);
      } catch (err) {
        setError('Failed to fetch product families.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductFamilies();
  }, []);

  const handleInputChange = (familyId, field, value) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [familyId]: {
        ...prevPreferences[familyId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Submit preferences for each family
      for (const familyId in preferences) {
        const userResponse = {
          companyId,
          productFamily: familyId,
          selectedSoftware: preferences[familyId]?.selectedSoftware,
          otherSoftware: preferences[familyId]?.otherSoftware,
        };
        await addUserResponse(userResponse); // Call the API to save the response
      }
      onFormSubmit(); // Call the function passed as prop after successful submission
    } catch (err) {
      setError('Failed to submit preferences.');
    }
  };

  if (loading) return <div className='loading'>Loading...</div>;
  if (error) return <div className='error'>{error}</div>;

  return (
    <form onSubmit={handleSubmit} className='preferences-form'>
      <h2>User Preferences Form</h2>
      <div className='families-grid'>
        {productFamilies.map((family) => (
          <div key={family._id} className='family-tile'>
            <h3>{family.family_name}</h3>
            <label>
              Selected Software:
              <input
                type='text'
                placeholder='Enter selected software'
                onChange={(e) =>
                  handleInputChange(
                    family._id,
                    'selectedSoftware',
                    e.target.value
                  )
                }
              />
            </label>
            <label>
              Other Software:
              <input
                type='text'
                placeholder='Enter other software (if any)'
                onChange={(e) =>
                  handleInputChange(family._id, 'otherSoftware', e.target.value)
                }
              />
            </label>
          </div>
        ))}
      </div>
      <button type='submit'>Submit Preferences</button>
    </form>
  );
};

export default UserPreferencesForm;
