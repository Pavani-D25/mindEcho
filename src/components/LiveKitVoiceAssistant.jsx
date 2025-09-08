// "use client";

// import { useEffect, useState } from "react";
// import { Room } from "livekit-client";
// import { Mic, MicOff, Loader2, X } from "lucide-react";
// import { motion } from "framer-motion";

// const LiveKitVoiceAssistant = ({ onClose }) => {
//   const [room, setRoom] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [isMicOn, setIsMicOn] = useState(false);
//   const roomName = "mindbloom-voice";
//   const identity = "user_" + Math.floor(Math.random() * 9999);

//   const connectToRoom = async () => {
//     const res = await fetch("/api/livekit-token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ identity, roomName }),
//     });

//     const { token } = await res.json();
//     const newRoom = new Room();
//     await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token);
//     setRoom(newRoom);
//     setConnected(true);
//   };

//   const toggleMic = async () => {
//     if (!room) return;
//     const micTrack = await Room.createLocalAudioTrack();

//     if (isMicOn) {
//       room.localParticipant.unpublishTrack(micTrack);
//       micTrack.stop();
//       setIsMicOn(false);
//     } else {
//       room.localParticipant.publishTrack(micTrack);
//       setIsMicOn(true);
//     }
//   };

//   useEffect(() => {
//     connectToRoom();

//     return () => {
//       room?.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
//     >
//       <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-purple-700">
//             Live Voice Chat
//           </h2>
//           <button onClick={onClose}>
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {!connected ? (
//           <div className="text-center text-gray-500">
//             <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2" />
//             Connecting to LiveKit...
//           </div>
//         ) : (
//           <div className="text-center">
//             <p className="text-sm text-gray-600 mb-4">You're connected!</p>
//             <button
//               onClick={toggleMic}
//               className={`p-4 rounded-full text-white ${
//                 isMicOn
//                   ? "bg-red-500 animate-pulse ring-4 ring-red-300"
//                   : "bg-purple-600 hover:bg-purple-700"
//               }`}
//             >
//               {isMicOn ? <MicOff /> : <Mic />}
//             </button>
//             <p className="mt-2 text-sm text-muted-foreground">
//               {isMicOn ? "Mic is On" : "Mic is Off"}
//             </p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default LiveKitVoiceAssistant;


// "use client";

// import { useEffect, useState } from "react";
// import { Room } from "livekit-client";
// import { Mic, MicOff, Loader2, X } from "lucide-react";
// import { motion } from "framer-motion";

// const LiveKitVoiceAssistant = ({ onClose }) => {
//   const [room, setRoom] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [isMicOn, setIsMicOn] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState("initializing");
//   const roomName = "mindbloom-voice";
//   const identity = "user_" + Math.floor(Math.random() * 9999);

//   const connectToRoom = async () => {
//     try {
//       setConnectionStatus("connecting");
//       const res = await fetch("/api/livekit-token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ identity, roomName }),
//       });

//       const { token } = await res.json();
//       const newRoom = new Room();
//       await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token);
//       setRoom(newRoom);
//       setConnected(true);
//       setConnectionStatus("connected");
//     } catch (error) {
//       setConnectionStatus("error");
//       console.error("Connection error:", error);
//     }
//   };

//   const toggleMic = async () => {
//     if (!room) return;
//     const micTrack = await Room.createLocalAudioTrack();

//     if (isMicOn) {
//       room.localParticipant.unpublishTrack(micTrack);
//       micTrack.stop();
//       setIsMicOn(false);
//     } else {
//       room.localParticipant.publishTrack(micTrack);
//       setIsMicOn(true);
//     }
//   };

//   useEffect(() => {
//     connectToRoom();

//     return () => {
//       room?.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
//     >
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ type: "spring", damping: 20 }}
//         className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
//       >
//         {/* Header with holographic effect */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-blue-500 opacity-10 blur-lg"></div>
//           <div className="relative flex justify-between items-center p-5 border-b border-gray-700">
//             <div>
//               <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
//                 VOICE CHANNEL
//               </h2>
//               <p className="text-xs text-gray-400 mt-1">LIVEKIT v2.3</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
//             >
//               <X className="w-5 h-5 text-gray-400 hover:text-white" />
//             </button>
//           </div>
//         </div>

//         <div className="p-5">
//           {!connected ? (
//             <div className="flex flex-col items-center justify-center py-8">
//               <div className="relative mb-4">
//                 <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
//                 <div className="absolute inset-0 rounded-full border-2 border-blue-400 border-opacity-30 animate-ping"></div>
//               </div>
//               <div className="space-y-2 text-center">
//                 <p className="text-blue-400 font-mono text-sm">
//                   {connectionStatus === "connecting"
//                     ? "ESTABLISHING SECURE CONNECTION..."
//                     : "INITIALIZING..."}
//                 </p>
//                 <div className="w-full bg-gray-700 rounded-full h-1.5">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: "70%" }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
//                   ></motion.div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center">
//               {/* Connection status indicator */}
//               <div className="flex items-center mb-6">
//                 <div className="relative">
//                   <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-75"></div>
//                   <div className="relative flex items-center justify-center w-3 h-3">
//                     <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
//                     <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
//                   </div>
//                 </div>
//                 <span className="ml-2 text-xs font-mono text-green-400">
//                   CONNECTED
//                 </span>
//               </div>

//               {/* Futuristic mic button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={toggleMic}
//                 className={`relative p-6 rounded-full ${
//                   isMicOn
//                     ? "bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30"
//                     : "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600"
//                 }`}
//               >
//                 {isMicOn ? (
//                   <>
//                     <MicOff className="w-8 h-8 text-white" />
//                     <div className="absolute inset-0 rounded-full border-2 border-red-400 border-opacity-50 animate-pulse"></div>
//                   </>
//                 ) : (
//                   <Mic className="w-8 h-8 text-blue-400" />
//                 )}
//               </motion.button>

//               {/* Status text with animation */}
//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-4 text-xs font-mono tracking-wider text-gray-400"
//               >
//                 {isMicOn ? (
//                   <>
//                     <span className="text-green-400">ACTIVE</span> · TRANSMITTING
//                   </>
//                 ) : (
//                   <>
//                     <span className="text-blue-400">STANDBY</span> · READY
//                   </>
//                 )}
//               </motion.p>

//               {/* Audio visualization */}
//               {isMicOn && (
//                 <div className="flex items-end justify-center h-12 mt-6 space-x-1">
//                   {[...Array(8)].map((_, i) => (
//                     <motion.div
//                       key={i}
//                       animate={{
//                         height: `${Math.random() * 30 + 10}px`,
//                       }}
//                       transition={{
//                         repeat: Infinity,
//                         repeatType: "reverse",
//                         duration: 0.5 + Math.random() * 0.5,
//                       }}
//                       className="w-1.5 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t-sm"
//                     ></motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer with connection info */}
//         <div className="px-5 py-3 bg-gray-800 bg-opacity-50 border-t border-gray-700">
//           <div className="flex justify-between items-center">
//             <p className="text-xs font-mono text-gray-400">
//               ID: {identity.slice(0, 8).toUpperCase()}
//             </p>
//             <p className="text-xs font-mono text-gray-400">
//               ROOM: {roomName.toUpperCase()}
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default LiveKitVoiceAssistant;