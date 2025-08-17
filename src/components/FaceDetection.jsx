

// "use client";
// import { useState, useRef, useEffect } from "react";
// import * as faceapi from "face-api.js";
// import { motion } from "framer-motion";
// import SongRecommendation from "./SongRecommendation";

// export default function FaceDetection({ onClose }) {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [detections, setDetections] = useState(null);
//   const [capturedData, setCapturedData] = useState(null);
//   const [isModelsLoading, setIsModelsLoading] = useState(true);
//   const [scanProgress, setScanProgress] = useState(0);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [error, setError] = useState(null);

//   // 1) Load models (from /public/models)
//   useEffect(() => {
//     let progressId;
//     const loadModels = async () => {
//       try {
//         setError(null);
//         // Next.js: serve from /public/models
//         const MODEL_URL = `/models`;
        
//         progressId = setInterval(() => {
//           setScanProgress((p) => (p >= 90 ? 90 : p + 10));
//         }, 200);

//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//           faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//           faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//           faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
//         ]);

//         setScanProgress(95);
//         await startVideo();
//         setScanProgress(100);
        
//         setTimeout(() => {
//           setIsModelsLoading(false);
//           setIsDetecting(true);
//         }, 500);

//       } catch (error) {
//         console.error("Model loading error:", error);
//         setError("Failed to load AI models. Please refresh and try again.");
//         setIsModelsLoading(false);
//       }
//     };

//     loadModels();

//     return () => {
//       if (progressId) clearInterval(progressId);
//     };
//   }, []);

//   // 2) Start camera
//   const startVideo = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: "user",
//           width: { ideal: 640 },
//           height: { ideal: 370 }
//         },
//         audio: false,
//       });
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         // Wait for video to be ready
//         return new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             resolve();
//           };
//         });
//       }
//     } catch (err) {
//       console.error("Camera error:", err);
//       setError("Camera access denied. Please allow camera permissions and refresh.");
//       throw err;
//     }
//   };

//   // 3) Continuous detection loop
//   useEffect(() => {
//     let animationId;
    
//     const detect = async () => {
//       if (!videoRef.current || !isDetecting || isModelsLoading) {
//         animationId = requestAnimationFrame(detect);
//         return;
//       }

//       const video = videoRef.current;
      
//       // Check if video is ready
//       if (video.readyState !== 4) {
//         animationId = requestAnimationFrame(detect);
//         return;
//       }

//       try {
//         const results = await faceapi
//           .detectAllFaces(
//             video,
//             new faceapi.TinyFaceDetectorOptions({ 
//               scoreThreshold: 0.5,
//               inputSize: 416
//             })
//           )
//           .withFaceLandmarks()
//           .withFaceExpressions()
//           .withAgeAndGender();

//         setDetections(results);
//         draw(results);
//       } catch (e) {
//         console.error("Detection error:", e);
//       }
      
//       animationId = requestAnimationFrame(detect);
//     };

//     if (isDetecting) {
//       animationId = requestAnimationFrame(detect);
//     }

//     return () => {
//       if (animationId) {
//         cancelAnimationFrame(animationId);
//       }
//     };
//   }, [isDetecting, isModelsLoading]);

//   // 4) Draw overlays - FIXED VERSION
//   const draw = (results) => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas || !results || results.length === 0) return;

//     // Set canvas size to match video display size
//     const videoRect = video.getBoundingClientRect();
//     canvas.width = video.offsetWidth;
//     canvas.height = video.offsetHeight;

//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Calculate scale factors from video's native size to displayed size
//     const scaleX = canvas.width / video.videoWidth;
//     const scaleY = canvas.height / video.videoHeight;

//     results.forEach((result) => {
//       const { detection, landmarks, expressions, age, gender } = result;
      
//       if (!detection) return;

//       // Get the bounding box
//       const box = detection.box;
      
//       // Scale the coordinates
//       const scaledBox = {
//         x: box.x * scaleX,
//         y: box.y * scaleY,
//         width: box.width * scaleX,
//         height: box.height * scaleY
//       };

//       // Mirror the x coordinate for the flipped video
//       const mirroredX = canvas.width - scaledBox.x - scaledBox.width;

//       // Draw face detection box
//       ctx.strokeStyle = "#a855f7";
//       ctx.lineWidth = 3;
//       ctx.strokeRect(mirroredX, scaledBox.y, scaledBox.width, scaledBox.height);

//       // Draw age/gender label
//       if (age !== undefined || gender) {
//         const ageText = age ? Math.round(age) : '';
//         const genderText = gender || '';
//         const labelText = `${ageText} ${genderText}`.trim();
        
//         if (labelText) {
//           ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
//           ctx.fillRect(mirroredX, scaledBox.y - 25, 120, 20);
//           ctx.fillStyle = "#ffffff";
//           ctx.font = "12px Arial";
//           ctx.fillText(labelText, mirroredX + 5, scaledBox.y - 10);
//         }
//       }

//       // Draw landmarks
//       if (landmarks && landmarks.positions) {
//         ctx.fillStyle = "#ec4899";
//         landmarks.positions.forEach(point => {
//           const mirroredPointX = canvas.width - (point.x * scaleX);
//           ctx.beginPath();
//           ctx.arc(mirroredPointX, point.y * scaleY, 1.5, 0, 2 * Math.PI);
//           ctx.fill();
//         });
//       }

//       // Draw expressions
//       if (expressions) {
//         const sortedExpressions = Object.entries(expressions)
//           .sort(([,a], [,b]) => b - a)
//           .slice(0, 3);

//         sortedExpressions.forEach(([expression, confidence], index) => {
//           const text = `${expression}: ${Math.round(confidence * 100)}%`;
//           const y = scaledBox.y + scaledBox.height + 20 + (index * 20);
          
//           // Measure text width for background
//           ctx.font = "bold 12px Arial";
//           const textWidth = ctx.measureText(text).width;
          
//           // Draw background
//           ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
//           ctx.fillRect(mirroredX - 5, y - 14, textWidth + 10, 18);
          
//           // Draw text
//           ctx.fillStyle = "#ffffff";
//           ctx.fillText(text, mirroredX, y);
//         });
//       }
//     });
//   };

//   // 5) Capture one frame's analysis
//   const handleCapture = () => {
//     if (detections && detections.length > 0) {
//       const detection = detections[0]; // Get first detected face
//       const { age, gender, expressions } = detection;
      
//       const sortedExpressions = Object.entries(expressions || {})
//         .sort(([,a], [,b]) => b - a);
        
//       const mostLikelyEmotion = sortedExpressions[0]?.[0] || "neutral";
//       const confidence = sortedExpressions[0]?.[1] || 0;

//       setCapturedData({
//         age: age ? Math.round(age) : "Unknown",
//         gender: gender || "Unknown",
//         emotion: mostLikelyEmotion,
//         confidence: Math.round(confidence * 100),
//         expressions: sortedExpressions.slice(0, 5).map(([expr, conf]) => ({
//           emotion: expr,
//           confidence: Math.round(conf * 100)
//         })),
//         timestamp: new Date().toLocaleTimeString(),
//       });
//     } else {
//       // No face detected
//       setCapturedData({
//         age: "No face detected",
//         gender: "No face detected",
//         emotion: "neutral",
//         confidence: 0,
//         expressions: [],
//         timestamp: new Date().toLocaleTimeString(),
//       });
//     }
//   };

//   // 6) Cleanup camera when closing/unmounting
//   useEffect(() => {
//     return () => {
//       const stream = videoRef.current?.srcObject;
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Auto-detect faces every 3 seconds for demo
//   useEffect(() => {
//     if (!isDetecting || isModelsLoading) return;
    
//     const interval = setInterval(() => {
//       if (detections && detections.length > 0) {
//         handleCapture();
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [detections, isDetecting, isModelsLoading]);

//   if (error) {
//     return (
//       <motion.div
//         className="min-h-[70vh] flex items-center justify-center"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <div className="text-center p-8 bg-red-50 rounded-2xl shadow-xl">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       className="min-h-[70vh] flex flex-col lg:flex-row gap-6"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Camera Panel */}
//       <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 relative">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">
//             AI Face Scanner
//           </h2>
//           {detections && detections.length > 0 && (
//             <div className="flex items-center gap-2 text-green-600 text-sm">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               {detections.length} face{detections.length !== 1 ? 's' : ''} detected
//             </div>
//           )}
//         </div>

//         <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-900">
//           <video
//             ref={videoRef}
//             className="rounded-xl w-full h-auto"
//             autoPlay
//             muted
//             playsInline
//             style={{ transform: 'scaleX(-1)' }}
//           />
//           <canvas
//             ref={canvasRef}
//             className="absolute inset-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//           />

//           {isModelsLoading && (
//             <div className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center rounded-xl" style={{ zIndex: 20 }}>
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
//               <p className="text-white font-medium mb-2">
//                 Loading AI Models...
//               </p>
//               <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
//                   style={{ width: `${scanProgress}%` }}
//                 />
//               </div>
//               <p className="text-gray-300 text-sm mt-2">{scanProgress}%</p>
//             </div>
//           )}
//         </div>

//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
//           >
//             Close Scanner
//           </button>
//           <button
//             onClick={handleCapture}
//             disabled={!detections || isModelsLoading}
//             className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
//               detections && !isModelsLoading
//                 ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Capture Analysis
//           </button>
//         </div>

//         {/* Live Detection Info */}
//         {detections && detections.length > 0 && !isModelsLoading && (
//           <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//             <p className="text-sm text-purple-800 font-medium">
//               Live Detection Active
//             </p>
//             <p className="text-xs text-purple-600">
//               Real-time emotion analysis running. Click "Capture" to save current state.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Results Panel */}
//       <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800">
//           Analysis Results
//         </h3>

//         {capturedData ? (
//           <div className="space-y-4">
//             {/* Basic Info Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               {[
//                 ["Age", capturedData.age],
//                 ["Gender", capturedData.gender],
//                 ["Primary Emotion", capturedData.emotion],
//                 ["Confidence", `${capturedData.confidence}%`],
//               ].map(([label, value]) => (
//                 <div
//                   key={label}
//                   className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm"
//                 >
//                   <p className="text-sm text-gray-500">{label}</p>
//                   <p className="text-lg font-semibold text-gray-800 capitalize">
//                     {value}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* Detailed Expressions */}
//             {capturedData.expressions && capturedData.expressions.length > 0 && (
//               <div className="p-4 bg-gray-50 rounded-xl">
//                 <h4 className="font-medium text-gray-700 mb-3">
//                   Emotion Breakdown
//                 </h4>
//                 <div className="space-y-2">
//                   {capturedData.expressions.map(({ emotion, confidence }) => (
//                     <div key={emotion} className="flex justify-between items-center">
//                       <span className="text-sm capitalize text-gray-600">
//                         {emotion}
//                       </span>
//                       <div className="flex items-center gap-2">
//                         <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-purple-400 transition-all"
//                             style={{ width: `${confidence}%` }}
//                           />
//                         </div>
//                         <span className="text-xs text-gray-500 w-8">
//                           {confidence}%
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Song Recommendations */}
//             <div className="mt-6">
//               <SongRecommendation
//                 emotion={capturedData.emotion}
//                 age={capturedData.age}
//                 gender={capturedData.gender}
//                 language="English"
//                 genre="Pop"
//               />
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setCapturedData(null)}
//                 className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
//               >
//                 Clear Results
//               </button>
//               <button
//                 onClick={handleCapture}
//                 className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium transition-all hover:shadow-lg"
//               >
//                 Refresh Analysis
//               </button>
//             </div>

//             <p className="text-xs text-gray-400 text-center">
//               Captured at {capturedData.timestamp}
//             </p>
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <div className="text-gray-300 text-6xl mb-4">🎭</div>
//             <p className="text-gray-500 text-sm">
//               No analysis captured yet.
//             </p>
//             <p className="text-gray-400 text-xs mt-2">
//               Position your face in front of the camera and click "Capture Analysis"
//             </p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }


// Updated FaceDetection.jsx for multi-language support
"use client";
import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";
import SongRecommendation from "./SongRecommendation";

export default function FaceDetection({ onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState(null);
  const [capturedData, setCapturedData] = useState(null);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);

  // 1) Load models (from /public/models)
  useEffect(() => {
    let progressId;
    const loadModels = async () => {
      try {
        setError(null);
        // Next.js: serve from /public/models
        const MODEL_URL = `/models`;
        
        progressId = setInterval(() => {
          setScanProgress((p) => (p >= 90 ? 90 : p + 10));
        }, 200);

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);

        setScanProgress(95);
        await startVideo();
        setScanProgress(100);
        
        setTimeout(() => {
          setIsModelsLoading(false);
          setIsDetecting(true);
        }, 500);

      } catch (error) {
        console.error("Model loading error:", error);
        setError("Failed to load AI models. Please refresh and try again.");
        setIsModelsLoading(false);
      }
    };

    loadModels();

    return () => {
      if (progressId) clearInterval(progressId);
    };
  }, []);

  // 2) Start camera
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 370 }
        },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        return new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied. Please allow camera permissions and refresh.");
      throw err;
    }
  };

  // 3) Continuous detection loop
  useEffect(() => {
    let animationId;
    
    const detect = async () => {
      if (!videoRef.current || !isDetecting || isModelsLoading) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      const video = videoRef.current;
      
      // Check if video is ready
      if (video.readyState !== 4) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      try {
        const results = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ 
              scoreThreshold: 0.5,
              inputSize: 416
            })
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        setDetections(results);
        draw(results);
      } catch (e) {
        console.error("Detection error:", e);
      }
      
      animationId = requestAnimationFrame(detect);
    };

    if (isDetecting) {
      animationId = requestAnimationFrame(detect);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isDetecting, isModelsLoading]);

  // 4) Draw overlays - FIXED VERSION
  const draw = (results) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !results || results.length === 0) return;

    // Set canvas size to match video display size
    const videoRect = video.getBoundingClientRect();
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factors from video's native size to displayed size
    const scaleX = canvas.width / video.videoWidth;
    const scaleY = canvas.height / video.videoHeight;

    results.forEach((result) => {
      const { detection, landmarks, expressions, age, gender } = result;
      
      if (!detection) return;

      // Get the bounding box
      const box = detection.box;
      
      // Scale the coordinates
      const scaledBox = {
        x: box.x * scaleX,
        y: box.y * scaleY,
        width: box.width * scaleX,
        height: box.height * scaleY
      };

      // Mirror the x coordinate for the flipped video
      const mirroredX = canvas.width - scaledBox.x - scaledBox.width;

      // Draw face detection box
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 3;
      ctx.strokeRect(mirroredX, scaledBox.y, scaledBox.width, scaledBox.height);

      // Draw age/gender label
      if (age !== undefined || gender) {
        const ageText = age ? Math.round(age) : '';
        const genderText = gender || '';
        const labelText = `${ageText} ${genderText}`.trim();
        
        if (labelText) {
          ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
          ctx.fillRect(mirroredX, scaledBox.y - 25, 120, 20);
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px Arial";
          ctx.fillText(labelText, mirroredX + 5, scaledBox.y - 10);
        }
      }

      // Draw landmarks
      if (landmarks && landmarks.positions) {
        ctx.fillStyle = "#ec4899";
        landmarks.positions.forEach(point => {
          const mirroredPointX = canvas.width - (point.x * scaleX);
          ctx.beginPath();
          ctx.arc(mirroredPointX, point.y * scaleY, 1.5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // Draw expressions
      if (expressions) {
        const sortedExpressions = Object.entries(expressions)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3);

        sortedExpressions.forEach(([expression, confidence], index) => {
          const text = `${expression}: ${Math.round(confidence * 100)}%`;
          const y = scaledBox.y + scaledBox.height + 20 + (index * 20);
          
          // Measure text width for background
          ctx.font = "bold 12px Arial";
          const textWidth = ctx.measureText(text).width;
          
          // Draw background
          ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
          ctx.fillRect(mirroredX - 5, y - 14, textWidth + 10, 18);
          
          // Draw text
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, mirroredX, y);
        });
      }
    });
  };

  // 5) Capture one frame's analysis
  const handleCapture = () => {
    if (detections && detections.length > 0) {
      const detection = detections[0]; // Get first detected face
      const { age, gender, expressions } = detection;
      
      const sortedExpressions = Object.entries(expressions || {})
        .sort(([,a], [,b]) => b - a);
        
      const mostLikelyEmotion = sortedExpressions[0]?.[0] || "neutral";
      const confidence = sortedExpressions[0]?.[1] || 0;

      setCapturedData({
        age: age ? Math.round(age) : "Unknown",
        gender: gender || "Unknown",
        emotion: mostLikelyEmotion,
        confidence: Math.round(confidence * 100),
        expressions: sortedExpressions.slice(0, 5).map(([expr, conf]) => ({
          emotion: expr,
          confidence: Math.round(conf * 100)
        })),
        timestamp: new Date().toLocaleTimeString(),
      });
    } else {
      // No face detected
      setCapturedData({
        age: "No face detected",
        gender: "No face detected",
        emotion: "neutral",
        confidence: 0,
        expressions: [],
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // 6) Cleanup camera when closing/unmounting
  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Auto-detect faces every 5 seconds for demo
  useEffect(() => {
    if (!isDetecting || isModelsLoading) return;
    
    const interval = setInterval(() => {
      if (detections && detections.length > 0) {
        handleCapture();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [detections, isDetecting, isModelsLoading]);

  if (error) {
    return (
      <motion.div
        className="min-h-[70vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center p-8 bg-red-50 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-[70vh] flex flex-col lg:flex-row gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Camera Panel */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            🎭 AI Face Scanner
          </h2>
          {detections && detections.length > 0 && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {detections.length} face{detections.length !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-900">
          <video
            ref={videoRef}
            className="rounded-xl w-full h-auto"
            autoPlay
            muted
            playsInline
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          />

          {isModelsLoading && (
            <div className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center rounded-xl" style={{ zIndex: 20 }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-white font-medium mb-2">
                Loading AI Models...
              </p>
              <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="text-gray-300 text-sm mt-2">{scanProgress}%</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
          >
            Close Scanner
          </button>
          <button
            onClick={handleCapture}
            disabled={!detections || isModelsLoading}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              detections && !isModelsLoading
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Capture Analysis
          </button>
        </div>

        {/* Live Detection Info */}
        {detections && detections.length > 0 && !isModelsLoading && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800 font-medium">
              🌍 Live Multi-Language Detection Active
            </p>
            <p className="text-xs text-purple-600">
              Real-time emotion analysis running. Songs will be recommended in English, Hindi, Spanish & Korean.
            </p>
          </div>
        )}
      </div>

      {/* Results Panel */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          📊 Analysis Results
          {capturedData && (
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Multi-Language Ready
            </span>
          )}
        </h3>

        {capturedData ? (
          <div className="space-y-4">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Age", capturedData.age],
                ["Gender", capturedData.gender],
                ["Primary Emotion", capturedData.emotion],
                ["Confidence", `${capturedData.confidence}%`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm"
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Detailed Expressions */}
            {capturedData.expressions && capturedData.expressions.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  🎭 Emotion Breakdown
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Global Music Context
                  </span>
                </h4>
                <div className="space-y-2">
                  {capturedData.expressions.map(({ emotion, confidence }) => (
                    <div key={emotion} className="flex justify-between items-center">
                      <span className="text-sm capitalize text-gray-600">
                        {emotion}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-400 transition-all"
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Language Song Recommendations */}
            <div className="mt-6">
              <SongRecommendation
                emotion={capturedData.emotion}
                age={capturedData.age}
                gender={capturedData.gender}
                genre="Pop"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCapturedData(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
              >
                Clear Results
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium transition-all hover:shadow-lg"
              >
                🌍 Refresh Global Analysis
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Captured at {capturedData.timestamp} • Multi-Language Support Active
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-300 text-6xl mb-4">🌍</div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              Global Music Discovery Ready
            </h4>
            <p className="text-gray-500 text-sm mb-2">
              No analysis captured yet.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Position your face in camera and click "Capture Analysis" to get songs in 4 languages
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">🇺🇸 English</span>
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">🇮🇳 Hindi</span>
              <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">🇪🇸 Spanish</span>
              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">🇰🇷 Korean</span>
                            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">🇮🇳 Tamil</span>

            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}