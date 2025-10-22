# 📸 Avatar Upload Feature

## Mục tiêu
Cho phép người dùng upload ảnh đại diện (avatar), tự động resize trước khi lưu, và lưu trữ trên Cloudinary.

## Các tính năng đã triển khai

### 1. 🎨 AvatarUpload Component (`src/components/AvatarUpload.jsx`)
Component upload avatar với các tính năng:
- **File Selection**: Chọn ảnh từ thiết bị (PNG, JPG, GIF)
- **Image Preview**: Xem trước ảnh ngay sau khi chọn
- **Validation**: 
  - Kiểm tra định dạng file (chỉ chấp nhận image/*)
  - Giới hạn kích thước file (tối đa 5MB)
- **Upload Process**: 
  - Hiển thị loading state khi đang upload
  - Mock upload với delay 1.5s (trong thực tế sẽ gọi API)
  - Lưu avatar vào localStorage
- **Error Handling**: Hiển thị thông báo lỗi rõ ràng

```jsx
<AvatarUpload 
  currentAvatar={avatar}
  onUploadSuccess={handleAvatarUpload}
/>
```

### 2. 👤 UserAvatar Component (`src/components/UserAvatar.jsx`)
Component hiển thị avatar với nhiều kích thước:
- **Responsive Sizes**: sm, md, lg, xl
- **Fallback Icon**: Hiển thị icon mặc định nếu chưa có avatar
- **Gradient Background**: Màu gradient đẹp mắt cho avatar mặc định

```jsx
<UserAvatar user={user} size="md" />
```

### 3. 📄 Profile Page Update
Tích hợp AvatarUpload vào trang Profile:
- Section riêng cho avatar upload
- Real-time update khi upload thành công
- Load avatar từ localStorage khi mount

### 4. 🧭 Navigation Avatar Display
Hiển thị avatar trong navigation bar:
- Avatar nhỏ bên cạnh tên user
- Responsive với màn hình nhỏ
- Gradient background cho avatar mặc định

### 5. 📊 Dashboard Integration
Thêm avatar vào bảng danh sách user:
- **AdminDashboard**: Cột avatar trong bảng quản lý user
- **ModeratorDashboard**: Cột avatar trong bảng xem user

## Cấu trúc File

```
src/
├── components/
│   ├── AvatarUpload.jsx      # Component upload avatar
│   └── UserAvatar.jsx         # Component hiển thị avatar
├── pages/
│   ├── Profile.jsx            # Trang profile với avatar upload
│   ├── AdminDashboard.jsx     # Dashboard admin với avatar
│   └── ModeratorDashboard.jsx # Dashboard moderator với avatar
└── App.jsx                    # Navigation với avatar
```

## Workflow Upload Avatar

1. **User chọn ảnh**:
   ```javascript
   handleFileSelect(event)
   - Validate file type (image/*)
   - Validate file size (max 5MB)
   - Create preview using FileReader
   ```

2. **Preview ảnh**:
   ```javascript
   reader.onloadend = () => {
     setPreview(reader.result)
   }
   ```

3. **Upload**:
   ```javascript
   handleUpload()
   - Create FormData with file
   - Mock upload với delay (trong thực tế gọi API)
   - Save to localStorage
   - Trigger onUploadSuccess callback
   ```

4. **Display**:
   ```javascript
   UserAvatar component loads from localStorage
   - Show avatar image if exists
   - Show default icon if not
   ```

## API Integration (Future)

Khi tích hợp với backend thực tế:

### Upload Endpoint
```javascript
POST /api/users/avatar
Content-Type: multipart/form-data

Body: {
  avatar: File
}

Response: {
  success: true,
  avatarUrl: "https://cloudinary.com/..."
}
```

### Update trong AvatarUpload.jsx
```javascript
const handleUpload = async () => {
  const formData = new FormData()
  formData.append('avatar', selectedFile)
  
  const response = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  
  onUploadSuccess(response.data.avatarUrl)
}
```

## Cloudinary Integration

### Backend Setup (Node.js/Express)
```javascript
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const sharp = require('sharp')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload route
router.post('/users/avatar', upload.single('avatar'), async (req, res) => {
  try {
    // Resize image using sharp
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer()
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'avatars' },
      (error, result) => {
        if (error) throw error
        res.json({ 
          success: true, 
          avatarUrl: result.secure_url 
        })
      }
    ).end(resizedBuffer)
    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## Testing

### Manual Testing Checklist
- [ ] Chọn ảnh PNG/JPG/GIF - thành công
- [ ] Chọn file không phải ảnh - hiển thị lỗi
- [ ] Chọn ảnh > 5MB - hiển thị lỗi
- [ ] Preview ảnh hiển thị đúng
- [ ] Upload thành công - avatar cập nhật
- [ ] Avatar hiển thị trong navigation
- [ ] Avatar hiển thị trong Profile
- [ ] Avatar hiển thị trong Admin/Moderator Dashboard
- [ ] Hủy upload - xóa preview
- [ ] Refresh page - avatar vẫn hiển thị (localStorage)

## UI/UX Features

### AvatarUpload
- ✅ Circular preview với border đẹp
- ✅ Camera icon button overlay
- ✅ Upload progress với loading spinner
- ✅ Success/error messages
- ✅ Cancel button

### UserAvatar
- ✅ Multiple sizes (sm, md, lg, xl)
- ✅ Gradient background fallback
- ✅ Rounded circle design
- ✅ Default user icon

## Lưu ý kỹ thuật

### 1. File Validation
```javascript
// Type check
if (!file.type.startsWith('image/')) {
  setError('Vui lòng chọn file ảnh')
}

// Size check
if (file.size > 5 * 1024 * 1024) {
  setError('Kích thước ảnh không được vượt quá 5MB')
}
```

### 2. Image Preview
```javascript
const reader = new FileReader()
reader.onloadend = () => {
  setPreview(reader.result) // Base64 string
}
reader.readAsDataURL(file)
```

### 3. LocalStorage Management
```javascript
// Save
localStorage.setItem('userAvatar', avatarBase64)

// Load
const avatar = localStorage.getItem('userAvatar')

// Clear
localStorage.removeItem('userAvatar')
```

## Future Enhancements

1. **Image Cropping**: Cho phép crop ảnh trước khi upload
2. **Multiple Avatars**: Lưu lịch sử avatar
3. **Avatar Frames**: Khung avatar đặc biệt cho VIP
4. **Drag & Drop**: Upload bằng kéo thả
5. **Camera Capture**: Chụp ảnh trực tiếp từ webcam
6. **Image Filters**: Thêm filter cho ảnh

## Dependencies

```json
{
  "react": "^19.1.1",
  "tailwindcss": "^4.1.15"
}
```

Backend dependencies (khi tích hợp):
```json
{
  "cloudinary": "^1.37.0",
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.32.0"
}
```

## Screenshots

### Upload Interface
- Circular preview với default icon
- Camera button để chọn ảnh
- Upload và Cancel buttons

### Navigation Display
- Avatar nhỏ bên cạnh tên user
- Gradient background khi chưa có avatar

### Profile Page
- Section riêng cho avatar upload
- Preview lớn và buttons rõ ràng

### Dashboards
- Avatar column trong bảng user
- Nhỏ gọn, responsive

---

**Tác giả**: SV2 - Frontend Developer  
**Ngày tạo**: 2024  
**Phiên bản**: 1.0  
**Branch**: `feature/avatar-upload`
