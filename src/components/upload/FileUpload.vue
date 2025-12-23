<script setup>
import { ref, computed } from 'vue'
import { logAPI } from '../../services/api'

const isDragging = ref(false)
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref(null) // 'success', 'error', null
const errorMessage = ref('')

// Computed properties
const fileSize = computed(() => {
  if (!selectedFile.value) return ''
  const bytes = selectedFile.value.size
  const mb = (bytes / (1024 * 1024)).toFixed(2)
  return `${mb} MB`
})

const acceptedFileTypes = '.evtx'

// Drag and drop handlers
const handleDragEnter = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDragOver = (e) => {
  e.preventDefault()
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFileSelect(files[0])
  }
}

// File selection handlers
const handleFileInput = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    handleFileSelect(files[0])
  }
}

const handleFileSelect = (file) => {
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.evtx')) {
    errorMessage.value = 'Invalid file type. Please upload a Windows Event Log (.evtx) file.'
    uploadStatus.value = 'error'
    return
  }
  
  // Validate file size (max 100MB for now)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    errorMessage.value = 'File too large. Maximum size is 100MB.'
    uploadStatus.value = 'error'
    return
  }
  
  selectedFile.value = file
  uploadStatus.value = null
  errorMessage.value = ''
}

// Upload handlers
const uploadFile = async () => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  uploadProgress.value = 0
  uploadStatus.value = null
  errorMessage.value = ''
  
  try {
    const response = await logAPI.uploadLog(
      selectedFile.value,
      (progress) => {
        uploadProgress.value = progress
      }
    )
    
    uploadStatus.value = 'success'
    uploadProgress.value = 100
    
    // Reset after 2 seconds
    setTimeout(() => {
      resetUpload()
    }, 2000)
    
  } catch (error) {
    console.error('Upload error:', error)
    uploadStatus.value = 'error'
    errorMessage.value = error.response?.data?.message || 'Failed to upload file. Please try again.'
  } finally {
    isUploading.value = false
  }
}

const resetUpload = () => {
  selectedFile.value = null
  uploadProgress.value = 0
  uploadStatus.value = null
  errorMessage.value = ''
}

const triggerFileInput = () => {
  document.getElementById('file-input').click()
}
</script>

<template>
  <div class="upload-container">
    <!-- Dropzone -->
    <div 
      :class="['dropzone', { 
        'dragging': isDragging,
        'has-file': selectedFile,
        'uploading': isUploading,
        'success': uploadStatus === 'success',
        'error': uploadStatus === 'error'
      }]"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @click="!isUploading && triggerFileInput()"
    >
      <input
        id="file-input"
        type="file"
        :accept="acceptedFileTypes"
        @change="handleFileInput"
        style="display: none"
      />
      
      <!-- Upload Icon/Status -->
      <div class="dropzone-content">
        <div v-if="!selectedFile && !isUploading" class="upload-prompt">
          <div class="icon">📁</div>
          <h3>Drop your log file here</h3>
          <p class="text-secondary">or click to browse</p>
          <p class="file-types">Accepts: Windows Event Logs (.evtx)</p>
        </div>
        
        <div v-else-if="selectedFile && !isUploading && uploadStatus !== 'success'" class="file-info">
          <div class="icon">📄</div>
          <h3>{{ selectedFile.name }}</h3>
          <p class="text-secondary">{{ fileSize }}</p>
          <div class="file-actions">
            <button @click.stop="uploadFile" class="btn btn-primary">
              Upload File
            </button>
            <button @click.stop="resetUpload" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
        
        <div v-else-if="isUploading" class="uploading-state">
          <div class="spinner"></div>
          <h3>Uploading...</h3>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <p class="text-secondary">{{ uploadProgress }}%</p>
        </div>
        
        <div v-else-if="uploadStatus === 'success'" class="success-state">
          <div class="icon success">✅</div>
          <h3>Upload Successful!</h3>
          <p class="text-secondary">Your log file is being processed...</p>
        </div>
        
        <div v-else-if="uploadStatus === 'error'" class="error-state">
          <div class="icon error">❌</div>
          <h3>Upload Failed</h3>
          <p class="error-message">{{ errorMessage }}</p>
          <button @click.stop="resetUpload" class="btn btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    </div>
    
    <!-- Info Cards -->
    <div class="info-section">
      <div class="info-card">
        <div class="info-icon">📊</div>
        <div class="info-content">
          <h4>What We Analyze</h4>
          <ul>
            <li>Failed login attempts</li>
            <li>Account lockout events</li>
            <li>Brute force patterns</li>
            <li>Unusual access times</li>
          </ul>
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-icon">🔒</div>
        <div class="info-content">
          <h4>Privacy & Security</h4>
          <p class="text-secondary">
            Your logs are processed securely and stored temporarily for analysis. 
            All data is handled according to security best practices.
          </p>
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-icon">⚡</div>
        <div class="info-content">
          <h4>Processing Time</h4>
          <p class="text-secondary">
            Small files (&lt;10MB): ~30 seconds<br>
            Medium files (10-50MB): 1-3 minutes<br>
            Large files (50-100MB): 3-5 minutes
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Dropzone */
.dropzone {
  background-color: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropzone:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

.dropzone.dragging {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
  transform: scale(1.02);
}

.dropzone.uploading {
  cursor: not-allowed;
  border-color: var(--color-info);
}

.dropzone.success {
  border-color: var(--color-success);
  background-color: rgba(16, 185, 129, 0.1);
}

.dropzone.error {
  border-color: var(--color-danger);
  background-color: rgba(239, 68, 68, 0.1);
  cursor: default;
}

.dropzone-content {
  width: 100%;
}

/* Upload States */
.upload-prompt .icon,
.file-info .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.upload-prompt h3,
.file-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.upload-prompt p {
  margin: 0.5rem 0;
}

.file-types {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 1rem;
}

.file-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

/* Uploading State */
.uploading-state {
  width: 100%;
}

.uploading-state h3 {
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-info));
  transition: width 0.3s ease;
}

/* Success/Error States */
.success-state .icon,
.error-state .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-danger);
  margin: 1rem 0;
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.info-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-content h4 {
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
}

.info-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-content li {
  padding: 0.25rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.info-content li::before {
  content: "•";
  color: var(--color-primary);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.info-content p {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .dropzone {
    padding: 2rem 1rem;
    min-height: 300px;
  }

  .upload-prompt .icon,
  .file-info .icon {
    font-size: 3rem;
  }

  .file-actions {
    flex-direction: column;
  }

  .file-actions .btn {
    width: 100%;
  }

  .info-section {
    grid-template-columns: 1fr;
  }
}
</style>