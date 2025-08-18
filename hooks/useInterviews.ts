import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { getInterviewsWithQuery } from "@/lib/actions/interview.action";
import { InterviewsPageParams } from "@/app/(root)/interviews/page";
import {
  InterviewSearchParams,
  ReturnInterviewSearch,
} from "@/lib/actions/type";
import { clickAnalytics, scheduleAnalytics } from "@/lib/analytics";

export interface InterviewsPageProps {
  searchParams: InterviewsPageParams;
  interviews: ReturnInterviewSearch;
  userId?: string;
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

const useInterviews = ({
  interviews,
  searchParams,
  userId,
}: InterviewsPageProps) => {
  const [interviewsList, setInterviewsList] = useState<Interview[]>(
    interviews.interviews
  );

  const [hasNext, setHasNext] = useState(interviews.hasNextPage);
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

  const [isLoadingMore, startLoadMoreTransition] = useTransition();
  const [isFiltering, startFilteringTransition] = useTransition();

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
          setHasNext(result.hasNextPage);
        }
      } else {
        toast.error("Failed to load more interviews");
        if (!append) {
          setInterviewsList([]);
          setHasNext(false);
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
    history.pushState(null, "", `?${params.toString()}`);

    if (filters.query.length >= 2) {
      startFilteringTransition(async () => {
        await getInterviews({ filters, page: 1, append: false });
        setPage(1);
      });
    }
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

  const handleClick = (interview: Interview) => {
    if (userId) {
      clickAnalytics(interview, userId);
    }
  };

  const getMoreInterviews = () => {
    if (!hasNext || isLoadingMore) return;

    const nextPage = page + 1;
    startLoadMoreTransition(async () => {
      await getInterviews({
        filters: { query: searchQuery, type: typeFilter, sort: sortBy },
        page: nextPage,
        append: true,
      });
    });
  };

  const handleSchedule = (interview: Interview) => {
    setSelectedInterview(interview);
    setScheduleModalOpen(true);
    if (userId) scheduleAnalytics(interview, userId);
  };

  return {
    searchQuery,
    typeFilter,
    sortBy,
    interviewsList,
    hasMore: hasNext,
    isLoadingMore,
    isFiltering,
    selectedInterview,
    scheduleModalOpen,
    setScheduleModalOpen,
    getMoreInterviews,
    handleClick,
    handleSearchChange,
    handleSortChange,
    handleTypeChange,
    handleSchedule,
    handleFiltersChange,
  };
};

export default useInterviews;
