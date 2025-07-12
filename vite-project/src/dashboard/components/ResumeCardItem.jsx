import { Notebook } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function ResumeCardItem({ resume }) {
  return (
    <Link to={'/dashboard/resume/' + resume.documentId + "/edit"}>
      <div
        className='p-14 bg-gradient-to-b
        from-pink-100 via-purple-200 to-blue-200
        h-[280px] rounded-t-lg border-t-4
        transition-transform transform hover:scale-[1.02] hover:shadow-lg'
        style={{
          borderColor: resume?.themeColor
        }}
      >
        <div className='flex items-center justify-center h-[180px]'>
          {/* <Notebook /> */}
          <img src="/cv .png" width={80} height={80} />
        </div>
      </div>
      <h2 className='text-sm mt-2'>{resume.title}</h2>
    </Link>
  )
}

export default ResumeCardItem
