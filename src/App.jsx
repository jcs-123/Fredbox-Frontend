import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Pages/AdminDashboard';
import Layout from './Components/Layout';
import Messcutreport from './Pages/Messcutreport';
import Namewisereport from './Pages/Namewisereport';
import DateWiseReport from './Pages/Datewisereport';
import Monthlyattendancereport from './Pages/Monthlyattendancereport';
import RequestView from './Pages/RequestView';
import RequestBulkAproval from './Pages/RequestBulkAproval';
import ApologyRequest from './Pages/ApologyRequest';


function App() {
  return (
    <>
      <Routes>
        {/* Login page without layout */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Login/>}/>
        
        {/* Routes with layout using Outlet */}
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<AdminDashboard />} />
      <Route path='/mess-cut-report' element={<Messcutreport />} />
      <Route path='/name-wise-report' element={<Namewisereport />} />
      <Route path='/Date-wise-report' element={<DateWiseReport/>} />
      <Route path='/Monthly-Attendance-report' element={<Monthlyattendancereport/>} />
      <Route path='/Request-View' element={<RequestView/>} />
        <Route path='/Request-Bulk-Aprove' element={<RequestBulkAproval/>} />
                <Route path='/Aplology-Request' element={<ApologyRequest/>}
                />


        </Route>
      </Routes>
    </>
  );
}

export default App;