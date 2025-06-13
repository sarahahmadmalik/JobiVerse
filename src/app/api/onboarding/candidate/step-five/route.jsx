import { candidateService } from "@/services/onboard-service";
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
    const { education } = await request.json();
    
    if (!education || !Array.isArray(education)) {
      return new Response(JSON.stringify({ error: "Education must be provided as an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const validatedEducation = education.map(edu => ({
      degree: edu.degree?.trim() || '',
      fieldOfStudy: edu.fieldOfStudy?.trim() || '',
      institution: edu.institution?.trim() || '',
      location: edu.location?.trim() || '',
      startDate: edu.startDate || null,
      endDate: edu.endDate || null,
      description: edu.description?.trim() || ''
    }));

    const candidate = await candidateService.saveOnboardingStep(
      session.user.id,
      4, 
      validatedEducation
    );
    
    return new Response(JSON.stringify({
      success: true,
      education: candidate.education
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save education"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
