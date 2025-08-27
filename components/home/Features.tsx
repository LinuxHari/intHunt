import { features } from "@/constants";

const Features = () => {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
          Features
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900/20 shadow-sm p-6 hover:scale-105 duration-300"
          >
            <div className="flex mb-4">
              <feature.icon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
