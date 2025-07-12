import React from 'react';

function EducationalPreview({ resumeInfo }) {
  const educationList = Array.isArray(resumeInfo?.education)
    ? resumeInfo.education
    : [];

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Education
      </h2>
      <hr className="mb-4" style={{ borderColor: resumeInfo?.themeColor }} />

      {educationList.length === 0 ? (
        <p className="text-xs text-gray-500 text-center">No education added yet.</p>
      ) : (
        educationList.map((education, index) => (
          <div key={index} className="my-5">
            <h2
              className="text-sm font-bold"
              style={{ color: resumeInfo?.themeColor }}
            >
              {education.universityName}
            </h2>

            <div className="flex justify-between text-xs font-medium text-gray-700">
              <span>
                {education?.degree} in {education?.major}
              </span>
              <span>
                {education?.startDate} to {education?.EndDate}
              </span>
            </div>

            {education?.description && (
              <p className="text-xs my-2 text-gray-600">{education.description}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default EducationalPreview;
