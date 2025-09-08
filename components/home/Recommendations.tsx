import { use } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecommendedInterviews from "./RecommendedInterviews";

interface RecommendationsProps {
  recommendations: Promise<
    | {
        success: true;
        recommendations: Array<Interview>;
      }
    | CatchReturn
  >;
  user: Promise<User | null>;
}

const Recommendations = ({ recommendations, user }: RecommendationsProps) => {
  const recommendedInterviews = use(recommendations);
  const userInfo = use(user);

  const interviews = recommendedInterviews.success
    ? recommendedInterviews.recommendations
    : [];

  if (!interviews.length) return null;

  return (
    <Card className="border-none shadow-none space-y-5">
      <CardHeader className="flex justify-between items-center p-0 relative space-y-0">
        <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
          Recommended Interviews
        </CardTitle>
        <div className="flex space-x-2">
          <div className="swiper-button-prev custom-nav after:hidden">
            <button className="border border-primary p-1 rounded-full hover:bg-primary hover:text-white">
              <ArrowLeft />
            </button>
          </div>
          <div className="swiper-button-next custom-nav after:hidden">
            <button className="border border-primary p-1 rounded-full hover:bg-primary hover:text-white">
              <ArrowRight />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <RecommendedInterviews recommendations={interviews} user={userInfo} />
      </CardContent>
    </Card>
  );
};

export default Recommendations;
