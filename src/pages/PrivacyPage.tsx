
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              When you use EliteMinds, we collect information that you provide directly to us, such as your name, email address, and user profile information. We also automatically collect certain information about your device and how you interact with our platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience. We may also use your information to detect and prevent fraud and abuse of our platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service. We may also disclose your information if required by law or to protect our rights and safety.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Your Choices</h2>
            <p className="text-muted-foreground">
              You can access and update your account information at any time through your profile settings. You can also control certain privacy settings, such as whether your profile is visible to others and what information is displayed. You may request deletion of your account and personal information, subject to certain limitations.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings, although this may limit certain features of our platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Changes to this Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground mt-8">Last updated: May 19, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;
