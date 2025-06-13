import { recruiterService } from "@/services/onboard-service";
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
    const data = await request.json();
    const recruiter = await recruiterService.saveFirstStep(session.user.id, data);
    
    return new Response(JSON.stringify(recruiter), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save company details" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}