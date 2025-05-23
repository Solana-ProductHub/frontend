"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Twitter, Github, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { projects as projectsObj } from "../data/project"

// Card Props
type CardProps = {
  bannerUrl: string
  logoUrl: string
  name: string
  oneLiner: string
  track: string
  socials: { twitter?: string; github?: string }
}

const ProjectCard = ({
  bannerUrl,
  logoUrl,
  name,
  oneLiner,
  track,
  socials,
  onClick,
}: CardProps & { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false)

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
      aria-label={`View details for ${name}`}
    >
      <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          {/* Banner with overlay gradient */}
          <div className="h-32 relative overflow-hidden rounded-t-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <img
              src={bannerUrl || "/placeholder.svg"}
              alt=""
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
            />

            {/* Track badge */}
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 z-20 font-medium bg-background/80 backdrop-blur-sm"
            >
              {track}
            </Badge>
          </div>

          {/* Logo */}
          <Avatar className="absolute z-10 -bottom-6 left-4 w-12 h-12 border-4 border-background shadow-md">
            <AvatarImage src={logoUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-primary/10 font-bold">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <CardContent className="pt-8 pb-4 px-4 flex flex-col h-[calc(100%-8rem)]">
          {/* Project info */}
          <div className="flex-1 flex flex-col justify-start items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-left">{oneLiner}</p>
          </div>

          {/* Footer with social links and view button */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
            <div className="flex gap-2">
              {socials.twitter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#1da1f2] hover:text-[#1da1f2]/80 hover:bg-[#1da1f2]/10"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}

              {socials.github && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground hover:text-foreground/80"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={socials.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-medium text-primary hover:text-primary">
              View
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Convert projects object to array for mapping
const projects = Object.entries(projectsObj).map(([key, value]) => ({
  bannerUrl: value.bannerUrl,
  logoUrl: value.logoUrl,
  name: value.productName,
  oneLiner: value.oneLiner,
  track: value.track,
  socials: {
    twitter: value.twitter,
    github: (value as any).github ?? undefined,
  },
  key,
}))

// Grid component
const ProjectCardGrid = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map(({ key, ...project }) => (
          <ProjectCard key={key} {...project} onClick={() => navigate(`/${key}`)} />
        ))}
      </div>
    </div>
  )
}

export default ProjectCardGrid
