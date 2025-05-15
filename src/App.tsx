import React, { Component, ReactNode } from 'react';
import "@root/styles/general.scss";
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import All, { AllScreen } from '@root//screens/All';
import Moon from './components/Moon';

const continents = ["*", "africa", "america", "asia", "europe", "oceania"];
class App extends Component {
  Layout = () => {
    return (
      <>

        <header>
          <h1>Where in the world</h1>
          <div
            className='theme_toggle'
            onClick={() =>{
              document.body.classList.toggle("dark_theme");
              const is_dark = document.body.classList.contains("dark_theme");
              window.localStorage.setItem("theme", is_dark ? "dark" : "light");
            }}
          >
            <Moon />
            <span>Dark mode</span>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </>
    )
  }
  render(): ReactNode {
    const { Layout } = this;
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {
              continents.map((item, index) => (
                <Route path={item} element={<All path={item} />} key={index} />
              ))
            }
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}


export default App;
