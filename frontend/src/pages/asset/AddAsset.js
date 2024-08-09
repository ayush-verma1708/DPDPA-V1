import React, { useState, useEffect } from 'react';
import { createAsset, updateAsset, getAssetById } from '../../api/assetApi';

const AddAsset = ({ match, history }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const assetId = match.params.id;

  useEffect(() => {
    if (assetId) {
      const fetchAsset = async () => {
        const asset = await getAssetById(assetId);
        setName(asset.name);
        setDesc(asset.desc);
      };
      fetchAsset();
    }
  }, [assetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assetData = { name, desc };

    if (assetId) {
      await updateAsset(assetId, assetData);
    } else {
      await createAsset(assetData);
    }

    history.push('/assets');
  };

  return (
    <div>
      <h1>{assetId ? 'Edit Asset' : 'Create Asset'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">{assetId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default AddAsset;
