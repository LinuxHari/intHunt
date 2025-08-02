"use client";

import LoadMore from "../shared/LoadMore";
import InterviewsFilters from "./InterviewsFilter";
import InterviewsHeader from "./InterviewsHeader";
import InterviewsList from "./InterviewsList";
import NoInterviews from "./NoInterviews";
import ScheduleModal from "../interview/schedule/ScheduleModal";
import useInterviews, { InterviewsPageProps } from "@/hooks/useInterviews";

const InterviewsPage = ({
  searchParams,
  interviews,
  userId,
}: InterviewsPageProps) => {
  const {
    searchQuery,
    typeFilter,
    sortBy,
    isFiltering,
    interviewsList,
    hasMore,
    isLoadingMore,
    selectedInterview,
    scheduleModalOpen,
    handleClick,
    getMoreInterviews,
    setScheduleModalOpen,
    handleSearchChange,
    handleSortChange,
    handleTypeChange,
    handleSchedule,
  } = useInterviews({ searchParams, interviews, userId });

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
            onSelect={handleClick}
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
