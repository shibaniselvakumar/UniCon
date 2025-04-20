import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './FindProjects.css';


const FindProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredRole, setFilteredRole] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [roleToJoin, setRoleToJoin] = useState('');
  const navigate = useNavigate();

  const dummyUserId = 1; // Replace with actual logged-in user ID when available

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/find-projects/projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const roles = ['Frontend Developer', 'Backend Developer', 'UI Designer', 'ML Engineer', 'Content Writer'];

  const filteredProjects = filteredRole
    ? projects.filter(project =>
        project.roles.some(role =>
          role.role_name.toLowerCase().includes(filteredRole.toLowerCase())
        )
      )
    : projects;

  const handleJoinClick = (project, roleName) => {
    setSelectedProject(project);
    setRoleToJoin(roleName);
    setShowConfirmation(true);
  };

  const handleConfirmJoin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/find-projects/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject.project_id,
          roleName: roleToJoin,
          userId: dummyUserId
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setShowConfirmation(false);
        await fetchProjects(); // Refresh to reflect updated slots
        navigate('/dashboard');
      } else {
        alert(data.error || 'Failed to join project');
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Join error:', error);
      alert('Server error');
    }
  };

  const handleCancelJoin = () => {
    setShowConfirmation(false); 
  };

  return (
    <div className="find-projects-container">
      <header className="projects-header">Find Projects</header>
      <div className="projects-content">
        
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Filter by Role</h3>
          <ul>
            {roles.map(role => (
              <li key={role} onClick={() => setFilteredRole(role)}>
                {role}
              </li>
            ))}
            <li className="clear" onClick={() => setFilteredRole('')}>
              Clear Filters
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="projects-main">
          {filteredProjects.map(project => {
            const totalNeeded = project.roles.reduce((sum, role) => sum + role.num_teammates_total, 0);
            const filled = project.roles.reduce((sum, role) => sum + (role.num_teammates_total - role.num_teammates), 0);
            const percentageFilled = (filled / totalNeeded) * 100;

            return (
              <div key={project.project_id} className="project-card">
                <h2>{project.title}</h2>
                <p>{project.description}</p>

                <div className="team-roles">
                  {project.roles.map((role, i) => (
                    <span key={i} className="role-pill">
                      {role.role_name}: {role.num_teammates_total - role.num_teammates}/{role.num_teammates_total}
                    </span>
                  ))}
                </div>

                <div className="status-widget">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${percentageFilled}%` }}></div>
                  </div>
                  <small>{filled} of {totalNeeded} roles filled</small>
                </div>

                {project.roles.map((role, i) =>
                  role.num_teammates > 0 ? (
                    <button 
                      key={i}
                      className="join-btn"
                      onClick={() => handleJoinClick(project, role.role_name)}
                    >
                      Join as {role.role_name}
                    </button>
                  ) : null
                )}
              </div>
            );
          })}
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Are you sure you want to join this project?</h3>
            <p>Role: {roleToJoin}</p>
            <div className="modal-actions">
              <button onClick={handleConfirmJoin}>Confirm</button>
              <button onClick={handleCancelJoin}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindProjects;
