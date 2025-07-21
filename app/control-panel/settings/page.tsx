"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Twitter, Globe, Mail, Phone, MapPin, Upload, Save, Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WebsiteSettings {
  id: string
  siteName: string
  siteDescription?: string
  logoUrl?: string
  faviconUrl?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  googleMapsEmbed?: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  enableContactForm: boolean
  recipientEmail?: string
  autoReplyMessage?: string
  enableRecaptcha: boolean
  enableSocialSharing: boolean
  shareFacebook: boolean
  shareTwitter: boolean
  shareInstagram: boolean
  shareWhatsapp: boolean
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  generateSitemap: boolean
  enableRobotsTxt: boolean
  googleAnalyticsId?: string
  enableAnalytics: boolean
  enableCookieConsent: boolean
  defaultLanguage: string
  timezone: string
  dateFormat: string
  currency: string
}

export default function SettingsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [formData, setFormData] = useState<Partial<WebsiteSettings>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        setFormData(data.settings)
      } else {
        setError("Failed to fetch settings")
      }
    } catch (error) {
      setError("Error fetching settings")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof WebsiteSettings, value: any) => {
    // Convert empty strings to null for optional fields
    const processedValue = (typeof value === 'string' && value.trim() === '') ? null : value
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = event.target.files?.[0]
    if (file) {
      if (type === 'logo') {
        setLogoFile(file)
      } else {
        setFaviconFile(file)
      }
    }
  }

  const uploadFile = async (file: File, type: 'logo' | 'favicon') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/admin/settings/upload-logo', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user?.id}`,
      },
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      return data.url
    } else {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setError("")

      // Upload files if selected
      let logoUrl = formData.logoUrl
      let faviconUrl = formData.faviconUrl

      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'logo')
      }

      if (faviconFile) {
        faviconUrl = await uploadFile(faviconFile, 'favicon')
      }

      // Clean the data before sending
      const cleanedFormData = {
        siteName: formData.siteName || "Syria Ways",
        siteDescription: formData.siteDescription || null,
        logoUrl: logoUrl || null,
        faviconUrl: faviconUrl || null,
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null,
        contactAddress: formData.contactAddress || null,
        googleMapsEmbed: formData.googleMapsEmbed || null,
        facebookUrl: formData.facebookUrl || null,
        instagramUrl: formData.instagramUrl || null,
        twitterUrl: formData.twitterUrl || null,
        websiteUrl: formData.websiteUrl || null,
        youtubeUrl: formData.youtubeUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        enableContactForm: formData.enableContactForm ?? true,
        recipientEmail: formData.recipientEmail || null,
        autoReplyMessage: formData.autoReplyMessage || null,
        enableRecaptcha: formData.enableRecaptcha ?? true,
        enableSocialSharing: formData.enableSocialSharing ?? true,
        shareFacebook: formData.shareFacebook ?? true,
        shareTwitter: formData.shareTwitter ?? true,
        shareInstagram: formData.shareInstagram ?? false,
        shareWhatsapp: formData.shareWhatsapp ?? true,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        keywords: formData.keywords || null,
        generateSitemap: formData.generateSitemap ?? true,
        enableRobotsTxt: formData.enableRobotsTxt ?? true,
        googleAnalyticsId: formData.googleAnalyticsId || null,
        enableAnalytics: formData.enableAnalytics ?? true,
        enableCookieConsent: formData.enableCookieConsent ?? true,
        defaultLanguage: formData.defaultLanguage || "ENGLISH",
        timezone: formData.timezone || "Asia/Damascus",
        dateFormat: formData.dateFormat || "DD/MM/YYYY",
        currency: formData.currency || "USD",
      }

      // Save settings
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(cleanedFormData),
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        setFormData(data.settings)
        setLogoFile(null)
        setFaviconFile(null)
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        const error = await response.json()
        setError(error.error || "Failed to save settings")
        console.error('Save error:', error)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setError("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const siteName = settings?.siteName || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">
          Configure website settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Information</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Website Name</Label>
                <Input 
                  id="site-name" 
                  value={formData.siteName || ""}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Website Description</Label>
                <Textarea
                  id="site-description"
                  value={formData.siteDescription || ""}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-logo">Website Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logoUrl && (
                    <img src={formData.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                  )}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="logo-upload">
                        <Upload className="mr-2 h-4 w-4" />
                        {logoFile ? logoFile.name : "Upload New"}
                      </label>
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  {formData.faviconUrl && (
                    <img src={formData.faviconUrl} alt="Favicon" className="h-8 w-8 object-contain" />
                  )}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="favicon-upload">
                        <Upload className="mr-2 h-4 w-4" />
                        {faviconFile ? faviconFile.name : "Upload New"}
                      </label>
                    </Button>
                    <input
                      id="favicon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'favicon')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Region and language settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-language">Default Language</Label>
                <Select value={formData.defaultLanguage || "ENGLISH"} onValueChange={(value) => handleInputChange('defaultLanguage', value)}>
                  <SelectTrigger id="default-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENGLISH">English</SelectItem>
                    <SelectItem value="ARABIC">العربية (Arabic)</SelectItem>
                    <SelectItem value="FRENCH">Français (French)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone || "Asia/Damascus"} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Damascus">Asia/Damascus (GMT+3)</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris (GMT+2)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (GMT-4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={formData.dateFormat || "DD/MM/YYYY"} onValueChange={(value) => handleInputChange('dateFormat', value)}>
                  <SelectTrigger id="date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency || "USD"} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYP">SYP (Syrian Pound)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Public contact information for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="contact-email" 
                    value={formData.contactEmail || ""}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="contact-phone" 
                    value={formData.contactPhone || ""}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Textarea 
                    id="contact-address" 
                    value={formData.contactAddress || ""}
                    onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-maps">Google Maps Embed</Label>
                <Textarea
                  id="google-maps"
                  value={formData.googleMapsEmbed || ""}
                  onChange={(e) => handleInputChange('googleMapsEmbed', e.target.value)}
                  placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>
                Settings for the website contact form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Contact Form</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow visitors to contact you through the website
                  </p>
                </div>
                <Switch 
                  checked={formData.enableContactForm || false}
                  onCheckedChange={(checked) => handleInputChange('enableContactForm', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="recipient-email">Recipient Email</Label>
                <Input 
                  id="recipient-email" 
                  value={formData.recipientEmail || ""}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Form submissions will be sent to this email address
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auto-reply">Auto-Reply Message</Label>
                <Textarea
                  id="auto-reply"
                  value={formData.autoReplyMessage || ""}
                  onChange={(e) => handleInputChange('autoReplyMessage', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>reCAPTCHA Protection</Label>
                  <p className="text-sm text-muted-foreground">
                    Prevent spam submissions with Google reCAPTCHA
                  </p>
                </div>
                <Switch 
                  checked={formData.enableRecaptcha || false}
                  onCheckedChange={(checked) => handleInputChange('enableRecaptcha', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Accounts</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <div className="flex items-center">
                  <Facebook className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="facebook" 
                    value={formData.facebookUrl || ""}
                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="flex items-center">
                  <Instagram className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="instagram" 
                    value={formData.instagramUrl || ""}
                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="flex items-center">
                  <Twitter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="twitter" 
                    value={formData.twitterUrl || ""}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    value={formData.websiteUrl || ""}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input 
                  id="youtube" 
                  value={formData.youtubeUrl || ""}
                  onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin" 
                  value={formData.linkedinUrl || ""}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Sharing</CardTitle>
              <CardDescription>
                Configure social media sharing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Social Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow visitors to share content on social media
                  </p>
                </div>
                <Switch 
                  checked={formData.enableSocialSharing || false}
                  onCheckedChange={(checked) => handleInputChange('enableSocialSharing', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Platforms to Include</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="share-facebook" 
                      checked={formData.shareFacebook || false}
                      onCheckedChange={(checked) => handleInputChange('shareFacebook', checked)}
                    />
                    <Label htmlFor="share-facebook">Facebook</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="share-twitter" 
                      checked={formData.shareTwitter || false}
                      onCheckedChange={(checked) => handleInputChange('shareTwitter', checked)}
                    />
                    <Label htmlFor="share-twitter">Twitter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="share-instagram" 
                      checked={formData.shareInstagram || false}
                      onCheckedChange={(checked) => handleInputChange('shareInstagram', checked)}
                    />
                    <Label htmlFor="share-instagram">Instagram</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="share-whatsapp" 
                      checked={formData.shareWhatsapp || false}
                      onCheckedChange={(checked) => handleInputChange('shareWhatsapp', checked)}
                    />
                    <Label htmlFor="share-whatsapp">WhatsApp</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input 
                  id="meta-title" 
                  value={formData.metaTitle || ""}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={formData.metaDescription || ""}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Textarea
                  id="keywords"
                  value={formData.keywords || ""}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Generate Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate and update sitemap.xml
                  </p>
                </div>
                <Switch 
                  checked={formData.generateSitemap || false}
                  onCheckedChange={(checked) => handleInputChange('generateSitemap', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Robots.txt</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow search engines to index your website
                  </p>
                </div>
                <Switch 
                  checked={formData.enableRobotsTxt || false}
                  onCheckedChange={(checked) => handleInputChange('enableRobotsTxt', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Website tracking and analytics settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input 
                  id="google-analytics" 
                  value={formData.googleAnalyticsId || ""}
                  onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                  placeholder="UA-XXXXXXXXX-X"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track visitor behavior on your website
                  </p>
                </div>
                <Switch 
                  checked={formData.enableAnalytics || false}
                  onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cookie Consent Banner</Label>
                  <p className="text-sm text-muted-foreground">
                    Display a cookie consent banner to visitors
                  </p>
                </div>
                <Switch 
                  checked={formData.enableCookieConsent || false}
                  onCheckedChange={(checked) => handleInputChange('enableCookieConsent', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 