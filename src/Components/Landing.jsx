import pawsIntro from '../assets/meow.mp3'
import './Landing.css'

function Landing() {
  useEffect(() => {
    // Proper preloading using Image() with Vite-imported paths
    new Image().src = landingImg;
    new Image().src = portraitImg;
  }, []);
  
  return (
    <div className="paws-landing">
      <p>A cat for everyone.</p>
    </div>
  )
} 
export default Landing