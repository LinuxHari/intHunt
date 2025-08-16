"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchAnalytics } from "@/lib/analytics";

const SearchHero = () => {
  const [query, setQuery] = useState("");
  const [isSearching, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      startTransition(() => {
        searchAnalytics(trimmedQuery);
        router.push(`/interviews?search=${encodeURIComponent(trimmedQuery)}`);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md my-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search interviews..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={isSearching}>
        {isSearching ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Searching...
          </>
        ) : (
          "Search"
        )}
      </Button>
    </form>
  );
};

export default SearchHero;
