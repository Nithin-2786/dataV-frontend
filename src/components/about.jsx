import React from 'react'
import Navbar from './Navbar'
import '../styles.css'
import tapanImage from '../images/Photograph.png';

function AboutUs() {
  return (
    <div>
      <Navbar />
      <div className="about-us-container">
        <h1>AIR POLLUTION DATA VISUALIZATION</h1>
        <div className="about-us-content">
          <p>
            Welcome to our Air Pollution Data Visualization website! We are a
            team of passionate individuals dedicated to raising awareness about
            air pollution and its impact on our environment and health. Our
            mission is to provide a user-friendly platform that enables users to
            explore, analyze, and visualize air pollution data in an intuitive
            and informative manner.
          </p>
          <p>
            At our website, we strive to make complex air pollution data
            accessible to a wide range of users, including researchers,
            policymakers, and the general public. Through interactive
            visualizations, maps, and charts, we aim to present the data in a
            visually engaging and comprehensible format, facilitating better
            understanding and informed decision-making.
          </p>
          <p>
            Our team consists of multidisciplinary experts with backgrounds in
            environmental science, data analysis, and web development. We
            combine our knowledge and skills to design and develop innovative
            solutions for presenting air pollution data in a meaningful way. By
            leveraging the power of technology and data visualization
            techniques, we aim to empower individuals and organizations to make
            informed choices and contribute to a cleaner and healthier
            environment.
          </p>
          <p>
            We are committed to continuously improving our website and expanding
            its functionalities to provide an enriching experience for our
            users. We value user feedback and encourage suggestions for
            enhancements or additional features that would further enhance the
            usefulness of our platform.
          </p>
        </div>
        <div className="team-members-container">
          <h2>----------Team Members----------</h2>
          <div className="team-member-row">
            <div className="team-member">
              <img src={tapanImage} alt="Person 1" />
              <h3>Tapan Siddarth Narra</h3>
            </div>
            <div className="team-member">
              <img src={tapanImage} alt="Person 2" />
              <h3>Nithin Challa</h3>
            </div>
          </div>
          <div className="team-member-row">
            <div className="team-member">
              <img src={tapanImage} alt="Person 3" />
              <h3>Sai Charan Reddy Lingala</h3>
            </div>
            <div className="team-member">
              <img src={tapanImage} alt="Person 4" />
              <h3>Abhi Rohan K.S.S</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
