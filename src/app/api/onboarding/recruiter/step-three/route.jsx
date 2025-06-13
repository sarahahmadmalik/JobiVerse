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
    const { companyDescription, socialLinks, logoUrl } = await request.json();
    
    // Basic validation
    if (!companyDescription || typeof companyDescription !== 'string') {
      return new Response(JSON.stringify({ error: "Company description is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!socialLinks || typeof socialLinks !== 'object') {
      return new Response(JSON.stringify({ error: "Social links must be provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Save the onboarding step data
    const recruiter = await recruiterService.saveOnboardingStep(
      session.user.id,
      3, // Step number for branding
      { companyDescription, socialLinks, logoUrl }
    );
    
    return new Response(JSON.stringify({
      success: true,
      company: {
        description: recruiter.company.description,
        socialLinks: recruiter.company.socialLinks,
        logo: recruiter.company.logo
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to save branding details"
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
//     const recruiter = await recruiterService.getOnboardingProgress(session.user.id);
    
//     return new Response(JSON.stringify({
//       success: true,
//       company: {
//         description: recruiter?.company?.description || '',
//         socialLinks: recruiter?.company?.socialLinks || {
//           twitter: '',
//           facebook: '',
//           instagram: '',
//           linkedin: ''
//         }
//       }
//     }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ 
//       error: error.message || "Failed to fetch branding details"
//     }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }