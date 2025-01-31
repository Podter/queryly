import type { SearxngSearchResult } from "searxng";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface ImageItemProps {
  data: SearxngSearchResult;
}

export default function ImageItem({ data }: ImageItemProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex max-h-80 max-w-80 flex-col items-center justify-center overflow-hidden">
          <img
            src={data.thumbnail_src ?? data.img_src}
            alt={data.content ?? data.title}
            loading="lazy"
            decoding="async"
          />
        </button>
      </SheetTrigger>
      <SheetContent className="w-screen overflow-y-scroll border-none sm:w-[26rem] sm:max-w-none sm:border-l sm:border-solid">
        <SheetHeader>
          <SheetTitle>{data.title}</SheetTitle>
          <SheetDescription>{data.content}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-4 py-4">
          <a href={data.url}>
            <img
              src={data.thumbnail_src ?? data.img_src}
              alt={data.content ?? data.title}
              loading="lazy"
              decoding="async"
            />
          </a>
          <Button asChild>
            <a href={data.url}>Open</a>
          </Button>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex gap-2">
            {data.engines.map((engine) => (
              <span>{engine}</span>
            ))}
          </div>
          {data.publishedDate && (
            <time dateTime={data.publishedDate.toString()}>
              {new Date(data.publishedDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
