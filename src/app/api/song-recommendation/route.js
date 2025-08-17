


// // app/api/song-recommendation/route.js
// import { NextResponse } from 'next/server';

// // ---------- Enhanced YouTube helpers ----------
// function buildSearchKeywords(language) {
//   const languageKeywords = {
//     Hindi: 'bollywood hindi song official',
//     Spanish: 'spanish latino musica official',
//     Korean: 'kpop korean music official mv',
//     Tamil: 'tamil kollywood song official',
//     English: 'official music video'
//   };
//   return languageKeywords[language] || 'official music video';
// }

// function bestMatchFromItems(items, title, artist) {
//   if (!Array.isArray(items) || items.length === 0) return null;

//   const t = (s) => (s || '').toLowerCase().trim();
//   const wantedTitle = t(title);
//   const wantedArtist = t(artist || '');

//   let best = null;
//   let bestScore = -1;

//   for (const it of items) {
//     const snippet = it?.snippet;
//     const vid = it?.id?.videoId;
//     if (!snippet || !vid) continue;

//     const titleText = t(snippet.title);
//     const channelText = t(snippet.channelTitle);
//     const descText = t(snippet.description || '');
//     const hay = `${titleText} ${channelText} ${descText}`;

//     // Enhanced scoring system
//     let score = 0;
    
//     // Exact title match gets highest priority
//     if (wantedTitle && titleText.includes(wantedTitle)) score += 5;
    
//     // Artist match in title or channel
//     if (wantedArtist) {
//       if (titleText.includes(wantedArtist)) score += 4;
//       if (channelText.includes(wantedArtist)) score += 3;
//     }
    
//     // Official content indicators
//     if (hay.includes('official video')) score += 3;
//     if (hay.includes('official audio')) score += 2;
//     if (hay.includes('lyric video')) score += 2;
//     if (hay.includes('music video')) score += 1;
    
//     // Prefer verified channels (VEVO, official artist channels)
//     if (channelText.includes('vevo') || channelText.includes('official')) score += 2;
    
//     // Duration preference (avoid very short clips)
//     const duration = snippet.duration;
//     if (duration && !duration.includes('PT0M')) score += 1;
    
//     // View count preference (if available in snippet)
//     if (snippet.statistics?.viewCount) {
//       const views = parseInt(snippet.statistics.viewCount);
//       if (views > 1000000) score += 1; // 1M+ views
//     }

//     if (score > bestScore) {
//       bestScore = score;
//       best = vid;
//     }
//   }
  
//   // Return best match or first available video
//   return best || items[0]?.id?.videoId || null;
// }

// async function searchYouTubeVideoId({ title, artist, language }) {
//   const API_KEY = process.env.YOUTUBE_API_KEY;
//   const languageContext = buildSearchKeywords(language);
//   const query = `${title} ${artist || ''} ${languageContext}`.trim();

//   // Enhanced fallback that works better for embedding
//   if (!API_KEY) {
//     const encodedQuery = encodeURIComponent(query);
//     return {
//       type: 'search',
//       embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
//       watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
//       fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
//     };
//   }

//   try {
//     // Search with more parameters for better results
//     const url = new URL('https://www.googleapis.com/youtube/v3/search');
//     url.searchParams.set('part', 'snippet');
//     url.searchParams.set('maxResults', '10'); // Get more results for better matching
//     url.searchParams.set('q', query);
//     url.searchParams.set('type', 'video');
//     url.searchParams.set('videoEmbeddable', 'true'); // Only embeddable videos
//     url.searchParams.set('videoSyndicated', 'true'); // Only syndicated videos
//     url.searchParams.set('safeSearch', 'moderate');
//     url.searchParams.set('relevanceLanguage', language === 'English' ? 'en' : 
//                         language === 'Hindi' ? 'hi' : 
//                         language === 'Spanish' ? 'es' : 
//                         language === 'Korean' ? 'ko' : 
//                         language === 'Tamil' ? 'ta' : 'en');
//     url.searchParams.set('key', API_KEY);

//     const res = await fetch(url.toString());
//     if (!res.ok) {
//       console.error('YouTube API error:', res.status, await res.text());
//       // Enhanced fallback on API error
//       const encodedQuery = encodeURIComponent(query);
//       return {
//         type: 'search',
//         embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1`,
//         watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
//         fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
//       };
//     }

//     const data = await res.json();
//     const vid = bestMatchFromItems(data.items, title, artist);

//     if (vid) {
//       return {
//         type: 'video',
//         videoId: vid,
//         embedUrl: `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
//         watchUrl: `https://www.youtube.com/watch?v=${vid}`,
//         fallbackUrl: `https://www.youtube.com/watch?v=${vid}`
//       };
//     }

//     // No specific video found, use search playlist
//     const encodedQuery = encodeURIComponent(query);
//     return {
//       type: 'search',
//       embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1`,
//       watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
//       fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
//     };
//   } catch (e) {
//     console.error('YouTube search error:', e);
//     const encodedQuery = encodeURIComponent(query);
//     return {
//       type: 'search',
//       embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1`,
//       watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
//       fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
//     };
//   }
// }

// // ---------- Parsing helpers ----------
// function normalizeHeader(line) {
//   return line.trim().toUpperCase().replace(/\s+/g, ' ');
// }

// // Extract 5 songs per language from AI text; tolerant to missing colons / spacing
// function parseMultiLanguageSongs(content) {
//   const targetLangs = ['ENGLISH', 'HINDI', 'SPANISH', 'KOREAN', 'TAMIL'];
//   const lines = content.split('\n');

//   // Build sections map
//   const sections = {};
//   let current = null;
//   for (let raw of lines) {
//     const line = raw.trim();
//     if (!line) continue;

//     const upper = normalizeHeader(line);
//     const headerMatch = targetLangs.find((L) =>
//       new RegExp(`^${L}\\s*:?$`, 'i').test(upper)
//     );
//     if (headerMatch) {
//       current = headerMatch; // one of the uppercase names
//       sections[current] = [];
//       continue;
//     }
//     if (current) sections[current].push(line);
//   }

//   const out = {};
//   for (const lang of targetLangs) {
//     const rows = sections[lang] || [];
//     const songs = [];
//     for (const row of rows) {
//       const clean = row.replace(/^\d+\.\s*/, '').trim();
//       if (!clean || clean.length < 3) continue;

//       // Enhanced parsing patterns
//       const patterns = [
//         /^"([^"]+)"\s+by\s+(.+)$/i, // "Title" by Artist
//         /^([^-]+?)\s+by\s+(.+)$/i,  // Title by Artist
//         /^([^-]+?)\s*-\s*(.+)$/,    // Title - Artist
//         /^([^:]+):\s*(.+)$/,        // Artist: Title
//         /^(.+?)\s*\(\s*(.+?)\s*\)$/,// Title (Artist)
//         /^(.+?)\s*\|\s*(.+)$/       // Title | Artist
//       ];

//       let title = null, artist = 'Unknown Artist', matched = false;
//       for (const p of patterns) {
//         const m = clean.match(p);
//         if (m) {
//           if (p.source.includes('^([^:]+):\\s*(.+)$')) {
//             artist = m[1].trim();
//             title = m[2].trim().replace(/^["']|["']$/g, '');
//           } else if (p.source.includes('\\(\\s*(.+?)\\s*\\)')) {
//             title = m[1].trim().replace(/^["']|["']$/g, '');
//             artist = m[2].trim();
//           } else {
//             title = m[1].trim().replace(/^["']|["']$/g, '');
//             artist = (m[2] || '').trim() || 'Unknown Artist';
//           }
//           matched = true;
//           break;
//         }
//       }
//       if (!matched) {
//         title = clean.replace(/^["']|["']$/g, '');
//         // Try to extract artist from title if it contains common separators
//         const separators = [' by ', ' - ', ' ft. ', ' feat. ', ' featuring '];
//         for (const sep of separators) {
//           const parts = title.split(sep);
//           if (parts.length === 2) {
//             title = parts[0].trim();
//             artist = parts[1].trim();
//             break;
//           }
//         }
//       }

//       if (title && title.length >= 1) {
//         songs.push({ title, artist });
//         if (songs.length >= 5) break;
//       }
//     }

//     if (songs.length) {
//       const cap = lang.charAt(0) + lang.slice(1).toLowerCase();
//       out[cap] = songs;
//     }
//   }

//   return out;
// }

// // ---------- Enhanced Fallbacks ----------
// function getMultiLanguageFallbackSongs(emotion, genre) {
//   const fallbacks = {
//     happy: {
//       English: [
//         { title: "Happy", artist: "Pharrell Williams" },
//         { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
//         { title: "Can't Stop The Feeling", artist: "Justin Timberlake" },
//         { title: "Walking on Sunshine", artist: "Katrina and the Waves" },
//         { title: "Good 4 U", artist: "Olivia Rodrigo" },
//       ],
//       Hindi: [
//         { title: "Jai Ho", artist: "A.R. Rahman" },
//         { title: "Gallan Goodiyaan", artist: "Various Artists" },
//         { title: "Badtameez Dil", artist: "Benny Dayal" },
//         { title: "Tune Maari Entriyaan", artist: "Vishal Dadlani" },
//         { title: "Nagada Sang Dhol", artist: "Shreya Ghoshal" },
//       ],
//       Spanish: [
//         { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
//         { title: "Vivir Mi Vida", artist: "Marc Anthony" },
//         { title: "Bamboléo", artist: "Gipsy Kings" },
//         { title: "Macarena", artist: "Los Del Rio" },
//         { title: "La Vida Es Una Fiesta", artist: "Manu Chao" },
//       ],
//       Korean: [
//         { title: "Dynamite", artist: "BTS" },
//         { title: "Gangnam Style", artist: "PSY" },
//         { title: "Ice Cream", artist: "BLACKPINK & Selena Gomez" },
//         { title: "Feel My Rhythm", artist: "Red Velvet" },
//         { title: "Next Level", artist: "aespa" },
//       ],
//       Tamil: [
//         { title: "Vaathi Coming", artist: "Anirudh Ravichander" },
//         { title: "Arabic Kuthu", artist: "Anirudh Ravichander" },
//         { title: "Aalaporan Thamizhan", artist: "A.R. Rahman" },
//         { title: "Maari Thara Local", artist: "Dhanush" },
//         { title: "Yaakai Thiri", artist: "A.R. Rahman" },
//       ],
//     },
//     sad: {
//       English: [
//         { title: "Someone Like You", artist: "Adele" },
//         { title: "Fix You", artist: "Coldplay" },
//         { title: "Mad World", artist: "Gary Jules" },
//         { title: "Hurt", artist: "Johnny Cash" },
//         { title: "Skinny Love", artist: "Bon Iver" },
//       ],
//       Hindi: [
//         { title: "Tum Hi Ho", artist: "Arijit Singh" },
//         { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh" },
//         { title: "Channa Mereya", artist: "Arijit Singh" },
//         { title: "Raabta", artist: "Arijit Singh" },
//         { title: "Tera Hone Laga Hoon", artist: "Atif Aslam" },
//       ],
//       Spanish: [
//         { title: "Lágrimas Negras", artist: "Bebo Valdés" },
//         { title: "Me Voy", artist: "Jesse & Joy" },
//         { title: "No Me Ames", artist: "Jennifer Lopez" },
//         { title: "Amor Eterno", artist: "Juan Gabriel" },
//         { title: "La Llorona", artist: "Natalia Lafourcade" },
//       ],
//       Korean: [
//         { title: "Spring Day", artist: "BTS" },
//         { title: "Through the Night", artist: "IU" },
//         { title: "You Are", artist: "GOT7" },
//         { title: "Breath", artist: "Lee Hi" },
//         { title: "Eight", artist: "IU ft. Suga" },
//       ],
//       Tamil: [
//         { title: "Kadhal Rojave", artist: "A.R. Rahman" },
//         { title: "Munbe Vaa", artist: "A.R. Rahman" },
//         { title: "Nenjukkul Peidhidum", artist: "Harris Jayaraj" },
//         { title: "Oru Maalai", artist: "Yuvan Shankar Raja" },
//         { title: "Poo Nee Poo", artist: "D. Imman" },
//       ],
//     },
//     angry: {
//       English: [
//         { title: "Break Stuff", artist: "Limp Bizkit" },
//         { title: "Bodies", artist: "Drowning Pool" },
//         { title: "Killing in the Name", artist: "Rage Against the Machine" },
//         { title: "You Oughta Know", artist: "Alanis Morissette" },
//         { title: "Since U Been Gone", artist: "Kelly Clarkson" },
//       ],
//       Hindi: [
//         { title: "Malhari", artist: "Vishal Dadlani" },
//         { title: "Apna Time Aayega", artist: "Ranveer Singh" },
//         { title: "Sultan", artist: "Vishal-Shekhar" },
//         { title: "Dangal", artist: "Daler Mehndi" },
//         { title: "Tattad Tattad", artist: "Arijit Singh" },
//       ],
//       Spanish: [
//         { title: "Gasolina", artist: "Daddy Yankee" },
//         { title: "Resistiré", artist: "Dúo Dinámico" },
//         { title: "Oye Como Va", artist: "Santana" },
//         { title: "La Negra", artist: "La Santa Cecilia" },
//         { title: "Bambaataa", artist: "Shaggy" },
//       ],
//       Korean: [
//         { title: "Fire", artist: "BTS" },
//         { title: "Kill This Love", artist: "BLACKPINK" },
//         { title: "How You Like That", artist: "BLACKPINK" },
//         { title: "Mic Drop", artist: "BTS" },
//         { title: "God's Menu", artist: "Stray Kids" },
//       ],
//       Tamil: [
//         { title: "Rowdy Baby", artist: "Dhanush & Dhee" },
//         { title: "Master the Blaster", artist: "Anirudh Ravichander" },
//         { title: "Polakattum Para Para", artist: "A.R. Rahman" },
//         { title: "Ullaallaa", artist: "Anirudh Ravichander" },
//         { title: "Verithanam", artist: "A.R. Rahman" },
//       ],
//     },
//     neutral: {
//       English: [
//         { title: "Blinding Lights", artist: "The Weeknd" },
//         { title: "Shape of You", artist: "Ed Sheeran" },
//         { title: "Anti-Hero", artist: "Taylor Swift" },
//         { title: "As It Was", artist: "Harry Styles" },
//         { title: "Stay", artist: "The Kid LAROI & Justin Bieber" },
//       ],
//       Hindi: [
//         { title: "Kesariya", artist: "Arijit Singh" },
//         { title: "Raataan Lambiyan", artist: "Tanishk Bagchi" },
//         { title: "Ranjha", artist: "Jasleen Royal" },
//         { title: "Mann Mera", artist: "Gajendra Verma" },
//         { title: "Bekhayali", artist: "Sachet Tandon" },
//       ],
//       Spanish: [
//         { title: "Con Altura", artist: "Rosalía & J Balvin" },
//         { title: "Baila Baila Baila", artist: "Ozuna" },
//         { title: "Tusa", artist: "KAROL G & Nicki Minaj" },
//         { title: "Hawái", artist: "Maluma" },
//         { title: "Dakiti", artist: "Bad Bunny & Jhay Cortez" },
//       ],
//       Korean: [
//         { title: "Butter", artist: "BTS" },
//         { title: "Permission to Dance", artist: "BTS" },
//         { title: "Lovesick Girls", artist: "BLACKPINK" },
//         { title: "Celebrity", artist: "IU" },
//         { title: "Savage", artist: "aespa" },
//       ],
//       Tamil: [
//         { title: "Enjoy Enjaami", artist: "Dhee ft. Arivu" },
//         { title: "Thee Thalapathy", artist: "A.R. Rahman" },
//         { title: "Katchi Sera", artist: "Santhosh Narayanan" },
//         { title: "Kannaana Kanney", artist: "A.R. Rahman" },
//         { title: "Verithanam", artist: "A.R. Rahman" },
//       ],
//     },
//   };

//   const key = (emotion || 'neutral').toLowerCase();
//   return fallbacks[key] || fallbacks.neutral;
// }

// // ---------- Main handler ----------
// export async function POST(request) {
//   try {
//     const { emotion, genre = 'Pop', age, gender } = await request.json();

//     if (!emotion || emotion === 'N/A' || emotion === 'No face detected') {
//       return NextResponse.json({ error: 'Valid emotion is required' }, { status: 400 });
//     }

//     const ageContext = age && age !== 'Unknown' ? `The person is ${age} years old. ` : '';
//     const genderContext = gender && gender !== 'Unknown' ? `Gender: ${gender}. ` : '';

//     // Enhanced prompt for better AI responses
//     const prompt = `Recommend exactly 5 ${genre} songs for someone feeling ${emotion} in 5 different languages: English, Hindi, Spanish, Korean, and Tamil.
// ${ageContext}${genderContext}

// Consider the emotional context and cultural preferences:
// - For "happy": upbeat, energetic, celebratory songs
// - For "sad": comforting, melancholic, or healing songs
// - For "angry": intense, powerful, or cathartic songs  
// - For "surprised": dynamic, exciting, or unexpected songs
// - For "fear": calming, empowering, or uplifting songs
// - For "neutral": popular mainstream hits across cultures

// For each language section, provide exactly 5 songs. Use these exact headings: ENGLISH, HINDI, SPANISH, KOREAN, TAMIL (with or without colons).
// Format each song as: "Song Title" by Artist Name
// Ensure all songs are real, popular songs that would be available on YouTube.
// Focus on well-known artists and hit songs for better availability.

// IMPORTANT: Only provide the song lists, no extra commentary or explanations.`;

//     const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'openai/gpt-3.5-turbo',
//         temperature: 0.7,
//         max_tokens: 1500,
//         messages: [
//           {
//             role: 'system',
//             content: 'You are a global music curator with expertise in popular songs across English, Hindi (Bollywood), Spanish (Latin/Pop), Korean (K-Pop), and Tamil (Kollywood) music. Provide accurate, well-known song titles and artist names that are likely to be available on YouTube. Focus on mainstream hits and popular artists for better video availability.',
//           },
//           { role: 'user', content: prompt },
//         ],
//       }),
//     });

//     if (!aiRes.ok) {
//       console.error('OpenRouter API error:', aiRes.status, await aiRes.text());
//       const fallback = getMultiLanguageFallbackSongs(emotion, genre);
//       // Add YouTube URLs for fallback
//       const songsWithUrls = {};
//       for (const [language, songs] of Object.entries(fallback)) {
//         songsWithUrls[language] = await Promise.all(
//           songs.map(async (song) => {
//             const yt = await searchYouTubeVideoId({ ...song, language });
//             return { 
//               ...song, 
//               url: yt.watchUrl || yt.embedUrl, 
//               yt: {
//                 type: yt.type,
//                 videoId: yt.videoId,
//                 embedUrl: yt.embedUrl,
//                 fallbackUrl: yt.fallbackUrl
//               }
//             };
//           })
//         );
//       }
//       return NextResponse.json({
//         songsByLanguage: songsWithUrls,
//         emotion,
//         genre,
//         source: 'fallback',
//         generatedAt: new Date().toISOString(),
//       });
//     }

//     const aiData = await aiRes.json();
//     const content = aiData?.choices?.[0]?.message?.content || '';
//     const parsed = parseMultiLanguageSongs(content);

//     // If parsing failed, use fallbacks
//     const base = Object.keys(parsed).length ? parsed : getMultiLanguageFallbackSongs(emotion, genre);

//     // Enrich with enhanced YouTube URLs
//     const songsWithUrls = {};
//     for (const [language, songs] of Object.entries(base)) {
//       songsWithUrls[language] = await Promise.all(
//         songs.map(async (song) => {
//           const yt = await searchYouTubeVideoId({ ...song, language });
//           return { 
//             ...song, 
//             url: yt.watchUrl || yt.embedUrl, 
//             yt: {
//               type: yt.type,
//               videoId: yt.videoId,
//               embedUrl: yt.embedUrl,
//               fallbackUrl: yt.fallbackUrl
//             }
//           };
//         })
//       );
//     }

//     return NextResponse.json({
//       songsByLanguage: songsWithUrls,
//       emotion,
//       genre,
//       source: Object.keys(parsed).length ? 'ai' : 'fallback',
//       generatedAt: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error('Song recommendation error:', error);
//     const fallback = getMultiLanguageFallbackSongs('neutral', 'Pop');
    
//     // Even in error cases, provide YouTube URLs
//     const songsWithUrls = {};
//     for (const [language, songs] of Object.entries(fallback)) {
//       songsWithUrls[language] = songs.map((song) => ({
//         ...song,
//         url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`,
//         yt: {
//           type: 'search',
//           embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(song.title + ' ' + song.artist)}&autoplay=1&rel=0&modestbranding=1`,
//           fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`
//         }
//       }));
//     }
    
//     return NextResponse.json(
//       {
//         error: 'Failed to fetch song recommendations',
//         details: error.message,
//         songsByLanguage: songsWithUrls,
//         source: 'error_fallback'
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/song-recommendation/route.js
import { NextResponse } from 'next/server';

// ---------- Enhanced YouTube helpers ----------
function buildSearchKeywords(language) {
  const languageKeywords = {
    Hindi: 'bollywood hindi song official',
    Spanish: 'spanish latino musica official',
    Korean: 'kpop korean music official mv',
    Tamil: 'tamil kollywood song official',
    English: 'official music video'
  };
  return languageKeywords[language] || 'official music video';
}

function bestMatchFromItems(items, title, artist) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const t = (s) => (s || '').toLowerCase().trim();
  const wantedTitle = t(title);
  const wantedArtist = t(artist || '');

  let best = null;
  let bestScore = -1;

  for (const it of items) {
    const snippet = it?.snippet;
    const vid = it?.id?.videoId;
    if (!snippet || !vid) continue;

    const titleText = t(snippet.title);
    const channelText = t(snippet.channelTitle);
    const descText = t(snippet.description || '');
    const hay = `${titleText} ${channelText} ${descText}`;

    let score = 0;
    
    // Exact title match gets highest priority
    if (wantedTitle && titleText.includes(wantedTitle)) score += 5;
    
    // Artist match in title or channel
    if (wantedArtist) {
      if (titleText.includes(wantedArtist)) score += 4;
      if (channelText.includes(wantedArtist)) score += 3;
    }
    
    // Official content indicators
    if (hay.includes('official video')) score += 3;
    if (hay.includes('official audio')) score += 2;
    if (hay.includes('lyric video')) score += 2;
    if (hay.includes('music video')) score += 1;
    
    // Prefer verified channels
    if (channelText.includes('vevo') || channelText.includes('official')) score += 2;
    
    if (score > bestScore) {
      bestScore = score;
      best = vid;
    }
  }
  
  return best || items[0]?.id?.videoId || null;
}

async function searchYouTubeVideoId({ title, artist, language }) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const languageContext = buildSearchKeywords(language);
  const query = `${title} ${artist || ''} ${languageContext}`.trim();

  if (!API_KEY) {
    const encodedQuery = encodeURIComponent(query);
    return {
      type: 'search',
      embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
      watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
      fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
    };
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '10');
    url.searchParams.set('q', query);
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoEmbeddable', 'true');
    url.searchParams.set('videoSyndicated', 'true');
    url.searchParams.set('safeSearch', 'moderate');
    url.searchParams.set('relevanceLanguage', language === 'English' ? 'en' : 
                        language === 'Hindi' ? 'hi' : 
                        language === 'Spanish' ? 'es' : 
                        language === 'Korean' ? 'ko' : 
                        language === 'Tamil' ? 'ta' : 'en');
    url.searchParams.set('key', API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error('YouTube API error:', res.status, await res.text());
      const encodedQuery = encodeURIComponent(query);
      return {
        type: 'search',
        embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1`,
        watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
        fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
      };
    }

    const data = await res.json();
    const vid = bestMatchFromItems(data.items, title, artist);

    if (vid) {
      return {
        type: 'video',
        videoId: vid,
        embedUrl: `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
        watchUrl: `https://www.youtube.com/watch?v=${vid}`,
        fallbackUrl: `https://www.youtube.com/watch?v=${vid}`
      };
    }

    const encodedQuery = encodeURIComponent(query);
    return {
      type: 'search',
      embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1`,
      watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
      fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
    };
  } catch (e) {
    console.error('YouTube search error:', e);
    const encodedQuery = encodeURIComponent(query);
    return {
      type: 'search',
      embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&rel=0&modestbranding=1`,
      watchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
      fallbackUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`
    };
  }
}

// ---------- Enhanced Parsing helpers ----------
function normalizeHeader(line) {
  return line.trim().toUpperCase().replace(/\s+/g, ' ');
}

// More robust parsing to extract real AI recommendations
function parseMultiLanguageSongs(content) {
  console.log('Parsing AI content:', content); // Debug log
  
  const targetLangs = ['ENGLISH', 'HINDI', 'SPANISH', 'KOREAN', 'TAMIL'];
  const lines = content.split('\n');

  const sections = {};
  let current = null;
  
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const upper = normalizeHeader(line);
    
    // Check for language headers with various formats
    const headerMatch = targetLangs.find((L) => {
      return (
        upper === L ||
        upper === `${L}:` ||
        upper === `**${L}**` ||
        upper === `## ${L}` ||
        upper === `# ${L}` ||
        upper.includes(L) && upper.length <= L.length + 5
      );
    });
    
    if (headerMatch) {
      current = headerMatch;
      sections[current] = [];
      console.log(`Found section: ${current}`); // Debug log
      continue;
    }
    
    if (current && line.length > 5) { // Only add substantial content
      sections[current].push(line);
    }
  }

  const out = {};
  
  for (const lang of targetLangs) {
    const rows = sections[lang] || [];
    const songs = [];
    
    for (const row of rows.slice(0, 8)) { // Take up to 8 to find 5 good ones
      const clean = row.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim();
      if (!clean || clean.length < 5) continue;

      // Enhanced parsing patterns for better extraction
      const patterns = [
        /^"([^"]+)"\s+by\s+(.+)$/i,        // "Title" by Artist
        /^"([^"]+)"\s*[-–—]\s*(.+)$/i,     // "Title" - Artist
        /^([^-–—]+?)\s+by\s+(.+)$/i,       // Title by Artist
        /^([^-–—]+?)\s*[-–—]\s*(.+)$/,     // Title - Artist
        /^([^:]+?):\s*(.+)$/,              // Artist: Title
        /^(.+?)\s*\(\s*(.+?)\s*\)$/,       // Title (Artist)
        /^(.+?)\s*\|\s*(.+)$/,             // Title | Artist
        /^(.+?)\s*–\s*(.+)$/,              // Title – Artist (em dash)
        /^(.+?)\s+ft\.?\s+(.+)$/i,         // Title ft Artist
        /^(.+?)\s+feat\.?\s+(.+)$/i        // Title feat Artist
      ];

      let title = null, artist = 'Unknown Artist', matched = false;
      
      for (const p of patterns) {
        const m = clean.match(p);
        if (m) {
          // Special handling for "Artist: Title" format
          if (p.source.includes('^([^:]+?):\\s*(.+)$')) {
            artist = m[1].trim();
            title = m[2].trim().replace(/^["']|["']$/g, '');
          } 
          // Special handling for "Title (Artist)" format
          else if (p.source.includes('\\(\\s*(.+?)\\s*\\)')) {
            title = m[1].trim().replace(/^["']|["']$/g, '');
            artist = m[2].trim();
          } 
          // Standard "Title - Artist" or "Title by Artist" format
          else {
            title = m[1].trim().replace(/^["']|["']$/g, '');
            artist = (m[2] || '').trim() || 'Unknown Artist';
          }
          matched = true;
          break;
        }
      }
      
      // If no pattern matched, try basic extraction
      if (!matched) {
        title = clean.replace(/^["']|["']$/g, '');
        
        // Try to extract artist from common separators
        const separators = [' by ', ' - ', ' – ', ' — ', ' ft. ', ' feat. ', ' featuring ', ' x '];
        for (const sep of separators) {
          const sepIndex = title.toLowerCase().indexOf(sep.toLowerCase());
          if (sepIndex > 0) {
            artist = title.substring(sepIndex + sep.length).trim();
            title = title.substring(0, sepIndex).trim();
            break;
          }
        }
      }

      // Clean up and validate
      if (title && title.length >= 2) {
        // Remove common prefixes/suffixes
        title = title.replace(/^(Song:|Track:)/i, '').trim();
        artist = artist.replace(/^(by|artist:|singer:)/i, '').trim();
        
        // Ensure we have both title and artist
        if (!artist || artist === 'Unknown Artist') {
          // Try to extract from title one more time
          const lastTry = title.match(/^(.+?)\s+by\s+(.+)$/i);
          if (lastTry) {
            title = lastTry[1].trim();
            artist = lastTry[2].trim();
          }
        }
        
        songs.push({ 
          title: title.replace(/["""'']/g, '"').trim(), 
          artist: artist || 'Various Artists' 
        });
        
        console.log(`Parsed song: "${title}" by ${artist}`); // Debug log
        
        if (songs.length >= 5) break;
      }
    }

    if (songs.length > 0) {
      const cap = lang.charAt(0) + lang.slice(1).toLowerCase();
      out[cap] = songs;
      console.log(`Added ${songs.length} songs for ${cap}`); // Debug log
    }
  }

  console.log('Final parsed result:', out); // Debug log
  return out;
}

// Minimal fallbacks only for extreme cases
function getEmergencyFallbacks() {
  return {
    English: [
      { title: "Blinding Lights", artist: "The Weeknd" },
      { title: "Shape of You", artist: "Ed Sheeran" },
      { title: "Bad Guy", artist: "Billie Eilish" }
    ],
    Hindi: [
      { title: "Kesariya", artist: "Arijit Singh" },
      { title: "Tum Hi Ho", artist: "Arijit Singh" },
      { title: "Raataan Lambiyan", artist: "Tanishk Bagchi" }
    ],
    Spanish: [
      { title: "Despacito", artist: "Luis Fonsi" },
      { title: "Con Altura", artist: "Rosalía" },
      { title: "Tusa", artist: "KAROL G" }
    ]
  };
}

// ---------- Main handler ----------
export async function POST(request) {
  try {
    const { emotion, genre = 'Pop', age, gender } = await request.json();

    // Validate emotion
    if (!emotion || emotion === 'N/A' || emotion === 'No face detected') {
      return NextResponse.json({ error: 'Valid emotion is required' }, { status: 400 });
    }

    console.log(`Processing request: emotion=${emotion}, genre=${genre}, age=${age}, gender=${gender}`);

    const ageContext = age && age !== 'Unknown' ? `The person is ${age} years old. ` : '';
    const genderContext = gender && gender !== 'Unknown' ? `Gender: ${gender}. ` : '';

    // More specific and detailed prompt for better AI responses
    const prompt = `You are a music expert. Recommend exactly 5 songs in each of these 5 languages for someone feeling "${emotion}":

ENGLISH:
HINDI: 
SPANISH:
KOREAN:
TAMIL:

Context: ${ageContext}${genderContext}Genre preference: ${genre}.

For "${emotion}" emotion, focus on:
${emotion === 'happy' ? '- Upbeat, energetic, feel-good songs that boost mood' : 
  emotion === 'sad' ? '- Comforting, healing, or beautiful melancholic songs' :
  emotion === 'angry' ? '- Intense, powerful songs for emotional release' :
  emotion === 'surprised' ? '- Dynamic, exciting, unexpected songs' :
  emotion === 'fear' ? '- Calming, empowering, confidence-building songs' :
  '- Popular mainstream hits that are widely loved'}

Format EXACTLY like this for each language:
1. "Song Title" by Artist Name
2. "Song Title" by Artist Name
3. "Song Title" by Artist Name  
4. "Song Title" by Artist Name
5. "Song Title" by Artist Name

Use real, popular, well-known songs that exist on YouTube. Include hit songs from:
- English: Billboard hits, pop charts, classic rock/pop
- Hindi: Bollywood hits, popular playback singers  
- Spanish: Latin pop, reggaeton, Spanish pop hits
- Korean: K-pop hits, popular idol groups
- Tamil: Kollywood hits, popular Tamil cinema songs

NO explanations, NO additional text, ONLY the song lists.`;

    console.log('Sending request to AI...');

    // Make the AI API call
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yourdomain.com', // Optional: your domain
        'X-Title': 'Music Recommendation App', // Optional: app name
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Use GPT-4o-mini for better results
        temperature: 0.7,
        max_tokens: 2000, // Increase token limit
        messages: [
          {
            role: 'system',
            content: 'You are a professional music curator with deep knowledge of popular songs across different languages and cultures. You provide accurate song titles and artist names that are widely available on music platforms. Focus on mainstream hits and well-known artists. Always follow the exact format requested.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error('OpenRouter API error:', aiRes.status, errorText);
      throw new Error(`AI API failed: ${aiRes.status} - ${errorText}`);
    }

    const aiData = await aiRes.json();
    const content = aiData?.choices?.[0]?.message?.content || '';
    
    console.log('AI Response received:', content);

    if (!content.trim()) {
      throw new Error('Empty response from AI');
    }

    // Parse the AI response
    const parsed = parseMultiLanguageSongs(content);
    
    console.log('Parsed songs:', parsed);

    // Check if we got meaningful results
    const totalSongs = Object.values(parsed).reduce((sum, songs) => sum + songs.length, 0);
    
    if (totalSongs < 5) {
      console.warn('Insufficient songs parsed, using emergency fallback');
      throw new Error('Insufficient songs parsed from AI response');
    }

    // Enrich with YouTube URLs
    const songsWithUrls = {};
    for (const [language, songs] of Object.entries(parsed)) {
      console.log(`Processing ${songs.length} songs for ${language}...`);
      songsWithUrls[language] = await Promise.all(
        songs.map(async (song, index) => {
          try {
            console.log(`Searching YouTube for: "${song.title}" by ${song.artist}`);
            const yt = await searchYouTubeVideoId({ ...song, language });
            return { 
              ...song, 
              url: yt.watchUrl || yt.embedUrl, 
              yt: {
                type: yt.type,
                videoId: yt.videoId,
                embedUrl: yt.embedUrl,
                fallbackUrl: yt.fallbackUrl
              }
            };
          } catch (ytError) {
            console.error(`YouTube search failed for song ${index + 1}:`, ytError);
            return {
              ...song,
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`,
              yt: {
                type: 'search',
                embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(song.title + ' ' + song.artist)}`,
                fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`
              }
            };
          }
        })
      );
    }

    console.log('Successfully processed all songs');

    return NextResponse.json({
      songsByLanguage: songsWithUrls,
      emotion,
      genre,
      source: 'ai',
      totalSongs: Object.values(songsWithUrls).reduce((sum, songs) => sum + songs.length, 0),
      generatedAt: new Date().toISOString(),
      debug: {
        aiResponseLength: content.length,
        parsedLanguages: Object.keys(parsed),
        originalContent: content // Include for debugging
      }
    });

  } catch (error) {
    console.error('Song recommendation error:', error);
    
    // Only use emergency fallbacks in case of complete failure
    const emergency = getEmergencyFallbacks();
    
    const songsWithUrls = {};
    for (const [language, songs] of Object.entries(emergency)) {
      songsWithUrls[language] = songs.map((song) => ({
        ...song,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`,
        yt: {
          type: 'search',
          embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(song.title + ' ' + song.artist)}&autoplay=1&rel=0&modestbranding=1`,
          fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`
        }
      }));
    }
    
    return NextResponse.json(
      {
        error: 'Failed to fetch song recommendations',
        details: error.message,
        songsByLanguage: songsWithUrls,
        source: 'emergency_fallback',
        generatedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}