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
        CHAPTER I: PRELIMINARY
      </h2>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>1. Short Title and Commencement</h3>
        <p>
          (1) This Act may be called the Digital Personal Data Protection Act,
          2023.
          <br />
          (2) It shall come into force on such date as the Central Government
          may, by notification in the Official Gazette, appoint and different
          dates may be appointed for different provisions of this Act and any
          reference in any such provision to the commencement of this Act shall
          be construed as a reference to the coming into force of that
          provision.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>2. Definitions</h3>
        <p>In this Act, unless the context otherwise requires—</p>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>
            (a) “Appellate Tribunal” means the Telecom Disputes Settlement and
            Appellate Tribunal established under section 14 of the Telecom
            Regulatory Authority of India Act, 1997;
          </li>
          <li>
            (b) “automated” means any digital process capable of operating
            automatically in response to instructions given or otherwise for the
            purpose of processing data;
          </li>
          <li>
            (c) “Board” means the Data Protection Board of India established by
            the Central Government under section 18;
          </li>
          {/* Add more definitions as needed */}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2980b9' }}>3. Application of the Act</h3>
        <p>
          Subject to the provisions of this Act, it shall—
          <br />
          (a) apply to the processing of digital personal data within the
          territory of India where the personal data is collected—
          <br />
          (i) in digital form; or
          <br />
          (ii) in non-digital form and digitised subsequently;
        </p>
        <p>
          (b) also apply to processing of digital personal data outside the
          territory of India, if such processing is in connection with any
          activity related to offering of goods or services to Data Principals
          within the territory of India;
        </p>
        <p>
          (c) not apply to—
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>
              (i) personal data processed by an individual for any personal or
              domestic purpose; and
            </li>
            <li>
              (ii) personal data that is made or caused to be made publicly
              available by—
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>
                  (A) the Data Principal to whom such personal data relates; or
                </li>
                <li>
                  (B) any other person who is under an obligation under any law
                  for the time being in force in India to make such personal
                  data publicly available.
                </li>
              </ul>
            </li>
          </ul>
        </p>

        <h4 style={{ color: '#2980b9' }}>Illustration</h4>
        <p>
          X, an individual, while blogging her views, has publicly made
          available her personal data on social media. In such a case, the
          provisions of this Act shall not apply.
        </p>
      </section>
    </div>
  );
};

export default DataProtectionAct;

// import React from 'react';

// const DataProtectionAct = () => {
//   return (
//     <div
//       style={{
//         padding: '20px',
//         lineHeight: '1.6',
//         fontFamily: 'Arial, sans-serif',
//       }}
//     >
//       <h1>CHAPTER I</h1>
//       <h2>PRELIMINARY</h2>

//       <section>
//         <h3>1. Short Title and Commencement</h3>
//         <p>
//           (1) This Act may be called the Digital Personal Data Protection Act,
//           2023.
//           <br />
//           (2) It shall come into force on such date as the Central Government
//           may, by notification in the Official Gazette, appoint and different
//           dates may be appointed for different provisions of this Act and any
//           reference in any such provision to the commencement of this Act shall
//           be construed as a reference to the coming into force of that
//           provision.
//         </p>
//       </section>

//       <section>
//         <h3>2. Definitions</h3>
//         <p>In this Act, unless the context otherwise requires—</p>
//         <ul>
//           <li>
//             (a) “Appellate Tribunal” means the Telecom Disputes Settlement and
//             Appellate Tribunal established under section 14 of the Telecom
//             Regulatory Authority of India Act, 1997;
//           </li>
//           <li>
//             (b) “automated” means any digital process capable of operating
//             automatically in response to instructions given or otherwise for the
//             purpose of processing data;
//           </li>
//           <li>
//             (c) “Board” means the Data Protection Board of India established by
//             the Central Government under section 18;
//           </li>
//           {/* You can keep adding other definitions in a similar way */}
//         </ul>
//       </section>

//       <section>
//         <h3>3. Application of the Act</h3>
//         <p>
//           Subject to the provisions of this Act, it shall— <br />
//           (a) apply to the processing of digital personal data within the
//           territory of India where the personal data is collected—
//           <br />
//           (i) in digital form; or
//           <br />
//           (ii) in non-digital form and digitised subsequently;
//         </p>
//         <p>
//           (b) also apply to processing of digital personal data outside the
//           territory of India, if such processing is in connection with any
//           activity related to offering of goods or services to Data Principals
//           within the territory of India;
//         </p>
//         <p>
//           (c) not apply to—
//           <ul>
//             <li>
//               (i) personal data processed by an individual for any personal or
//               domestic purpose; and
//             </li>
//             <li>
//               (ii) personal data that is made or caused to be made publicly
//               available by—
//               <ul>
//                 <li>
//                   (A) the Data Principal to whom such personal data relates; or
//                 </li>
//                 <li>
//                   (B) any other person who is under an obligation under any law
//                   for the time being in force in India to make such personal
//                   data publicly available.
//                 </li>
//               </ul>
//             </li>
//           </ul>
//         </p>

//         <h4>Illustration</h4>
//         <p>
//           X, an individual, while blogging her views, has publicly made
//           available her personal data on social media. In such a case, the
//           provisions of this Act shall not apply.
//         </p>
//       </section>
//     </div>
//   );
// };

// export default DataProtectionAct;
