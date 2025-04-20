import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Tab, Tabs, TextField, Grid, Card, CardContent, Typography, IconButton, Avatar, Modal, CircularProgress, Fab, Tooltip } from '@mui/material';
import { Star, FileDownload, Search, AccountCircle, Add } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import './ResourceHub.css';

const ResourceHub = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Academic');
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', avatar: '', resourcesUploaded: 10 });

  // Infinite Scroll
  const [page, setPage] = useState(1);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/resourcehub/resources?page=${page}`);
      const data = await res.json();
      setResources(prevResources => [...prevResources, ...data]);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchResources();
  }, [page, fetchResources]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title) {
      toast.error("Please provide both title and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("category", category);

    try {
      const response = await fetch("http://localhost:5000/api/resourcehub/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Resource uploaded successfully!");
        setFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setCategory('Academic');
        fetchResources(); // Refresh list after upload
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed due to a server error.");
    }
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="resourcehub-container" onScroll={handleScroll}>
      <h1>Welcome to the Resource Hub</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Dark/Light Mode Toggle */}
      <div className="theme-toggle">
        <Tooltip title="Toggle Dark/Light Mode">
          <Button variant="contained" onClick={() => document.body.classList.toggle('dark-theme')}>🌙</Button>
        </Tooltip>
      </div>

      <Tabs value={category} onChange={(e, newValue) => setCategory(newValue)} centered>
        <Tab label="Academic" value="Academic" />
        <Tab label="Research" value="Research" />
        <Tab label="Projects" value="Projects" />
      </Tabs>

      <div className="upload-container">
        <h2>Upload Your Resources</h2>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Tags (comma-separated)"
          variant="outlined"
          fullWidth
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />
        <Button variant="contained" onClick={handleUpload}>Upload Resource</Button>
      </div>

      <div className="search-bar">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </div>

      {/* Resource List */}
      <div className="resource-list">
        {resources.map((res) => (
          <Card key={res.id} className="resource-card" raised>
            <CardContent>
              <div className="resource-header">
                <Avatar alt={res.uploaderName} src={res.uploaderAvatar} />
                <Typography variant="h6">{res.title}</Typography>
              </div>
              <Typography variant="body2" color="textSecondary">{res.description}</Typography>
              <Typography variant="body2" color="textSecondary">Tags: {res.tags}</Typography>
              <Typography variant="body2">Uploaded by: {res.uploaderName}</Typography>
              <div className="resource-footer">
                <Button startIcon={<FileDownload />} href={`http://localhost:5000/uploads/${res.file_name}`} download>
                  Download
                </Button>
                <Button startIcon={<Star />} onClick={() => toast.success('Rated')}>
                  Rate
                </Button>
              </div>
              <div className="resource-stats">
                <Typography variant="caption">Downloads: {res.downloadCount}</Typography>
              </div>
            </CardContent>
          </Card>
        ))}
        {loading && <CircularProgress />}
      </div>

      {/* FAB for Upload */}
      <Fab color="primary" aria-label="add" onClick={() => document.querySelector('.upload-container').scrollIntoView()}>
        <Add />
      </Fab>
    </div>
  );
};

export default ResourceHub;
