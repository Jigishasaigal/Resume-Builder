import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      GetResumesList();
    }
  }, [user]);

  const GetResumesList = () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      console.warn("User email not found.");
      setResumeList([]);
      return;
    }

    GlobalApi.GetUserResumes(email)
      .then((resp) => {
        const resumes = resp?.data?.data || [];
        setResumeList(resumes);
      })
      .catch((error) => {
        console.error("Failed to fetch resumes:", error);
        setResumeList([]); // Ensure resumeList is still an array
      });
  };

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start creating AI resume to your next job role</p>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
        <AddResume />
        {Array.isArray(resumeList) && resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem resume={resume} key={index} />
          ))
        ) : (
          <p className="col-span-full text-gray-500">No resumes found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

