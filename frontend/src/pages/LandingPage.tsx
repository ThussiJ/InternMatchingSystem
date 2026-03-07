import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import PopularInterns from '../components/sections/PopularInterns';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <Navbar />

            <main>
                <Hero />
                <PopularInterns />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
