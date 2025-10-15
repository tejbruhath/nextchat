import { useState, useRef } from 'react';
import { Send, Paperclip, Image, X } from 'lucide-react';

function ChatInput({ onSendMessage, onTyping, onStopTyping }) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator
    onTyping();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview({
        url: e.target.result,
        type: file.type.split('/')[0],
        file
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', preview.file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      // Send message with media
      onSendMessage(message, data.filePath, data.mediaType);
      
      // Clear input and preview
      setMessage('');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSend = () => {
    if (preview) {
      handleUpload();
    } else if (message.trim()) {
      onSendMessage(message.trim(), null, null);
      setMessage('');
      onStopTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* File Preview */}
      {preview && (
        <div className="mb-3 relative inline-block">
          <div className="relative bg-gray-100 rounded-lg p-2">
            {preview.type === 'image' ? (
              <img
                src={preview.url}
                alt="Preview"
                className="max-h-32 rounded"
              />
            ) : preview.type === 'video' ? (
              <video
                src={preview.url}
                className="max-h-32 rounded"
                controls
              />
            ) : (
              <div className="flex items-center gap-2 p-4">
                <Paperclip className="w-6 h-6 text-gray-600" />
                <span className="text-sm">{preview.file.name}</span>
              </div>
            )}
            <button
              onClick={clearPreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-6 h-6" />
        </button>

        <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-transparent outline-none resize-none max-h-32"
            rows="1"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={(!message.trim() && !preview) || uploading}
          className="p-3 bg-whatsapp-green text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
