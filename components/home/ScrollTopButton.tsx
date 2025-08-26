"use client";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ScrollTopButtonProps {
  className?: string;
  children: ReactNode;
}

const ScrollTopButton = ({
  className = "",
  children,
}: ScrollTopButtonProps) => {
  return (
    <div className="pt-2">
      <Button
        onClick={() => window.scrollTo(0, 0)}
        className={cn(null, className)}
      >
        {children}
      </Button>
    </div>
  );
};

export default ScrollTopButton;
