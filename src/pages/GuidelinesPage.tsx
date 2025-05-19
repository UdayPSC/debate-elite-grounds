
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GuidelinesPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <p className="text-muted-foreground mb-4">
              At EliteMinds, we aim to foster a community where thoughtful debate and respectful discourse can flourish. These guidelines are designed to help create a positive and engaging environment for all users.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Respect for Others</h2>
            <p className="text-muted-foreground">
              Treat all community members with respect, regardless of their background, beliefs, or opinions. Disagreement is natural in debate, but personal attacks, harassment, or discrimination are not acceptable. Critique ideas, not people.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Intellectual Honesty</h2>
            <p className="text-muted-foreground">
              Present your arguments in good faith. Do not misrepresent facts or deliberately mislead others. Be willing to reconsider your position when presented with compelling evidence or reasoning. Acknowledge when you've made a mistake.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Evidence-Based Discussion</h2>
            <p className="text-muted-foreground">
              Support your claims with credible evidence when possible. Be transparent about your sources and open to scrutiny of your evidence. Recognize the difference between opinion and fact in your arguments.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Constructive Contributions</h2>
            <p className="text-muted-foreground">
              Focus on making constructive contributions to debates. Avoid trolling, spamming, or deliberately derailing discussions. Your participation should add value to the conversation and help advance understanding of the topic.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Appropriate Content</h2>
            <p className="text-muted-foreground">
              Do not post content that is illegal, obscene, or harmful. This includes but is not limited to: content that promotes violence or illegal activities, sexually explicit material, private information about others without their consent, or malware/phishing attempts.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Clear Communication</h2>
            <p className="text-muted-foreground">
              Strive for clarity in your communication. Avoid unnecessary jargon or overly complex language that might exclude others from the conversation. Be concise when possible, but thorough when necessary.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Responsible Moderation</h2>
            <p className="text-muted-foreground">
              If you serve as a debate moderator, apply rules fairly and consistently. Make decisions based on the content of contributions, not on personal feelings about participants. Be transparent about moderation actions when appropriate.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Reporting Violations</h2>
            <p className="text-muted-foreground">
              If you encounter content that violates these guidelines, please report it through the appropriate channels. Do not engage in vigilante moderation or escalate conflicts. Trust the community management process.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground mt-8">These guidelines are subject to change as our community evolves. Users who repeatedly or severely violate these guidelines may face temporary or permanent restrictions on their account.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidelinesPage;
