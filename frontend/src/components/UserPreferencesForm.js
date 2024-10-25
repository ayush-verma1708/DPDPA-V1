import React, { useState, useEffect } from 'react';
import {
  getAllProductFamilies,
  addUserResponse,
} from '../api/productFamilyApi';
import './UserPreferencesForm.css';

const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
  const [productFamilies, setProductFamilies] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Options for selecting software
  const softwareOptions = [
    'Microsoft Tools',
    'Other Software',
    'None of these',
    'Others',
  ];

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
      for (const familyId in preferences) {
        const userResponse = {
          companyId,
          productFamily: familyId,
          selectedSoftware: preferences[familyId]?.selectedSoftware,
          otherSoftware: preferences[familyId]?.otherSoftware,
        };
        await addUserResponse(userResponse);
      }
      onFormSubmit(); // Callback after successful submission
    } catch (err) {
      setError('Failed to submit preferences.');
    }
  };

  if (loading) return <div className='loading'>Loading...</div>;
  if (error) return <div className='error'>{error}</div>;

  return (
    <form onSubmit={handleSubmit} className='preferences-form'>
      <div className='families-grid'>
        {productFamilies.map((family) => (
          <div key={family._id} className='family-tile'>
            <h3>{family.family_name}</h3>
            <div className='options-grid'>
              {softwareOptions.map((option) => (
                <label key={option} className='checkbox-option'>
                  <input
                    type='radio'
                    name={`software-${family._id}`}
                    value={option}
                    checked={
                      preferences[family._id]?.selectedSoftware === option
                    }
                    onChange={() =>
                      handleInputChange(family._id, 'selectedSoftware', option)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
            {preferences[family._id]?.selectedSoftware === 'Others' && (
              <label className='other-software'>
                <strong>Specify Other Software:</strong>
                <input
                  type='text'
                  placeholder='Enter other software'
                  value={preferences[family._id]?.otherSoftware || ''}
                  onChange={(e) =>
                    handleInputChange(
                      family._id,
                      'otherSoftware',
                      e.target.value
                    )
                  }
                />
              </label>
            )}
          </div>
        ))}
      </div>
      <button type='submit'>Submit Preferences</button>
    </form>
  );
};

export default UserPreferencesForm;
