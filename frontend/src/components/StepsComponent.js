// added header
import React, { useState, useEffect, useReducer, useMemo } from 'react';
import '../styles/StepsComponent.css'

const initialState = {
  currentStep: 0,
  completedSteps: JSON.parse(localStorage.getItem('completedSteps')) || [],
};

const stepsReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'COMPLETE_STEP':
      const updatedCompleted = state.completedSteps.includes(action.index)
        ? state.completedSteps.filter((step) => step !== action.index)
        : [...state.completedSteps, action.index];
      localStorage.setItem('completedSteps', JSON.stringify(updatedCompleted));
      return { ...state, completedSteps: updatedCompleted, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
    case 'SET_STEP':
      return { ...state, currentStep: action.index };
    case 'RESET':
      localStorage.removeItem('completedSteps');
      return { currentStep: 0, completedSteps: [] };
    default:
      return state;
  }
};

const StepsComponent = ({ onClose }) => {
  const [state, dispatch] = useReducer(stepsReducer, initialState);
  const [showTooltip, setShowTooltip] = useState(false);

  const steps = useMemo(() => [
    {
      title: 'Step 1',
      heading: 'User Creation',
      description: 'Create new users and assign them permissions.',
      imageUrl: 'assets/1.png',
      linkUrl: '/user-creation',
    },
    {
      title: 'Step 2',
      heading: 'Asset Management',
      description: 'Declare and manage company assets efficiently.',
      imageUrl: 'assets/2.png',
      linkUrl: '/asset-management',
    },
    {
      title: 'Step 3',
      heading: 'List of Actions',
      description: 'Access control families and complete actions to upload evidence.',
      imageUrl: 'assets/3.png',
      linkUrl: '/list-of-actions',
    },
    {
      title: 'Step 4',
      heading: 'Alert and Recommendation',
      description: 'View tasks to maintain the industry standard score and get recommendations.',
      imageUrl: 'assets/4.png',
      linkUrl: '/alert-management',
    },
  ], []);

  useEffect(() => {
    if (state.completedSteps.length === steps.length) {
      const firstIncompleteStep = steps.findIndex((_, index) => !state.completedSteps.includes(index));
      if (firstIncompleteStep !== -1) {
        dispatch({ type: 'SET_STEP', index: firstIncompleteStep });
      } else {
        onClose();
      }
    }
  }, [state.completedSteps, steps, onClose]);

  useEffect(() => {
    const firstIncompleteStep = steps.findIndex((_, index) => !state.completedSteps.includes(index));
    if (firstIncompleteStep !== -1) {
      dispatch({ type: 'SET_STEP', index: firstIncompleteStep });
    }
  }, [steps, state.completedSteps]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      dispatch({ type: 'NEXT_STEP', stepsLength: steps.length });
    } else if (event.key === 'ArrowLeft') {
      dispatch({ type: 'PREV_STEP' });
    }
  };

  const handleStepCompletion = (index) => {
    dispatch({ type: 'COMPLETE_STEP', index, stepsLength: steps.length });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const isStepSkipped = (index) => {
    return index < state.currentStep && !state.completedSteps.includes(index);
  };

  return (
    <div className="steps-container" onKeyDown={handleKeyDown} tabIndex="0">
      <button className="close-button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h1 className="steps-heading">Steps Panel</h1>
      <div className="steps-header">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${state.completedSteps.includes(index) ? 'completed' : ''} ${isStepSkipped(index) ? 'skipped' : ''}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button onClick={() => dispatch({ type: 'SET_STEP', index })} aria-label={`Go to ${step.title}`}>
              {index + 1}
            </button>
            {showTooltip && <div className="tooltip">{step.title}</div>}
          </div>
        ))}
      </div>
      <div className="steps-content">
        <div className="steps-image">
          <a href={steps[state.currentStep].linkUrl}>
            <img src={steps[state.currentStep].imageUrl} alt={`${steps[state.currentStep].title} visual`} />
          </a>
        </div>
        <div className="steps-text">
          <h2>{steps[state.currentStep].title}</h2>
          <h3>{steps[state.currentStep].heading}</h3>
          <p>{steps[state.currentStep].description}</p>
          {state.completedSteps.includes(state.currentStep) ? (
            <div className="step-completed">
              <h2>Completed</h2>
              <button onClick={() => handleStepCompletion(state.currentStep)}>Undo</button>
            </div>
          ) : (
            <button className="complete-button" onClick={() => handleStepCompletion(state.currentStep)}>
              Mark as Complete
            </button>
          )}
        </div>
      </div>
      <div className="steps-navigation">
        <button onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={state.currentStep === 0}>
          Previous
        </button>
        <button onClick={() => dispatch({ type: 'NEXT_STEP', stepsLength: steps.length })} disabled={state.currentStep === steps.length - 1}>
          Next
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(state.completedSteps.length / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepsComponent;


// // On completing it returns to step undone

// import React, { useState, useEffect, useReducer, useMemo } from 'react';
// import './StepsComponent.css';

// const initialState = {
//   currentStep: 0,
//   completedSteps: JSON.parse(localStorage.getItem('completedSteps')) || [],
// };

// const stepsReducer = (state, action) => {
//   switch (action.type) {
//     case 'NEXT_STEP':
//       return { ...state, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
//     case 'PREV_STEP':
//       return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
//     case 'COMPLETE_STEP':
//       const updatedCompleted = state.completedSteps.includes(action.index)
//         ? state.completedSteps.filter((step) => step !== action.index)
//         : [...state.completedSteps, action.index];
//       localStorage.setItem('completedSteps', JSON.stringify(updatedCompleted));
//       return { ...state, completedSteps: updatedCompleted, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
//     case 'SET_STEP':
//       return { ...state, currentStep: action.index };
//     case 'RESET':
//       localStorage.removeItem('completedSteps');
//       return { currentStep: 0, completedSteps: [] };
//     default:
//       return state;
//   }
// };

// const StepsComponent = ({ onClose }) => {
//   const [state, dispatch] = useReducer(stepsReducer, initialState);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const steps = useMemo(() => [
//     {
//       title: 'Step 1',
//       heading: 'User Creation',
//       description: 'Create new users and assign them permissions.',
//       imageUrl: 'assets/1.png',
//       linkUrl: '/user-creation',
//     },
//     {
//       title: 'Step 2',
//       heading: 'Asset Management',
//       description: 'Declare and manage company assets efficiently.',
//       imageUrl: 'assets/2.png',
//       linkUrl: '/asset-management',
//     },
//     {
//       title: 'Step 3',
//       heading: 'List of Actions',
//       description: 'Access control families and complete actions to upload evidence.',
//       imageUrl: 'assets/3.png',
//       linkUrl: '/list-of-actions',
//     },
//     {
//       title: 'Step 4',
//       heading: 'Alert and Recommendation',
//       description: 'View tasks to maintain the industry standard score and get recommendations.',
//       imageUrl: 'assets/4.png',
//       linkUrl: '/alert-management',
//     },
//   ], []);

//   useEffect(() => {
//     if (state.completedSteps.length === steps.length) {
//       const firstIncompleteStep = steps.findIndex((_, index) => !state.completedSteps.includes(index));
//       if (firstIncompleteStep !== -1) {
//         dispatch({ type: 'SET_STEP', index: firstIncompleteStep });
//       } else {
//         onClose();
//       }
//     }
//   }, [state.completedSteps, steps, onClose]);

//   useEffect(() => {
//     const firstIncompleteStep = steps.findIndex((_, index) => !state.completedSteps.includes(index));
//     if (firstIncompleteStep !== -1) {
//       dispatch({ type: 'SET_STEP', index: firstIncompleteStep });
//     }
//   }, [steps, state.completedSteps]);

//   const handleKeyDown = (event) => {
//     if (event.key === 'ArrowRight') {
//       dispatch({ type: 'NEXT_STEP', stepsLength: steps.length });
//     } else if (event.key === 'ArrowLeft') {
//       dispatch({ type: 'PREV_STEP' });
//     }
//   };

//   const handleStepCompletion = (index) => {
//     dispatch({ type: 'COMPLETE_STEP', index, stepsLength: steps.length });
//   };

//   const handleReset = () => {
//     dispatch({ type: 'RESET' });
//   };

//   const isStepSkipped = (index) => {
//     return index < state.currentStep && !state.completedSteps.includes(index);
//   };

//   return (
//     <div className="steps-container" onKeyDown={handleKeyDown} tabIndex="0">
//       <button className="close-button" onClick={onClose} aria-label="Close">
//         ×
//       </button>
//       <div className="steps-header">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className={`step-indicator ${state.completedSteps.includes(index) ? 'completed' : ''} ${isStepSkipped(index) ? 'skipped' : ''}`}
//             onMouseEnter={() => setShowTooltip(true)}
//             onMouseLeave={() => setShowTooltip(false)}
//           >
//             <button onClick={() => dispatch({ type: 'SET_STEP', index })} aria-label={`Go to ${step.title}`}>
//               {index + 1}
//             </button>
//             {showTooltip && <div className="tooltip">{step.title}</div>}
//           </div>
//         ))}
//       </div>
//       <div className="steps-content">
//         <div className="steps-image">
//           <a href={steps[state.currentStep].linkUrl}>
//             <img src={steps[state.currentStep].imageUrl} alt={`${steps[state.currentStep].title} visual`} />
//           </a>
//         </div>
//         <div className="steps-text">
//           <h2>{steps[state.currentStep].title}</h2>
//           <h3>{steps[state.currentStep].heading}</h3>
//           <p>{steps[state.currentStep].description}</p>
//           {state.completedSteps.includes(state.currentStep) ? (
//             <div className="step-completed">
//               <h2>Completed</h2>
//               <button onClick={() => handleStepCompletion(state.currentStep)}>Undo</button>
//             </div>
//           ) : (
//             <button className="complete-button" onClick={() => handleStepCompletion(state.currentStep)}>
//               Mark as Complete
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="steps-navigation">
//         <button onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={state.currentStep === 0}>
//           Previous
//         </button>
//         <button onClick={() => dispatch({ type: 'NEXT_STEP', stepsLength: steps.length })} disabled={state.currentStep === steps.length - 1}>
//           Next
//         </button>
//         <button onClick={handleReset}>
//           Reset
//         </button>
//       </div>
//       <div className="progress-bar">
//         <div
//           className="progress"
//           style={{ width: `${(state.completedSteps.length / steps.length) * 100}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default StepsComponent;

// // steps to return to 1 stage on reset 

// // import React, { useState, useEffect, useReducer } from 'react';
// // import './StepsComponent.css';

// // const initialState = {
// //   currentStep: 0,
// //   completedSteps: JSON.parse(localStorage.getItem('completedSteps')) || [],
// // };

// // const stepsReducer = (state, action) => {
// //   switch (action.type) {
// //     case 'NEXT_STEP':
// //       return { ...state, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
// //     case 'PREV_STEP':
// //       return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
// //     case 'COMPLETE_STEP':
// //       const updatedCompleted = state.completedSteps.includes(action.index)
// //         ? state.completedSteps.filter((step) => step !== action.index)
// //         : [...state.completedSteps, action.index];
// //       localStorage.setItem('completedSteps', JSON.stringify(updatedCompleted));
// //       return { ...state, completedSteps: updatedCompleted, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
// //     case 'SET_STEP':
// //       return { ...state, currentStep: action.index };
// //     case 'RESET':
// //       localStorage.removeItem('completedSteps');
// //       return { currentStep: 0, completedSteps: [] };
// //     default:
// //       return state;
// //   }
// // };

// // const StepsComponent = ({ onClose }) => {
// //   const [state, dispatch] = useReducer(stepsReducer, initialState);
// //   const [showTooltip, setShowTooltip] = useState(false);

// //   const steps = [
// //     {
// //       title: 'Step 1',
// //       heading: 'User Creation',
// //       description: 'Create new users and assign them permissions.',
// //       imageUrl: 'assets/1.png',
// //       linkUrl: '/user-creation',
// //     },
// //     {
// //       title: 'Step 2',
// //       heading: 'Asset Management',
// //       description: 'Declare and manage company assets efficiently.',
// //       imageUrl: 'assets/2.png',
// //       linkUrl: '/asset-management',
// //     },
// //     {
// //       title: 'Step 3',
// //       heading: 'List of Actions',
// //       description: 'Access control families and complete actions to upload evidence.',
// //       imageUrl: 'assets/3.png',
// //       linkUrl: '/list-of-actions',
// //     },
// //     {
// //       title: 'Step 4',
// //       heading: 'Alert and Recommendation',
// //       description: 'View tasks to maintain the industry standard score and get recommendations.',
// //       imageUrl: 'assets/4.png',
// //       linkUrl: '/alert-management',
// //     },
// //   ];

// //   useEffect(() => {
// //     if (state.completedSteps.length === steps.length) {
// //       const firstIncompleteStep = steps.findIndex((_, index) => !state.completedSteps.includes(index));
// //       if (firstIncompleteStep !== -1) {
// //         dispatch({ type: 'SET_STEP', index: firstIncompleteStep });
// //       } else {
// //         onClose();
// //       }
// //     }
// //   }, [state.completedSteps, steps.length, onClose]);

// //   const handleKeyDown = (event) => {
// //     if (event.key === 'ArrowRight') {
// //       dispatch({ type: 'NEXT_STEP', stepsLength: steps.length });
// //     } else if (event.key === 'ArrowLeft') {
// //       dispatch({ type: 'PREV_STEP' });
// //     }
// //   };

// //   const handleStepCompletion = (index) => {
// //     dispatch({ type: 'COMPLETE_STEP', index, stepsLength: steps.length });
// //   };

// //   const handleReset = () => {
// //     dispatch({ type: 'RESET' });
// //   };

// //   const isStepSkipped = (index) => {
// //     return index < state.currentStep && !state.completedSteps.includes(index);
// //   };

// //   return (
// //     <div className="steps-container" onKeyDown={handleKeyDown} tabIndex="0">
// //       <button className="close-button" onClick={onClose} aria-label="Close">
// //         ×
// //       </button>
// //       <div className="steps-header">
// //         {steps.map((step, index) => (
// //           <div
// //             key={index}
// //             className={`step-indicator ${state.completedSteps.includes(index) ? 'completed' : ''} ${isStepSkipped(index) ? 'skipped' : ''}`}
// //             onMouseEnter={() => setShowTooltip(true)}
// //             onMouseLeave={() => setShowTooltip(false)}
// //           >
// //             <button onClick={() => dispatch({ type: 'SET_STEP', index })} aria-label={`Go to ${step.title}`}>
// //               {index + 1}
// //             </button>
// //             {showTooltip && <div className="tooltip">{step.title}</div>}
// //           </div>
// //         ))}
// //       </div>
// //       <div className="steps-content">
// //         <div className="steps-image">
// //           <a href={steps[state.currentStep].linkUrl}>
// //             <img src={steps[state.currentStep].imageUrl} alt={`${steps[state.currentStep].title} visual`} />
// //           </a>
// //         </div>
// //         <div className="steps-text">
// //           <h2>{steps[state.currentStep].title}</h2>
// //           <h3>{steps[state.currentStep].heading}</h3>
// //           <p>{steps[state.currentStep].description}</p>
// //           {state.completedSteps.includes(state.currentStep) ? (
// //             <div className="step-completed">
// //               <h2>Completed</h2>
// //               <button onClick={() => handleStepCompletion(state.currentStep)}>Undo</button>
// //             </div>
// //           ) : (
// //             <button className="complete-button" onClick={() => handleStepCompletion(state.currentStep)}>
// //               Mark as Complete
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //       <div className="steps-navigation">
// //         <button onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={state.currentStep === 0}>
// //           Previous
// //         </button>
// //         <button onClick={() => dispatch({ type: 'NEXT_STEP', stepsLength: steps.length })} disabled={state.currentStep === steps.length - 1}>
// //           Next
// //         </button>
// //         <button onClick={handleReset}>
// //           Reset
// //         </button>
// //       </div>
// //       <div className="progress-bar">
// //         <div
// //           className="progress"
// //           style={{ width: `${(state.completedSteps.length / steps.length) * 100}%` }}
// //         ></div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StepsComponent;


// // // Step can be reached from panel above 

// // // import React, { useState, useEffect, useReducer } from 'react';
// // // import './StepsComponent.css';

// // // const initialState = {
// // //   currentStep: 0,
// // //   completedSteps: JSON.parse(localStorage.getItem('completedSteps')) || [],
// // // };

// // // const stepsReducer = (state, action) => {
// // //   switch (action.type) {
// // //     case 'NEXT_STEP':
// // //       return { ...state, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
// // //     case 'PREV_STEP':
// // //       return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
// // //     case 'COMPLETE_STEP':
// // //       const updatedCompleted = state.completedSteps.includes(action.index)
// // //         ? state.completedSteps.filter((step) => step !== action.index)
// // //         : [...state.completedSteps, action.index];
// // //       localStorage.setItem('completedSteps', JSON.stringify(updatedCompleted));
// // //       return { ...state, completedSteps: updatedCompleted, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
// // //     case 'SET_STEP':
// // //       return { ...state, currentStep: action.index };
// // //     case 'RESET':
// // //       localStorage.removeItem('completedSteps');
// // //       return { currentStep: 0, completedSteps: [] };
// // //     default:
// // //       return state;
// // //   }
// // // };

// // // const StepsComponent = ({ onClose }) => {
// // //   const [state, dispatch] = useReducer(stepsReducer, initialState);
// // //   const [showTooltip, setShowTooltip] = useState(false);

// // //   const steps = [
// // //     {
// // //       title: 'Step 1',
// // //       heading: 'User Creation',
// // //       description: 'Create new users and assign them permissions.',
// // //       imageUrl: 'assets/1.png',
// // //       linkUrl: '/user-creation',
// // //     },
// // //     {
// // //       title: 'Step 2',
// // //       heading: 'Asset Management',
// // //       description: 'Declare and manage company assets efficiently.',
// // //       imageUrl: 'assets/2.png',
// // //       linkUrl: '/asset-management',
// // //     },
// // //     {
// // //       title: 'Step 3',
// // //       heading: 'List of Actions',
// // //       description: 'Access control families and complete actions to upload evidence.',
// // //       imageUrl: 'assets/3.png',
// // //       linkUrl: '/list-of-actions',
// // //     },
// // //     {
// // //       title: 'Step 4',
// // //       heading: 'Alert and Recommendation',
// // //       description: 'View tasks to maintain the industry standard score and get recommendations.',
// // //       imageUrl: 'assets/4.png',
// // //       linkUrl: '/alert-management',
// // //     },
// // //   ];

// // //   useEffect(() => {
// // //     if (state.completedSteps.length === steps.length) {
// // //       onClose();
// // //     }
// // //   }, [state.completedSteps, steps.length, onClose]);

// // //   const handleKeyDown = (event) => {
// // //     if (event.key === 'ArrowRight') {
// // //       dispatch({ type: 'NEXT_STEP', stepsLength: steps.length });
// // //     } else if (event.key === 'ArrowLeft') {
// // //       dispatch({ type: 'PREV_STEP' });
// // //     }
// // //   };

// // //   const handleStepCompletion = (index) => {
// // //     dispatch({ type: 'COMPLETE_STEP', index, stepsLength: steps.length });
// // //   };

// // //   const handleReset = () => {
// // //     dispatch({ type: 'RESET' });
// // //   };

// // //   const isStepSkipped = (index) => {
// // //     return index < state.currentStep && !state.completedSteps.includes(index);
// // //   };

// // //   return (
// // //     <div className="steps-container" onKeyDown={handleKeyDown} tabIndex="0">
// // //       <button className="close-button" onClick={onClose} aria-label="Close">
// // //         ×
// // //       </button>
// // //       <div className="steps-header">
// // //         {steps.map((step, index) => (
// // //           <div
// // //             key={index}
// // //             className={`step-indicator ${state.completedSteps.includes(index) ? 'completed' : ''} ${isStepSkipped(index) ? 'skipped' : ''}`}
// // //             onMouseEnter={() => setShowTooltip(true)}
// // //             onMouseLeave={() => setShowTooltip(false)}
// // //           >
// // //             <button onClick={() => dispatch({ type: 'SET_STEP', index })} aria-label={`Go to ${step.title}`}>
// // //               {index + 1}
// // //             </button>
// // //             {showTooltip && <div className="tooltip">{step.title}</div>}
// // //           </div>
// // //         ))}
// // //       </div>
// // //       <div className="steps-content">
// // //         <div className="steps-image">
// // //           <a href={steps[state.currentStep].linkUrl}>
// // //             <img src={steps[state.currentStep].imageUrl} alt={`${steps[state.currentStep].title} visual`} />
// // //           </a>
// // //         </div>
// // //         <div className="steps-text">
// // //           <h2>{steps[state.currentStep].title}</h2>
// // //           <h3>{steps[state.currentStep].heading}</h3>
// // //           <p>{steps[state.currentStep].description}</p>
// // //           {state.completedSteps.includes(state.currentStep) ? (
// // //             <div className="step-completed">
// // //               <h2>Completed</h2>
// // //               <button onClick={() => handleStepCompletion(state.currentStep)}>Undo</button>
// // //             </div>
// // //           ) : (
// // //             <button className="complete-button" onClick={() => handleStepCompletion(state.currentStep)}>
// // //               Mark as Complete
// // //             </button>
// // //           )}
// // //         </div>
// // //       </div>
// // //       <div className="steps-navigation">
// // //         <button onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={state.currentStep === 0}>
// // //           Previous
// // //         </button>
// // //         <button onClick={() => dispatch({ type: 'NEXT_STEP', stepsLength: steps.length })} disabled={state.currentStep === steps.length - 1}>
// // //           Next
// // //         </button>
// // //         <button onClick={handleReset}>
// // //           Reset
// // //         </button>
// // //       </div>
// // //       <div className="progress-bar">
// // //         <div
// // //           className="progress"
// // //           style={{ width: `${(state.completedSteps.length / steps.length) * 100}%` }}
// // //         ></div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default StepsComponent;


// // // step indicator in black 

// // // // import React, { useState, useEffect, useReducer } from 'react';
// // // // import './StepsComponent.css';

// // // // const initialState = {
// // // //   currentStep: 0,
// // // //   completedSteps: JSON.parse(localStorage.getItem('completedSteps')) || [],
// // // // };

// // // // const stepsReducer = (state, action) => {
// // // //   switch (action.type) {
// // // //     case 'NEXT_STEP':
// // // //       return { ...state, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
// // // //     case 'PREV_STEP':
// // // //       return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
// // // //     case 'COMPLETE_STEP':
// // // //       const updatedCompleted = state.completedSteps.includes(action.index)
// // // //         ? state.completedSteps.filter((step) => step !== action.index)
// // // //         : [...state.completedSteps, action.index];
// // // //       localStorage.setItem('completedSteps', JSON.stringify(updatedCompleted));
// // // //       return { ...state, completedSteps: updatedCompleted, currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1) };
// // // //     case 'RESET':
// // // //       localStorage.removeItem('completedSteps');
// // // //       return { currentStep: 0, completedSteps: [] };
// // // //     default:
// // // //       return state;
// // // //   }
// // // // };

// // // // const StepsComponent = ({ onClose }) => {
// // // //   const [state, dispatch] = useReducer(stepsReducer, initialState);
// // // //   const [showTooltip, setShowTooltip] = useState(false);

// // // //   const steps = [
// // // //     {
// // // //       title: 'Step 1',
// // // //       heading: 'User Creation',
// // // //       description: 'Create new users and assign them permissions.',
// // // //       imageUrl: 'assets/1.png',
// // // //       linkUrl: '/user-creation',
// // // //     },
// // // //     {
// // // //       title: 'Step 2',
// // // //       heading: 'Asset Management',
// // // //       description: 'Declare and manage company assets efficiently.',
// // // //       imageUrl: 'assets/2.png',
// // // //       linkUrl: '/asset-management',
// // // //     },
// // // //     {
// // // //       title: 'Step 3',
// // // //       heading: 'List of Actions',
// // // //       description: 'Access control families and complete actions to upload evidence.',
// // // //       imageUrl: 'assets/3.png',
// // // //       linkUrl: '/list-of-actions',
// // // //     },
// // // //     {
// // // //       title: 'Step 4',
// // // //       heading: 'Alert and Recommendation',
// // // //       description: 'View tasks to maintain the industry standard score and get recommendations.',
// // // //       imageUrl: 'assets/4.png',
// // // //       linkUrl: '/alert-management',
// // // //     },
// // // //   ];

// // // //   useEffect(() => {
// // // //     if (state.completedSteps.length === steps.length) {
// // // //       onClose();
// // // //     }
// // // //   }, [state.completedSteps, steps.length, onClose]);

// // // //   const handleKeyDown = (event) => {
// // // //     if (event.key === 'ArrowRight') {
// // // //       dispatch({ type: 'NEXT_STEP', stepsLength: steps.length });
// // // //     } else if (event.key === 'ArrowLeft') {
// // // //       dispatch({ type: 'PREV_STEP' });
// // // //     }
// // // //   };

// // // //   const handleStepCompletion = (index) => {
// // // //     dispatch({ type: 'COMPLETE_STEP', index, stepsLength: steps.length });
// // // //   };

// // // //   const handleReset = () => {
// // // //     dispatch({ type: 'RESET' });
// // // //   };

// // // //   const isStepSkipped = (index) => {
// // // //     return index < state.currentStep && !state.completedSteps.includes(index);
// // // //   };

// // // //   return (
// // // //     <div className="steps-container" onKeyDown={handleKeyDown} tabIndex="0">
// // // //       <button className="close-button" onClick={onClose} aria-label="Close">
// // // //         ×
// // // //       </button>
// // // //       <div className="steps-header">
// // // //         {steps.map((step, index) => (
// // // //           <div
// // // //             key={index}
// // // //             className={`step-indicator ${state.completedSteps.includes(index) ? 'completed' : ''} ${isStepSkipped(index) ? 'skipped' : ''}`}
// // // //             onMouseEnter={() => setShowTooltip(true)}
// // // //             onMouseLeave={() => setShowTooltip(false)}
// // // //           >
// // // //             <button onClick={() => dispatch({ type: 'SET_STEP', index })} aria-label={`Go to ${step.title}`}>
// // // //               {index + 1}
// // // //             </button>
// // // //             {showTooltip && <div className="tooltip">{step.title}</div>}
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //       <div className="steps-content">
// // // //         <div className="steps-image">
// // // //           <a href={steps[state.currentStep].linkUrl}>
// // // //             <img src={steps[state.currentStep].imageUrl} alt={`${steps[state.currentStep].title} visual`} />
// // // //           </a>
// // // //         </div>
// // // //         <div className="steps-text">
// // // //           <h2>{steps[state.currentStep].title}</h2>
// // // //           <h3>{steps[state.currentStep].heading}</h3>
// // // //           <p>{steps[state.currentStep].description}</p>
// // // //           {state.completedSteps.includes(state.currentStep) ? (
// // // //             <div className="step-completed">
// // // //               <h2>Completed</h2>
// // // //               <button onClick={() => handleStepCompletion(state.currentStep)}>Undo</button>
// // // //             </div>
// // // //           ) : (
// // // //             <button className="complete-button" onClick={() => handleStepCompletion(state.currentStep)}>
// // // //               Mark as Complete
// // // //             </button>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //       <div className="steps-navigation">
// // // //         <button onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={state.currentStep === 0}>
// // // //           Previous
// // // //         </button>
// // // //         <button onClick={() => dispatch({ type: 'NEXT_STEP', stepsLength: steps.length })} disabled={state.currentStep === steps.length - 1}>
// // // //           Next
// // // //         </button>
// // // //         <button onClick={handleReset}>
// // // //           Reset
// // // //         </button>
// // // //       </div>
// // // //       <div className="progress-bar">
// // // //         <div
// // // //           className="progress"
// // // //           style={{ width: `${(state.completedSteps.length / steps.length) * 100}%` }}
// // // //         ></div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default StepsComponent;
