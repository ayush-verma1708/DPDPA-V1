import React from 'react';

const DataProtectionAct = () => {
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
        Digital Personal Data Protection Act, 2023
      </h1>
      <h2 style={{ textAlign: 'center', color: '#34495e' }}>
        CHAPTER VI: Powers, Functions and Procedure to be Followed by Board
      </h2>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>
          27. Powers and Functions of the Board
        </h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>
            <strong>(a)</strong> To direct urgent remedial or mitigation
            measures upon receiving intimation of a personal data breach and
            impose penalties as necessary.
          </li>
          <li>
            <strong>(b)</strong> To investigate complaints of personal data
            breaches and impose penalties.
          </li>
          <li>
            <strong>(c)</strong> To investigate complaints regarding Consent
            Managers and impose penalties.
          </li>
          <li>
            <strong>(d)</strong> To inquire into breaches by Consent Managers
            and impose penalties.
          </li>
          <li>
            <strong>(e)</strong> To address breaches related to intermediary
            provisions upon referral by the government.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>
          28. Procedure to be Followed by the Board
        </h3>
        <p>
          (1) The Board shall function as an independent digital office,
          managing complaints, hearings, and decisions online where feasible.
        </p>
        <p>
          (2) On receiving complaints, references, or directions, the Board may
          act in accordance with this Act and any rules established under it.
        </p>
        <p>
          (3) The Board must determine sufficient grounds to proceed with an
          inquiry, and may close proceedings if deemed unnecessary, recording
          its reasons in writing.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>Powers During Inquiry</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>
            <strong>(a)</strong> Summon and examine individuals under oath.
          </li>
          <li>
            <strong>(b)</strong> Require the production of documents and inspect
            data records.
          </li>
          <li>
            <strong>(c)</strong> Employ interim orders during inquiries as
            needed.
          </li>
          <li>
            <strong>(d)</strong> Close proceedings if complaints are determined
            to be frivolous or false.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default DataProtectionAct;
