"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Twitter, MessageCircle, Globe, FileText, ArrowUpRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"

// API Response Types
type TeamMember = {
  name: string
  xHandle: string
}

type Milestone = {
  title: string
  description: string
  startDate: string
  endDate: string
}

type Achievement = {
  description: string
}

type Project = {
  uuid: string
  name: string
  bDescription: string
  description: string
  logoURI: string
  bannerURI: string
  state: string
  track: string
  walletAddress: string
  twitterURL?: string
  telegramURL?: string
  websiteURL?: string
  status?: "PENDING" | "DECLINED" | "PUBLISHED"
  documentationURL?: string
  teamMembers: TeamMember[]
  milestones: Milestone[]
  achievements: Achievement[]
}

// Card Props
type CardProps = {
  project: Project
  onClick: () => void
}

const ProjectCard = ({ project, onClick }: CardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const getTrackColor = (track: string) => {
    const colors = {
      Defi: "bg-blue-100 text-blue-800 border-blue-200",
      Gaming: "bg-purple-100 text-purple-800 border-purple-200",
      Ai: "bg-pink-100 text-pink-800 border-pink-200",
      DePin: "bg-green-100 text-green-800 border-green-200",
      Infra: "bg-orange-100 text-orange-800 border-orange-200",
      Consumers: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }
    return colors[track as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleSocialClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer h-full"
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.name}`}
    >
      <Card className="overflow-hidden py-0 h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          {/* Banner with overlay gradient */}
          <div className="h-32 relative overflow-hidden rounded-t-lg bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            {project.bannerURI ? (
              <img
                src={project.bannerURI || "/placeholder.svg"}
                alt=""
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <div className="text-3xl mb-1">🚀</div>
                  <p className="text-xs font-medium">Project</p>
                </div>
              </div>
            )}

            {/* Track badge */}
            <Badge className={`absolute top-3 right-3 z-20 font-medium ${getTrackColor(project.track)}`}>
              {project.track}
            </Badge>

            {/* Status badge */}
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 z-20 font-medium bg-green-100 text-green-800 border-green-200"
            >
              {project.status}
            </Badge>
          </div>

          {/* Logo */}
          <Avatar className="absolute z-10 -bottom-6 left-4 w-12 h-12 border-4 border-background shadow-md">
            <AvatarImage src={project.logoURI || "/placeholder.svg"} alt={project.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {project.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <CardContent className="pt-8 pb-4 px-4 flex flex-col h-[calc(100%-8rem)]">
          {/* Project info */}
          <div className="flex-1 flex flex-col justify-start items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-left">{project.bDescription}</p>

            {/* Team members count */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs text-muted-foreground">
                  {project.teamMembers.length} team member{project.teamMembers.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Milestones count */}
            {project.milestones && project.milestones.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs text-muted-foreground">
                  {project.milestones.length} milestone{project.milestones.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Footer with social links and view button */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
            <div className="flex gap-1">
              {project.twitterURL && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer text-[#1da1f2] hover:text-[#1da1f2]/80 hover:bg-[#1da1f2]/10"
                  onClick={(e) => handleSocialClick(e, project.twitterURL!)}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              )}

              {project.telegramURL && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer text-[#0088cc] hover:text-[#0088cc]/80 hover:bg-[#0088cc]/10"
                  onClick={(e) => handleSocialClick(e, project.telegramURL!)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}

              {project.websiteURL && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer text-slate-600 hover:text-slate-600/80 hover:bg-slate-100"
                  onClick={(e) => handleSocialClick(e, project.websiteURL!)}
                >
                  <Globe className="h-4 w-4" />
                </Button>
              )}

              {project.documentationURL && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer text-slate-600 hover:text-slate-600/80 hover:bg-slate-100"
                  onClick={(e) => handleSocialClick(e, project.documentationURL!)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button variant="ghost" size="sm" className="h-8 cursor-pointer gap-1 text-xs font-medium text-primary hover:text-primary">
              View
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


// Grid component
const ProjectCardGrid = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const baseUrl = import.meta.env.VITE_ENDPOINT_URL

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${baseUrl}/api/products/list`)

        if (response.data.status && Array.isArray(response.data.data)) {
          const allProjects = response.data.data
          allProjects.forEach((p: any, i: any) => console.log(`Project[${i}] Status:`, p.status))

          // TEMP: no filtering
          setProjects(allProjects);
        } else {
          setError("Failed to fetch projects")
        }
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("An error occurred while fetching projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [baseUrl])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading published projects...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-xl">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-slate-900">No Published Projects Yet!</h3>
            <p className="text-muted-foreground max-w-md">
              There are currently no published projects to display. Check back later for exciting new projects!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Published Projects</h2>
        <p className="text-muted-foreground">
          Discover {projects.length} amazing project{projects.length !== 1 ? "s" : ""} from our community
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.uuid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectCard
              project={project}
              onClick={() => {
                console.log("Navigating to project:", project.name)
                // Use the exact project name for navigation
                navigate(`/project/${project.name}`)
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProjectCardGrid
