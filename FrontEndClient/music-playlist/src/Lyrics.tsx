import { useState } from "react"

export default function Lyrics() {
    const [isExpanded, setIsExpanded] = useState(true)
    function buttonClick() {
        setIsExpanded(!isExpanded)
    }
    return (
        <>
            <button className="btn" onClick={buttonClick}>{isExpanded ? '>' : '<'}</button>
            {isExpanded ? (
            <div className='border-start p-4 d-flex flex-column col-xl-2 text-muted'>
                <div className="align-self-center">No lyrics available</div>
            </div> ): null }
        </>
    )
}