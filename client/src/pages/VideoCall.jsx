import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) { navigate('/login'); return; }
    const user = JSON.parse(userStr);

    const appID = 563212508;
    const serverSecret = '6cd6a2868cfbd7aa49840550535597fa';

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user.id.toString(),
      user.name
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      showScreenSharingButton: true,
      showUserList: true,
      showRoomDetailsButton: true,
    });
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Room: <span className="text-white font-mono">{roomId}</span></span>
          <a href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</a>
        </div>
      </nav>
      <div ref={containerRef} style={{ height: 'calc(100vh - 64px)', width: '100%' }} />
    </div>
  );
}

export default VideoCall;