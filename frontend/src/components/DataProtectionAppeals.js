import React from 'react';

const DataProtectionAppeals = () => {
  const penalties = [
    {
      id: 1,
      description:
        'Breach in observing the obligation of Data Fiduciary to take reasonable security safeguards to prevent personal data breach under sub-section (5) of section 8.',
      penalty: 'May extend to ₹250 crore',
    },
    {
      id: 2,
      description:
        'Breach in observing the obligation to give the Board or affected Data Principal notice of a personal data breach under sub-section (6) of section 8.',
      penalty: 'May extend to ₹200 crore',
    },
    {
      id: 3,
      description:
        'Breach in observance of additional obligations in relation to children under section 9.',
      penalty: 'May extend to ₹200 crore',
    },
    {
      id: 4,
      description:
        'Breach in observance of additional obligations of Significant Data Fiduciary under section 10.',
      penalty: 'May extend to ₹150 crore',
    },
    {
      id: 5,
      description: 'Breach in observance of the duties under section 15.',
      penalty: 'May extend to ₹10,000',
    },
    {
      id: 6,
      description:
        'Breach of any term of voluntary undertaking accepted by the Board under section 32.',
      penalty:
        'Up to the applicable extent for the breach in respect of which proceedings under section 28 were instituted.',
    },
    {
      id: 7,
      description:
        'Breach of any other provision of this Act or the rules made thereunder.',
      penalty: 'May extend to ₹50 crore',
    },
  ];

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
          If the Board concludes after an inquiry that a person has breached
          provisions of this Act or its rules, it may impose a monetary penalty
          as specified below:
        </p>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  backgroundColor: '#f2f2f2',
                }}
              >
                Sl. No.
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  backgroundColor: '#f2f2f2',
                }}
              >
                Description of Breach
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  backgroundColor: '#f2f2f2',
                }}
              >
                Penalty
              </th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((item) => (
              <tr key={item.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {item.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {item.description}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    color: '#e74c3c',
                  }}
                >
                  {item.penalty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
