import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { RootState } from './rootReducer';
import { AppDispatch } from './store';
import { selectCurrentUser, authenticate } from '../features/auth/authSlice';
import GlobalStyle from './App.styles';

import LoadingPage from '../features/loading/LoadingPage';
import LoginPage from '../features/auth/LoginPage';
import SignUpPage from '../features/auth/SignUpPage';
import AuthenticatedPage from '../features/auth/AuthenticatedPage';
import MotionRedirect from '../components/MotionRedirect/MotionRedirect';

const App: React.FC = () => {
  const currentUser = useSelector((state: RootState) =>
    selectCurrentUser(state)
  );
  const [authenticating, setAuthenticating] = useState(true);
  const isAuthenticated = Boolean(currentUser);

  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const doAuth = async () => {
      if (!currentUser) {
        try {
          const result = await dispatch(authenticate());
          unwrapResult(result);
          // eslint-disable-next-line no-empty
        } catch (err) {
        } finally {
          // Avoid awkward flash of logo in cases of short auth time
          setTimeout(() => {
            setAuthenticating(false);
          }, 500);
        }
      }
    };
    doAuth();
  }, [currentUser, dispatch]);

  return (
    <div className="App">
      <GlobalStyle />
      <AnimatePresence exitBeforeEnter>
        {authenticating ? (
          <LoadingPage />
        ) : (
          <Switch key={location.key} location={location}>
            <Route
              exact
              path="/"
              authenticated={isAuthenticated}
              render={() =>
                isAuthenticated ? (
                  <AuthenticatedPage />
                ) : (
                  <MotionRedirect to="/login" />
                )
              }
            />
            <Route
              path="/login"
              authenticated={isAuthenticated}
              render={() =>
                !isAuthenticated ? <LoginPage /> : <MotionRedirect to="/" />
              }
            />
            <Route
              path="/signup"
              authenticated={isAuthenticated}
              render={() =>
                !isAuthenticated ? <SignUpPage /> : <MotionRedirect to="/" />
              }
            />
            <Route>
              <h1>Page not found</h1>
            </Route>
          </Switch>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
