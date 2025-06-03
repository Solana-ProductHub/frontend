"use client";

import type React from "react";
import axios from "axios";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Plus, PlusIcon, Calendar } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import useUser from "@/hooks/useUser";

import type { ProductAchievements, ProductMilestones, ProductTeamMembers } from "@/lib/types";

import { formatISOToDateInput } from "@/lib/utils";

const PRODUCT_STATES = [
  "Ideas",
  "MVP Testnet",
  "MVP Mainnet",
  "Working Product",
];

const TRACKS = ["Defi", "Gaming", "Ai", "DePin", "Infra", "Consumers"];

const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  oneLiner: z.string().min(1, "One-liner is required"),
  description: z.string().min(1, "Description is required"),
  state: z.string().min(1, "State is required"),
  track: z.string().min(1, "Track is required"),
  twitter: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  telegram: z.string().url().optional().or(z.literal("")),
  documentation: z.string().url().optional().or(z.literal("")),
  wallet: z.string().optional(),
});

export default function UpdateProjectForm() {
  let params = useParams();
  const { connected, address, user } = useUser();
  const navigate = useNavigate();
  const projectName = params?.projectName || "";
  const { isFechingProject, project } = useProject(projectName);
  const [bannerURI, setBanner] = useState<File | null>(null);
  const [logoURI, setLogo] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [team, setTeam] = useState<ProductTeamMembers[]>([{ name: "", xHandle: "" }]);
  const [milestones, setMilestones] = useState<ProductMilestones[]>([
    { title: "", description: "", startDate: "", endDate: "" },
  ]);
  const [achievements, setAchievements] = useState<ProductAchievements[]>([
    { description: "" },
  ]);

  const [_submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      oneLiner: "",
      description: "",
      state: "",
      track: "",
      twitter: "",
      website: "",
      telegram: "",
      documentation: "",
      wallet: "",
    },
  });

  // Populate data
  useEffect(() => {
    if (project) {
        form.setValue("productName", project.name);
        form.setValue("oneLiner", project.bDescription);
        form.setValue("description", project.description);
        form.setValue("oneLiner", project.bDescription);
        form.setValue("state", project.state);
        form.setValue("track", project.track);
        form.setValue("twitter", project?.twitterURL || "");
        form.setValue("website", project?.websiteURL || "");
        form.setValue("telegram", project?.telegramURL || "");
        form.setValue("documentation", project?.documentationURL || "");
        form.setValue("wallet", project?.walletAddress || "");

      // Set Team
        setTeam(project.teamMembers);

        // Set milestones if it exists
        if (project?.milestones?.length) {
          const parsedMilestones = project.milestones.map(m => ({
            ...m,
            startDate: formatISOToDateInput(m.startDate),
            endDate: formatISOToDateInput(m.endDate)
          }))
          setMilestones(parsedMilestones);
        }

        // Set achievements if it exists
        if (project?.achievements?.length) {
          setAchievements(project.achievements);
        }
    }
  }, [project])   

  const handleTeamChange = (
    idx: number,
    field: keyof ProductTeamMembers,
    value: string
  ) => {
    const updatedTeam = [...team];
    updatedTeam[idx][field] = value;
    setTeam(updatedTeam);
  };

  const handleMilestoneChange = (
    idx: number,
    field: keyof ProductMilestones,
    value: string
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[idx][field] = value;
    setMilestones(updatedMilestones);
  };

  const handleAchievementChange = (
    idx: number,
    field: keyof ProductAchievements,
    value: string
  ) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[idx][field] = value;
    setAchievements(updatedAchievements);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const addTeamMember = () => {
    setTeam([...team, { name: "", xHandle: "" }]);
  };

  const removeTeamMember = (idx: number) => {
    setTeam(team.filter((_, i) => i !== idx));
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: "", description: "", startDate: "", endDate: "" },
    ]);
  };

  const removeMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const addAchievement = () => {
    setAchievements([...achievements, { description: "" }]);
  };

  const removeAchievement = (idx: number) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!connected || !address) {
      setSubmitError("Wallet not connected");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userUID = user?.uuid;

      // Prepare form data
      const formData = new FormData();

      // Append basic fields
      formData.append("name", values.productName);
      formData.append("bDescription", values.oneLiner);
      formData.append("description", values.description);
      formData.append("state", values.state);
      formData.append("track", values.track);
      formData.append("walletAddress", values.wallet || address);

      // Append optional URLs
      if (values.twitter) formData.append("twitterURL", values.twitter);
      if (values.telegram) formData.append("telegramURL", values.telegram);
      if (values.website) formData.append("websiteURL", values.website);
      if (values.documentation)
        formData.append("documentationURL", values.documentation);

      // Append files if they exist
      if (bannerURI) formData.append("bannerURI", bannerURI || "");
      if (logoURI) formData.append("logoURI", logoURI || "");

      // Append arrays as JSON strings
      if (team.length) {
        formData.append(
          "teamMembers",
          JSON.stringify(
            team
              .filter((member) => member.name && member.xHandle)
              .map((member) => ({
                name: member.name,
                xHandle: member.xHandle,
              }))
          )
        );
      }

      // Append if it exists
      if (milestones.length) {
        formData.append(
          "milestones",
          JSON.stringify(
            milestones
              .filter((milestone) => milestone.title && milestone.description)
              .map((milestone) => ({
                title: milestone.title,
                description: milestone.description,
                startDate:
                  milestone.startDate || new Date().toISOString().split("T")[0],
                endDate:
                  milestone.endDate || new Date().toISOString().split("T")[0],
              }))
          )
        );
      }

      if (achievements.length) {
        formData.append(
          "achievements",
          JSON.stringify(
            achievements
              .filter((achievement) => achievement.description)
              .map((achievement) => ({
                description: achievement.description,
              }))
          )
        );
      }

      // Submit form
      const createRes = await axios.put(
        `${ENDPOINT_URL}/api/products/${userUID}/${project?.uuid}/update`,
        formData
      );

      const createResult = createRes.data;

      if (!createResult.status) {
        throw new Error(createResult.message || "Failed to create product");
      }

      // Reset form on success
      toast("Project successfully updated!");
      
      setTimeout(() => {
        // Redirect to project detail page
        navigate(`/project/${createResult.data.name}`)
      }, 1500)
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Update ({projectName})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oneLiner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-liner</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of your product"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of your project"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="max-w-lg grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="track"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Track</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Track" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRACKS.map((track) => (
                          <SelectItem key={track} value={track}>
                            {track}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner Upload */}
              <div className="flex flex-col items-center gap-2">
                <FormLabel>Banner Image</FormLabel>
                <label
                  htmlFor="banner-upload"
                  className="w-full h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  {bannerPreview ? (
                    <img
                      src={bannerPreview || "/placeholder.svg"}
                      alt="Banner Preview"
                      className="object-cover self-center item-center w-full h-full rounded-lg"
                    />
                  ) : (
                    <span className="flex flex-col items-center text-gray-400">
                      <PlusIcon className="w-8 h-8 mb-1" />
                    </span>
                  )}
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Logo Upload */}
              <div className="flex flex-col items-center gap-2">
                <FormLabel>Logo</FormLabel>
                <label
                  htmlFor="logo-upload"
                  className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="flex flex-col items-center text-gray-400">
                      <PlusIcon className="w-6 h-6 mb-1" />
                    </span>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://t.me/..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documentation URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://docs..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Wallet address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Team Members</FormLabel>
              {team.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      handleTeamChange(idx, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="X Handle"
                    value={member.xHandle}
                    onChange={(e) =>
                      handleTeamChange(idx, "xHandle", e.target.value)
                    }
                    className="flex-1"
                  />
                  {team.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTeamMember(idx)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Team Member
              </Button>
            </div>

            <div className="space-y-4">
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Milestones (Optional)
              </FormLabel>
              {milestones.map((milestone, idx) => (
                <div key={idx} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Milestone title"
                      value={milestone.title}
                      onChange={(e) =>
                        handleMilestoneChange(idx, "title", e.target.value)
                      }
                      className="flex-1"
                    />
                    {milestones.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeMilestone(idx)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Milestone description"
                    value={milestone.description}
                    onChange={(e) =>
                      handleMilestoneChange(idx, "description", e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <FormLabel className="text-sm">Start Date</FormLabel>
                      <Input
                        type="date"
                        value={milestone.startDate}
                        onChange={(e) =>
                          handleMilestoneChange(
                            idx,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <FormLabel className="text-sm">End Date</FormLabel>
                      <Input
                        type="date"
                        value={milestone.endDate}
                        onChange={(e) =>
                          handleMilestoneChange(idx, "endDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addMilestone}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Milestone
              </Button>
            </div>

            <div className="space-y-4">
              <FormLabel>Achievements (Optional)</FormLabel>
              {achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Textarea
                    placeholder="Achievement description"
                    value={achievement.description}
                    onChange={(e) =>
                      handleAchievementChange(
                        idx,
                        "description",
                        e.target.value
                      )
                    }
                    className="flex-1 min-h-[80px]"
                  />
                  {achievements.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAchievement(idx)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addAchievement}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Achievement
              </Button>
            </div>

            <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isFechingProject}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
