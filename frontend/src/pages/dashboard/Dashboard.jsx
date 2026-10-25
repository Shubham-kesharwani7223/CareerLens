import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  Award,
  Target,
  Upload,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { AtsScoreChart } from "@/components/charts/AtsScoreChart";
import { SkillsRadarChart } from "@/components/charts/SkillsRadarChart";
import { useAuth } from "@/hooks/useAuth";
import { resumeApi } from "@/api/resume";
import {
  getDashboardListBarColor,
  getScoreLabel,
} from "@/utils/constants";
import { SkeletonDashboard } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const cardTheme =
  "border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] " +
  "dark:!border-[#3c2b43] dark:!bg-[#17101d] dark:!text-[#fbf7ff]";

const headingTheme = "text-[#29182f] dark:text-[#fbf7ff]";
const mutedTheme = "text-[#796a7d] dark:text-[#c5b8ce]";

const buttonTheme =
  "h-12 rounded-xl border border-[#89658a] " +
  "bg-gradient-to-r from-[#694969] to-[#89658a] " +
  "px-5 font-semibold text-white shadow-lg " +
  "shadow-[#694969]/20 transition hover:brightness-110";

const statStyles = [
  {
    label: "Total Resumes",
    icon: FileText,
    iconLight: "bg-blue-100 text-blue-700",
    iconDark: "dark:bg-blue-400/15 dark:text-blue-300",
    accent: "border-t-blue-500",
  },
  {
    label: "Overall Average",
    icon: TrendingUp,
    iconLight: "bg-emerald-100 text-emerald-700",
    iconDark: "dark:bg-emerald-400/15 dark:text-emerald-300",
    accent: "border-t-emerald-500",
  },
  {
    label: "Best Score",
    icon: Award,
    iconLight: "bg-amber-100 text-amber-700",
    iconDark: "dark:bg-amber-400/15 dark:text-amber-300",
    accent: "border-t-amber-500",
  },
  {
    label: "Job Match",
    icon: Target,
    iconLight: "bg-purple-100 text-purple-700",
    iconDark: "dark:bg-purple-400/15 dark:text-purple-300",
    accent: "border-t-purple-500",
  },
];

function resumeRecencyMs(resume) {
  const analysisTime = resume.analysis?.updatedAt
    ? new Date(resume.analysis.updatedAt).getTime()
    : 0;

  const updatedTime = resume.updatedAt
    ? new Date(resume.updatedAt).getTime()
    : 0;

  const createdTime = resume.createdAt
    ? new Date(resume.createdAt).getTime()
    : 0;

  return Math.max(analysisTime, updatedTime, createdTime);
}

export function DashboardPage() {
  const { user } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    resumeApi
      .getHistory()
      .then((data) => {
        if (active) {
          setResumes(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error(
          "[Dashboard] Failed to load resumes:",
          error
        );
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const sortedResumes = useMemo(
    () =>
      [...resumes].sort(
        (a, b) => resumeRecencyMs(b) - resumeRecencyMs(a)
      ),
    [resumes]
  );

  const latestResume = sortedResumes[0];
  const analysis = latestResume?.analysis;

  const averageScore = resumes.length
    ? Math.round(
        resumes.reduce(
          (sum, resume) => sum + (resume.atsScore || 0),
          0
        ) / resumes.length
      )
    : 0;

  const bestScore = resumes.length
    ? Math.max(
        ...resumes.map((resume) => resume.atsScore || 0)
      )
    : 0;

  const stats = [
    {
      ...statStyles[0],
      value: resumes.length,
      suffix: "",
    },
    {
      ...statStyles[1],
      value: averageScore,
      suffix: "%",
    },
    {
      ...statStyles[2],
      value: bestScore,
      suffix: "%",
    },
    {
      ...statStyles[3],
      value: analysis?.jobMatchScore || 0,
      suffix:
        analysis?.jobMatchScore != null ? "%" : "",
    },
  ];

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <div
      className={
        "min-h-full rounded-2xl bg-[#f7f0e5] p-1 " +
        "text-[#29182f] dark:!bg-[#090811] " +
        "dark:!text-[#f7f1fa]"
      }
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Dashboard heading */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1
                className={
                  "text-2xl font-bold tracking-tight md:text-3xl " +
                  headingTheme
                }
              >
                Welcome back to CareerLens,{" "}
                {user?.name?.split(" ")[0] || "there"}! 👋
              </h1>

              <p className={`mt-1 text-sm md:text-base ${mutedTheme}`}>
                Your career growth journey, all in one place.
              </p>
            </div>

            <Link to="/upload" className="shrink-0">
              <Button className={`${buttonTheme} w-full sm:w-auto`}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="h-full min-w-0"
            >
              <Card
                className={
                  "relative h-full min-h-[156px] overflow-hidden " +
                  "rounded-2xl border border-t-4 " +
                  `${stat.accent} ${cardTheme} ` +
                  "shadow-sm transition duration-300 " +
                  "hover:-translate-y-1 hover:shadow-lg"
                }
              >
                <CardContent className="flex h-full min-h-[152px] items-center gap-4 p-5 sm:p-6">
                  <div
                    className={
                      "flex h-14 w-14 shrink-0 items-center " +
                      `justify-center rounded-2xl ${stat.iconLight} ${stat.iconDark}`
                    }
                  >
                    <stat.icon
                      className="h-7 w-7"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        "text-sm font-medium leading-5 sm:text-base " +
                        mutedTheme
                      }
                    >
                      {stat.label}
                    </p>

                    {index === 3 && !analysis?.jobMatchScore ? (
                      <Link
                        to="/job-match"
                        className={
                          "mt-3 inline-flex min-h-10 max-w-full " +
                          "items-center justify-center gap-2 rounded-xl " +
                          "bg-gradient-to-r from-[#694969] to-[#89658a] " +
                          "px-3 py-2 text-center text-sm font-semibold " +
                          "leading-5 text-white shadow-md transition " +
                          "hover:brightness-110 sm:px-4"
                        }
                      >
                        <Target className="h-4 w-4 shrink-0" />
                        <span>Find Best-Fit Role</span>
                      </Link>
                    ) : (
                      <p
                        className={
                          `mt-1 text-3xl font-bold leading-tight ` +
                          `tracking-tight ${headingTheme}`
                        }
                      >
                        {stat.value}
                        {stat.suffix}
                      </p>
                    )}

                    {index === 0 && (
                      <p className="mt-1 text-xs text-[#8b7b90] dark:text-[#aa9bb4]">
                        {resumes.length === 1
                          ? "Resume uploaded"
                          : "Resumes uploaded"}
                      </p>
                    )}

                    {index === 1 && (
                      <p className="mt-1 text-xs text-[#8b7b90] dark:text-[#aa9bb4]">
                        Across your resumes
                      </p>
                    )}

                    {index === 2 && (
                      <p className="mt-1 text-xs text-[#8b7b90] dark:text-[#aa9bb4]">
                        Your highest ATS score
                      </p>
                    )}

                    {index === 3 &&
                      analysis?.jobMatchScore != null && (
                        <Link
                          to="/job-match"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#79557e] hover:underline dark:text-[#d5b6df]"
                        >
                          View job match
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ATS charts or empty state */}
        {latestResume && (latestResume.atsScore || 0) > 0 ? (
          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            <motion.div
              variants={itemVariants}
              className="min-w-0"
            >
              <AtsScoreChart score={latestResume.atsScore} />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="min-w-0"
            >
              <SkillsRadarChart
                skills={analysis?.skillsScore || 0}
                experience={analysis?.experienceScore || 0}
                education={analysis?.educationScore || 0}
                projects={analysis?.projectsScore || 0}
                headlineAts={latestResume.atsScore ?? null}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card
              className={
                "overflow-hidden rounded-2xl border " +
                "border-[#d8c2d8] " +
                "bg-gradient-to-br from-[#f0e4f1] via-[#fffaf2] to-[#f7eee4] " +
                "text-[#29182f] dark:!border-[#49344f] " +
                "dark:!bg-[#17101d] dark:!text-[#fbf7ff]"
              }
            >
              <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center sm:py-16">
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="mb-5 h-16 w-16 text-[#89618c] dark:text-[#d5b6df]" />
                </motion.div>

                <h2 className={`text-xl font-semibold ${headingTheme}`}>
                  Start Your CareerLens Journey
                </h2>

                <p
                  className={
                    `mt-3 max-w-xl text-sm sm:text-base ${mutedTheme}`
                  }
                >
                  Upload your first resume to see your career analytics
                  and discover opportunities to improve your profile.
                </p>

                <Link to="/upload" className="mt-6">
                  <Button className={`${buttonTheme} px-6`}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent analyses */}
        {resumes.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className={`rounded-2xl border ${cardTheme}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className={`text-lg ${headingTheme}`}>
                    Recent CareerLens Analyses
                  </CardTitle>

                  <Link
                    to="/history"
                    className={
                      "inline-flex shrink-0 items-center gap-1 rounded-lg " +
                      "border border-[#e4d6dc] px-3 py-2 text-sm " +
                      "font-medium text-[#694969] transition " +
                      "hover:bg-[#f0e4f1] dark:border-[#49344f] " +
                      "dark:text-[#e0cce6] dark:hover:bg-[#76577c]/20"
                    }
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {sortedResumes.slice(0, 5).map((resume) => (
                  <Link
                    key={resume.id}
                    to={`/analysis?resumeId=${resume.id}`}
                    className={
                      "group flex min-w-0 items-center justify-between " +
                      "gap-3 rounded-xl border border-[#eadfe4] p-4 " +
                      "transition hover:border-[#b99ab9] hover:bg-[#f7eff5] " +
                      "dark:border-[#3c2b43] dark:hover:border-[#89658a] " +
                      "dark:hover:bg-[#76577c]/10"
                    }
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eee3ef] text-[#79557e] dark:bg-[#76577c]/20 dark:text-[#d5b6df]">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className={`truncate font-semibold ${headingTheme}`}>
                          {resume.fileName || "Resume"}
                        </p>

                        <p className={`text-xs ${mutedTheme}`}>
                          {resume.createdAt
                            ? new Date(
                                resume.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Date unavailable"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <div className="hidden sm:block">
                        <Progress
                          value={resume.atsScore || 0}
                          className="w-20"
                          size="sm"
                          barColor={getDashboardListBarColor(
                            resume.atsScore || 0
                          )}
                        />
                      </div>

                      <Badge
                        variant={
                          (resume.atsScore || 0) >= 71
                            ? "success"
                            : (resume.atsScore || 0) >= 41
                              ? "warning"
                              : "danger"
                        }
                      >
                        {resume.atsScore || 0}% —{" "}
                        {getScoreLabel(resume.atsScore || 0)}
                      </Badge>

                      <ArrowUpRight className="h-4 w-4 text-[#89618c] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-[#d5b6df]" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
