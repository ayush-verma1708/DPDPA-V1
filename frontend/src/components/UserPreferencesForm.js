import React, { useState, useEffect } from 'react';
import { getAllProductFamilies } from '../api/productFamilyApi';
import { addUserResponses } from '../api/userResonseApi';

const UserPreferencesForm = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [productFamilies, setProductFamilies] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch product families when the component mounts
  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const data = await getAllProductFamilies();
        setProductFamilies(data);

        // Set responses without default selections
        setResponses(
          data.map((family) => ({
            productFamilyId: family._id,
            selectedSoftware: '', // Set to empty string for no default selection
            otherSoftware: '',
          }))
        );
      } catch (err) {
        setError('Error fetching product families');
        console.error('Error:', err);
      }
    };
    fetchProductFamilies();
  }, []);

  // Handle change for response fields
  const handleResponseChange = (index, field, value) => {
    const updatedResponses = responses.map((response, i) =>
      i === index ? { ...response, [field]: value } : response
    );
    setResponses(updatedResponses);
  };

  // Handle change for other software input
  const handleOtherSoftwareChange = (index, value) => {
    handleResponseChange(index, 'otherSoftware', value);
  };

  // Handle form submission for adding responses
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading state to true and progress to 0
    setLoading(true);
    setProgress(0);

    try {
      // Map responses to ensure the structure matches expected API format
      const formattedResponses = responses.map((response) => ({
        productFamilyId: response.productFamilyId,
        selectedSoftware: response.selectedSoftware, // This is now an ObjectId
        otherSoftware: response.otherSoftware,
      }));

      // Simulate progress for the submission process
      let progressInterval = 0;
      const interval = setInterval(() => {
        if (progressInterval < 100) {
          setProgress(progressInterval);
          progressInterval += 10; // Increase progress by 10% every 200ms
        } else {
          clearInterval(interval); // Stop the progress bar when 100% is reached
        }
      }, 200);

      // Submit the responses
      await addUserResponses(companyId, formattedResponses);
      setError(null); // Clear any previous errors
      setIsSubmitted(true); // Set submission status to true
    } catch (err) {
      setError(err.message || 'Error adding responses');
      setIsSubmitted(false); // Reset submission status on error
    } finally {
      // Set loading state to false once the request is complete
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '0 auto', padding: '20px' }}>
      {isSubmitted && (
        <div
          style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}
        >
          Congratulations! Your preferences have been saved successfully.
        </div>
      )}

      {/* Show loading indicator if the form is being submitted */}
      {loading && (
        <div
          style={{ marginBottom: '20px', textAlign: 'center', color: '#444' }}
        >
          <p
            style={{
              fontSize: '18px',
              fontWeight: '500',
              margin: '0 0 10px 0',
            }}
          >
            Saving your preferences, please wait...
          </p>

          {/* Progress Bar Container */}
          <div
            style={{
              width: '80%',
              maxWidth: '400px',
              height: '20px',
              margin: '0 auto',
              backgroundColor: '#e0e0e0',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Progress Bar */}
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#0073e6',
                borderRadius: '10px 0 0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'width 0.3s ease-in-out',
              }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {Array.isArray(responses) && responses.length > 0 ? (
            responses.map((response, index) => {
              const productFamily = productFamilies.find(
                (family) => family._id === response.productFamilyId
              );

              return (
                <div
                  key={response.productFamilyId}
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                  }}
                >
                  <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
                    {productFamily ? productFamily.family_name : ''}
                  </p>
                  <div>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Selected Software:
                    </label>
                    <select
                      value={response.selectedSoftware}
                      onChange={(e) =>
                        handleResponseChange(
                          index,
                          'selectedSoftware',
                          e.target.value
                        )
                      }
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        marginTop: '4px',
                      }}
                    >
                      <option value=''>Select Software</option>
                      {productFamily &&
                        Array.isArray(productFamily.software_list) &&
                        productFamily.software_list.map((software) => (
                          <option
                            key={software._id}
                            value={software._id} // Using ObjectId as value
                          >
                            {software.software_name}
                          </option>
                        ))}
                      <option value='None'>
                        No Software Available for Implementation
                      </option>
                      <option value='Others'>Alternate Software</option>
                    </select>
                  </div>
                  {response.selectedSoftware === 'Others' && (
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ fontWeight: 'bold', color: '#333' }}>
                        Software Name:
                      </label>
                      <input
                        type='text'
                        value={response.otherSoftware}
                        onChange={(e) =>
                          handleOtherSoftwareChange(index, e.target.value)
                        }
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          marginTop: '4px',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No product families available.</p>
          )}
        </div>

        <button
          type='submit'
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#0073e6',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            alignSelf: 'center',
          }}
        >
          Save Preferences
        </button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default UserPreferencesForm;
