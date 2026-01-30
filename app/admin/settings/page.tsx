"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Bell, CreditCard, Mail, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    siteName: "LMS Academy",
    siteDescription: "Professional online learning platform",
    contactEmail: "admin@lmsacademy.com",
    supportEmail: "support@lmsacademy.com",
    paystackPublicKey: "pk_test_xxxxx",
    paystackSecretKey: "sk_test_xxxxx",
    emailNotifications: true,
    courseApproval: false,
    autoEnrollment: true,
    certificateGeneration: true,
  })

  const handleSave = () => {
    // Save settings
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure your LMS academy settings</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Gateway (Paystack)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publicKey">Public Key</Label>
              <Input
                id="publicKey"
                value={settings.paystackPublicKey}
                onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
                placeholder="pk_test_xxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                value={settings.paystackSecretKey}
                onChange={(e) => setSettings({ ...settings, paystackSecretKey: e.target.value })}
                placeholder="sk_test_xxxxx"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Feature Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications to students</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="courseApproval">Course Approval</Label>
                <p className="text-sm text-muted-foreground">Require admin approval for new courses</p>
              </div>
              <Switch
                id="courseApproval"
                checked={settings.courseApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, courseApproval: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoEnrollment">Auto Enrollment</Label>
                <p className="text-sm text-muted-foreground">Automatically enroll students after payment</p>
              </div>
              <Switch
                id="autoEnrollment"
                checked={settings.autoEnrollment}
                onCheckedChange={(checked) => setSettings({ ...settings, autoEnrollment: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="certificateGeneration">Certificate Generation</Label>
                <p className="text-sm text-muted-foreground">Generate certificates upon course completion</p>
              </div>
              <Switch
                id="certificateGeneration"
                checked={settings.certificateGeneration}
                onCheckedChange={(checked) => setSettings({ ...settings, certificateGeneration: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
