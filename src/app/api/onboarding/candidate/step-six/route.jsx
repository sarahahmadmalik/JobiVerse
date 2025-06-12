import { candidateService } from "@/services/candidate-onboard-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { socialLinks } = await request.json();
    
    if (!socialLinks || typeof socialLinks !== 'object') {
      return new Response(JSON.stringify({ error: "Social links must be provided as an object" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate and format social links
    const validatedLinks = {
      linkedin: socialLinks.linkedin?.trim() || '',
      portfolio: socialLinks.portfolio?.trim() || '',
      github: socialLinks.otherLinks?.includes('github.com') ? socialLinks.otherLinks.trim() : '',
      dribbble: socialLinks.otherLinks?.includes('dribbble.com') ? socialLinks.otherLinks.trim() : ''
    };

    const candidate = await candidateService.saveOnboardingStep(
      session.user.id,
      5, // Step number for social links
      validatedLinks
    );
    
    return new Response(JSON.stringify({
      success: true,
      socialLinks: candidate.socialLinks
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save social links"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
