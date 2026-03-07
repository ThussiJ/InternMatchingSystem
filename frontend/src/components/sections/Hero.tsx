import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase } from 'lucide-react';

const Hero: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Searching for ${searchTerm} in ${location}`);
    };

    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="hero-title"
                    >
                        Find Your Dream <br />
                        <span className="text-gradient">Internship</span> Today
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="hero-description"
                    >
                        The intelligent internship matching system that connects ambitious
                        students with top-tier companies worldwide. Jumpstart your career now.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        className="search-wrapper"
                    >
                        <form className="search-bar" onSubmit={handleSearch}>
                            <div className="search-input-group">
                                <Briefcase size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="search-divider"></div>

                            <div className="search-input-group">
                                <MapPin size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="City, state, or Remote"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary search-btn">
                                <Search size={18} />
                                <span>Search</span>
                            </button>
                        </form>

                        <div className="popular-searches">
                            <span className="popular-label">Popular:</span>
                            <a href="#" className="popular-tag">Software Engineering</a>
                            <a href="#" className="popular-tag">Data Science</a>
                            <a href="#" className="popular-tag">Marketing</a>
                            <a href="#" className="popular-tag">Design</a>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="hero-image-container"
                >
                    {/* Abstract geometric shapes or character illustration */}
                    <div className="hero-graphic">
                        <div className="graphic-circle graphic-circle-1"></div>
                        <div className="graphic-circle graphic-circle-2"></div>
                        <div className="glass-card float-card-1">
                            <div className="card-icon">🚀</div>
                            <div className="card-text">
                                <strong>Top Companies</strong>
                                <span>Hiring Now</span>
                            </div>
                        </div>
                        <div className="glass-card float-card-2">
                            <div className="card-icon">⚡</div>
                            <div className="card-text">
                                <strong>Smart Match</strong>
                                <span>AI Powered</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
        .hero {
          padding-top: 140px;
          padding-bottom: 80px;
          min-height: 85vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        /* Subtle background glow */
        .hero::before {
          content: '';
          position: absolute;
          top: -10%;
          left: -10%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, var(--color-primary) 0%, transparent 60%);
          opacity: 0.15;
          filter: blur(80px);
          z-index: -1;
        }
        
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }
        
        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          font-size: 1.2rem;
          color: var(--color-text-muted);
          margin-bottom: 3rem;
          max-width: 600px;
        }
        
        .search-bar {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 0.5rem;
          display: flex;
          align-items: center;
          box-shadow: var(--glass-shadow);
          margin-bottom: 1rem;
        }
        
        .search-input-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          padding: 0 1rem;
        }
        
        .search-icon {
          color: var(--color-text-muted);
        }
        
        .search-input {
          border: none;
          background: transparent;
          width: 100%;
          font-size: 1rem;
          color: var(--color-text-main);
          outline: none;
          font-family: inherit;
        }
        
        .search-divider {
          width: 1px;
          height: 30px;
          background-color: var(--color-border);
        }
        
        .search-btn {
          padding: 0.8rem 2rem;
          border-radius: var(--radius-full);
        }
        
        .popular-searches {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.9rem;
        }
        
        .popular-label {
          color: var(--color-text-muted);
          font-weight: 500;
        }
        
        .popular-tag {
          color: var(--color-text-muted);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }
        
        .popular-tag:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }
        
        .hero-graphic {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
        }
        
        .graphic-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        }
        
        .graphic-circle-1 {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          opacity: 0.8;
          animation: float 6s ease-in-out infinite;
        }
        
        .graphic-circle-2 {
          width: 40%;
          height: 40%;
          bottom: 0;
          right: 0;
          opacity: 0.4;
          animation: float 8s ease-in-out infinite reverse;
        }
        
        .glass-card {
          position: absolute;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--glass-shadow);
        }
        
        .float-card-1 {
          top: 20%;
          left: -10%;
          animation: float 5s ease-in-out infinite 1s;
        }
        
        .float-card-2 {
          bottom: 20%;
          right: -10%;
          animation: float 7s ease-in-out infinite 2s;
        }
        
        .card-icon {
          font-size: 2rem;
        }
        
        .card-text {
          display: flex;
          flex-direction: column;
        }
        
        .card-text strong {
          color: var(--color-text-main);
          font-size: 1.1rem;
        }
        
        .card-text span {
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @media (max-width: 991px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-description {
            margin: 0 auto 2rem;
          }
          
          .search-bar {
            flex-direction: column;
            border-radius: var(--radius-lg);
            padding: 1rem;
            gap: 1rem;
            background: transparent;
            border: none;
            box-shadow: none;
          }
          
          .search-input-group {
            width: 100%;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            padding: 1rem;
            border-radius: var(--radius-md);
          }
          
          .search-divider {
            display: none;
          }
          
          .search-btn {
            width: 100%;
          }
          
          .popular-searches {
            justify-content: center;
            margin-top: 1rem;
          }
          
          .hero-graphic {
            width: 80%;
            margin: 3rem auto 0;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
