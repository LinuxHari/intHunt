"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DisplayTechIconsProps {
  techStack: Array<string>;
  className?: string;
  slice?: boolean;
}

const DisplayTechIcons = ({
  techStack,
  className,
  slice = true,
}: DisplayTechIconsProps) => {
  if (!techStack) return null;

  const displayTechs = slice ? techStack.slice(0, 3) : techStack;
  const remainingCount = slice ? techStack.length - 3 : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5 justify-center", className)}>
      {displayTechs.map((tech) => (
        <Badge
          key={tech}
          variant="secondary"
          className="px-2 py-0.5 text-[10px] font-medium capitalize leading-none bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0"
        >
          {tech}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="secondary"
          className="px-2 py-0.5 text-[10px] font-medium leading-none bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-0"
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};

export default DisplayTechIcons;
