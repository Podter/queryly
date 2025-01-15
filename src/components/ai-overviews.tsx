import { useCompletion } from "ai/react";

interface AIOverviewsProps {
  query: string;
}

export default function AIOverviews({ query }: AIOverviewsProps) {
  const { completion, complete } = useCompletion({
    api: "/api/llm",
  });

  return (
    <div>
      <button
        onClick={async () => {
          await complete(query);
        }}
      >
        Generate
      </button>
      {completion}
    </div>
  );
}
