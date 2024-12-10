import React, { useState, useEffect, useReducer, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../styles/StepsComponent.css';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  LinearProgress,
} from '@mui/material';

const initialState = {
  currentStep: 0,
  completedSteps: JSON.parse(localStorage.getItem('completedSteps')) || [],
  step5Tasks: JSON.parse(localStorage.getItem('step5Tasks')) || [
    false,
    false,
    false,
  ], // Add tasks state
};

const stepsReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1),
      };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'COMPLETE_STEP':
      const updatedCompleted = state.completedSteps.includes(action.index)
        ? state.completedSteps.filter((step) => step !== action.index)
        : [...state.completedSteps, action.index];
      localStorage.setItem('completedSteps', JSON.stringify(updatedCompleted));
      return {
        ...state,
        completedSteps: updatedCompleted,
        currentStep: Math.min(state.currentStep + 1, action.stepsLength - 1),
      };
    case 'SET_STEP':
      return { ...state, currentStep: action.index };
    case 'RESET':
      localStorage.removeItem('completedSteps');
      localStorage.removeItem('step5Tasks');
      return {
        currentStep: 0,
        completedSteps: [],
        step5Tasks: [false, false, false],
      };
    case 'TOGGLE_TASK':
      const updatedTasks = state.step5Tasks.map((task, idx) =>
        idx === action.index ? !task : task
      );
      localStorage.setItem('step5Tasks', JSON.stringify(updatedTasks));

      // Check if all tasks are completed
      const allTasksCompleted = updatedTasks.every(Boolean);
      if (allTasksCompleted) {
        // Mark Step 5 as completed if all tasks are completed
        return {
          ...state,
          step5Tasks: updatedTasks,
          completedSteps: [...new Set([...state.completedSteps, 4])], // Mark Step 5 as completed
        };
      } else {
        // Remove Step 5 from completed steps if any task is unchecked
        const updatedCompletedSteps = state.completedSteps.filter(
          (step) => step !== 4
        );
        return {
          ...state,
          step5Tasks: updatedTasks,
          completedSteps: updatedCompletedSteps, // Remove Step 5 from completed steps
        };
      }
    default:
      return state;
  }
};

const StepsComponent = ({ onClose }) => {
  const [state, dispatch] = useReducer(stepsReducer, initialState);
  const [showTooltip, setShowTooltip] = useState(false);

  const steps = useMemo(
    () => [
      {
        title: 'Step 1',
        heading: 'Stake Holder Mapping',
        description: 'Manage stakeholders and assign them roles.',
        imageUrl: 'assets/1.png',
        linkUrl: '/user-creation',
        icon: '👤',
      },
      {
        title: 'Step 2',
        heading: 'Asset Management',
        description: 'Declare and manage company assets efficiently.',
        imageUrl: 'assets/2.png',
        linkUrl: '/asset-management',
        icon: '📦',
      },
      {
        title: 'Step 3',
        heading: 'Product Declaration',
        description: 'Open the product family page to declare products.',
        imageUrl: 'assets/3.png',
        linkUrl: '/product-family',
        icon: '📝',
      },
    ],
    []
  );

  useEffect(() => {
    if (state.completedSteps.length === steps.length) {
      const firstIncompleteStep = steps.findIndex(
        (_, index) => !state.completedSteps.includes(index)
      );
      if (firstIncompleteStep !== -1) {
        dispatch({ type: 'SET_STEP', index: firstIncompleteStep });
      } else {
        onClose();
      }
    }
  }, [state.completedSteps, steps, onClose]);

  useEffect(() => {
    const firstIncompleteStep = steps.findIndex(
      (_, index) => !state.completedSteps.includes(index)
    );
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

  const handleTaskToggle = (index) => {
    dispatch({ type: 'TOGGLE_TASK', index });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const isStepSkipped = (index) => {
    return index < state.currentStep && !state.completedSteps.includes(index);
  };

  return (
    <div
      className='container mt-4 p-3'
      onKeyDown={handleKeyDown}
      tabIndex='0'
      style={{ maxWidth: '800px' }}
    >
      <button
        className='btn-close'
        onClick={onClose}
        aria-label='Close'
      ></button>
      <h1 className='text-center mb-4'>Onboarding Panel</h1>
      <div className='progress mb-4'>
        <div
          className='progress-bar'
          role='progressbar'
          style={{
            width: `${(state.completedSteps.length / steps.length) * 100}%`,
          }}
        ></div>
      </div>
      <div className='d-flex justify-content-between mb-4'>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${
              state.completedSteps.includes(index) ? 'completed' : ''
            } ${isStepSkipped(index) ? 'skipped' : ''}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className='step-heading'>{step.heading}</div>
            <button
              className='btn btn-outline-primary'
              onClick={() => dispatch({ type: 'SET_STEP', index })}
              aria-label={`Go to ${step.title}`}
            >
              {step.icon} {index + 1}
            </button>
            {showTooltip && <div className='tooltip'>{step.title}</div>}
          </div>
        ))}
      </div>

      <div className='steps-content'>
        {steps[state.currentStep].imageUrl ? (
          <div className='steps-image mb-4'>
            <a href={steps[state.currentStep].linkUrl}>
              <img
                src={steps[state.currentStep].imageUrl}
                alt={`${steps[state.currentStep].title} visual`}
                className='img-fluid'
              />
            </a>
          </div>
        ) : null}
        <div className='steps-text'>
          <h2>{steps[state.currentStep].title}</h2>
          <h3>{steps[state.currentStep].heading}</h3>
          <p>{steps[state.currentStep].description}</p>

          {state.currentStep === 4 ? (
            <div className='step5-tasks'>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6'>Final Tasks:</Typography>
                <Typography variant='body2'>
                  Completed {state.step5Tasks.filter(Boolean).length} of{' '}
                  {steps[4].tasks.length} tasks
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {steps[4].tasks.map((task, idx) => (
                  <FormControlLabel
                    key={idx}
                    control={
                      <Checkbox
                        checked={state.step5Tasks[idx]}
                        onChange={() => handleTaskToggle(idx)}
                        color='primary'
                      />
                    }
                    label={
                      <Typography
                        variant='body1'
                        sx={{
                          textDecoration: state.step5Tasks[idx],
                        }}
                      >
                        {task}
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                ))}
              </Box>
            </div>
          ) : state.completedSteps.includes(state.currentStep) ? (
            <div className='step-completed'>
              <h2>Completed</h2>
              <button
                className='btn btn-warning'
                onClick={() => handleStepCompletion(state.currentStep)}
              >
                Undo
              </button>
            </div>
          ) : (
            <button
              className='btn btn-success'
              onClick={() => handleStepCompletion(state.currentStep)}
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>

      <div className='d-flex justify-content-between mt-4'>
        <button
          className='btn btn-secondary'
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          disabled={state.currentStep === 0}
        >
          Previous
        </button>
        <button
          className='btn btn-primary'
          onClick={() =>
            dispatch({ type: 'NEXT_STEP', stepsLength: steps.length })
          }
          disabled={state.currentStep === steps.length - 1}
        >
          Next
        </button>
        <button className='btn btn-danger' onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default StepsComponent;
