import React, { Component, ReactNode } from 'react';
import "@root/styles/general.scss";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import All,{AllScreen} from '@root//screens/All';

class App extends Component {
  render(): ReactNode {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<All/>} >
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}


export default App;
