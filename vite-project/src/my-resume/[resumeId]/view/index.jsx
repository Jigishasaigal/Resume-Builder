import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import ResumePreview from '@/dashboard/resume/components/ResumePreview'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../service/GlobalApi'
import { RWebShare } from 'react-web-share'
import { toast } from 'sonner' // Assuming you're using sonner for toast messages

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { resumeId } = useParams();

  useEffect(() => {
    if (resumeId) {
      GetResumeInfo();
    } else {
      setError("No resume ID provided");
      setLoading(false);
      toast.error("Resume ID is missing");
    }
  }, [resumeId]);

  const GetResumeInfo = async () => {
    try {
      setLoading(true);
      const response = await GlobalApi.GetResumeById(resumeId);
      
      // Validate response data
      if (!response || !response.data || !response.data.data) {
        throw new Error("Invalid response format from API");
      }
      
      // Log response data for debugging
      console.log("Resume API Response:", response.data.data);
      
      // Check if Experience data exists in the response
      if (!response.data.data.Experience || response.data.data.Experience.length === 0) {
        console.warn("No experience data found in resume response");
      } else {
        console.log("Experience data:", response.data.data.Experience);
      }
      
      // Set the resume info state
      setResumeInfo(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resume:", err);
      setError(err.message || "Failed to load resume data");
      setLoading(false);
      toast.error("Failed to load resume. Please try again.");
    }
  };

  const HandleDownload = () => {
    window.print();
  };

  // Wait for data to be loaded before rendering the preview
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your resume...</p>
        </div>
      </div>
    );
  }

  // Show error if loading failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={GetResumeInfo} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />
        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
          <h2 className='text-center text-2xl font-medium'>
            Congrats! Your Ultimate AI generated Resume is ready!
          </h2>
          <p className='text-center text-gray-400'>
            Now you are ready to download your resume and you can share unique
            resume URL with your friends and family
          </p>
          <div className='flex justify-between px-4 md:px-44 my-10'>
            <Button onClick={HandleDownload}>Download</Button>
            
            <RWebShare
              data={{
                text: `Hello Everyone, This is my resume please open URL to see it`,
                url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                title: `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''} resume`,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>
      
      <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
        <div id="print-area">
          {/* Pass resumeInfo explicitly as prop */}
          <ResumePreview resumeInfo={resumeInfo} />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;