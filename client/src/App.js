import MainLayout from 'layouts/MainLayout';
import TrackNet from 'pages/TrackNet';
import Login from 'pages/Login';
import UserManagement from 'pages/UserManagement';
import { Navigate, Route, Routes } from 'react-router-dom';
import LogManagement from 'pages/LogManagement';

const AuthRoute = ({ type = 'private', children }) => {
  const user = JSON.parse(localStorage.getItem('tracknet_user'));
  if (type === 'private' && !user) {
    return <Navigate to='/login' />;
  }
  return (
    <>
      <MainLayout />
      {children}
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthRoute type='private' />}>
        <Route
          path=''
          element={
            <Navigate
              to={
                JSON.parse(localStorage.getItem('tracknet_user'))?.role === 'admin'
                  ? 'admin'
                  : 'tracknet'
              }
            />
          }
        />
        {/* <Route path='' element={<TrackNet />} /> */}
        {/* <Route path='/home' element={<Dashboard />} /> */}
        <Route path='/tracknet' element={<TrackNet />} />
      </Route>
      <Route path='/admin' element={<AuthRoute type='private' />}>
        <Route path='' element={<Navigate to='user' />} />
        <Route path='log' element={<LogManagement />} />
        <Route path='user' element={<UserManagement />} />
      </Route>
      <Route path='/login' element={<Login />} />
    </Routes>
  );
};

export default App;
