import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-content"
          >
            <h2 className="section-title">Bridging the Gap Between <span className="text-gradient">Talent and Opportunity</span></h2>
            <p className="about-text">
              InternTalentConnect is more than just a job board. We are a dynamic ecosystem 
              dedicated to empowering students and helping employers discover the next generation 
              of industry leaders.
            </p>
            
            <div className="about-features">
              <div className="about-feature">
                <div className="feature-icon"><Target size={24} /></div>
                <div className="feature-text">
                  <h4>Our Mission</h4>
                  <p>To digitize and streamline the internship seeker-provider ecosystem for maximum efficiency.</p>
                </div>
              </div>
              <div className="about-feature">
                <div className="feature-icon"><Users size={24} /></div>
                <div className="feature-text">
                  <h4>Our Community</h4>
                  <p>Join thousands of students and hundreds of leading companies already on the platform.</p>
                </div>
              </div>
            </div>

            <button className="btn btn-primary">Learn More About Us</button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="about-visual"
          >
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Active Interns</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">500+</span>
                <span className="stat-label">Partner Companies</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">12K+</span>
                <span className="stat-label">Applications</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-number">98%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .about-section {
          background-color: var(--color-background);
          padding: 8rem 0;
          overflow: hidden;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-content h2 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .about-text {
          font-size: 1.2rem;
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .about-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .about-feature {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(var(--color-primary), 0.1), rgba(var(--color-secondary), 0.1));
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
          border: 1px solid var(--color-border);
        }

        .feature-text h4 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .feature-text p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }

        .about-visual {
          position: relative;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 2rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: var(--glass-shadow);
          transition: transform var(--transition-bounce);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-primary);
        }

        .stat-card.highlight {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          border: none;
        }

        .stat-card.highlight .stat-number,
        .stat-card.highlight .stat-label {
          color: white;
        }

        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 991px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .about-content h2 {
            font-size: 2.5rem;
          }

          .about-text {
            margin-left: auto;
            margin-right: auto;
          }

          .about-feature {
            text-align: left;
          }

          .about-features {
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
