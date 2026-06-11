import { useRef } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC.js';

export default function CallInterface({ appointmentId, isVideo = true }) {
  const isInitiator = true;
  const { myVideoRef } = useWebRTC(appointmentId, isInitiator);
  const peerVideoRef = useRef(null);

  const endCall = () => {
    // Emit end_call via socket
    window.location.href = '/appointments';
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-black text-white">
      <video ref={myVideoRef} autoPlay muted className="w-64 h-48 bg-gray-800 rounded" />
      <video ref={peerVideoRef} autoPlay className="w-64 h-48 bg-gray-800 rounded" />
      <div className="flex space-x-4">
        <button className="bg-green-600 px-4 py-2 rounded">Toggle Audio</button>
        <button className="bg-blue-600 px-4 py-2 rounded">Toggle Video</button>
        <button onClick={endCall} className="bg-red-600 px-4 py-2 rounded">End Call</button>
      </div>
    </div>
  );
}