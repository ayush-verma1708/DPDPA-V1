import React from 'react';

const DataProtectionAppeals = () => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        CHAPTER VIII: Penalties and Adjudication
      </h1>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>
          33. Penalties for Breach of Provisions
        </h3>
        <p>
          (1) If the Board concludes after an inquiry that a person has
          significantly breached the provisions of this Act or its rules, it
          may, after allowing the person an opportunity to be heard, impose a
          monetary penalty specified in the Schedule.
        </p>
        <p>
          (2) In determining the monetary penalty amount, the Board shall
          consider:
          <ul>
            <li>The nature, gravity, and duration of the breach.</li>
            <li>
              The type and nature of personal data affected by the breach.
            </li>
            <li>Whether the breach was repetitive in nature.</li>
            <li>
              If the person gained or avoided a loss as a result of the breach.
            </li>
            <li>
              The actions taken by the person to mitigate the breach’s impact,
              including timeliness and effectiveness.
            </li>
            <li>
              If the penalty is proportionate and effective for enforcing and
              deterring future breaches.
            </li>
            <li>The likely impact of the penalty on the person.</li>
          </ul>
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>34. Consolidation of Penalty Funds</h3>
        <p>
          All sums collected through penalties imposed by the Board under this
          Act shall be credited to the Consolidated Fund of India.
        </p>
      </section>
    </div>
  );
};

export default DataProtectionAppeals;
