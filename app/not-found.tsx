"use client";

import Link from "next/link";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchHero from "@/components/home/SearchHero";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <FileQuestion className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  404
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Page Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved, deleted, or you entered the wrong URL.
            </p>

            <SearchHero />

            <div className="space-y-3 grid md:grid-cols-2 gap-x-3">
              <Button asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Link>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
