import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

function VoiceCall({ 
  socket, 
  currentUser, 
  targetUser, 
  chatId,
  isIncoming,
  incomingCallData,
  onCallEnd 
}) {
  const [callState, setCallState] = useState('connecting'); // connecting, ringing, active, ended
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudio = useRef(null);
  const callTimer = useRef(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (isIncoming) {
      // Handle incoming call
      setCallState('ringing');
    } else {
      // Initiate outgoing call
      initiateCall();
    }

    // Setup socket listeners
    socket.on('callAnswered', handleCallAnswered);
    socket.on('iceCandidate', handleIceCandidate);
    socket.on('callEnded', handleCallEnded);
    socket.on('callRejected', handleCallRejected);
    socket.on('callError', handleCallError);

    return () => {
      cleanup();
      socket.off('callAnswered');
      socket.off('iceCandidate');
      socket.off('callEnded');
      socket.off('callRejected');
      socket.off('callError');
    };
  }, []);

  const initiateCall = async () => {
    try {
      // Get user media (microphone)
      localStream.current = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });

      // Create peer connection
      peerConnection.current = new RTCPeerConnection(rtcConfig);

      // Add local stream tracks
      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', {
            targetUserId: targetUser.id,
            candidate: event.candidate
          });
        }
      };

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      };

      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit('callUser', {
        chatId,
        targetUserId: targetUser.id,
        offer
      });

      setCallState('ringing');
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to access microphone. Please check permissions.');
      onCallEnd();
    }
  };

  const answerCall = async () => {
    try {
      // Get user media
      localStream.current = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });

      // Create peer connection
      peerConnection.current = new RTCPeerConnection(rtcConfig);

      // Add local stream tracks
      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', {
            targetUserId: incomingCallData.callerId,
            candidate: event.candidate
          });
        }
      };

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      };

      // Set remote description (offer)
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(incomingCallData.offer)
      );

      // Create and send answer
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit('answerCall', {
        callerId: incomingCallData.callerId,
        answer
      });

      setCallState('active');
      startCallTimer();
    } catch (error) {
      console.error('Error answering call:', error);
      alert('Failed to answer call. Please check microphone permissions.');
      rejectCall();
    }
  };

  const handleCallAnswered = async (data) => {
    try {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      setCallState('active');
      startCallTimer();
    } catch (error) {
      console.error('Error handling call answer:', error);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const handleCallEnded = () => {
    setCallState('ended');
    cleanup();
    setTimeout(() => onCallEnd(), 1000);
  };

  const handleCallRejected = () => {
    setCallState('ended');
    cleanup();
    alert('Call was rejected');
    onCallEnd();
  };

  const handleCallError = (data) => {
    alert(data.message);
    cleanup();
    onCallEnd();
  };

  const endCall = () => {
    socket.emit('endCall', {
      targetUserId: isIncoming ? incomingCallData.callerId : targetUser.id
    });
    setCallState('ended');
    cleanup();
    setTimeout(() => onCallEnd(), 500);
  };

  const rejectCall = () => {
    socket.emit('rejectCall', {
      callerId: incomingCallData.callerId
    });
    cleanup();
    onCallEnd();
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleSpeaker = () => {
    if (remoteAudio.current) {
      remoteAudio.current.muted = !remoteAudio.current.muted;
      setIsSpeakerOn(!remoteAudio.current.muted);
    }
  };

  const startCallTimer = () => {
    callTimer.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const cleanup = () => {
    // Stop call timer
    if (callTimer.current) {
      clearInterval(callTimer.current);
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Stop local stream
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStateText = () => {
    switch (callState) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return isIncoming ? 'Incoming call...' : 'Ringing...';
      case 'active':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <audio ref={remoteAudio} autoPlay />
      
      <div className="bg-gradient-to-br from-whatsapp-teal to-whatsapp-green rounded-3xl p-8 w-96 shadow-2xl">
        {/* User Info */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white flex items-center justify-center text-whatsapp-teal text-5xl font-bold shadow-lg">
            {isIncoming 
              ? incomingCallData.callerName[0].toUpperCase()
              : targetUser.username[0].toUpperCase()
            }
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isIncoming ? incomingCallData.callerName : targetUser.username}
          </h2>
          <p className="text-white text-opacity-80 text-lg">
            {getCallStateText()}
          </p>
        </div>

        {/* Call Controls */}
        {callState === 'ringing' && isIncoming ? (
          // Incoming call buttons
          <div className="flex justify-center gap-6">
            <button
              onClick={rejectCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
              title="Reject"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={answerCall}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 animate-pulse"
              title="Answer"
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>
        ) : callState === 'active' ? (
          // Active call controls
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
            
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
              title="End Call"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={toggleSpeaker}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                !isSpeakerOn ? 'bg-red-500 hover:bg-red-600' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
              title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-6 h-6 text-white" />
              ) : (
                <VolumeX className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        ) : callState === 'ringing' && !isIncoming ? (
          // Outgoing call - only end button
          <div className="flex justify-center">
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
              title="Cancel"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </div>
        ) : null}

        {/* Call State Indicator */}
        {callState === 'active' && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Connected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceCall;
