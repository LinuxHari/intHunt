// import Image from "next/image";

import Agent from "@/components/interview/Agent";
// import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "@/components/shared/DisplayTechIcons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import InterviewCardStats from "@/components/interviews/interviewCardStats";
import InterviewBadges from "@/components/dashboard/publishedInterviews/InterviewBadges";

interface InterviewPageProps {
  feedback: Feedback | null;
  interview: Interview;
  user: User;
}

const InterviewPage = ({ interview, feedback, user }: InterviewPageProps) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 py-8 w-full">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex flex-row gap-4 items-center">
                    {/* <Image
                      src={getRandomInterviewCover() || "/placeholder.svg"}
                      alt="Interview cover"
                      width={60}
                      height={60}
                      className="rounded-full object-cover size-[60px] border-2 border-slate-200 dark:border-slate-700"
                    /> */}
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                        {interview.role} Interview
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400">
                        Practice your skills and get instant feedback
                      </p>
                    </div>
                  </div>
                  <DisplayTechIcons
                    techStack={interview.techstack}
                    slice={false}
                  />
                </div>

                <div className="flex gap-2">
                  <InterviewBadges
                    type={interview.type}
                    level={interview.level}
                    difficulty={interview.difficulty}
                  />
                  {feedback && (
                    <Badge className="text-sm bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm text-slate-600 dark:text-slate-400">
                <InterviewCardStats
                  rating={interview.rating}
                  questions={interview.questionCount}
                  attendees={interview.attendees}
                />
                {feedback && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {feedback.totalScore}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Agent
                user={user}
                type="interview"
                interview={interview}
                feedbackId={feedback?.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Interview Instructions
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                      1
                    </span>
                  </div>
                  <p>
                    Click the &quot;Call&quot; button to start your interview
                    with our AI interviewer.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                      2
                    </span>
                  </div>
                  <p>
                    Answer questions naturally and speak clearly. The AI will
                    listen and respond in real-time.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                      3
                    </span>
                  </div>
                  <p>
                    The interview will automatically end when complete, and
                    you&apos;ll receive detailed feedback.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
