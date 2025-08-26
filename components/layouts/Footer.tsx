import ScrollTopButton from "../home/ScrollTopButton";
import Logo from "../shared/Logo";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900/20 shadow-sm p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
      <Logo />
      <ScrollTopButton className="bg-transparent hover:bg-transparent text-right shadow-none hover:shadow-none text-gray-600 dark:text-gray-300">
        Back to Top <ArrowUp />
      </ScrollTopButton>
      <div className="text-gray-600 dark:text-gray-300 text-sm col-span-full md:col-span-full lg:col-span-1 flex flex-col items-start md:items-end">
        <span>&copy; 2025 Inthunt - All fights reserved</span>
        <span className="md:text-nowrap">
          Ace Your Interviews with AI-Driven Practice & Feedback
        </span>
      </div>
    </footer>
  );
};

export default Footer;
