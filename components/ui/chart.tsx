"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
    theme?: {
      light?: string;
      dark?: string;
    };
  };
}

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config?: ChartConfig;
  children: React.ReactNode;
}

interface TooltipPayload {
  color?: string;
  name?: string;
  value?: string | number;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps
  extends Omit<React.ComponentProps<"div">, "content"> {
  content?: React.ComponentType<ChartTooltipContentProps> | React.ReactNode;
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, config, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        data-chart-config={config ? JSON.stringify(config) : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ content, active, payload, label, ...restProps }, ref) => {
    const chartProps = { active, payload, label };

    if (React.isValidElement(content)) {
      return React.cloneElement(content, chartProps);
    }

    if (typeof content === "function") {
      const ContentComponent =
        content as React.ComponentType<ChartTooltipContentProps>;
      return <ContentComponent {...chartProps} />;
    }

    if (content) {
      return (
        <div ref={ref} {...restProps}>
          {content}
        </div>
      );
    }

    return <ChartTooltipContent ref={ref} {...chartProps} {...restProps} />;
  }
);
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      className,
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey = "name",
      ...props
    },
    ref
  ) => {
    if (!active || !payload?.length) {
      return null;
    }

    const renderIndicator = (color: string) => {
      switch (indicator) {
        case "line":
          return (
            <div className="w-4 h-0.5" style={{ backgroundColor: color }} />
          );
        case "dashed":
          return (
            <div
              className="w-4 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: color }}
            />
          );
        case "dot":
        default:
          return (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background px-3 py-2 text-sm shadow-lg",
          "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
          className
        )}
        {...props}
      >
        {!hideLabel && label && (
          <div className="font-medium text-slate-900 dark:text-white mb-2">
            {label}
          </div>
        )}

        <div className="space-y-1">
          {payload.map((item, index) => {
            const itemName =
              (item[nameKey as keyof TooltipPayload] as string) ||
              item.dataKey ||
              "Value";
            const itemValue = item.value;
            const itemColor = item.color || "#8884d8";

            return (
              <div key={index} className="flex items-center gap-2">
                {!hideIndicator && renderIndicator(itemColor)}
                <span className="text-slate-600 dark:text-slate-300 flex-1">
                  {itemName}: {itemValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const useChartConfig = (config: ChartConfig = {}) => {
  return React.useMemo(() => {
    return Object.entries(config).reduce((acc, [key, value]) => {
      acc[key] = {
        label: value.label || key,
        color: value.color || "#8884d8",
        ...value,
      };
      return acc;
    }, {} as ChartConfig);
  }, [config]);
};

const getConfigColor = (
  config: ChartConfig,
  dataKey: string,
  fallback: string = "#8884d8"
): string => {
  return config[dataKey]?.color || fallback;
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChartConfig,
  getConfigColor,
  type ChartConfig,
  type ChartTooltipProps,
  type ChartTooltipContentProps,
  type TooltipPayload,
};
