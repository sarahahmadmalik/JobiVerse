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
    const { experiences } = await request.json();
    
    if (!experiences || !Array.isArray(experiences)) {
      return new Response(JSON.stringify({ error: "Experiences must be provided as an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate each experience object
    const validatedExperiences = experiences.map(exp => ({
      jobTitle: exp.jobTitle?.trim() || '',
      companyName: exp.companyName?.trim() || '',
      location: exp.location?.trim() || '',
      employmentType: exp.employmentType?.trim() || '',
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      description: exp.description?.trim() || ''
    }));

    const candidate = await candidateService.saveOnboardingStep(
      session.user.id,
      3, 
      validatedExperiences
    );
    
    return new Response(JSON.stringify({
      success: true,
      experiences: candidate.experience
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save experiences"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
