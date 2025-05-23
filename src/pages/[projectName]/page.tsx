"use client"

import { useParams, Navigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Twitter, MessageSquare, FileText, Wallet, Users, Info, Share2, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { projects } from "../../data/project"
import { motion } from "framer-motion"
// import { toast } from "sonner"



export default function ProjectDetails() {
  const { projectName } = useParams<{ projectName: string }>()
  const [project, setProject] = useState<any | null>(undefined)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    if (projectName) {
      // Simulate async fetch
      setTimeout(() => {
        setProject(projects[projectName as keyof typeof projects] || null)
      }, 300)
    }
  }, [projectName])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // toast("The wallet address has been copied to your clipboard.")
  }

  if (project === undefined) {
    return <ProjectSkeleton />
  }

  if (!project) {
    return <Navigate to="/404" replace />
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Banner Image with Parallax Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-8 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        <img
          src={project.bannerUrl || "/placeholder.svg"}
          alt={`${project.productName} banner`}
          className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
        />
      </motion.div>

      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8"
      >
        <div className="relative -mt-16 z-20">
          <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
            <AvatarImage src={project.logoUrl || "/placeholder.svg"} alt={project.productName} />
            <AvatarFallback className="text-xl font-bold bg-primary/10">
              {project.productName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.productName}</h1>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="font-medium">
                {project.track}
              </Badge>
              <Badge variant="secondary" className="font-medium">
                {project.state}
              </Badge>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{project.oneLiner}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator
                .share({
                  title: project.productName,
                  text: project.oneLiner,
                  url: window.location.href,
                })
                .catch(() => {
                  navigator.clipboard.writeText(window.location.href)
                  // toast("Project link has been copied to clipboard")
                })
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          {project.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Website
              </a>
            </Button>
          )}

          {project.twitter && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </a>
            </Button>
          )}

          {project.telegram && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.telegram} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" />
                Telegram
              </a>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Mobile Tabs */}
      <div className="md:hidden mb-6">
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Project Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-2">
          {/* Mobile Tab Content */}
          <div className="md:hidden">
            {activeTab === "about" ? (
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    About
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Team
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {project.team.map((member: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                      >
                        <Avatar className="border-2 border-primary/10">
                          <AvatarFallback className="bg-primary/10">
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.handle}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Card className="border-none shadow-lg mb-6">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  About
                </h2>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Team
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.team.map((member: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <Avatar className="border-2 border-primary/10">
                        <AvatarFallback className="bg-primary/10">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.handle}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="border-none shadow-lg sticky top-4">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Details</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {project.community && (
                <div className="group">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Community</h3>
                  <p className="font-medium">{project.community}</p>
                </div>
              )}

              {project.wallet && (
                <div className="group">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Wallet Address</h3>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 group-hover:bg-muted transition-colors">
                    <Wallet className="h-4 w-4 flex-shrink-0 text-primary" />
                    <p className="truncate text-sm flex-1 font-mono">{project.wallet}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(project.wallet)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {project.documentation && (
                <div className="group">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Documentation</h3>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a
                      href={project.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4 text-primary" />
                      View Documentation
                    </a>
                  </Button>
                </div>
              )}

              {/* Social Links for Mobile */}
              <div className="md:hidden pt-2 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  {project.website && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={project.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}

                  {project.twitter && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </a>
                    </Button>
                  )}

                  {project.telegram && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={project.telegram} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Telegram
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  )
}

function ProjectSkeleton() {
  return (
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
        <div className="md:col-span-2">
          <Card className="border-none shadow-lg mb-6">
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
                  <div key={i} className="flex items-center gap-3 p-4 rounded-lg border">
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
                <Skeleton className="h-5 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
