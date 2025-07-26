import CreateInterviewForm from "@/components/dashboard/createInterview/CreateInterviewForm";

const CreateInterviewPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create Interview
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Design a new interview for candidates
        </p>
      </div>
      <CreateInterviewForm />
    </div>
  );
};

export default CreateInterviewPage;
