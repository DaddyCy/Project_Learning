import React, { useEffect, useRef } from 'react';
import './Footer.css'; 

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footerRef.current.style.opacity = '1';
        } else {
          footerRef.current.style.opacity = '0';
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        © 2024 LearnEasilyWithDave Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;