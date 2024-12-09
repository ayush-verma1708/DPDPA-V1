import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-6 mt-10 relative'>
      <div className='container mx-auto'>
        {/* Designed and Developed Section (Centered) */}
        <div className='text-center mb-4'>
          <p className='text-sm text-gray-400'>
            Designed and developed by{' '}
            <span className='font-semibold text-white'>
              Pink Unicorn Algorithm
            </span>
          </p>
        </div>
      </div>
      {/* Footer Bottom Section (Right Bottom) */}
      <div className='absolute bottom-0 right-0 mb-4 mr-6 text-sm font-light text-gray-300'>
        <p>&copy; 2024 Company Directory. All rights reserved.</p>
        <p className='text-xs text-gray-400 mt-2'>
          Version 1.0 - DPDPA Assessment
        </p>
      </div>
    </footer>
  );
};

export default Footer;

// import React from 'react';

// const Footer = () => {
//   return (
//     <footer className='bg-gray-800 text-white text-center py-6 mt-10'>
//       <div className='container mx-auto'>
//         {/* Main footer content */}
//         <p className='text-sm font-light'>
//           &copy; 2024 Company Directory. All rights reserved.
//         </p>
//         <p className='text-xs text-gray-400 mt-2'>
//           Version 1.0 - DPDPA Assessment
//         </p>
//         <div className='mt-4'>
//           <hr className='border-t border-gray-600' />
//         </div>
//         <p className='text-sm text-gray-400 mt-4'>
//           Designed and developed by{' '}
//           <span className='font-semibold text-white'>PECS</span>
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// // import React from 'react';

// // const Footer = () => {
// //   return (
// //     <footer className='bg-gray-800 text-white text-center py-6 mt-10'>
// //       <div className='container mx-auto'>
// //         <p className='text-sm font-light'>
// //           &copy; 2024 Company Directory. All rights reserved.
// //         </p>
// //         <p className='text-xs text-gray-400 mt-2'>
// //           Version 1.0 - DPDPA Assessment
// //         </p>
// //       </div>
// //       <div className='mt-4'>
// //         <hr className='border-t border-gray-600' />
// //       </div>
// //       <div className='mt-4'>
// //         <p className='text-sm text-gray-400'>
// //           Designed and developed by{' '}
// //           <span className='font-semibold text-white'>PECS</span>
// //         </p>
// //       </div>
// //     </footer>
// //   );
// // };

// // export default Footer;

// // // import React from 'react';

// // // const Footer = () => {
// // //   return (
// // //     <footer className="bg-gray-800 text-white text-center py-4">
// // //       <p>&copy; 2024 Company Directory</p>
// // //     </footer>
// // //   );
// // // };

// // // export default Footer;
