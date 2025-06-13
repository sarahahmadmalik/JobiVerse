"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export const useOnboardingData = (endpoint, userType = "candidate") => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async (options = {}) => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    // Validate userType
    const validUserType = ["candidate", "recruiter"].includes(userType) 
      ? userType 
      : "candidate";

    setIsLoading(true);
    setError(null);

    try {
      const defaultHeaders = {
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding/${validUserType}/${endpoint}`,
        {
          method: options.method || "POST",
          headers: { ...defaultHeaders, ...options.headers },
          body: options.body ? JSON.stringify(options.body) : undefined,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, isLoading, error, data };
};