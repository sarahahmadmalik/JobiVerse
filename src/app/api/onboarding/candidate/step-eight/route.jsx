import { candidateService } from "@/services/candidate-onboard-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const candidate = await candidateService.completeOnboarding(session.user.id);
    
    if (!candidate) {
      return new Response(JSON.stringify({ error: "Candidate not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      isOnboarded: candidate.isOnboarded
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to complete onboarding"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}