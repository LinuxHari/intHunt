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
  const typeConfig = getTypeConfig(type);
  const levelConfig = getLevelConfig(level);
  const difficultyConfig = getDifficultyConfig(difficulty);

  return (
    <div className="flex w-fit gap-2 mt-1 flex-wrap capitalize">
      <Badge
        className={cn("text-xs py-1 px-2 leading-tight", typeConfig.color)}
      >
        {type}
      </Badge>
      <Badge
        className={cn("text-xs py-1 px-2 leading-tight", levelConfig.color)}
      >
        {level}
      </Badge>
      <Badge
        className={cn(
          "text-xs py-1 px-2 leading-tight",
          difficultyConfig.color
        )}
      >
        {difficulty}
      </Badge>
    </div>
  );
};

export default InterviewBadges;
