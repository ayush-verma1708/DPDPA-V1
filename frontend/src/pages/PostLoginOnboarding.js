import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneNumberForm from '../components/PhoneNumberForm';
import CompanyDetailsForm from '../components/CompanyDetailsForm';
import { checkFormCompletion, updateFormCompletionStatus } from '../api/userApi';
import { fetchCurrentUser } from '../api/userApi'; // Assume this gets the current logged-in user
import { createCompanyForm } from '../api/companyFormApi';

const PostLoginOnboarding = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      try {
        const user = await fetchCurrentUser(
          window.localStorage.getItem('token')
        ); // Get the current logged-in user

        setUserId(user.data._id);

        const { hasCompletedCompanyForm } = await checkFormCompletion(user.data._id);
        
        if (hasCompletedCompanyForm) {
          navigate('/dashboard'); // Redirect to main application if form is completed
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login if there's an error fetching user data
      }
    };

    fetchCompletionStatus();
  }, [navigate]);

  const handleNext = (phoneNumber, otp) => {
    setPhoneNumber(phoneNumber);
    setOtp(otp);
    setStep(2);
  };

  const handleFormSubmit = async (formData) => {
    try {
      await createCompanyForm({ ...formData, phoneNumber, otp });
      await updateFormCompletionStatus(userId);
      navigate('/dashboard'); // Redirect to main application
    } catch (error) {
      console.error('Error submitting company form:', error);
      alert('Failed to submit the form');
    }
  };

  return (
    <div className='w-full flex items-center justify-center h-[calc(100vh-(3.5rem+5.5rem))]'>
      {step === 1 && <PhoneNumberForm onNext={handleNext} />}
      {step === 2 && <CompanyDetailsForm phoneNumber={phoneNumber} otp={otp} onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default PostLoginOnboarding;
