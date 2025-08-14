import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface InterviewSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const InterviewSearch = ({
  searchQuery,
  onSearchChange,
}: InterviewSearchProps) => {
  const [query, setQuery] = useState(searchQuery);

  const debouncedSearch = useDebounce(query);

  useEffect(() => {
    if (searchQuery !== query) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className="flex-1 min-w-0">
      <Input
        placeholder="Search interviews..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

export default InterviewSearch;
