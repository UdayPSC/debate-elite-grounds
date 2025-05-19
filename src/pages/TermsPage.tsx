
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using the EliteMinds platform, you agree to be bound by these Terms of Service. If you do not agree to all these terms, please do not use our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
            <p className="text-muted-foreground">
              EliteMinds provides a platform for users to engage in structured debates and discourse on various topics. Users can create debates, participate in existing debates, and interact with others in a respectful manner.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">3. User Registration</h2>
            <p className="text-muted-foreground">
              To use certain features of the platform, you may be required to register for an account. You agree to provide accurate information and to keep your account credentials secure. You are responsible for all activities that occur under your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">4. User Conduct</h2>
            <p className="text-muted-foreground">
              You agree to use the platform in accordance with all applicable laws and regulations. You will not engage in behavior that is harmful, threatening, abusive, or otherwise objectionable. EliteMinds reserves the right to remove content or suspend accounts that violate these terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The content you post on EliteMinds remains your property, but you grant us a non-exclusive license to use, modify, and display that content on our platform. EliteMinds and its logos, trademarks, and service marks are owned by us and may not be used without permission.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              EliteMinds is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the modified terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by the laws of the jurisdiction in which EliteMinds is registered, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground mt-8">Last updated: May 19, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
