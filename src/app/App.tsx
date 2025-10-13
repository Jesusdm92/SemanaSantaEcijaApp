import { Routes, Route } from 'react-router-dom'
import { HermandadesProvider } from '@/context/HermandadesContext'
import AppLayout from './AppLayout'
import SplashScreen from '@/pages/SplashScreen'
import HermandadesList from '@/pages/HermandadesList'
import HermandadDetail from '@/pages/HermandadDetail'
import Favoritos from '@/pages/Favoritos'
import About from '@/pages/About'
import AgendaCofrade from '@/pages/AgendaCofrade'
import HoySale from '@/pages/HoySale'
import Test from '@/pages/Test'

export default function App() {
  return (
    <HermandadesProvider>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route element={<AppLayout />}>
          <Route path="hermandades" element={<HermandadesList />} />
          <Route path="hermandades/:id" element={<HermandadDetail />} />
          <Route path="test" element={<Test />} />
          <Route path="agenda" element={<AgendaCofrade />} />
          <Route path="hoy" element={<HoySale />} />
          <Route path="favoritos" element={<Favoritos />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </HermandadesProvider>
  )
}
