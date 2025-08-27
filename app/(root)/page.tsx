import Banner from "@/components/home/Banner";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Recommendations from "@/components/home/Recommendations";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewRecommendations } from "@/lib/actions/interview.action";

export const dynamic = "force-dynamic";

const Home = async () => {
  const recommendations = await getInterviewRecommendations();
  const recommendedInterviews = recommendations.success
    ? recommendations.recommendations
    : [];

  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <main className="container space-y-14 mx-auto lg:px-4">
        <Hero />
        <Recommendations recommendations={recommendedInterviews} user={user} />
        <Features />
        <Banner />
      </main>
    </div>
  );
};

export default Home;
