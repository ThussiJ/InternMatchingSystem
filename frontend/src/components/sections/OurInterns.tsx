import React from 'react';
import { motion } from 'framer-motion';
import { Quote, GraduationCap } from 'lucide-react';

const successStories = [
  {
    id: 1,
    name: 'Dilshan Perera',
    role: 'Full Stack Engineer',
    company: 'WSO2',
    story: 'InternTalentConnect helped me find my dream internship at WSO2. The process was seamless and the direct communication with recruiters was a game changer.',
    image: 'https://i.pravatar.cc/150?u=dilshan',
    university: 'University of Moratuwa'
  },
  {
    id: 2,
    name: 'Anjali Wijesinghe',
    role: 'Product Designer',
    company: '99x',
    story: 'As a design student, finding the right mentor is crucial. I found an amazing team at 99x through this platform. It really bridges the gap.',
    image: 'https://i.pravatar.cc/150?u=anjali',
    university: 'IIT'
  },
  {
    id: 3,
    name: 'Kasun Rathnayake',
    role: 'Data Scientist',
    company: 'Axiata Digital',
    story: 'The skills verification feature gave me the confidence to apply for high-end roles. I secured a position at Axiata within two weeks!',
    image: 'https://i.pravatar.cc/150?u=kasun',
    university: 'University of Colombo'
  }
];

const OurInterns: React.FC = () => {
  return (
    <section className="section our-interns-section" id="intern-stories">
      <div className="container">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header center"
        >
            <h2 className="section-title">Success <span className="text-gradient">Stories</span></h2>
            <p className="section-subtitle">
                Hear from students who launched their careers using InternTalentConnect.
                Your success story starts here.
            </p>
        </motion.div>

        <div className="stories-grid">
            {successStories.map((story, index) => (
                <motion.div
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="story-card"
                >
                    <div className="story-image-container">
                        <img src={story.image} alt={story.name} className="story-image" />
                        <div className="quote-icon"><Quote size={20} fill="currentColor" /></div>
                    </div>

                    <div className="story-content">
                        <p className="story-text">"{story.story}"</p>
                        
                        <div className="story-footer">
                            <div className="user-info">
                                <h4>{story.name}</h4>
                                <div className="user-role">
                                    <span>{story.role} at <strong>{story.company}</strong></span>
                                </div>
                                <div className="user-univ">
                                    <GraduationCap size={14} />
                                    <span>{story.university}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="cta-container">
            <button className="btn btn-outline-primary">Read More Stories</button>
        </div>
      </div>

      <style>{`
        .our-interns-section {
          background-color: var(--color-surface);
          padding: 8rem 0;
        }

        .stories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 2.5rem;
            margin-bottom: 4rem;
        }

        .story-card {
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            transition: all var(--transition-bounce);
            position: relative;
        }

        .story-card:hover {
            transform: translateY(-10px);
            border-color: var(--color-primary);
            box-shadow: 0 15px 40px rgba(0,0,0,0.06);
        }

        .story-image-container {
            width: 80px;
            height: 80px;
            position: relative;
        }

        .story-image {
            width: 100%;
            height: 100%;
            border-radius: var(--radius-md);
            object-fit: cover;
            border: 2px solid var(--color-surface);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .quote-icon {
            position: absolute;
            bottom: -10px;
            right: -10px;
            width: 32px;
            height: 32px;
            background: var(--color-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--color-surface);
        }

        .story-text {
            font-size: 1.1rem;
            line-height: 1.7;
            color: var(--color-text-main);
            font-style: italic;
            margin-bottom: 1.5rem;
        }

        .story-footer {
            border-top: 1px solid var(--color-border);
            padding-top: 1.5rem;
        }

        .user-info h4 {
            font-size: 1.2rem;
            margin-bottom: 0.25rem;
        }

        .user-role {
            font-size: 0.95rem;
            color: var(--color-text-muted);
            margin-bottom: 0.5rem;
        }

        .user-role strong {
            color: var(--color-primary);
        }

        .user-univ {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            opacity: 0.8;
        }

        .cta-container {
            display: flex;
            justify-content: center;
        }

        @media (max-width: 480px) {
            .story-card {
                padding: 2rem 1.5rem;
            }
        }
      `}</style>
    </section>
  );
};

export default OurInterns;
