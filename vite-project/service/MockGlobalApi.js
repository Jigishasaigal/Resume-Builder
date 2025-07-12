// This is a mock implementation to help debug the API service
// Import this in your Experience component instead of the actual GlobalApi

const MockGlobalApi = {
  // Mock API call that resolves successfully
  UpdateResumeDetail: async (resumeId, data) => {
    console.log('MockGlobalApi called with:', { resumeId, data });
    
    // Add artificial delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if resumeId is valid
    if (!resumeId) {
      throw new Error('Missing resumeId parameter');
    }
    
    // Return a mock successful response
    return {
      success: true,
      data: {
        id: resumeId,
        ...data
      }
    };
  }
};

export default MockGlobalApi;