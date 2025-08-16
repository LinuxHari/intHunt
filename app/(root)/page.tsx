import Hero from "@/components/home/Hero";
import Recommendations from "@/components/home/Recommendations";
import { getInterviewRecommendations } from "@/lib/actions/interview.action";

export const dynamic = "force-dynamic";

const Home = async () => {
  const recommendations = await getInterviewRecommendations();
  const recommendedInterviews = recommendations.success
    ? recommendations.recommendations
    : [];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto lg:px-4 py-8">
        <Hero />
        <Recommendations recommendations={recommendedInterviews} />
      </main>
    </div>
  );
};

export default Home;
