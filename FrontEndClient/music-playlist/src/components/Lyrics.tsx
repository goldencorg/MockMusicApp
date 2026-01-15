'use client'
import { useState } from "react"

export default function Lyrics() {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
        <div className={`flex transition-all duration-300 border-l ${isExpanded ? 'w-64' : 'w-12'}`}>
            <button 
                className="h-8 w-8 mt-4 -ml-4 bg-white border rounded-full shadow hover:bg-gray-100 flex items-center justify-center absolute z-10" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? '>' : '<'}
            </button>
            
            {isExpanded && (
                <div className='p-4 flex flex-col w-full text-gray-500 justify-center items-center h-full'>
                    <div>No lyrics available</div>
                </div>
            )}
        </div>
    )
}