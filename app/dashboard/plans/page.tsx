"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"

export default function Plans() {
  const { t, dir } = useLanguage()

  return (
    <div className="content-card p-6 dark:bg-dark-section" dir={dir}>
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-syria-gold dark:text-gold-accent mb-2">
          {t.dashboard?.plans || "Advertising Plans"}
        </h1>
        <p className="text-muted-foreground dark:text-dark-text max-w-2xl mx-auto">
          {t.home?.introduction ||
            "Choose the perfect advertising plan to showcase your business on Syria Ways. Whether you're a hotel owner or car rental service, we have options to boost your visibility."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="relative bg-white dark:bg-dark-icon-bg rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-dark-beige transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
          <div className="p-6 bg-syria-cream/50 dark:bg-dark-blue/30">
            <h3 className="text-xl font-bold text-syria-gold dark:text-gold-accent">
              {t.dashboard?.basicPlan || "Basic Plan"}
            </h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">$99</span>
              <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                /{t.dashboard?.month || "month"}
              </span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <ul className="space-y-4 flex-1">
              <FeatureItem included text={t.dashboard?.standardListing || "Standard listing on search results"} />
              <FeatureItem included text={t.dashboard?.businessName || "Basic business profile"} />
              <FeatureItem included text={t.dashboard?.pic || "Up to 5 photos"} />
              <FeatureItem included text={t.dashboard?.profilePic || "Customer reviews"} />
              <FeatureItem included text={t.dashboard?.analyticsReports || "Basic analytics"} />
              <FeatureItem text={t.dashboard?.featuredInNewsletter || "Featured in homepage"} />
              <FeatureItem text={t.dashboard?.socialMediaPromotion || "Social media promotion"} />
              <FeatureItem text={t.dashboard?.priorityCustomerSupport || "Priority customer support"} />
              <FeatureItem text={t.dashboard?.customBranding || "Seasonal promotion features"} />
            </ul>
            <Button className="w-full mt-8 bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
              {t.dashboard?.selectPlan || "Select Plan"}
            </Button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative bg-white dark:bg-dark-icon-bg rounded-xl shadow-md overflow-hidden border border-syria-gold dark:border-gold-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
          <Badge className="absolute top-0 right-0 m-2 bg-syria-gold dark:bg-gold-accent text-white dark:text-gray-900">
            {t.bundles?.recommended || "Popular"}
          </Badge>
          <div className="p-6 bg-syria-gold/20 dark:bg-gold-accent/20">
            <h3 className="text-xl font-bold text-syria-gold dark:text-gold-accent">
              {t.dashboard?.premiumPlan || "Premium Plan"}
            </h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">$199</span>
              <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                /{t.dashboard?.month || "month"}
              </span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <ul className="space-y-4 flex-1">
              <FeatureItem included text={t.dashboard?.enhancedVisibility || "Priority listing on search results"} />
              <FeatureItem included text={t.dashboard?.businessType || "Enhanced business profile"} />
              <FeatureItem included text={t.dashboard?.pic || "Up to 15 photos"} />
              <FeatureItem included text={t.dashboard?.profilePic || "Customer reviews with responses"} />
              <FeatureItem included text={t.dashboard?.analyticsReports || "Detailed analytics dashboard"} />
              <FeatureItem included text={t.dashboard?.featuredInNewsletter || "Featured in homepage"} />
              <FeatureItem included text={t.dashboard?.socialMediaPromotion || "Social media promotion"} />
              <FeatureItem included text={t.dashboard?.priorityCustomerSupport || "Priority customer support"} />
              <FeatureItem text={t.dashboard?.customBranding || "Seasonal promotion features"} />
            </ul>
            <Button className="w-full mt-8 bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900">
              {t.dashboard?.selectPlan || "Select Plan"}
            </Button>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="relative bg-white dark:bg-dark-icon-bg rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-dark-beige transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
          <div className="p-6 bg-syria-teal/20 dark:bg-dark-green/30">
            <h3 className="text-xl font-bold text-syria-teal dark:text-syria-teal">
              {t.dashboard?.enterprisePlan || "Enterprise Plan"}
            </h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">$299</span>
              <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                /{t.dashboard?.month || "month"}
              </span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <ul className="space-y-4 flex-1">
              <FeatureItem included text={t.dashboard?.topListing || "Top listing on search results"} />
              <FeatureItem included text={t.bundles?.premium || "Premium business profile"} />
              <FeatureItem included text={t.dashboard?.pic || "Unlimited photos"} />
              <FeatureItem included text={t.dashboard?.profilePic || "Customer reviews with responses"} />
              <FeatureItem included text={t.dashboard?.analyticsReports || "Advanced analytics with reports"} />
              <FeatureItem included text={t.dashboard?.featuredInNewsletter || "Featured in homepage"} />
              <FeatureItem included text={t.dashboard?.socialMediaPromotion || "Social media promotion"} />
              <FeatureItem included text={t.dashboard?.dedicatedAccountManager || "24/7 dedicated support"} />
              <FeatureItem included text={t.dashboard?.customBranding || "Seasonal promotion features"} />
            </ul>
            <Button className="w-full mt-8 bg-syria-teal hover:bg-syria-dark-teal dark:bg-syria-teal dark:hover:bg-syria-dark-teal dark:text-white">
              {t.dashboard?.selectPlan || "Select Plan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ included = false, text }: { included?: boolean; text: string }) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        {included ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-gray-400 dark:text-gray-600" />
        )}
      </div>
      <p
        className={`ml-3 text-sm ${included ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500 line-through"}`}
      >
        {text}
      </p>
    </li>
  )
}
