import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
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
  const user = JSON.parse(localStorage.getItem('user') || '{}'); 
  const [page, setPage] = useState(1);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/resourcehub/resources?page=${page}`);
      const data = await res.json();
      setResources(prev => {
        const newRes = data.filter(d => !prev.some(p => p.resource_id === d.resource_id));
        return [...prev, ...newRes];
      });
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) setPage(prev => prev + 1);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !title) return toast.error('Please provide both title and file.');
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("uploaderId", user.student_id);

    try {
      const response = await fetch("http://localhost:5000/api/resourcehub/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Resource uploaded!");
        setFile(null); setTitle(''); setDescription(''); setTags(''); setCategory('Academic');
        fetchResources();
      } else toast.error(data.message || "Upload failed.");
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("Upload failed due to a server error.");
    }
  };

  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="resourcehub-container" onScroll={handleScroll}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="hub-title">🛰️ Resource Hub</h1>

      <div className="upload-form">
        <h2>Upload Resource</h2>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="🔍 Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="resource-cards">
        {filteredResources.map(res => (
          <div key={res.resource_id} className="resource-card">
            <h3>{res.title}</h3>
            <p>{res.description}</p>
            <p className="tags">🎯 {res.tags}</p>
            <p className="uploader">🧑‍🚀 Uploaded by: {user.name}</p>
            <div className="card-actions">
              <a href={`http://localhost:5000/uploads/${res.file_name}`} download className="btn download">⬇️ Download</a>
              
            </div>
   
          </div>
        ))}
        {loading && <p className="loading-text">Loading...</p>}
      </div>
    </div>
  );
};

export default ResourceHub;
