import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
// Option 1: Use the real GlobalApi
//import GlobalApi from './../../../../../service/GlobalApi'
// Option 2: Uncomment this line and comment out the above line to use the mock API for testing
import GlobalApi from './../../../../../service/MockGlobalApi'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

const Experience = () => {
  const [experienceList, setExperienceList] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  // Initialize experienceList from context when component mounts or resumeInfo changes
  useEffect(() => {
    if (resumeInfo?.Experience && resumeInfo.Experience.length > 0) {
      setExperienceList(resumeInfo.Experience);
    } else {
      // If no experience data, initialize with empty array to avoid undefined issues
      setExperienceList([]);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const newEntries = [...experienceList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const addNewExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        title: '',
        companyName: '',
        city: '',
        state: '',
        startDate: '',
        endDate: '',
        // Using workSummery to match backend spelling
        workSummery: '',
      },
    ]);
  };

  const removeExperience = () => {
    if (experienceList.length > 0) {
      setExperienceList((prev) => prev.slice(0, -1));
    }
  };

  // Fixed parameter order to match what RichTextEditor expects
  const handleRichTextEditor = (value, name, index) => {
    console.log('RichTextEditor changed:', { value, name, index });
    const newEntries = [...experienceList];
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  // Update resumeInfo when experienceList changes
  useEffect(() => {
    // Don't add empty experience arrays to resume context
    if (experienceList.length > 0) {
      console.log('Updating resumeInfo with new experience list:', experienceList);
      setResumeInfo((prevResumeInfo) => ({
        ...prevResumeInfo,
        Experience: experienceList,
      }));
    }
  }, [experienceList, setResumeInfo]); // Added setResumeInfo as dependency

  // Single, fixed onSave function
  const onSave = async () => {
    setLoading(true);
    
    try {
      // Log what we're about to send to help with debugging
      console.log('Saving resume data:', {
        resumeId: params?.resumeId,
        experienceList
      });
      
      // Make sure experienceList has valid data before saving
      if (!experienceList || experienceList.length === 0) {
        toast.warning('No experience data to save');
        setLoading(false);
        return;
      }
      
      // Properly format the data for the API - use workSummery spelling to match backend
      const data = {
        data: {
          Experience: experienceList.map(({ id, ...experience }) => {
            // Ensure consistency with backend field name (workSummery)
            if (experience.workSummary && !experience.workSummery) {
              experience.workSummery = experience.workSummary;
              delete experience.workSummary;
            }
            return experience;
          }),
        },
      };

      // Make sure we have a valid resumeId before making the API call
      if (!params?.resumeId) {
        console.error('Missing resumeId parameter');
        toast.error('Error: Missing resume ID');
        setLoading(false);
        return;
      }

      // Call the API with proper error handling
      const res = await GlobalApi.UpdateResumeDetail(params.resumeId, data);
      
      // Check if we have a valid response
      if (!res) {
        throw new Error('Empty response from API');
      }
      
      console.log('API response:', res);
      toast.success('Experience details updated successfully!');
      
      // Update the local resumeInfo context to reflect the saved data
      setResumeInfo(prevState => ({
        ...prevState,
        Experience: data.data.Experience
      }));
      
    } catch (error) {
      // Log detailed error information
      console.error('Update failed:', error);
      
      // Provide more specific error messaging based on the error type
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
        toast.error(`Error updating details: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request error:', error.request);
        toast.error('Network error. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Error updating details: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add your previous job experience</p>
        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                <div>
                  <label className='text-xs'>Position Title</label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.title || ''}
                  />
                </div>
                <div>
                  <label className='text-xs'>Company Name</label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.companyName || ''}
                  />
                </div>
                <div>
                  <label className='text-xs'>City</label>
                  <Input
                    name="city"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.city || ''}
                  />
                </div>
                <div>
                  <label className='text-xs'>State</label>
                  <Input
                    name="state"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.state || ''}
                  />
                </div>
                <div>
                  <label className='text-xs'>Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.startDate || ''}
                  />
                </div>
                <div>
                  <label className='text-xs'>End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(event) => handleChange(index, event)}
                    value={item?.endDate || ''}
                  />
                </div>
                <div className='col-span-2'>
                  <label className='text-xs'>Work Summary</label>
                  <RichTextEditor
                    index={index}
                    defaultValue={item?.workSummery || ''}
                    onRichTextEditorChange={handleRichTextEditor}
                    name="workSummery" // Match backend field name exactly
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Button variant="outline" onClick={addNewExperience} className="text-primary">
              + Add More Experience
            </Button>
            <Button variant="outline" onClick={removeExperience} className="text-primary">
              - Remove
            </Button>
          </div>
          <Button disabled={loading} onClick={onSave}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Experience;