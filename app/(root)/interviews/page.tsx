import InterviewsPage from "@/components/interviews/InterviewsPage";
import { getInterviewsWithQuery } from "@/lib/actions/interview.action";
import { InterviewSearchParams } from "@/lib/actions/type";

export interface InterviewsPageParams {
  search: string;
  type?: Interview["type"];
  sortType?: InterviewSearchParams["sortType"];
}

interface InterviewsPageProps {
  searchParams: Promise<InterviewsPageParams>;
}

const Interviews = async ({ searchParams }: InterviewsPageProps) => {
  const params = await searchParams;

  const interviews = await getInterviewsWithQuery({
    query: params.search,
    interviewType: params.type,
    sortType: params.sortType,
  });

  if (!interviews.success) throw "Something went wrong";

  return <InterviewsPage interviews={interviews} searchParams={params} />;
};

export default Interviews;
