import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecommendedInterviews from "./RecommendedInterviews";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface RecommendationsProps {
  recommendations: Array<Interview>;
  user: User | null;
}

const Recommendations = ({ recommendations, user }: RecommendationsProps) => {
  if (!recommendations.length) return null;

  return (
    <Card className="border-none shadow-none space-y-5">
      <CardHeader className="flex justify-between items-center p-0 relative">
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
        <RecommendedInterviews recommendations={recommendations} user={user} />
      </CardContent>
    </Card>
  );
};

export default Recommendations;
