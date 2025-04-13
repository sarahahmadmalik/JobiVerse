export const fetchLocationSuggestions = async (query) => {
    if (!query || query.length < 3) return [];
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        {
          headers: {
            'User-Agent': 'Jobiverse/1.0 (your@email.com)' 
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
  
      const data = await response.json();

      return data.map(item => {
        const address = item.address;
        let displayName = '';
        
        if (address.city) displayName += address.city;
        if (address.state && address.city !== address.state) displayName += `, ${address.state}`;
        if (address.country && address.state !== address.country) displayName += `, ${address.country}`;
        
        return displayName || item.display_name;
      }).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
    } catch (error) {
      console.error("Location API error:", error);
      return [];
    }
  };
  
//cache layer
  const locationCache = new Map();
  
  export const getLocationSuggestions = async (query) => {
    if (locationCache.has(query)) {
      return locationCache.get(query);
    }
  
    const results = await fetchLocationSuggestions(query);
    locationCache.set(query, results);
    return results;
  };