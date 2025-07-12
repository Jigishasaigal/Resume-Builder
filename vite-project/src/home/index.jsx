import Header from '@/components/custom/Header'
import { UserButton } from '@clerk/clerk-react'
import { AtomIcon, Edit, Share2 } from 'lucide-react'
import React, { useState } from 'react'

function Home() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="bg-white">
      <Header />
      <div className="relative">
        {/* Hero Section */}
        <section className="relative z-50 py-24 px-6 text-center text-white bg-blue-600">
          <div className="mx-auto max-w-screen-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              Build Your Resume <span className="text-yellow-200">With AI</span>
            </h1>
            <p className="text-lg md:text-xl font-light mb-8">
              Effortlessly Craft a Standout Resume with Our AI-Powered Builder. Get Started Today!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-center gap-6 mb-10">
              <a href="/dashboard" className="inline-flex items-center py-3 px-6 text-lg font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors transform duration-300 ease-in-out">
                Get Started
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-screen-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <div 
                className="bg-blue-100 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
              >
                <h3 className="text-xl font-semibold mb-4">Step 1: Sign Up</h3>
                <p className="text-lg">Create an account to start building your personalized resume.</p>
              </div>
              <div 
                className="bg-blue-100 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <h3 className="text-xl font-semibold mb-4">Step 2: Create Your Resume</h3>
                <p className="text-lg">Our AI will help you craft the perfect resume tailored to your experience.</p>
              </div>
              <div 
                className="bg-blue-100 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <h3 className="text-xl font-semibold mb-4">Step 3: Download</h3>
                <p className="text-lg">Once you're satisfied, download your resume and start applying!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Feedback Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Let Us Help You!</h2>
            <p className="text-xl font-light mb-8">
              We’re here to guide you in crafting the best resume. Don’t hesitate to reach out to us.
            </p>
            <div className="flex justify-center gap-6">
              <div className="inline-block bg-blue-800 p-5 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out">
                <h4 className="text-lg font-semibold">Contact Us</h4>
                <p className="text-sm">Have questions? We’re here to help you out!</p>
              </div>
              <div className="inline-block bg-blue-800 p-5 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out">
                <h4 className="text-lg font-semibold">Give Feedback</h4>
                <p className="text-sm">We'd love to hear about your experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="py-10 bg-white text-center text-gray-600">
          <div className="max-w-screen-lg mx-auto">
            <p className="text-lg">Craft your future with the perfect resume. Start today!</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home;


