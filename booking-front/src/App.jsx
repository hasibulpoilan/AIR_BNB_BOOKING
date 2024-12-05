import './App.css'
import { Route, Routes } from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import PlacePage from './pages/PlacePage';
import AccountPage from './pages/AccountPage';
import EditPlacePage from './pages/EditPlacePage';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage'; 

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/account/:subpage?' element={<AccountPage/>}/>
          <Route path='/account/:subpage/:action' element={<AccountPage/>}/>
          <Route path="/account/places/:id/edit" element={<EditPlacePage />} />
          <Route path='/places/:id' element={<PlacePage/>}/>
          <Route path='/account/bookings' element={<BookingsPage/>}/>
          <Route path='/account/bookings/:id' element={<BookingPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
