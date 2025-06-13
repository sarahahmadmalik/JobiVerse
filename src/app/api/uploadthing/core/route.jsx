import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { 
      maxFileSize: "4MB",
      maxFileCount: 1,
    }
  })
  .middleware(async ({ req }) => {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new UploadThingError("Unauthorized");
    }

    // console.log(session)

    return { 
      userId: session.user.id,
      userEmail: session.user.email || null
    };
  })
  .onUploadComplete(async ({ metadata, file }) => {

    console.log("upload done")
    // IMPORTANT: Must return a JSON-serializable object
    return { 
      success: true,
      userId: metadata.userId,
      url: file.url
    };
  }),
}

