import React, { useState } from "react";
import "./Auth.css";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return alert("Vui lòng chọn ảnh!");
    // Giả lập upload lên Cloudinary
    setTimeout(() => {
      setMessage("Ảnh đại diện đã được cập nhật thành công!");
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Upload Avatar</h2>
        <form onSubmit={handleUpload}>
          <div className="input-group">
            <label>Chọn ảnh đại diện</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {preview && (
            <div className="avatar-preview">
              <img src={preview} alt="avatar preview" />
            </div>
          )}

          <button type="submit" className="btn-primary">
            Cập nhật
          </button>
        </form>
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}
