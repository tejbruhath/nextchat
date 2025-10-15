import { File, Download } from 'lucide-react';

function FilePreview({ mediaUrl, mediaType }) {
  const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `http://localhost:5000${mediaUrl}`;

  const handleDownload = () => {
    window.open(fullUrl, '_blank');
  };

  if (mediaType === 'image') {
    return (
      <div className="mb-2">
        <img
          src={fullUrl}
          alt="Shared image"
          className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(fullUrl, '_blank')}
        />
      </div>
    );
  }

  if (mediaType === 'video') {
    return (
      <div className="mb-2">
        <video
          src={fullUrl}
          controls
          className="rounded-lg max-w-xs max-h-64"
        />
      </div>
    );
  }

  if (mediaType === 'audio') {
    return (
      <div className="mb-2">
        <audio src={fullUrl} controls className="w-full max-w-xs" />
      </div>
    );
  }

  // Default file preview
  return (
    <div className="mb-2 flex items-center gap-2 bg-gray-100 p-3 rounded-lg max-w-xs">
      <File className="w-8 h-8 text-gray-600" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">Attachment</p>
        <button
          onClick={handleDownload}
          className="text-xs text-whatsapp-teal hover:underline flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
      </div>
    </div>
  );
}

export default FilePreview;
