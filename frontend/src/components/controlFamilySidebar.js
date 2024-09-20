import React, { useEffect, useState, useMemo } from 'react';
import Tooltip from '@mui/material/Tooltip';

const ControlFamily = React.memo(({ family, isExpanded, onClick }) => (
  <div className={`control-family ${isExpanded ? 'expanded' : ''}`}>
    <Tooltip title={family.description} placement='right'>
      <div
        className={`control-family-header ${isExpanded ? 'expanded' : ''} ${
          isExpanded ? 'selected-family' : ''
        }`}
        onClick={onClick}
      >
        Chapter {family.variable_id}
      </div>
    </Tooltip>
  </div>
));

const ControlFamilySidebar = ({ controlFamilies }) => {
  const [expandedFamilyId, setExpandedFamilyId] = useState(null);

  useEffect(() => {
    if (controlFamilies.length > 0) {
      setExpandedFamilyId(controlFamilies[0]._id); // Default to the first control family
    }
  }, [controlFamilies]);

  const sortedFamilies = useMemo(
    () => controlFamilies.sort((a, b) => a.variable_id - b.variable_id),
    [controlFamilies]
  );

  const handleFamilyClick = (familyId) => {
    setExpandedFamilyId((prev) => (prev === familyId ? null : familyId));
  };

  return (
    <div className='control-family-sidebar'>
      {sortedFamilies.map((family) => (
        <ControlFamily
          key={family._id}
          family={family}
          isExpanded={expandedFamilyId === family._id}
          onClick={() => handleFamilyClick(family._id)}
        />
      ))}
    </div>
  );
};

export default ControlFamilySidebar;
