interface TopicCloudProps {
  topics: string[];
}

export default function TopicCloud({ topics }: TopicCloudProps) {
  // Different sizes for visual variety
  const sizes = ["text-sm", "text-base", "text-lg", "text-xl"];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {topics.map((topic, index) => {
        const size = sizes[index % sizes.length];
        return (
          <span
            key={index}
            className={`inline-block px-3 py-1 bg-white border border-gray-200 rounded-full ${size} font-medium text-gray-700 shadow-sm`}
          >
            {topic}
          </span>
        );
      })}
    </div>
  );
}
