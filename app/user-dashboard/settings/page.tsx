"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Eye, EyeOff } from "lucide-react"

export default function UserSettings() {
  const { t, language, dir } = useLanguage()
  const { user, signOut, updateUser } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [profileUpdated, setProfileUpdated] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    setMounted(true)
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email,
        phone: user.phone || ""
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (!user) {
      setError("User not found")
      setLoading(false)
      return
    }
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify(profileData),
      })
      const data = await response.json()
      if (response.ok) {
        setProfileUpdated(true)
        updateUser(data.user)
        setTimeout(() => setProfileUpdated(false), 3000)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      setError("An error occurred while updating profile")
    }
    setLoading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (!user) {
      setError("User not found")
      setLoading(false)
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      setLoading(false)
      return
    }
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword, // Add missing field
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setPasswordChanged(true)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setTimeout(() => setPasswordChanged(false), 3000)
      } else {
        setError(data.error || "Failed to change password")
      }
    } catch (error) {
      setError("An error occurred while changing password")
    }
    setLoading(false)
  }

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 3000)
  }

  if (!mounted || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/90 p-6 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
        <h1 className="mb-6 text-2xl font-bold">{t.userDashboard?.settings || "Settings"}</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="personal-info">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="personal-info">{t.userDashboard?.personalInformation || "Personal Information"}</TabsTrigger>
            <TabsTrigger value="security">{t.userDashboard?.security || "Security"}</TabsTrigger>
            <TabsTrigger value="notifications">{t.userDashboard?.notifications || "Notifications"}</TabsTrigger>
            <TabsTrigger value="preferences">{t.userDashboard?.preferences || "Preferences"}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info">
            <Card>
              <CardHeader>
                <CardTitle>{t.userDashboard?.personalInformation || "Personal Information"}</CardTitle>
                <CardDescription>
                  {t.userDashboard?.updatePersonalInfoDescription || "Update your personal information and contact details."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.userDashboard?.fullName || "Full Name"}</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.userDashboard?.email || "Email"}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.userDashboard?.phone || "Phone"}</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">{t.userDashboard?.role || "Role"}</Label>
                      <Input 
                        id="role" 
                        value={user?.role ? user.role.replace('_', ' ') : t.userDashboard?.unknown || 'Unknown'}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="submit" disabled={loading}>
                      {loading ? (t.userDashboard?.saving || "Saving...") : (t.userDashboard?.saveChanges || "Save Changes")}
                    </Button>
                    {profileUpdated && (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <Check className="mr-1 h-4 w-4" />
                        {t.userDashboard?.profileUpdatedSuccess || "Profile updated successfully!"}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t.userDashboard?.security || "Security"}</CardTitle>
                <CardDescription>
                  {t.userDashboard?.managePasswordDescription || "Manage your password and security settings."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">{t.userDashboard?.currentPassword || "Current Password"}</Label>
                      <div className="relative">
                        <Input 
                          id="current-password" 
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">{t.userDashboard?.newPassword || "New Password"}</Label>
                      <div className="relative">
                        <Input 
                          id="new-password" 
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t.userDashboard?.confirmPassword || "Confirm Password"}</Label>
                      <div className="relative">
                        <Input 
                          id="confirm-password" 
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="submit" disabled={loading}>
                      {loading ? (t.userDashboard?.changingPassword || "Changing Password...") : (t.userDashboard?.changePassword || "Change Password")}
                    </Button>
                    {passwordChanged && (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <Check className="mr-1 h-4 w-4" />
                        {t.userDashboard?.passwordChangedSuccess || "Password changed successfully!"}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t.userDashboard?.notifications || "Notifications"}</CardTitle>
                <CardDescription>
                  {t.userDashboard?.manageNotificationsDescription || "Manage how you receive notifications."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSettingsSave} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t.userDashboard?.emailNotifications || "Email Notifications"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.userDashboard?.receiveNotificationsViaEmail || "Receive notifications via email."}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t.userDashboard?.smsNotifications || "SMS Notifications"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.userDashboard?.receiveNotificationsViaSMS || "Receive notifications via SMS."}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t.userDashboard?.marketingEmails || "Marketing Emails"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.userDashboard?.receiveMarketingEmails || "Receive marketing emails and promotions."}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="submit">{t.userDashboard?.saveChanges || "Save Changes"}</Button>
                    {settingsSaved && (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <Check className="mr-1 h-4 w-4" />
                        {t.userDashboard?.settingsSavedSuccess || "Settings saved successfully!"}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{t.userDashboard?.preferences || "Preferences"}</CardTitle>
                <CardDescription>
                  {t.userDashboard?.customizeAccountPreferences || "Customize your account preferences and settings."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSettingsSave} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t.userDashboard?.language || "Language"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.userDashboard?.choosePreferredLanguage || "Choose your preferred language."}
                        </p>
                      </div>
                      <div className="text-sm font-medium">{user.preferredLang}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t.userDashboard?.accountStatus || "Account Status"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.userDashboard?.currentAccountStatus || "Your current account status."}
                        </p>
                      </div>
                      <div className="text-sm font-medium">{user.status}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t.userDashboard?.memberSince || "Member Since"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.userDashboard?.whenYouJoinedSyriaWay || "When you joined SyriaWay."}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : (t.userDashboard?.unknown || "Unknown")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="submit">{t.userDashboard?.saveChanges || "Save Changes"}</Button>
                    {settingsSaved && (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <Check className="mr-1 h-4 w-4" />
                        {t.userDashboard?.settingsSavedSuccess || "Settings saved successfully!"}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
