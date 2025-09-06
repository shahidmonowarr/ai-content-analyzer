interface SentimentMeterProps {
  score: number; // -1 to 1
}

export default function SentimentMeter({ score }: SentimentMeterProps) {
  // Convert score from -1 to 1 to 0 to 100 for the meter
  const meterValue = ((score + 1) / 2) * 100;
  
  let sentimentColor = 'bg-blue-500';
  if (score < -0.3) sentimentColor = 'bg-red-500';
  else if (score > 0.3) sentimentColor = 'bg-green-500';
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className={`h-4 rounded-full ${sentimentColor} transition-all duration-500`}
          style={{ width: `${meterValue}%` }}
        ></div>
      </div>
      <div className="text-center mt-2">
        <span className="text-sm font-medium text-gray-700">
          Score: {score.toFixed(2)}
        </span>
      </div>
    </div>
  );
}