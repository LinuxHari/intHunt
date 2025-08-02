import Link from "next/link";

const PublishedInterviewsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Published Interviews
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your created interviews
        </p>
      </div>
      <Link
        className="bg-primary px-4 py-2 rounded-md self-end text-white"
        href="/dashboard/create"
      >
        Create New Interview
      </Link>
    </div>
  );
};

export default PublishedInterviewsHeader;
