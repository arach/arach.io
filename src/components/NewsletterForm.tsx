import React, { useState } from "react";

interface NewsletterFormProps {
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    try {
      // For now, we'll just simulate a submission
      // Replace this with your actual newsletter service API call
      // Example: Buttondown, ConvertKit, Mailchimp, etc.
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For production, replace with actual API endpoint:
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      setStatus("success");
      setMessage("Thanks for subscribing! Check your email to confirm.");
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
      
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={`newsletter-form ${className}`}>
      <div className="bg-skin-card rounded-lg p-6 border border-skin-line">
        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
        <p className="text-sm text-skin-base opacity-80 mb-4">
          Get notified about new posts on AI, development, and technology.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-skin-fill border border-skin-line rounded-md focus:outline-none focus:ring-2 focus:ring-skin-accent focus:border-transparent transition-all duration-200"
              disabled={status === "loading"}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-2 bg-skin-accent text-skin-inverted rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          
          {message && (
            <div className={`text-sm ${
              status === "success" ? "text-green-600 dark:text-green-400" : 
              status === "error" ? "text-red-600 dark:text-red-400" : ""
            } transition-all duration-200`}>
              {message}
            </div>
          )}
        </form>
        
        <p className="text-xs text-skin-base opacity-60 mt-3">
          No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default NewsletterForm;