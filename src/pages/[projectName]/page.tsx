"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Twitter,
  MessageCircle,
  FileText,
  Wallet,
  Users,
  Info,
  Share2,
  Copy,
  ArrowLeft,
  Globe,
  Target,
  Trophy,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import WalletConnection from "@/components/wallet";

// API Response Types
type TeamMember = {
  name: string;
  xHandle: string;
};

type Milestone = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

type Achievement = {
  description: string;
};

type Project = {
  id: number;
  uuid: string;
  name: string;
  bDescription: string;
  description: string;
  logoURI: string;
  bannerURI: string;
  state: string;
  track: string;
  walletAddress: string;
  twitterURL?: string;
  telegramURL?: string;
  websiteURL?: string;
  documentationURL?: string;
  status: "PENDING" | "DECLINED" | "PUBLISHED";
  teamMembers: TeamMember[];
  milestones: Milestone[];
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export default function ProjectDetails() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const baseUrl = import.meta.env.VITE_ENDPOINT_URL;

  const [donateOpen, setDonateOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateError, setDonateError] = useState<string | null>(null);
  const [donateSuccess, setDonateSuccess] = useState<string | null>(null);

  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected && donateOpen === false && donationAmount === "") {
      setDonateOpen(true);
    }
    // eslint-disable-next-line
  }, [isConnected]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!name) {
        setError("No project name provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching project with name:", name);
        const productName = decodeURIComponent(name);
        // Directly fetch project details using the project name
        const response = await axios.get(
          `${baseUrl}/api/products/${productName}`
        );
        console.log("API response:", response.data);
        if (response.data && response.data.data) {
          setProject(response.data.data);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Project not found");
        } else {
          setError("An error occurred while fetching project details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [name, baseUrl]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Wallet address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast("Could not copy wallet address");
    }
  };

  const shareProject = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: project?.name,
          text: project?.bDescription,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast("Project link has been copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DECLINED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrackColor = (track: string) => {
    const colors = {
      Defi: "bg-blue-100 text-blue-800 border-blue-200",
      Gaming: "bg-purple-100 text-purple-800 border-purple-200",
      Ai: "bg-pink-100 text-pink-800 border-pink-200",
      DePin: "bg-green-100 text-green-800 border-green-200",
      Infra: "bg-orange-100 text-orange-800 border-orange-200",
      Consumers: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return (
      colors[track as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (loading) {
    return <ProjectSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  console.log("Current project state:", project);
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 font-medium mb-4">
              Project not found.
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="dark:bg-secondary dark:text-white bg-black text-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl mt-4">
        {/* Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-8 shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 border" />
          {project.bannerURI ? (
            <img
              src={project.bannerURI || "/placeholder.svg"}
              alt={`${project.name} banner`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
              <div className="text-center text-white/80">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-lg font-medium">Project Banner</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8"
        >
          <div className="relative -mt-30 z-20 ml-5">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
              <AvatarImage
                src={project.logoURI || "/placeholder.svg"}
                alt={project.name}
              />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {project.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col justify-start items-start flex-1 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex gap-2 flex-wrap">
                <Badge className={getTrackColor(project.track)}>
                  {project.track}
                </Badge>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {project.state}
                </Badge>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              {project.bDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={shareProject}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            {project.websiteURL && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}

            {project.twitterURL && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.twitterURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="mr-2 h-4 w-4" />X
                </a>
              </Button>
            )}

            {project.telegramURL && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.telegramURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Telegram
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2">
            {/* Main Content - Always Visible */}
            <div className="space-y-6">
              <Card className="border border-[1px] flex flex-col justify-start items-start">
                <CardHeader className="pb-2 w-full">
                  <CardTitle className="flex items-center text-left">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full text-left">
                  <p className="whitespace-pre-line leading-relaxed text-left">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {project.milestones && project.milestones.length > 0 && (
                <Card className="border border-[1px] flex flex-col justify-start items-start">
                  <CardHeader className="pb-2 w-full">
                    <CardTitle className="flex items-center text-left">
                      <Target className="h-5 w-5 mr-2 text-primary" />
                      Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <div className="space-y-4 flex flex-col justify-start items-start w-full">
                      {project.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 pl-4 py-2 w-full text-left"
                        >
                          <h4 className="font-semibold mb-1 text-left">
                            {milestone.title}
                          </h4>
                          <p className="mb-2 text-left">
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-left">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(
                                milestone.startDate
                              ).toLocaleDateString()}
                            </span>
                            <span>→</span>
                            <span>
                              {new Date(milestone.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.achievements && project.achievements.length > 0 && (
                <Card className="border border-[1px] flex flex-col justify-start items-start">
                  <CardHeader className="pb-2 w-full">
                    <CardTitle className="flex items-center text-left">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <div className="space-y-3 text-left">
                      {project.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 text-left"
                        >
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                          <p className="text-left">{achievement.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sticky top-4 space-y-6">
            <Card className="border border-[1px] sticky top-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-left">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 text-left">
                    Wallet Address
                  </h3>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 group hover:bg-muted transition-colors">
                    <Wallet className="h-4 w-4 flex-shrink-0 text-primary" />
                    <code className="text-sm flex-1 font-mono truncate">
                      {project.walletAddress.slice(0, 8)}...
                      {project.walletAddress.slice(-6)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(project.walletAddress)}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {project.documentationURL && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 text-left">
                      Documentation
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={project.documentationURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        View Documentation
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>

              {project.teamMembers && project.teamMembers.length > 0 && (
                <Card className="flex flex-col justify-start items-start border-none shadow-none">
                  <CardHeader className="w-full">
                    <CardTitle className="flex items-center text-left">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <div className="grid sm:grid-cols-1 grid-cols-2 gap-4">
                      {project.teamMembers.map((member, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-left">
                              {member.name}
                            </p>
                            <p className="text-sm text-left">
                              @{member.xHandle}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Card>
          </div>
          <div className="w-full">
            {!isConnected ? (
              <WalletConnection />
            ) : (
              <Button
                className="mt-4 w-full"
                onClick={() => setDonateOpen(true)}
              >
                Support Product
              </Button>
            )}
          </div>
        </motion.div>
      </main>

      <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Support {project.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="font-medium">Project Wallet Address</div>
              <div className="bg-muted px-2 py-1 rounded text-xs break-all">
                {project.walletAddress}
              </div>
            </div>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount in USDC"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            {donateError && (
              <div className="text-red-500 text-sm">{donateError}</div>
            )}
            {donateSuccess && (
              <div className="text-green-600 text-sm">{donateSuccess}</div>
            )}
          </div>
          <DialogFooter>
            <Button
              disabled={donateLoading}
              onClick={async () => {
                setDonateError(null);
                setDonateSuccess(null);
                if (!address) {
                  setDonateError("Please connect your wallet.");
                  return;
                }
                if (
                  !donationAmount ||
                  isNaN(Number(donationAmount)) ||
                  Number(donationAmount) <= 0
                ) {
                  setDonateError("Enter a valid donation amount.");
                  return;
                }
                setDonateLoading(true);
                try {
                  const res = await fetch(
                    `${baseUrl}/api/products/${project.userId}/${project.uuid}/donate`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        donationAmount: Number(donationAmount),
                        donator: address,
                      }),
                    }
                  );
                  const data = await res.json();
                  if (data.status) {
                    setDonateSuccess("Thank you for your support!");
                    setDonationAmount("");
                  } else {
                    setDonateError(data.message || "Donation failed.");
                  }
                } catch (err) {
                  setDonateError("Donation failed. Please try again.");
                } finally {
                  setDonateLoading(false);
                }
              }}
            >
              {donateLoading ? "Processing..." : "Support"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <main className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Banner Skeleton */}
        <Skeleton className="w-full h-[200px] md:h-[300px] rounded-xl mb-8" />

        {/* Project Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative -mt-16 z-20">
            <Skeleton className="w-24 h-24 rounded-full" />
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <Skeleton className="h-10 w-64 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-full max-w-md" />
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Project Details Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-lg border"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
