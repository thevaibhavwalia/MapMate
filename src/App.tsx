import {lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
const Home = lazy(() => import('./pages/Home'))
const MainHome=lazy(()=>import ('./pages/MainHome'))
const Location = lazy(() => import('./pages/Location'))

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element ={<MainHome></MainHome>}/>
          <Route path="/home" element={<Home />} />
          <Route path="location/:roomId" element={<Location />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;