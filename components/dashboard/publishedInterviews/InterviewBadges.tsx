import { Badge } from "@/components/ui/badge";
import {
  cn,
  getDifficultyConfig,
  getLevelConfig,
  getTypeConfig,
} from "@/lib/utils";

interface InterviewBadgesProps {
  type: Interview["type"];
  level: Interview["level"];
  difficulty: Interview["difficulty"];
}

const InterviewBadges = ({ type, level, difficulty }: InterviewBadgesProps) => {
  // const getStatusConfig = (status: string) => {
  //   return status === "active"
  //     ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
  //     : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  // };

  const typeConfig = getTypeConfig(type);
  const levelConfig = getLevelConfig(level);
  const difficultyConfig = getDifficultyConfig(difficulty);

  return (
    <div className="flex w-fit gap-2 mt-1 flex-wrap capitalize">
      <Badge className={cn("text-xs", typeConfig.color)}>{type}</Badge>
      <Badge className={cn("text-xs", levelConfig.color)}>{level}</Badge>
      <Badge className={cn("text-xs", difficultyConfig.color)}>
        {difficulty}
      </Badge>
    </div>
  );
};

export default InterviewBadges;
