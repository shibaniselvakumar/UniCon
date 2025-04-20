const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your db.js to access the pool



// Route: GET /api/find-projects/projects
router.get('/projects', async (req, res) => {
  try {
    // Step 1: Get all projects
    const [projects] = await db.query('SELECT * FROM Projects');

    // Step 2: Get all roles associated with those projects
    const [roles] = await db.query('SELECT * FROM Roles');

    // Step 3: Attach roles to each project
    const projectsWithRoles = projects.map(project => {
        const rolesForProject = roles
          .filter(role => role.project_id === project.project_id)
          .map(role => ({
            role_name: role.role_name,
            num_teammates: role.num_teammates,
            num_teammates_total: role.num_teammates_total
          }));
      
        return {
          ...project,
          roles: rolesForProject
        };
      });
      

    res.json(projectsWithRoles); // Send response as JSON
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
});

router.post('/join', async (req, res) => {
    const { projectId, roleName, userId } = req.body;
  
    try {
      // Check available slots
      const [roleResult] = await db.query(
        'SELECT num_teammates FROM roles WHERE project_id = ? AND role_name = ?',
        [projectId, roleName]
      );
  
      if (roleResult.length === 0) return res.status(404).json({ error: 'Role not found' });
  
      const available = roleResult[0].num_teammates;
  
      if (available <= 0) return res.status(400).json({ error: 'No slots available' });
  
      // Decrease the number of teammates
      await db.query(
        'UPDATE roles SET num_teammates = num_teammates - 1 WHERE project_id = ? AND role_name = ?',
        [projectId, roleName]
      );
  
      // Insert user into project_members
      await db.query(
        'INSERT INTO project_members (project_id, user_id, role_name) VALUES (?, ?, ?)',
        [projectId, userId, roleName]
      );
  
      res.json({ message: 'Joined project successfully' });
  
    } catch (err) {
      console.error('Join project error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
module.exports = router;
