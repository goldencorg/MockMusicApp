import homeImage from './assets/home.svg'
import trendingImage from './assets/trending.svg'
import radioImage from './assets/radio.svg'
import songImage from './assets/song.svg'
import albumImage from './assets/album.svg'
import artistImage from './assets/artist.svg'

export default function AlternativeChoices() {
    return (
        <div style={{overflow: 'hidden'}}>
            <div className="pb-2">
                <h6 className="text-muted">Music</h6>
                <div className="fs-4 d-flex flex-row">
                    <img className='align-self-center' src={homeImage} style={{paddingLeft: 15, height: 17}}></img>
                    <div style={{textIndent:2}}>Home</div>
                </div>
                <div className="fs-4 d-flex flex-row">
                    <img className='align-self-center' src={trendingImage} style={{paddingLeft: 15, height: 17}}></img>
                    <div style={{textIndent:5}}>Trending</div>
                </div>
                <div className="fs-4 d-flex flex-row">
                    <img className='align-self-center' src={radioImage} style={{paddingLeft: 15, height: 17}}></img>
                    <div style={{textIndent:5}}>Radio</div>
                </div>
            </div>
            <div className="pb-2">
                <h6 className="text-muted">Library</h6>
                <div className="fs-4 d-flex flex-row">
                    <img className='align-self-center' src={songImage} style={{paddingLeft: 15, height: 17}}></img>
                    <div style={{textIndent:2}}>Songs</div>
                </div>
                <div className="fs-4 d-flex flex-row">
                    <img className='align-self-center' src={albumImage} style={{paddingLeft: 15, height: 17}}></img>
                    <div style={{textIndent:5}}>Albums</div>
                </div>
                <div className="fs-4 d-flex flex-row">
                    <img className='align-self-center' src={artistImage} style={{paddingLeft: 15, height: 17}}></img>
                    <div style={{textIndent:5}}>Artists</div>
                </div>
            </div>
        </div>
    )
}