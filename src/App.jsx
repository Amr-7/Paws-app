import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import Landing from './Components/Landing.jsx'

import './App.css'

function App() {
  //Itialized state variables
  const [catList, setCatList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [likedCats, setLikedCats] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const [landingFade, setLandingFade] = useState(false)

  // Landing page timer, show for 5 seconds then fade
  useEffect(() => {
    const landingTimer = setTimeout(() => {
      setLandingFade(true)
      setTimeout(() => {
        setShowLanding(false)
      }, 500) // 500ms for fade animation
    }, 3000) // 3 seconds

    return () => clearTimeout(landingTimer)
  }, [])

  // Preload 10 cats on mount
  useEffect(() => {
    const preloadCats = async () => {
      try {
        setLoading(true)
        const requests = Array.from({ length: 10 }).map((_, i) =>
          fetch(`https://cataas.com/cat?type=square&_t=${Date.now() + i}`) //fetch unique square cat images and then convert to blob URL
            .then(res => res.blob())
            .then(blob => URL.createObjectURL(blob))
        )
        const cats = await Promise.all(requests) //wait for all fetches
        setCatList(cats)
        setCurrentIndex(0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    preloadCats()
  }, [])

  const currentCat = catList[currentIndex]

  //store liked cats and move to next cat
  const nextCat = (liked = false) => {
    if (liked && currentCat) {
      setLikedCats([...likedCats, currentCat])
    }
    
    setSwipeDirection(null)
    
    if (currentIndex + 1 >= 10) {
      setShowResults(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }
  //detect swipe direction
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection('left')
      setTimeout(() => nextCat(false), 300)
    },
    onSwipedRight: () => {
      setSwipeDirection('right')
      setTimeout(() => nextCat(true), 300)
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  return (
    // Render the landing page then fade into Main App
    <> 
      {showLanding && (
        <div className={`landing-wrapper ${landingFade ? 'fade-out' : ''}`}>
          <Landing />
        </div>
      )}
      {!showLanding && (
        <div className="app-container">
          <h1 className="app-title">🐱 Cat Swiper</h1>
          <p className="cat-counter">Cats viewed: {currentIndex + 1} / 10</p>
        
        {error && <p className="error-message">Error: {error}</p>}
        
        {loading ? (
          <p className="loading-message">Loading 10 cats...</p>
        ) : !showResults ? (
          <>
            {currentCat && (
              <div 
                {...handlers}
                className={`cat-card ${swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''}`}
              >
                <img 
                  src={currentCat} 
                  alt="Random cat" 
                  className="cat-image"
                />
              </div>
            )}

            <p className="instructions">
              Swipe left to pass • Swipe right to like
            </p>
          </>
        ) : (
          <div className="results-container">
            <h2 className="results-title">🎉 You've Viewed 10 Cats!</h2>
            <p className="results-count">You liked {likedCats.length} cats</p>
            
            {likedCats.length > 0 ? (
              <>
                <h3 className="liked-cats-title">Your Liked Cats:</h3>
                <div className="liked-cats-grid">
                  {likedCats.map((cat, index) => (
                    <img 
                      key={index} 
                      src={cat} 
                      alt={`Liked cat ${index + 1}`} 
                      className="liked-cat-image"
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="no-likes-message">You didn't like any cats this time 😿</p>
            )}
            
            <button 
              onClick={() => {
                setShowResults(false)
                setCurrentIndex(0)
                setLikedCats([])
                setSwipeDirection(null)
                setLoading(true)
                const preloadCats = async () => {
                  try {
                    const requests = Array.from({ length: 10 }).map((_, i) =>
                      fetch(`https://cataas.com/cat?type=square&_t=${Date.now() + i}`)
                        .then(res => res.blob())
                        .then(blob => URL.createObjectURL(blob))
                    )
                    const cats = await Promise.all(requests)
                    setCatList(cats)
                  } catch (err) {
                    setError(err.message)
                  } finally {
                    setLoading(false)
                  }
                }
                preloadCats()
              }}
              className="btn btn-restart"
            >
               🔄️ Start Over
            </button>
          </div>
        )}
        </div>
      )}
    </>
  )
}

export default App
