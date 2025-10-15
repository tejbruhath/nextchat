import { Check, CheckCheck } from 'lucide-react';
import FilePreview from './FilePreview';

function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} message-bubble`}>
      <div
        className={`max-w-md px-4 py-2 rounded-lg shadow-sm ${
          isOwn
            ? 'bg-whatsapp-light text-gray-800'
            : 'bg-white text-gray-800'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold text-whatsapp-teal mb-1">
            {message.sender_username}
          </p>
        )}
        
        {message.media_url && (
          <FilePreview
            mediaUrl={message.media_url}
            mediaType={message.media_type}
          />
        )}
        
        {message.text && (
          <p className="break-words whitespace-pre-wrap">{message.text}</p>
        )}
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-gray-600">
            {formatTime(message.created_at)}
          </span>
          {isOwn && (
            <span className="text-gray-600">
              {message.is_read ? (
                <CheckCheck className="w-4 h-4 text-blue-500" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
