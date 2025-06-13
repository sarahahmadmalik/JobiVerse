import { recruiterService } from "@/services/onboard-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const recruiter = await recruiterService.completeOnboarding(session.user.id);
    
    if (!recruiter) {
      return new Response(JSON.stringify({ error: "Recruiter not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      isOnboarded: recruiter.isOnboarded
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to complete recruiter onboarding"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}