import React, { useState, useEffect } from 'react';
import UserPreferencesForm from './UserPreferencesForm';
import './UserResponsesManager.css';

const UserResponsesManager = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productFamilies, setProductFamilies] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='responses-container'>
      <div>Responses</div>
      : showForm ? (
      <UserPreferencesForm className='user-form' companyId={companyId} />) : (
      <div>No product families found.</div>)
    </div>
  );
};

export default UserResponsesManager;
