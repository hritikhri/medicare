import { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './useSocket.js';

export const useWebRTC = (appointmentId, isInitiator = true) => {
  const myVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socket = useSocket(); // Assume userId passed higher

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        peerRef.current = new Peer({
          initiator: isInitiator,
          trickle: false,
          stream,
        });

        peerRef.current.on('signal', (data) => {
          if (isInitiator) {
            socket.emit('join_call', { appointmentId, offer: data });
          } else {
            socket.emit('call_answer', { appointmentId, answer: data });
          }
        });

        socket.on('call_offer', ({ offer }) => {
          if (peerRef.current) peerRef.current.signal(offer);
        });

        socket.on('call_answer', ({ answer }) => {
          if (peerRef.current) peerRef.current.signal(answer);
        });

        socket.on('ice-candidate', ({ candidate }) => {
          if (peerRef.current) peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        peerRef.current.on('stream', (remoteStream) => {
          // Set remote video ref here
        });
      } catch (err) {
        console.error('WebRTC error:', err);
      }
    };

    startCall();

    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [appointmentId, isInitiator, socket]);

  return { myVideoRef, peerRef };
};