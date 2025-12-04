import pawsIntro from '../assets/meow.mp3'
import './Landing.css'

function Landing() {

    useEffect(() => {
    // Preload both landscape + portrait images
    const images = [
      new Image().src = '/Paws-app/assets/paws-landing.png',
      new Image().src = '/Paws-app/assets/paws-portrait.png'
    ];
  }, []);
  
  return (
    <div className="paws-landing">
      <p>A cat for everyone.</p>
    </div>
  )
} 
export default Landing