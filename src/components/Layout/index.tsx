import { Outlet } from 'react-router-dom'
import Header from '../Elements/Header'

function index() {
  return (
    <div className='flex justify-center px-3 py-2 min-h-screen'>
      <div className='bg-white-900 flex flex-col w-full  mb-4'>
        {/* <Header /> */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default index