"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams, useNavigate } from "react-router-dom"

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Icon Components
import { ArrowLeft, Save, Ban, CheckCircle } from "lucide-react"

// Custom Utilities
import routes from "@/utilities/routes"
import { mockUsers } from "@/data/mockData"

export default function UserDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const user = mockUsers.find((u) => u.id === id)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    role: user?.role || "user",
    status: user?.status || "active",
  })

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t("user.userNotFound")}</h1>
          <Link to={routes.dashboard.users.index}>
            <Button>{t("user.backToUsers")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Update user:", formData)
    // TODO: Implement user update API call
    navigate(routes.dashboard.users.index)
  }

  const handleStatusToggle = () => {
    const newStatus = formData.status === "active" ? "blocked" : "active"
    setFormData({ ...formData, status: newStatus })
    console.log("[v0] Toggle user status:", newStatus)
    // TODO: Implement status toggle API call
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to={routes.dashboard.users.index}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black">
            <span className="gradient-gaming-text">{t("user.userDetails")}</span>
          </h1>
          <p className="text-muted-foreground mt-2">{t("user.manageUserInfo")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="border-primary/20 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("user.userInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.avatar.url || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={user.role === "admin" ? "gradient-gaming" : "bg-primary/10 text-primary"}
                >
                  {t(`user.${user.role}`)}
                </Badge>
                <Badge
                  variant={formData.status === "active" ? "default" : "destructive"}
                  className={formData.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                >
                  {t(`user.${formData.status}`)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("user.joined")} {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={formData.status === "active" ? "destructive" : "default"} className="w-full">
                    {formData.status === "active" ? (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        {t("user.block")}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t("user.unblock")}
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {formData.status === "active" ? t("user.blockUser") : t("user.unblockUser")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {formData.status === "active" ? t("user.blockUserDescription") : t("user.unblockUserDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStatusToggle}>{t("common.confirm")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-primary/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("user.editUserDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("user.name")} {t("form.required")}
                </Label>
                <Input
                  id="name"
                  placeholder={t("user.enterName")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("user.email")} {t("form.required")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("user.enterEmail")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">{t("user.avatar")} URL</Label>
                <Input
                  id="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  {t("user.role")} {t("form.required")}
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{t("user.user")}</SelectItem>
                    <SelectItem value="author">{t("user.author")}</SelectItem>
                    <SelectItem value="admin">{t("user.admin")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t("user.bio")}</Label>
                <Textarea
                  id="bio"
                  placeholder={t("user.userBio")}
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("common.save")}
                </Button>
                <Link to={routes.dashboard.users.index}>
                  <Button type="button" variant="outline">
                    {t("common.cancel")}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
