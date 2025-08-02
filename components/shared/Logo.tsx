import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-white font-bold text-sm">IH</span>
      </div>
      <span className="font-semibold text-lg text-gray-900 dark:text-white">
        Inthunt
      </span>
    </Link>
  );
};

export default Logo;
