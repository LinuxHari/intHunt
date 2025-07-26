import { Filter, SortAsc } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewSearchParams } from "@/lib/actions/type";
import InterviewSearch from "./InterviewSearch";

interface InterviewsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: InterviewSearchParams["interviewType"];
  onTypeFilterChange: (
    value: Exclude<InterviewSearchParams["interviewType"], undefined>
  ) => void;
  sortBy: InterviewSearchParams["sortType"];
  onSortByChange: (
    value: Exclude<InterviewSearchParams["sortType"], undefined>
  ) => void;
}

export default function InterviewsFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
}: InterviewsFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <InterviewSearch
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select
                value={typeFilter ?? "all"}
                onValueChange={onTypeFilterChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-slate-500" />
              <Select value={sortBy ?? "rating"} onValueChange={onSortByChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="attendees">Attendees</SelectItem>
                  <SelectItem value="questions">Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
