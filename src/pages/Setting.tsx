import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Camera, Lock, Mail, Globe, Sparkles, Settings2 } from "lucide-react";
import { TitleLayout } from "@/components/shared/title-layout";
/* Mock user */
const user = {
  name: "Elena Rodriguez",
  role: "Head of Engineering",
  email: "elena@nova.io",
  avatar: "https://github.com/shadcn.png",
  language: "en",
};

/* Motion */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function Setting() {
  return (
    <div className="flex w-full flex-col">
      <SettingHeader />
      <SettingContent />
    </div>
  );
}

function SettingHeader() {
  return (
    <div className="flex w-full flex-col gap-4 py-1">
      <TitleLayout title="Settings" icon={<Settings2 />} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure your workspace preferences, API keys, and notification
          triggers.
        </p>
      </div>
    </div>
  );
}

function SettingContent() {
  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="relative min-h-screen w-full  px-6 py-16"
    >
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Identity Hero */}
        <motion.section
          variants={item}
          className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

          <div className="relative flex flex-col md:flex-row items-center gap-10 p-10">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-background">
                <AvatarImage src="/avatar.jpeg" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {user.name}
                </h1>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <p className="text-lg text-muted-foreground">{user.role}</p>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </motion.section>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Account */}
          <motion.section variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Your public identity and contact details
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={user.name} />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input defaultValue={user.role} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      disabled
                      defaultValue={user.email}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Preferences */}
          <motion.section variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Personalize how the product feels
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue={user.language}>
                    <SelectTrigger className="w-full">
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Label>Change password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" className="pl-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Save */}
        <motion.div variants={item} className="flex justify-end">
          <Button size="lg" className="px-10">
            Save changes
          </Button>
        </motion.div>
      </div>
    </motion.main>
  );
}
