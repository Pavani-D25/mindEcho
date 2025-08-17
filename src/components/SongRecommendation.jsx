

// import React, { useEffect, useState, useRef } from "react";
// import { Play, SkipBack, SkipForward, Heart, ExternalLink, Music, Maximize2, Minimize2, RefreshCw, AlertCircle, Pause } from "lucide-react";

// const SongRecommendation = ({ emotion = "happy", age = "25", gender = "unknown", genre = "Pop" }) => {
//   const [songsByLanguage, setSongsByLanguage] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const [activeLanguage, setActiveLanguage] = useState('English');

//   // Player state
//   const [playlist, setPlaylist] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentSong, setCurrentSong] = useState(null);
//   const [showPlayer, setShowPlayer] = useState(false);
//   const [playerExpanded, setPlayerExpanded] = useState(false);
//   const [playerReady, setPlayerReady] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playerError, setPlayerError] = useState(false);

//   // YouTube iframe ref
//   const iframeRef = useRef(null);

//   // Favorites persisted in memory (localStorage removed for Claude.ai compatibility)
//   const [favorites, setFavorites] = useState(new Set());

//   const languagesOrder = ['English', 'Hindi', 'Spanish', 'Korean', 'Tamil'];
//   const languageEmojis = {
//     English: '🇺🇸',
//     Hindi: '🇮🇳',
//     Spanish: '🇪🇸',
//     Korean: '🇰🇷',
//     Tamil: '🇮🇳',
//   };

//   // Extract YouTube video ID from various URL formats
//   const extractVideoId = (url) => {
//     if (!url) return null;
    
//     const patterns = [
//       /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
//       /youtube\.com\/v\/([^&\n?#]+)/,
//       /youtube\.com\/watch\?.*v=([^&\n?#]+)/
//     ];
    
//     for (const pattern of patterns) {
//       const match = url.match(pattern);
//       if (match && match[1]) {
//         return match[1];
//       }
//     }
//     return null;
//   };

//   // Enhanced embed info generation with proper YouTube embed URLs
//   const getEmbedInfo = (song) => {
//     // First check if videoId is directly provided
//     if (song.videoId && song.videoId.length > 0) {
//       return { 
//         kind: 'video', 
//         videoId: song.videoId,
//         embedUrl: `https://www.youtube.com/embed/${song.videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&controls=1`,
//         fallbackUrl: `https://www.youtube.com/watch?v=${song.videoId}`
//       };
//     }

//     // Prefer structured info from API (yt object)
//     if (song.yt?.type === 'video' && song.yt.videoId && song.yt.videoId.length > 0) {
//       return { 
//         kind: 'video', 
//         videoId: song.yt.videoId,
//         embedUrl: `https://www.youtube.com/embed/${song.yt.videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&controls=1`,
//         fallbackUrl: `https://www.youtube.com/watch?v=${song.yt.videoId}`
//       };
//     }
    
//     // Try to extract from URL
//     if (song.url) {
//       const videoId = extractVideoId(song.url);
//       if (videoId && videoId.length > 0) {
//         return { 
//           kind: 'video', 
//           videoId: videoId,
//           embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&controls=1`,
//           fallbackUrl: song.url
//         };
//       }
//     }

//     // Search fallback - no video ID available
//     const query = `${song.title} ${song.artist || ''}`.trim();
//     return {
//       kind: 'search',
//       videoId: null,
//       query: query,
//       embedUrl: null,
//       fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
//     };
//   };

//   // Demo data for Claude.ai environment with proper video IDs
//   useEffect(() => {
//     const demoData = {
//       English: [
//         { title: "Happy", artist: "Pharrell Williams", url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs", videoId: "ZbZSe6N_BXs" },
//         { title: "Blinding Lights", artist: "The Weeknd", url: "https://www.youtube.com/watch?v=fHI8X4OXluQ", videoId: "fHI8X4OXluQ" },
//         { title: "Shape of You", artist: "Ed Sheeran", url: "https://www.youtube.com/watch?v=JGwWNGJdvx8", videoId: "JGwWNGJdvx8" },
//         { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", url: "https://www.youtube.com/watch?v=OPf0YbXqDm0", videoId: "OPf0YbXqDm0" },
//         { title: "Can't Stop The Feeling", artist: "Justin Timberlake", url: "https://www.youtube.com/watch?v=ru0K8uYEZWw", videoId: "ru0K8uYEZWw" }
//       ],
//       Hindi: [
//         { title: "Kesariya", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=kVqar1GNjq0", videoId: "kVqar1GNjq0" },
//         { title: "Tum Hi Ho", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=IJq0yyWug1k", videoId: "IJq0yyWug1k" },
//         { title: "Jai Ho", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=Eo_mo5vA7tw", videoId: "Eo_mo5vA7tw" },
//         { title: "Gallan Goodiyaan", artist: "Various Artists", url: "https://www.youtube.com/watch?v=2IB1OhzPYTE", videoId: "2IB1OhzPYTE" },
//         { title: "Badtameez Dil", artist: "Benny Dayal", url: "https://www.youtube.com/watch?v=5T5BY1j2MkE", videoId: "5T5BY1j2MkE" }
//       ],
//       Spanish: [
//         { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk", videoId: "kJQP7kiw5Fk" },
//         { title: "Macarena", artist: "Los Del Rio", url: "https://www.youtube.com/watch?v=zWaymcVmJ-A", videoId: "zWaymcVmJ-A" },
//         { title: "Bamboléo", artist: "Gipsy Kings", url: "https://www.youtube.com/watch?v=9euSpM1UqgU", videoId: "9euSpM1UqgU" },
//         { title: "Con Altura", artist: "Rosalía & J Balvin", url: "https://www.youtube.com/watch?v=p7bfOZek9t4", videoId: "p7bfOZek9t4" },
//         { title: "Vivir Mi Vida", artist: "Marc Anthony", url: "https://www.youtube.com/watch?v=YXnjy5YlDwk", videoId: "YXnjy5YlDwk" }
//       ],
//       Korean: [
//         { title: "Dynamite", artist: "BTS", url: "https://www.youtube.com/watch?v=gdZLi9oWNZg", videoId: "gdZLi9oWNZg" },
//         { title: "Gangnam Style", artist: "PSY", url: "https://www.youtube.com/watch?v=9bZkp7q19f0", videoId: "9bZkp7q19f0" },
//         { title: "Butter", artist: "BTS", url: "https://www.youtube.com/watch?v=WMweEpGlu_U", videoId: "WMweEpGlu_U" },
//         { title: "Kill This Love", artist: "BLACKPINK", url: "https://www.youtube.com/watch?v=2S24-y0Ij3Y", videoId: "2S24-y0Ij3Y" },
//         { title: "How You Like That", artist: "BLACKPINK", url: "https://www.youtube.com/watch?v=ioNng23DkIM", videoId: "ioNng23DkIM" }
//       ],
//       Tamil: [
//         { title: "Vaathi Coming", artist: "Anirudh Ravichander", url: "https://www.youtube.com/watch?v=rZGAl3KdBSk", videoId: "rZGAl3KdBSk" },
//         { title: "Arabic Kuthu", artist: "Anirudh Ravichander", url: "https://www.youtube.com/watch?v=fiE5MYzKnO8", videoId: "fiE5MYzKnO8" },
//         { title: "Enjoy Enjaami", artist: "Dhee ft. Arivu", url: "https://www.youtube.com/watch?v=rWNNSUWpjqo", videoId: "rWNNSUWpjqo" },
//         { title: "Aalaporan Thamizhan", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=R-eDMgB22bg", videoId: "R-eDMgB22bg" },
//         { title: "Rowdy Baby", artist: "Dhanush & Dhee", url: "https://www.youtube.com/watch?v=x6Q7c9RyMzk", videoId: "x6Q7c9RyMzk" }
//       ]
//     };

//     setSongsByLanguage(demoData);
//     setActiveLanguage('English');

//     // Build unified playlist with embed info
//     const all = [];
//     Object.entries(demoData).forEach(([lang, songs]) => {
//       songs.forEach((s) => {
//         const embed = getEmbedInfo(s);
//         all.push({
//           ...s,
//           language: lang,
//           embed,
//         });
//       });
//     });
    
//     setPlaylist(all);

//     if (all.length > 0) {
//       setCurrentIndex(0);
//       setCurrentSong(all[0]);
//       setShowPlayer(true);
//       setPlayerError(false);
//     }
//   }, []);

//   const handlePlaySong = (song) => {
//     const idx = playlist.findIndex(
//       (s) => s.title === song.title && s.artist === song.artist && s.language === song.language
//     );
//     if (idx >= 0) {
//       setCurrentIndex(idx);
//       setCurrentSong(playlist[idx]);
//       setShowPlayer(true);
//       setPlayerError(false);
//       setPlayerReady(false);
//       setIsPlaying(true);
//     }
//   };

//   const handleNext = () => {
//     if (!playlist.length) return;
//     const nextIndex = (currentIndex + 1) % playlist.length;
//     setCurrentIndex(nextIndex);
//     setCurrentSong(playlist[nextIndex]);
//     setPlayerError(false);
//     setPlayerReady(false);
//   };

//   const handlePrevious = () => {
//     if (!playlist.length) return;
//     const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
//     setCurrentIndex(prevIndex);
//     setCurrentSong(playlist[prevIndex]);
//     setPlayerError(false);
//     setPlayerReady(false);
//   };

//   const togglePlayPause = () => {
//     // Note: YouTube iframe API requires more complex setup for programmatic control
//     // For now, users can use the built-in YouTube controls
//     if (iframeRef.current) {
//       // Basic iframe interaction - limited without YouTube API setup
//       console.log('Player control - use YouTube controls in the embedded video');
//     }
//   };

//   const toggleFavorite = (song) => {
//     const key = `${song.title}-${song.artist}-${song.language}`;
//     const newFav = new Set(favorites);
//     if (newFav.has(key)) newFav.delete(key);
//     else newFav.add(key);
//     setFavorites(newFav);
//   };

//   const handleRetry = () => {
//     setRetryCount((x) => x + 1);
//     setError(null);
//   };

//   // YouTube iframe event handlers
//   const onIframeLoad = () => {
//     setPlayerReady(true);
//     setPlayerError(false);
//   };

//   const onIframeError = () => {
//     setPlayerError(true);
//     setPlayerReady(false);
//   };

//   const activeSongs = songsByLanguage[activeLanguage] || [];
//   const totalSongs = Object.values(songsByLanguage).reduce((acc, list) => acc + (list?.length || 0), 0);

//   if (loading) {
//     return (
//       <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//           <h4 className="text-lg font-semibold text-gray-800">🌍 Multi-Language Music Player</h4>
//         </div>
//         <p className="text-gray-600">
//           Finding perfect songs in 5 languages for your <span className="font-medium text-purple-600">{emotion}</span> mood...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h4 className="text-lg font-semibold text-gray-800">
//             🌍 Perfect for your <span className="text-purple-600 capitalize">{emotion}</span> mood
//           </h4>
//           <p className="text-sm text-gray-600">
//             {totalSongs} songs across {Object.keys(songsByLanguage).length} languages • Enhanced YouTube Player
//           </p>
//         </div>
//         <button
//           onClick={handleRetry}
//           className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
//         >
//           <RefreshCw className="w-3 h-3" />
//           Refresh
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
//           <AlertCircle className="w-4 h-4" />
//           {error}
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="flex flex-wrap gap-2 mb-4 p-1 bg-white rounded-lg">
//         {languagesOrder
//           .filter((l) => songsByLanguage[l]?.length)
//           .map((lang) => (
//             <button
//               key={lang}
//               onClick={() => setActiveLanguage(lang)}
//               className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
//                 activeLanguage === lang
//                   ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <span>{languageEmojis[lang]}</span>
//               <span>{lang}</span>
//               <span className="text-xs opacity-75">({songsByLanguage[lang].length})</span>
//             </button>
//           ))}
//       </div>

//       {/* Enhanced Player with react-youtube-embed */}
//       {showPlayer && currentSong && (
//         <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
//           <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//             <div className="flex items-center gap-3">
//               <Music className="w-5 h-5" />
//               <div>
//                 <h5 className="font-semibold text-sm">{currentSong.title}</h5>
//                 <p className="text-xs opacity-90">by {currentSong.artist}</p>
//               </div>
//               <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
//                 {languageEmojis[currentSong.language]} {currentSong.language}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPlayerExpanded((v) => !v)}
//                 className="p-1 hover:bg-white/20 rounded transition-colors"
//                 title={playerExpanded ? "Minimize player" : "Expand player"}
//               >
//                 {playerExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
//               </button>
//               <button 
//                 onClick={() => setShowPlayer(false)} 
//                 className="p-1 hover:bg-white/20 rounded transition-colors"
//                 title="Close player"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>

//           <div className={`relative ${playerExpanded ? 'aspect-video' : 'aspect-video max-h-64'}`}>
//             {playerError ? (
//               <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
//                 <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
//                 <p className="text-sm text-gray-600 mb-3">Video unavailable</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setPlayerError(false);
//                       setPlayerReady(false);
//                     }}
//                     className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                   >
//                     Retry
//                   </button>
//                   {currentSong.embed.fallbackUrl && (
//                     <a
//                       href={currentSong.embed.fallbackUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
//                     >
//                       <ExternalLink className="w-3 h-3" />
//                       Open YouTube
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ) : currentSong.embed.embedUrl ? (
//               <>
//                 {!playerReady && (
//                   <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
//                   </div>
//                 )}
//                 <iframe
//                   ref={iframeRef}
//                   key={`${currentSong.title}-${currentIndex}`}
//                   src={currentSong.embed.embedUrl}
//                   title={`${currentSong.title} by ${currentSong.artist}`}
//                   className="w-full h-full rounded-lg"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                   allowFullScreen
//                   onLoad={onIframeLoad}
//                   onError={onIframeError}
//                   referrerPolicy="strict-origin-when-cross-origin"
//                 />
//               </>
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center">
//                 <Music className="w-12 h-12 text-purple-400 mb-3" />
//                 <p className="text-sm text-gray-600 mb-2">Video not available for embedding</p>
//                 <p className="text-xs text-gray-500 mb-3">Song: {currentSong.title}</p>
//                 {currentSong.embed.fallbackUrl && (
//                   <a
//                     href={currentSong.embed.fallbackUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors flex items-center gap-1"
//                   >
//                     <ExternalLink className="w-3 h-3" />
//                     Open on YouTube
//                   </a>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="flex items-center justify-center gap-4 p-3 bg-gray-50">
//             <button
//               onClick={handlePrevious}
//               className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
//               disabled={playlist.length <= 1}
//               title="Previous song"
//             >
//               <SkipBack className="w-5 h-5 text-gray-600" />
//             </button>
            
//             <button
//               onClick={handleNext}
//               className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
//               disabled={playlist.length <= 1}
//               title="Next song"
//             >
//               <SkipForward className="w-5 h-5 text-gray-600" />
//             </button>

//             <div className="text-center ml-4">
//               <div className="text-xs text-gray-500">
//                 {playlist.length ? currentIndex + 1 : 0} of {playlist.length}
//               </div>
//               {playerError && (
//                 <div className="text-xs text-red-500">Player error</div>
//               )}
//               {playerReady && (
//                 <div className="text-xs text-green-500">Ready</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Song list */}
//       <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//         {activeSongs.map((song, idx) => {
//           const key = `${song.title}-${song.artist}-${activeLanguage}`;
//           const isFav = favorites.has(key);
//           const songWithEmbed = { ...song, language: activeLanguage, embed: getEmbedInfo({ ...song, language: activeLanguage }) };
//           const playable = !!(songWithEmbed.embed?.embedUrl);
//           const isCurrent =
//             currentSong &&
//             currentSong.title === song.title &&
//             currentSong.artist === song.artist &&
//             currentSong.language === activeLanguage;

//           return (
//             <div
//               key={`${song.title}-${idx}`}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
//                 playable ? 'cursor-pointer' : 'cursor-not-allowed'
//               } ${isCurrent ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200' : 'bg-white hover:bg-gray-50'}`}
//               onClick={() => playable && handlePlaySong(songWithEmbed)}
//             >
//               <button
//                 disabled={!playable}
//                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                   !playable
//                     ? 'bg-gray-200 text-gray-400'
//                     : isCurrent
//                     ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
//                     : 'bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600'
//                 }`}
//                 title={playable ? 'Play' : 'Video ID not available'}
//               >
//                 <Play className="w-4 h-4" />
//               </button>

//               <div className="flex-1 min-w-0">
//                 <h5 className={`font-medium text-sm leading-tight truncate ${isCurrent ? 'text-purple-700' : 'text-gray-800'}`}>
//                   {song.title}
//                 </h5>
//                 {song.artist && <p className="text-gray-500 text-xs truncate">by {song.artist}</p>}
//                 {!playable && <p className="text-orange-500 text-xs">Video ID not found</p>}
//               </div>

//               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavorite(songWithEmbed);
//                   }}
//                   className={`p-1 rounded hover:bg-gray-100 transition-colors ${isFav ? 'text-red-500' : 'text-gray-400'}`}
//                   title={isFav ? 'Remove favorite' : 'Add favorite'}
//                 >
//                   <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
//                 </button>

//                 {(song.url || songWithEmbed.embed?.fallbackUrl) && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       const url = song.url || songWithEmbed.embed.fallbackUrl;
//                       window.open(url, '_blank', 'noopener,noreferrer');
//                     }}
//                     className="p-1 text-gray-400 hover:text-blue-500 rounded hover:bg-gray-100 transition-colors"
//                     title="Open on YouTube"
//                   >
//                     <ExternalLink className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               <div className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
//                 {languageEmojis[activeLanguage]}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Footer */}
//       <div className="mt-4 pt-3 border-t border-gray-200">
//         <div className="flex items-center justify-between text-xs text-gray-400">
//           <span>🎵 Enhanced YouTube Player • Global Music • {genre}</span>
//           <span>{favorites.size} favorites</span>
//         </div>
//         <div className="mt-2 text-xs text-gray-500">
//           🚀 Enhanced YouTube Player • Auto-play • Built-in YouTube controls
//         </div>
//       </div>

//       <style jsx>{`
//         .scrollbar-thin::-webkit-scrollbar { width: 6px; }
//         .scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
//         .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
//         .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>
//     </div>
//   );
// };

// export default SongRecommendation;

import React, { useState, useEffect } from "react";
import { Music, Heart, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

const SongRecommendation = ({ emotion = "happy", age = "25", gender = "unknown", genre = "Pop" }) => {
  const [songsByLanguage, setSongsByLanguage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [favorites, setFavorites] = useState(new Set());

  const languagesOrder = ['English', 'Hindi', 'Spanish', 'Korean', 'Tamil'];
  const languageEmojis = {
    English: '🇺🇸',
    Hindi: '🇮🇳',
    Spanish: '🇪🇸',
    Korean: '🇰🇷',
    Tamil: '🇮🇳',
  };

  // Fetch recommendations from API
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/song-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotion,
          age,
          gender,
          genre
        })
      });

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.songsByLanguage && Object.keys(data.songsByLanguage).length > 0) {
        setSongsByLanguage(data.songsByLanguage);
        setActiveLanguage(Object.keys(data.songsByLanguage)[0]);
      } else {
        throw new Error('No songs received from API');
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError(err.message || 'Failed to fetch song recommendations');
      
      // Fallback to demo data
      setSongsByLanguage({
        English: [
          { title: "Happy", artist: "Pharrell Williams", videoId: "ZbZSe6N_BXs" },
          { title: "Blinding Lights", artist: "The Weeknd", videoId: "fHI8X4OXluQ" },
          { title: "Shape of You", artist: "Ed Sheeran", videoId: "JGwWNGJdvx8" }
        ],
        Hindi: [
          { title: "Kesariya", artist: "Arijit Singh", videoId: "kVqar1GNjq0" },
          { title: "Tum Hi Ho", artist: "Arijit Singh", videoId: "IJq0yyWug1k" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [retryCount]);

  // Get YouTube URL for a song
  const getYouTubeUrl = (song) => {
    if (song.videoId) {
      return `https://www.youtube.com/watch?v=${song.videoId}`;
    }
    if (song.url) {
      return song.url;
    }
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${song.title} ${song.artist || ''}`.trim()
    )}`;
  };

  const toggleFavorite = (song) => {
    const key = `${song.title}-${song.artist}-${activeLanguage}`;
    const newFav = new Set(favorites);
    newFav.has(key) ? newFav.delete(key) : newFav.add(key);
    setFavorites(newFav);
  };

  const handleRetry = () => {
    setRetryCount((x) => x + 1);
    setError(null);
  };

  const activeSongs = songsByLanguage[activeLanguage] || [];
  const totalSongs = Object.values(songsByLanguage).reduce((acc, list) => acc + (list?.length || 0), 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <h4 className="text-lg font-semibold text-gray-800">🌍 Finding your perfect songs</h4>
        </div>
        <p className="text-gray-600">
          Searching for {emotion} songs in 5 languages...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            🌍 {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood Songs
          </h4>
          <p className="text-sm text-gray-600">
            {totalSongs} songs across {Object.keys(songsByLanguage).length} languages
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4 p-1 bg-white rounded-lg">
        {languagesOrder
          .filter((l) => songsByLanguage[l]?.length)
          .map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeLanguage === lang
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{languageEmojis[lang]}</span>
              <span>{lang}</span>
              <span className="text-xs opacity-75">({songsByLanguage[lang].length})</span>
            </button>
          ))}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {activeSongs.map((song, idx) => {
          const key = `${song.title}-${song.artist}-${activeLanguage}`;
          const isFav = favorites.has(key);
          const youtubeUrl = getYouTubeUrl(song);

          return (
            <div
              key={`${song.title}-${idx}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <Music className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-sm leading-tight truncate text-gray-800">
                  {song.title}
                </h5>
                <p className="text-gray-500 text-xs truncate">
                  {song.artist || 'Unknown Artist'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song);
                  }}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                    isFav ? 'text-red-500' : 'text-gray-400'
                  }`}
                  title={isFav ? 'Remove favorite' : 'Add favorite'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => window.open(youtubeUrl, '_blank', 'noopener,noreferrer')}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Open on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>🎵 Music Recommendations • {genre}</span>
          <span>{favorites.size} favorites</span>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default SongRecommendation;