// import { getCurrentUser } from "@/lib/actions/auth.action";
// import { getLatestInterviews } from "@/lib/actions/general.action";
// import AttendedInterviews from "@/components/home/AttendedInterviews";
// import UpcomingInterviews from "@/components/home/UpcomingInterviews";
import Hero from "@/components/home/Hero";
// import { getInterviewRecommendations } from "@/lib/actions/interview.action";
// import UserStats from "@/components/home/UserStats";
// import { getAttendedInterviews } from "@/lib/actions/interview.action";

export const dynamic = "force-dynamic";

const Home = async () => {
  // const user = await getCurrentUser();

  // const [userInterviews, allInterview] = user
  //   ? await Promise.all([
  //       getAttendedInterviews(),
  //       getLatestInterviews({ userId: user?.id! }),
  //     ])
  //   : [null, null];

  // const attendedInterviews = userInterviews && userInterviews.success? userInterviews.attendedInterviews: []
  //  const latestInterviews = allInterview && allInterview.success? interviews: 0

  // const recommendations = await getInterviewRecommendations();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto lg:px-4 py-8">
        <Hero />
        {/* {user ? (
          <>
            <UserStats
              attendedInterviews={attendedInterviews.length || 0}
              availableInterviews={latestInterviews.length || 0}
            />

            <div className="grid lg:grid-cols-2 gap-8">
              <AttendedInterviews
                userInterviews={attendedInterviews}
                user={user}
              />
              <UpcomingInterviews
                upcomingInterviews={allInterview}
                user={user}
              />
            </div>
          </>
        ) : null} */}
      </main>
    </div>
  );
};

export default Home;
