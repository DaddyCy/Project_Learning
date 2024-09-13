import React from 'react';
import HomeNavbar from '../components/HomeNavbar.jsx';
import Footer from '../components/Footer.jsx';
import video1 from '/852292-hd_1728_1080_25fps.mp4';
import video2 from '/853750-hd_1920_1080_25fps.mp4';
import video3 from '/2278095-hd_1920_1080_30fps.mp4'; 
import video4 from '/8275951-hd_1920_1080_30fps.mp4'; 
import courseImage from '/code-820275_640.jpg';

const HomePage = () => {
  return (
    <div>
      <HomeNavbar />
      <div className="container flex-grow-1 d-flex flex-column justify-content-between py-5">
        <h3 className="text-center">Benvenuto nella migliore piattaforma per coding</h3>
        <div className="row h-100">
          <div className="col-md-3 d-flex flex-column justify-content-between">
            <video width="100%" controls className="shadow-lg mb-5 ">
              <source src={video1} type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
            <video width="100%" controls className="shadow-lg">
              <source src={video2} type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <img src={courseImage} alt="Course" className="img-fluid shadow-lg" style={{maxWidth: '80%', maxHeight: '200px', objectFit: 'cover'}} />
          </div>
          <div className="col-md-3 d-flex flex-column justify-content-between">
            <video width="100%" controls className="shadow-lg mb-5">
              <source src={video3} type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
            <video width="100%" controls className="shadow-lg">
              <source src={video4} type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
