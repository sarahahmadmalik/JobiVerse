export const searchJobs = ({ searchTerm, location }, allJobs) => {
    return allJobs.filter(job => {
      // Normalize search inputs
      const searchTermLower = searchTerm?.toLowerCase() || '';
      const locationLower = location?.toLowerCase() || '';
      
      // Check if we should match both criteria or just one
      const hasSearchTerm = searchTermLower.trim().length > 0;
      const hasLocation = locationLower.trim().length > 0;
      
      // If no filters are provided, return all jobs
      if (!hasSearchTerm && !hasLocation) return true;
      
      // Check matches for each criteria
      const matchesSearchTerm = !hasSearchTerm || 
        job.position.toLowerCase().includes(searchTermLower) ||
        job.company.toLowerCase().includes(searchTermLower) ||
        (job.skills && job.skills.some(skill => 
          skill.toLowerCase().includes(searchTermLower)
        ));
      
      const matchesLocation = !hasLocation || 
        job.location.toLowerCase().includes(locationLower);
      
      // Return true only if:
      // - We're searching for both and both match OR
      // - We're only searching for one and it matches
      return (hasSearchTerm && hasLocation)
        ? matchesSearchTerm && matchesLocation
        : matchesSearchTerm || matchesLocation;
    });
  };
  
  // Improved version with additional search fields and exact match option
  export const advancedJobSearch = (
    { searchTerm, location, exactMatch = false }, 
    allJobs
  ) => {
    return allJobs.filter(job => {
      const searchTermLower = searchTerm?.toLowerCase()?.trim() || '';
      const locationLower = location?.toLowerCase()?.trim() || '';
      
      const hasSearchTerm = searchTermLower.length > 0;
      const hasLocation = locationLower.length > 0;
      
      if (!hasSearchTerm && !hasLocation) return true;
      
      // Search term can match in multiple fields
      const matchesSearchTerm = !hasSearchTerm || [
        job.position,
        job.company,
        job.description,
        ...(job.skills || []),
        job.role,
        job.department
      ].some(field => 
        field && 
        (exactMatch
          ? field.toLowerCase() === searchTermLower
          : field.toLowerCase().includes(searchTermLower))
      );
      
      // Location can match city, state, or country
      const matchesLocation = !hasLocation || [
        job.location,
        job.city,
        job.state,
        job.country
      ].some(field => 
        field && 
        field.toLowerCase().includes(locationLower)
      );
      
      return (hasSearchTerm && hasLocation)
        ? matchesSearchTerm && matchesLocation
        : matchesSearchTerm || matchesLocation;
    });
  };