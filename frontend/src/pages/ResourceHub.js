import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResourceHub.css';

const ResourceHub = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploaderId, setUploaderId] = useState(1); // You can set it dynamically later

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
    formData.append("uploaderId", uploaderId);

    console.log("Sending formData:", {
      file,
      title,
      description,
      tags,
      uploaderId,
    });

    try {
      const response = await fetch("http://localhost:5000/api/resourcehub/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Resource uploaded successfully!");
        // Reset fields
        setFile(null);
        setTitle('');
        setDescription('');
        setTags('');
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed due to a server error.");
    }
  };

  return (
    <div className="resourcehub-container">
      <h1>Welcome to the Resource Hub</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="upload-container">
        <h2>Upload Your Resources</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="text-input"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for the resource"
          className="description-input"
        />

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma-separated)"
          className="text-input"
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />

        <button onClick={handleUpload} className="upload-btn">
          Upload Resource
        </button>
      </div>

      <div className="resource-list">
        <h2>Available Resources</h2>
        {/* You can map over fetched resources here */}
        <div className="resource-card">
          <h3>Title of Resource</h3>
          <p>Short Description</p>
          <button>Download</button>
        </div>
      </div>
    </div>
  );
};

export default ResourceHub;
