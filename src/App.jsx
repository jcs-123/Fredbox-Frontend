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
import HolidaySelect from './Pages/HolidaySelect';
import DateSelect from './Pages/DateSelect';
import ComplaintDetails from './Pages/ComplaintDetails';
import StudentDetails from './Pages/StudentDetails';


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
      <Route path='/holiday-select' element={<HolidaySelect/>} />
      <Route path="/date-select" element={<DateSelect />} />
      <Route path="/complaint-details" element={<ComplaintDetails />} />
      <Route path="/student-details" element={<StudentDetails />} />


        </Route>
      </Routes>
    </>
  );
}

export default App;