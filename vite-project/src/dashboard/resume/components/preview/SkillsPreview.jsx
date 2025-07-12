import React from 'react';

function SkillsPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        Skills
      </h2>
      <hr
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />

      <div className="grid grid-cols-2 gap-5 my-4">
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <h2 className="text-xs w-20">{skill.name}</h2>
            <span className="text-xs" style={{ color: resumeInfo?.themeColor }}>
              {skill.rating} / 5
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;

