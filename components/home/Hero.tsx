import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import SearchHero from "./SearchHero";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-8 md:p-12 mb-12">
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              AI-Powered Interview Prep
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ace Your Interviews with{" "}
              <span className="text-primary text-nowrap">AI-Driven</span>{" "}
              Practice & Feedback
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
              Get ready for your next interview with practice questions and
              instant tips
            </p>
          </div>
          <SearchHero />
          {/* <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/interview">Start an Interview</Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            View Analytics
          </Button>
        </div> */}
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={400}
              height={400}
              className="drop-shadow-2xl"
              priority
            />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
