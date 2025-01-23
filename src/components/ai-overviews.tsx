import { useCompletion } from "ai/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

import { cn } from "~/lib/utils";
import { AI_OVERVIEWS_KEY } from "./settings";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AIOverviewsProps {
  query: string;
}

export default function AIOverviews({ query }: AIOverviewsProps) {
  const [open, setOpen] = useState(false);

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/llm",
  });

  useEffect(() => {
    void complete(query);
  }, [complete, query]);

  useEffect(() => {
    const value = localStorage.getItem(AI_OVERVIEWS_KEY);
    if (value) {
      setOpen(value === "true");
    }
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <Sparkles size={24} />
          AI Overviews
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "prose prose-sm prose-neutral min-h-64 max-w-none dark:prose-invert",
          !open && "h-64",
        )}
      >
        <Markdown>{completion}</Markdown>
        {!isLoading && completion.length > 0 && open && (
          <div className="flex w-full items-center justify-center">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Show less
            </Button>
          </div>
        )}
      </CardContent>
      {!open && (
        <div className="absolute bottom-0 left-0 right-0 flex h-20 items-center justify-center bg-gradient-to-t from-background to-transparent">
          {completion.length > 500 && (
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Show more
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
