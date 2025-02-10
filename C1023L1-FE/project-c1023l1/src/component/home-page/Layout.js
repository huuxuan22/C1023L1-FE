import React from 'react';
import Header from '../home/header/header';
import Footer from '../home/footer/footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
