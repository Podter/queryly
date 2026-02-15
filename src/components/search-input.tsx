import * as Ariakit from "@ariakit/react";
import { navigate } from "astro:transitions/client";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";

interface SearchInputProps {
  initialQuery?: string;
}

export default function SearchInput({ initialQuery }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const debounced = setTimeout(async () => {
      if (query === "") {
        setSuggestions([]);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: string[] = await fetch(
        `/api/autocomplete?q=${encodeURIComponent(query)}`,
      ).then((res) => res.json());
      setSuggestions(data);
    }, 50);

    return () => {
      clearTimeout(debounced);
    };
  }, [query]);

  const formRef = useRef<HTMLFormElement>(null);
  const [formWidth, setFormWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      if (formRef.current) {
        setFormWidth(formRef.current.offsetWidth);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/refs
  }, [formRef.current?.offsetWidth]);

  return (
    <Ariakit.ComboboxProvider value={query} setValue={setQuery}>
      <form
        className="flex h-10 w-full overflow-hidden rounded-xl border border-input bg-background shadow-sm"
        method="get"
        action="/search"
        ref={formRef}
      >
        <Ariakit.Combobox
          className="w-full bg-background px-3 py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none md:text-sm"
          type="search"
          name="q"
          placeholder="Search"
          required
          autoComplete="both"
        />
        <button
          className={cn(
            "inline-flex aspect-square h-full items-center justify-center transition-colors focus-visible:outline-none",
            "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
          )}
          type="submit"
        >
          <Search size={20} />
          <span className="sr-only">Search</span>
        </button>
      </form>
      {suggestions.length > 0 && (
        <Ariakit.ComboboxPopover
          gutter={8}
          className="z-50 rounded-xl border bg-popover p-2 text-popover-foreground shadow-md outline-none"
          style={{
            width: formWidth,
          }}
        >
          {suggestions.map((suggestion) => (
            <Ariakit.ComboboxItem
              key={suggestion}
              value={suggestion}
              onClick={async () => {
                await navigate(`/search?q=${encodeURIComponent(suggestion)}`);
              }}
              className={cn(
                "relative flex select-none items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                "data-[active-item]:bg-accent data-[active-item]:text-accent-foreground",
                "active:bg-accent active:text-accent-foreground",
                "data-[active]:bg-accent data-[active]:text-accent-foreground",
              )}
            />
          ))}
        </Ariakit.ComboboxPopover>
      )}
    </Ariakit.ComboboxProvider>
  );
}
