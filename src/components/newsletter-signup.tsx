"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { AnimateOnScroll } from "@/components/animate-on-scroll"

type SubscriptionState = "idle" | "loading" | "success" | "error"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<SubscriptionState>("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setState("error")
      setMessage("Please enter a valid email address")
      return
    }

    setState("loading")

    try {
      // Substack API endpoint
      const substackSubdomain = process.env.NEXT_PUBLIC_SUBSTACK_SUBDOMAIN || "goarach"
      const response = await fetch(`https://${substackSubdomain}.substack.com/api/v1/free`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_url: window.location.href,
          first_referrer: document.referrer,
          current_url: window.location.href,
          current_referrer: document.referrer,
          // Add any additional fields if needed
        }),
      })

      if (response.ok) {
        setState("success")
        setMessage("Thanks for subscribing! Check your email for confirmation.")
        setEmail("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        setState("error")
        setMessage(errorData.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setState("error")
      setMessage("Unable to subscribe at this time. Please try again later.")
    }
  }

  const resetState = () => {
    setState("idle")
    setMessage("")
  }

  return (
    <AnimateOnScroll variant="fadeInUp" threshold={0.1}>
      <Card className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />

        <CardHeader className="relative text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Stay Updated</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Get the latest insights on AI development, engineering leadership, and startup building delivered to your
            inbox.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          {state === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Successfully Subscribed!</h3>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Button variant="outline" onClick={resetState}>
                Subscribe Another Email
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state === "error") resetState()
                    }}
                    className="h-12 text-base"
                    disabled={state === "loading"}
                  />
                </div>
                <Button type="submit" disabled={state === "loading" || !email} className="h-12 px-8 font-semibold">
                  {state === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>

              {/* Error message */}
              {state === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </motion.div>
              )}

              {/* Privacy note */}
              <p className="text-xs text-muted-foreground text-center">
                No spam, ever. Unsubscribe at any time. Read our{" "}
                <a href="#" className="underline hover:text-foreground transition-colors">
                  privacy policy
                </a>
                .
              </p>
            </form>
          )}

          {/* Newsletter preview */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">What You'll Get</h4>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Weekly Insights</p>
                  <p className="text-muted-foreground text-xs">AI development trends and best practices</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Leadership Tips</p>
                  <p className="text-muted-foreground text-xs">Engineering management and team building</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Startup Stories</p>
                  <p className="text-muted-foreground text-xs">Behind-the-scenes founder experiences</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}