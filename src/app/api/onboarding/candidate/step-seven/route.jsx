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
    const { jobPreferences } = await request.json();
    
    if (!jobPreferences || typeof jobPreferences !== 'object') {
      return new Response(JSON.stringify({ error: "Job preferences must be provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const validatedPreferences = {
      desiredTitle: jobPreferences.desiredTitle?.trim() || '',
      preferredLocations: Array.isArray(jobPreferences.preferredLocations) 
        ? jobPreferences.preferredLocations.map(loc => loc.trim()).filter(loc => loc)
        : [],
      industries: Array.isArray(jobPreferences.industries)
        ? jobPreferences.industries.map(ind => ind.trim()).filter(ind => ind)
        : [],
      salaryExpectation: jobPreferences.salaryExpectation?.trim() || '',
      employmentTypes: Array.isArray(jobPreferences.employmentTypes)
        ? jobPreferences.employmentTypes.filter(type => 
            ["Full-time", "Part-time", "Contract", "Freelance", "Internship"].includes(type)
          )
        : []
    };

    const candidate = await candidateService.saveOnboardingStep(
      session.user.id,
      6, // Step number for job preferences
      validatedPreferences
    );
    
    return new Response(JSON.stringify({
      success: true,
      jobPreferences: candidate.jobPreferences
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save job preferences"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
