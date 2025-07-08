"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Bell, Globe, Upload } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function Settings() {
  const { t, dir } = useLanguage()
  const [profileImage, setProfileImage] = useState("/abstract-geometric-shapes.png")
  const [username, setUsername] = useState("Username")

  const handleSaveProfile = () => {
    // In a real app, this would save to a database
    // For now, we'll just update the local state
    localStorage.setItem("username", username)
    // Show a success message
    alert(t.dashboard?.profileUpdated || "Profile updated successfully!")
  }

  return (
    <div className="content-card p-6 dark:bg-dark-section" dir={dir}>
      <h1 className="text-2xl font-bold text-syria-gold dark:text-gold-accent mb-6">
        {t.dashboard?.settings || "Account Settings"}
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8 dark:bg-dark-icon-bg">
          <TabsTrigger
            value="profile"
            className="dark:data-[state=active]:bg-dark-blue dark:data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            {t.dashboard?.profile || "Profile"}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="dark:data-[state=active]:bg-dark-blue dark:data-[state=active]:text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            {t.dashboard?.security || "Security"}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="dark:data-[state=active]:bg-dark-blue dark:data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            {t.dashboard?.notifications || "Notifications"}
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="dark:data-[state=active]:bg-dark-blue dark:data-[state=active]:text-white"
          >
            <Globe className="h-4 w-4 mr-2" />
            {t.dashboard?.preferences || "Preferences"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="dark:bg-dark-icon-bg dark:border-dark-beige">
              <CardHeader>
                <CardTitle className="dark:text-white">{t.dashboard?.personalInfo || "Profile Information"}</CardTitle>
                <CardDescription className="dark:text-dark-text">
                  {t.dashboard?.profilePic || "Update your account profile information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback className="bg-syria-gold dark:bg-gold-accent text-white text-xl">UN</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                      <Upload className="h-4 w-4 mr-2" />
                      {t.dashboard?.pic || "Change Photo"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="dark:text-white">
                    {t.dashboard?.username || "Username"}
                  </Label>
                  <Input
                    id="username"
                    placeholder={t.dashboard?.username || "Enter username"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-white">
                    {t.dashboard?.email || "Email"}
                  </Label>
                  <Input
                    id="email"
                    placeholder={t.dashboard?.email || "Enter email"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-white">
                    {t.common?.contactUs || "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t.common?.contactUs || "Enter full name"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900"
                >
                  {t.dashboard?.saveChanges || "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="dark:bg-dark-icon-bg dark:border-dark-beige">
              <CardHeader>
                <CardTitle className="dark:text-white">{t.dashboard?.businessName || "Business Information"}</CardTitle>
                <CardDescription className="dark:text-dark-text">
                  {t.dashboard?.businessType || "Update your business details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="dark:text-white">
                    {t.dashboard?.businessName || "Company Name"}
                  </Label>
                  <Input
                    id="company"
                    placeholder={t.dashboard?.businessName || "Enter company name"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-type" className="dark:text-white">
                    {t.dashboard?.businessType || "Business Type"}
                  </Label>
                  <Input
                    id="business-type"
                    placeholder={t.dashboard?.businessType || "Enter business type"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="dark:text-white">
                    {t.dashboard?.address || "Address"}
                  </Label>
                  <Input
                    id="address"
                    placeholder={t.dashboard?.address || "Enter address"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-white">
                    {t.dashboard?.phone || "Phone Number"}
                  </Label>
                  <Input
                    id="phone"
                    placeholder={t.dashboard?.phone || "Enter phone number"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
                  {t.dashboard?.saveChanges || "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="dark:bg-dark-icon-bg dark:border-dark-beige">
              <CardHeader>
                <CardTitle className="dark:text-white">{t.dashboard?.newPassword || "Change Password"}</CardTitle>
                <CardDescription className="dark:text-dark-text">
                  {t.dashboard?.security || "Update your password to keep your account secure"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="dark:text-white">
                    {t.dashboard?.currentPassword || "Current Password"}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={t.dashboard?.currentPassword || "Enter current password"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="dark:text-white">
                    {t.dashboard?.newPassword || "New Password"}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder={t.dashboard?.newPassword || "Enter new password"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="dark:text-white">
                    {t.dashboard?.confirmPassword || "Confirm New Password"}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder={t.dashboard?.confirmPassword || "Confirm new password"}
                    className="dark:bg-dark-section dark:border-dark-beige dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
                  {t.dashboard?.saveChanges || "Update Password"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="dark:bg-dark-icon-bg dark:border-dark-beige">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  {t.dashboard?.twoFactorAuth || "Two-Factor Authentication"}
                </CardTitle>
                <CardDescription className="dark:text-dark-text">
                  {t.dashboard?.enableTwoFactor || "Add an extra layer of security to your account"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base dark:text-white">{t.dashboard?.enableTwoFactor || "Enable 2FA"}</Label>
                    <p className="text-sm text-muted-foreground dark:text-dark-text">
                      {t.dashboard?.twoFactorAuth || "Secure your account with two-factor authentication"}
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base dark:text-white">
                      {t.dashboard?.smsNotifications || "SMS Authentication"}
                    </Label>
                    <p className="text-sm text-muted-foreground dark:text-dark-text">
                      {t.dashboard?.smsNotifications || "Receive verification codes via SMS"}
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base dark:text-white">
                      {t.dashboard?.recoveryEmail || "Authenticator App"}
                    </Label>
                    <p className="text-sm text-muted-foreground dark:text-dark-text">
                      {t.dashboard?.recoveryEmail || "Use an authenticator app for verification codes"}
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
                  {t.dashboard?.saveChanges || "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="dark:bg-dark-icon-bg dark:border-dark-beige">
            <CardHeader>
              <CardTitle className="dark:text-white">
                {t.dashboard?.notifications || "Notification Preferences"}
              </CardTitle>
              <CardDescription className="dark:text-dark-text">
                {t.dashboard?.notifications || "Choose how you want to be notified"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">
                    {t.dashboard?.emailNotifications || "Email Notifications"}
                  </Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.emailNotifications || "Receive notifications via email"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">
                    {t.dashboard?.smsNotifications || "SMS Notifications"}
                  </Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.smsNotifications || "Receive notifications via SMS"}
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">
                    {t.dashboard?.marketingEmails || "Marketing Emails"}
                  </Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.marketingEmails || "Receive marketing and promotional emails"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">{t.dashboard?.offerAlerts || "New Offer Alerts"}</Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.offerAlerts || "Get notified about new offers and promotions"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
                {t.dashboard?.saveChanges || "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="dark:bg-dark-icon-bg dark:border-dark-beige">
            <CardHeader>
              <CardTitle className="dark:text-white">{t.dashboard?.preferences || "Account Preferences"}</CardTitle>
              <CardDescription className="dark:text-dark-text">
                {t.dashboard?.preferences || "Customize your account experience"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">{t.dashboard?.language || "Language"}</Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.language || "Choose your preferred language"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    English
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    العربية
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    Français
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">{t.dashboard?.theme || "Theme"}</Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.theme || "Choose your preferred theme"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    {t.dashboard?.lightMode || "Light"}
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    {t.dashboard?.darkMode || "Dark"}
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    {t.dashboard?.systemDefault || "System"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">{t.dashboard?.currency || "Currency"}</Label>
                  <p className="text-sm text-muted-foreground dark:text-dark-text">
                    {t.dashboard?.currency || "Choose your preferred currency"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    USD
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    EUR
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-dark-beige dark:text-dark-text">
                    SYP
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
                {t.dashboard?.saveChanges || "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
