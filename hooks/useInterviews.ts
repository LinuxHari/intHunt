import { useState, useTransition, useCallback } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { getInterviewsWithQuery } from "@/lib/actions/interview.action";
import useAnalytics from "./useAnalytics";
import { InterviewsPageParams } from "@/app/(root)/interviews/page";
import {
  InterviewSearchParams,
  ReturnInterviewSearch,
} from "@/lib/actions/type";

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

const useInterviews = ({ interviews, searchParams }: InterviewsPageProps) => {
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

  const { clickAnalytics } = useAnalytics();

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

  const handleClick = (interview: Interview, userId?: string) => {
    if (userId) {
      clickAnalytics(interview, userId);
    }
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

  return {
    searchQuery,
    typeFilter,
    sortBy,
    isFiltering,
    interviewsList,
    hasMore,
    isLoadingMore,
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
