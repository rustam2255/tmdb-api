
import Hero from "../hero/hero"
import Navbar from "../navbar/navbar"
import RowMoives from "../row-movies/row-movies"



const App = () => {
  return (  
    <div className="app">
      <Navbar />
      <Hero />
      <RowMoives />
    </div>
  )
}

export default App