import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  recommendation: string;
  type: 'exercise' | 'song' | 'movie';
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method === 'POST') {
    // In a real app, you would use the text for AI analysis
    const { text } = req.body;
    
    // Mock responses - in a real app, these would be generated based on the text
    const responses: ResponseData[] = [
      { 
        recommendation: text 
          ? `Based on what you wrote about "${text.substring(0, 20)}...", I recommend a 10-minute guided meditation.`
          : "Based on your mood, I recommend a 10-minute guided meditation to help center your thoughts.",
        type: "exercise"
      },
      {
        recommendation: text
          ? `Your journal entry suggests calming music might help. Try "Weightless" by Marconi Union.`
          : "Listening to calming instrumental music might help ease your mind right now.",
        type: "song"
      },
      {
        recommendation: text
          ? `Given what you shared, you might enjoy the uplifting movie 'The Pursuit of Happyness'.`
          : "How about watching an uplifting movie? I suggest 'The Pursuit of Happyness'.",
        type: "movie"
      }
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    res.status(200).json(randomResponse);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}