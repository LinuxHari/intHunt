import { Users } from "lucide-react";
import InterviewCard from "../shared/InterviewCard";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type UpcomingInterviewsProps = {
  upcomingInterviews: Interview[] | null;
  user: User | null;
};

const UpcomingInterviews = ({
  user,
  upcomingInterviews,
}: UpcomingInterviewsProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Take Interviews
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Practice with available interviews
          </p>
        </div>
        <Users className="h-5 w-5 text-gray-400" />
      </div>

      <Card>
        <CardContent className="p-6">
          {upcomingInterviews && upcomingInterviews.length > 0 && user ? (
            <div className="space-y-4">
              {upcomingInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  difficulty={interview.difficulty}
                  level={interview.level}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                No interviews available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                There are no interviews available at the moment. Check back
                later for new opportunities.
              </p>
              <Button variant="outline">Refresh</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default UpcomingInterviews;
