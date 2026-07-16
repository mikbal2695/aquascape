"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("/paludarium.png");
  const [customImageMode, setCustomImageMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.url);
      setUploadedUrl(data.url);
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, author, image, tags, content }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage({ type: "success", text: "Article uploaded successfully!" });
      // Reset form
      setTitle("");
      setDescription("");
      setAuthor("");
      setTags("");
      setContent("");
      setUploadedUrl("");
      setImage("/paludarium.png");
      setCustomImageMode(false);
      
      router.refresh(); // Refresh page to show new post in the list
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="calculator-widget">
      {message && (
        <div 
          style={{
            padding: '12px',
            borderRadius: '4px',
            backgroundColor: message.type === "success" ? '#d4edda' : '#f8d7da',
            color: message.type === "success" ? '#155724' : '#721c24',
            border: message.type === "success" ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            fontSize: '0.9rem',
            marginBottom: '15px'
          }}
        >
          {message.text}
        </div>
      )}

      <div className="calc-input-group">
        <label>Article Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          placeholder="e.g., Setting up my Iwagumi"
        />
      </div>

      <div className="calc-input-group">
        <label>Description</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          placeholder="Short summary for the home feed excerpt"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '15px' }}>
        <div className="calc-input-group">
          <label>Author Name</label>
          <input 
            type="text" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            placeholder="e.g., AmanoDisciple"
          />
        </div>
        <div className="calc-input-group">
          <label>Cover Source</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
            <button 
              type="button"
              onClick={() => setCustomImageMode(false)}
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                backgroundColor: !customImageMode ? 'var(--brand-blue)' : '#f8f9fa',
                color: !customImageMode ? '#fff' : '#333',
                fontWeight: !customImageMode ? 'bold' : 'normal'
              }}
            >
              Defaults
            </button>
            <button 
              type="button"
              onClick={() => setCustomImageMode(true)}
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                backgroundColor: customImageMode ? 'var(--brand-blue)' : '#f8f9fa',
                color: customImageMode ? '#fff' : '#333',
                fontWeight: customImageMode ? 'bold' : 'normal'
              }}
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {!customImageMode ? (
        <div className="calc-input-group">
          <label>Select Cover Image</label>
          <select value={image} onChange={(e) => setImage(e.target.value)}>
            <option value="/paludarium.png">Paludarium Setup</option>
            <option value="/cichlids.png">Cichlid Aquarium</option>
            <option value="/koipond.jpg">Koi Pond</option>
            <option value="/jungle-aquarium.png">Nature Aquarium</option>
          </select>
        </div>
      ) : (
        <div className="calc-input-group" style={{ border: '2px dashed var(--border-color)', padding: '15px', borderRadius: '4px', textAlign: 'center', backgroundColor: '#fafafa', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>📤 Upload Custom Cover Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'block', margin: '0 auto 10px auto', fontSize: '0.85rem' }}
          />
          {uploadingImage && <div style={{ fontSize: '0.85rem', color: 'var(--brand-blue)' }}>Uploading to server...</div>}
          {uploadedUrl && !uploadingImage && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#27ae60', marginBottom: '5px', fontWeight: '500' }}>✓ Image uploaded successfully!</div>
              <img 
                src={uploadedUrl} 
                alt="Preview" 
                style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>
          )}
        </div>
      )}

      <div className="calc-input-group">
        <label>Tags (comma separated)</label>
        <input 
          type="text" 
          value={tags} 
          onChange={(e) => setTags(e.target.value)} 
          placeholder="e.g., iwagumi, hardscape, rocks"
        />
      </div>

      <div className="calc-input-group">
        <label>Content (Markdown Support)</label>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          placeholder="Write your article here..."
          rows={12}
          style={{
            padding: '10px',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-orange" 
        disabled={loading}
        style={{ padding: '12px', fontSize: '1rem', fontWeight: 'bold' }}
      >
        {loading ? "Uploading..." : "Publish Article"}
      </button>
    </form>
  );
}
