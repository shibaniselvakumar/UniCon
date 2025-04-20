import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostProject.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostProject = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teammates, setTeammates] = useState([{ role_name: '', num_teammates: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [step, setStep] = useState(1);  // Track the current step

  const validateForm = () => {
    const errors = [];
    if (step === 1) {
      if (!title) errors.push('Title is required');
      if (!description) errors.push('Description is required');
    }
    if (step === 2 && teammates.some(teammate => !teammate.role_name || !teammate.num_teammates)) {
      errors.push('All role and teammate fields must be filled');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    if (step === 1) {
      setStep(2);  // Move to the next step (team roles)
    } else if (step === 2) {
      setStep(3);  // Move to the confirmation step
    } else {
      setIsSubmitting(true);

      try {
        const response = await axios.post('http://localhost:5000/api/projects/create', {
          title,
          description,
          teammates
        });

        if (response.status === 201) {
          toast.success('Project Submitted Successfully!');
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        console.error('Error creating project:', error);
        setIsSubmitting(false);
        setFormErrors(['Server error. Please try again later.']);
        toast.error('Server error. Please try again later.');
      }
    }
  };

  const handleTeammateChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeammates = [...teammates];
    updatedTeammates[index][name] = value;
    setTeammates(updatedTeammates);
  };

  const addTeammateField = () => {
    setTeammates([...teammates, { role_name: '', num_teammates: '' }]);
  };

  const progressBarWidth = (step) => {
    if (step === 1) return '33%';
    if (step === 2) return '66%';
    if (step === 3) return '100%';
    return '0%';
  };

  return (
    
    <div className="post-project-container">
      <h2>Post Your Project</h2>

      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: progressBarWidth(step) }}></div>

      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && (
          <div className="error-messages">
            {formErrors.map((error, index) => (
              <p key={index} className="error">{error}</p>
            ))}
          </div>
        )}

        {/* Step 1: Project Details */}
        {step === 1 && (
          <div>
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit">Next</button>
          </div>
        )}

        {/* Step 2: Team Roles */}
        {step === 2 && (
          <div>
            <h3>Team Roles</h3>
            {teammates.map((teammate, index) => (
              <div key={index} className="teammate-field">
                <input
                  type="text"
                  name="role_name"
                  placeholder="Role Name"
                  value={teammate.role_name}
                  onChange={(e) => handleTeammateChange(index, e)}
                  required
                />
                <input
                  type="number"
                  name="num_teammates"
                  placeholder="Number of Teammates"
                  value={teammate.num_teammates}
                  onChange={(e) => handleTeammateChange(index, e)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addTeammateField}>Add Role</button>
            <button type="submit">Next</button>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div>
            <h3>Confirm Your Details</h3>
            <div className="confirmation-details">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Description:</strong> {description}</p>
              <h4>Team Roles</h4>
              <ul>
                {teammates.map((teammate, index) => (
                  <li key={index}>{teammate.role_name} - {teammate.num_teammates} teammates</li>
                ))}
              </ul>
            </div>
            <button type="button" onClick={() => setStep(2)}>Go Back</button>
            <button type="submit">{isSubmitting ? 'Submitting...' : 'Submit Project'}</button>
          </div>
        )}
      </form>

      {/* Toast Container */}
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default PostProject;
