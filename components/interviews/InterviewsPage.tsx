"use client";

import { useState, useTransition, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { InterviewsPageParams } from "@/app/(root)/interviews/page";
import { getInterviewsWithQuery } from "@/lib/actions/interview.action";
import {
  InterviewSearchParams,
  ReturnInterviewSearch,
} from "@/lib/actions/type";
import LoadMore from "../shared/LoadMore";
import InterviewsFilters from "./InterviewsFilter";
import InterviewsHeader from "./InterviewsHeader";
import InterviewsList from "./InterviewsList";
import NoInterviews from "./NoInterviews";
import ScheduleModal from "../interview/ScheduleModal";

interface InterviewsPageProps {
  searchParams: InterviewsPageParams;
  interviews: ReturnInterviewSearch;
}

interface Filters {
  query: string;
  type: InterviewSearchParams["interviewType"];
  sort: InterviewSearchParams["sortType"];
}

interface LoadInterviewParams {
  page: number;
  append: boolean;
  filters: Filters;
}

type Interview = ReturnInterviewSearch["interviews"][0];

const InterviewsPage = ({ searchParams, interviews }: InterviewsPageProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [interviewsList, setInterviewsList] = useState<Interview[]>(
    interviews.interviews
  );
  const [totalCount, setTotalCount] = useState(interviews.totalCount);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const [typeFilter, setTypeFilter] = useState<
    InterviewSearchParams["interviewType"]
  >(searchParams.type || "all");
  const [sortBy, setSortBy] = useState<InterviewSearchParams["sortType"]>(
    searchParams.sortType || "rating"
  );

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  const [isFiltering, startFilteringTransition] = useTransition();
  const [isLoadingMore, startLoadMoreTransition] = useTransition();

  const hasMore = totalCount > interviewsList.length;

  const getInterviews = useCallback(
    async ({ filters, page, append }: LoadInterviewParams) => {
      const result = await getInterviewsWithQuery({
        query: filters.query,
        interviewType: filters.type === "all" ? undefined : filters.type,
        sortType: filters.sort,
        page,
      });

      if (result.success) {
        setPage(page);
        if (append) {
          setInterviewsList((prev) => [...prev, ...result.interviews]);
        } else {
          setInterviewsList(result.interviews);
          setTotalCount(result.totalCount);
        }
      } else {
        toast.error("Failed to load more interviews");
        if (!append) {
          setInterviewsList([]);
          setTotalCount(0);
        }
      }
    },
    []
  );

  const handleFiltersChange = useCallback((filters: Filters) => {
    const params = new URLSearchParams();
    if (filters.query) params.set("search", filters.query);
    if (filters.type && filters.type !== "all")
      params.set("type", filters.type);
    if (filters.sort) params.set("sortType", filters.sort);
    window.history.pushState(null, "", `${pathname}?${params.toString()}`); // Here we use history API to prevent full page re-render

    startFilteringTransition(() => {
      getInterviews({ filters, page: 1, append: false });
    });
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFiltersChange({ query: value, type: typeFilter, sort: sortBy });
  };

  const handleTypeChange = (value: InterviewSearchParams["interviewType"]) => {
    setTypeFilter(value);
    handleFiltersChange({ query: searchQuery, type: value, sort: sortBy });
  };

  const handleSortChange = (value: InterviewSearchParams["sortType"]) => {
    setSortBy(value);
    handleFiltersChange({ query: searchQuery, type: typeFilter, sort: value });
  };

  const getMoreInterviews = () => {
    if (!hasMore || isLoadingMore) return;

    const nextPage = page + 1;
    startLoadMoreTransition(() => {
      getInterviews({
        filters: { query: searchQuery, type: typeFilter, sort: sortBy },
        page: nextPage,
        append: true,
      });
    });
  };

  const handleSchedule = (interview: Interview) => {
    setSelectedInterview(interview);
    setScheduleModalOpen(true);
  };

  const handleAttendNow = (interview: Interview) => {
    router.push(`/interview/${interview.id}`);
  };

  return (
    <div className="space-y-8 mt-5">
      <InterviewsHeader />

      <InterviewsFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeChange}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
      />

      <div className="space-y-6">
        {isFiltering ? (
          <div className="text-center p-8">Loading results...</div>
        ) : interviewsList.length > 0 ? (
          <InterviewsList
            interviews={interviewsList}
            onSchedule={handleSchedule}
            onAttendNow={handleAttendNow}
          />
        ) : (
          <NoInterviews
            title="No interviews found"
            description="Try adjusting your search or filters to find more interviews."
          />
        )}
        {hasMore && !isFiltering && (
          <LoadMore loading={isLoadingMore} onClick={getMoreInterviews} />
        )}
      </div>

      {selectedInterview && (
        <ScheduleModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          interview={selectedInterview}
        />
      )}
    </div>
  );
};

export default InterviewsPage;
