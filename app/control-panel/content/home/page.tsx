"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, Upload, Plus, Trash2, Hotel } from "lucide-react"

export default function HomePageContent() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("hero")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.controlPanel?.homePageContent || "Home Page Content"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t.controlPanel?.editHomePageContent || "Edit the content displayed on the home page"}
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          {t.controlPanel?.saveChanges || "Save Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="hero">{t.controlPanel?.heroSection || "Hero"}</TabsTrigger>
          <TabsTrigger value="about">{t.controlPanel?.aboutSection || "About"}</TabsTrigger>
          <TabsTrigger value="services">{t.controlPanel?.servicesSection || "Services"}</TabsTrigger>
          <TabsTrigger value="bundles">{t.controlPanel?.bundlesSection || "Bundles"}</TabsTrigger>
          <TabsTrigger value="testimonials">{t.controlPanel?.testimonialsSection || "Testimonials"}</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.controlPanel?.heroSection || "Hero Section"}</CardTitle>
              <CardDescription>
                {t.controlPanel?.heroSectionDescription ||
                  "Edit the main hero section that appears at the top of the home page"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">{t.controlPanel?.title || "Title"}</Label>
                <Input
                  id="hero-title"
                  placeholder={t.controlPanel?.enterTitle || "Enter title"}
                  defaultValue="Discover the Beauty of Syria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">{t.controlPanel?.subtitle || "Subtitle"}</Label>
                <Input
                  id="hero-subtitle"
                  placeholder={t.controlPanel?.enterSubtitle || "Enter subtitle"}
                  defaultValue="Experience authentic hospitality and explore ancient wonders"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-cta">{t.controlPanel?.callToAction || "Call to Action"}</Label>
                <Input
                  id="hero-cta"
                  placeholder={t.controlPanel?.enterCTA || "Enter call to action text"}
                  defaultValue="Start Your Journey"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.controlPanel?.backgroundImage || "Background Image"}</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-md w-40 h-24 bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg?key=zef4c"
                      alt="Hero background"
                      className="max-h-full max-w-full object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {t.controlPanel?.changeImage || "Change Image"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.controlPanel?.aboutSection || "About Section"}</CardTitle>
              <CardDescription>
                {t.controlPanel?.aboutSectionDescription || "Edit the 'Who Are We' section content"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">{t.controlPanel?.sectionTitle || "Section Title"}</Label>
                <Input
                  id="about-title"
                  placeholder={t.controlPanel?.enterSectionTitle || "Enter section title"}
                  defaultValue="Who Are We and What We Do?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-content">{t.controlPanel?.content || "Content"}</Label>
                <Textarea
                  id="about-content"
                  placeholder={t.controlPanel?.enterContent || "Enter content"}
                  rows={6}
                  defaultValue="Introduction to the App: The Syria App is built to facilitate tourism in Syria. The app integrates various services to create a modern and user-friendly interface with multilingual support (Arabic, English)."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t.controlPanel?.servicesSection || "Services Section"}</CardTitle>
                <CardDescription>
                  {t.controlPanel?.servicesSectionDescription || "Edit the services displayed on the home page"}
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t.controlPanel?.addService || "Add Service"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-md">
                        <Hotel className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {index === 1 ? "Hotel Booking" : index === 2 ? "Car Rental" : "Tourism Sites"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {index === 1
                            ? "Advanced search options, filters, and secure payment"
                            : index === 2
                              ? "Browse vehicles by type, pricing calendar, and specifications"
                              : "Historical, natural, and religious sites with interactive map"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {t.controlPanel?.edit || "Edit"}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundles" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.controlPanel?.bundlesSection || "Bundles Section"}</CardTitle>
              <CardDescription>
                {t.controlPanel?.bundlesSectionDescription || "Edit the service bundles displayed on the home page"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bundles-title">{t.controlPanel?.sectionTitle || "Section Title"}</Label>
                <Input
                  id="bundles-title"
                  placeholder={t.controlPanel?.enterSectionTitle || "Enter section title"}
                  defaultValue="Bundles"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {["Basic", "Golden", "Premium"].map((bundle, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{bundle}</CardTitle>
                      {index === 1 && (
                        <div className="absolute top-0 right-4 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-md transform rotate-3">
                          {t.bundles?.recommended || "Recommended"}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        {t.controlPanel?.editBundle || "Edit Bundle"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t.controlPanel?.testimonialsSection || "Testimonials Section"}</CardTitle>
                <CardDescription>
                  {t.controlPanel?.testimonialsSectionDescription ||
                    "Edit customer testimonials displayed on the home page"}
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t.controlPanel?.addTestimonial || "Add Testimonial"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-md">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {index === 1 ? "JD" : index === 2 ? "SM" : "AK"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">
                          {index === 1 ? "John Doe" : index === 2 ? "Sarah Miller" : "Ahmed Khan"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {index === 1
                            ? "Amazing experience with Syria Ways! The hotel booking was seamless."
                            : index === 2
                              ? "The guided tour was exceptional. Our guide was knowledgeable and friendly."
                              : "Great service and support throughout our trip. Highly recommended!"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {t.controlPanel?.edit || "Edit"}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
