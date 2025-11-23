import './App.css'
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './layout/Layout';
import { ToastContainer } from 'react-toastify';
import Auth from './pages/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSidebar } from './redux/reducer/sidebardata';
import { useEffect, useState } from 'react';
import DynamicForm from './pages/DynamicForm';
import 'react-toastify/dist/ReactToastify.css';
import './style/style.css'
import ManageCategories from './pages/category/ManageCategories';

function App() {
  const { status, error, items } = useSelector(state => state.sidebardata);
  const dispatch = useDispatch();


  // Using menus from Redux: items

  useEffect(() => {
    if (status == 'idle') {
      dispatch(fetchSidebar());
    }
  }, [status, dispatch]);

  const router = createBrowserRouter(
    [
      { path: '/auth', element: <Auth /> },
      {
        path: '/',
        element: <Layout sidebarList={items} />,
        children: [
          { path: "/", element: <ProtectedRoute element={<Home />} /> },
          { path: "/form/:formName", element: <ProtectedRoute element={<DynamicForm />} /> },
          { path: "/manage/category", element: <ProtectedRoute element={<ManageCategories />} /> }
        ]
      },
    ]
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" theme='colored' autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App

