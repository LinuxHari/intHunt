"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We encountered an unexpected error. Don&apos;t worry, our team has
              been notified and we&apos;re working on a fix.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button onClick={reset} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 bg-transparent"
                >
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
              If this problem persists, please contact our support team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Error;
