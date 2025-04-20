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
  const [step, setStep] = useState(1);

  const validateForm = () => {
    const errors = [];
    if (step === 1) {
      if (!title) errors.push('Title is required');
      if (!description) errors.push('Description is required');
    }
    if (step === 2 && teammates.some(t => !t.role_name || !t.num_teammates)) {
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
      setStep(2);
    } else if (step === 2) {
      setStep(3);
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
    const updated = [...teammates];
    updated[index][name] = value;
    setTeammates(updated);
  };

  const addTeammateField = () => {
    setTeammates([...teammates, { role_name: '', num_teammates: '' }]);
  };

  const progressBarWidth = () => {
    if (step === 1) return '33%';
    if (step === 2) return '66%';
    return '100%';
  };

  return (
    <div className="post-project-container">
      <div className="background-stars"></div>
      <h2>🚀 Post Your Project</h2>

      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: progressBarWidth() }}></div>
      </div>

      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && (
          <div className="error-messages">
            {formErrors.map((err, i) => (
              <p key={i} className="error">{err}</p>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="form-group">
              <label htmlFor="title">✨ Project Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">📋 Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button className="fancy-btn" type="submit">Next ➡️</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>👥 Team Roles</h3>
            {teammates.map((tm, i) => (
              <div key={i} className="teammate-field">
                <input
                  type="text"
                  name="role_name"
                  placeholder="Role (e.g. Designer)"
                  value={tm.role_name}
                  onChange={(e) => handleTeammateChange(i, e)}
                  required
                />
                <input
                  type="number"
                  name="num_teammates"
                  placeholder="Teammates Needed"
                  value={tm.num_teammates}
                  onChange={(e) => handleTeammateChange(i, e)}
                  required
                />
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addTeammateField}>+ Add Role</button>
            <button className="fancy-btn" type="submit">Next ➡️</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>📦 Confirm Your Details</h3>
            <div className="confirmation-details">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Description:</strong> {description}</p>
              <h4>Team Roles</h4>
              <ul>
                {teammates.map((tm, i) => (
                  <li key={i}>{tm.role_name} - {tm.num_teammates} teammates</li>
                ))}
              </ul>
            </div>
            <button type="button" onClick={() => setStep(2)}>🔙 Go Back</button>
            <button className="fancy-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : '🚀 Submit Project'}
            </button>
          </div>
        )}
      </form>

      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default PostProject;
