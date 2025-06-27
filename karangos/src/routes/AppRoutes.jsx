import { Routes, Route } from 'react-router-dom'

import Homepage from '../pages/Homepage'
import Prova2 from '../pages/Prova2'

import CustomersList from '../pages/cars/CustomersList'
import CustomersForm from '../pages/cars/CustomersForm'
import CarsList from '../pages/cars/CarsList'
import CarsForm from '../pages/cars/CarsForm'

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={ <Homepage /> } />

    <Route path="/customers" element={ <CustomersList /> } />
    <Route path="/customers/new" element={ <CustomersForm /> } />
    <Route path="/customers/:id" element={ <CustomersForm /> } />
    <Route path="/cars" element={<CarsList />} />
    <Route path="/cars/new" element={<CarsForm />} />
    <Route path="/cars/:id" element={ <CarsForm /> } />
    <Route path="/prova/2" element= {<Prova2/>}/>
  </Routes>
}