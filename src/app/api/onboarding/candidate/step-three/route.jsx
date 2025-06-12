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
    const { skills } = await request.json();
    
    if (!skills || !Array.isArray(skills)) {
      return new Response(JSON.stringify({ error: "Skills must be provided as an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const candidate = await candidateService.saveOnboardingStep(
      session.user.id,
      3, // Step number for skills
      skills
    );
    
    return new Response(JSON.stringify({
      success: true,
      skills: candidate.skills
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save skills"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// export async function GET() {
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user?.id) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" }
//     });
//   }

//   try {
//     const candidate = await candidateService.getOnboardingProgress(session.user.id);
    
//     return new Response(JSON.stringify({
//       success: true,
//       skills: candidate?.skills || []
//     }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ 
//       error: error.message || "Failed to fetch skills"
//     }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }