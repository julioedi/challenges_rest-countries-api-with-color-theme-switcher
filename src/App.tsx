import React, { Component, ReactNode } from 'react';
import "@root/styles/general.scss";
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import All, { AllScreen } from '@root//screens/All';
import Moon from './components/Moon';
import { __ } from './utilities/Lang';

const continents = ["africa", "america", "americas", "asia", "europe", "oceania", ""];
class App extends Component {
  Layout = () => {
    return (
      <>

        <header>
          <h1>{__("Where in the world")}</h1>
          <div
            className='theme_toggle'
            onClick={() => {
              const el = document.head.parentElement;
              el?.classList.toggle("dark_theme");
              const is_dark = el?.classList.contains("dark_theme");
              window.localStorage.setItem("theme", is_dark ? "dark" : "light");
            }}
          >
            <Moon />
            <span>{__("Dark mode")}</span>
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
            <Route path={"*"} element={<All path={"*"} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}


export default App;
