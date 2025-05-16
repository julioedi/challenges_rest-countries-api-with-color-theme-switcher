import React, { Component, ReactNode } from 'react';
import "@root/styles/general.scss";
import { BrowserRouter, Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
import All from '@root//screens/All';
import SingleCountry from './screens/SingleCountry';
import Moon from './components/Moon';
import { __ } from './utilities/Lang';
import { api } from './utilities/countriesApi';
import { randomID } from './utilities/randomID';

const continents = api.continents.map(item => item.toLowerCase());
class App extends Component {
  Layout = () => {
    
        const navigate = useNavigate();
    return (
      <>
        <header>
          <h1 onClick={() =>{
            navigate("/");
            this.forceUpdate();
          }}>{__("Where in the world")}</h1>
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

    const Item = ({path}:{path:string}) =>{
      const id = randomID();
      return <All path={path}  key={id}/>
    }

    const Single = () =>{
      const id = randomID();
      return <SingleCountry key={id}/>
    }

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
    
            <Route path={""} element={<All path={"*"} />} />
            {
              continents.map((item, index) => (
                
                <Route path={item} element={<Item path={item} />} key={item} />
              ))
            }
            <Route path={"/country/:id"} element={<Single/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}


export default App;
