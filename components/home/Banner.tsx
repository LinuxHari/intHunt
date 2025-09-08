import Image from "next/image";
import BannerImage from "../../public/BannerImage.png";

import ScrollTopButton from "./ScrollTopButton";
import { ChevronRight } from "lucide-react";

const Banner = () => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900/20 shadow-sm duration-300 hover:shadow-lg">
      <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
        <div className="flex-shrink-0">
          <div className="relative mt-10 md:mt-0 md:rounded-l-xl overflow-hidden">
            <Image
              className="rounded-xl bg-primary/80 dark:bg-primary/90 lg:rounded-l-xl lg:rounded-r-none object-fill"
              src={BannerImage}
              alt="Professional interview platform banner"
              height={240}
              width={224}
              loading="lazy"
              // sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
            />
          </div>
        </div>
        <div className="flex-1 min-w-72 space-y-3 max-w-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
            Validate yourself with our platform
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Get your dream job through our real world interviews and immediate
            feedback that actually helps you improve yourself.
          </p>
          <ScrollTopButton className="group">
            Get Started{" "}
            <ChevronRight className="group-hover:translate-x-1 duration-300" />
          </ScrollTopButton>
        </div>
      </div>
    </div>
  );
};

export default Banner;
