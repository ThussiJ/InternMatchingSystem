import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Star, MapPin, Code, Palette, Briefcase } from 'lucide-react';

// Mock Data
const interns = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Frontend Developer',
    university: 'Stanford University',
    skills: ['React', 'TypeScript', 'UI/UX'],
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?u=sarah',
    icon: <Code size={20} />
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Designer',
    university: 'MIT',
    skills: ['Figma', 'Prototyping', 'Research'],
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?u=michael',
    icon: <Palette size={20} />
  },
  {
    id: 3,
    name: 'Alex Rivera',
    role: 'Data Analyst',
    university: 'UC Berkeley',
    skills: ['Python', 'SQL', 'Tableau'],
    rating: 5.0,
    image: 'https://i.pravatar.cc/150?u=alex',
    icon: <Briefcase size={20} />
  },
  {
    id: 4,
    name: 'Emma Watson',
    role: 'Marketing Specialist',
    university: 'NYU',
    skills: ['SEO', 'Content', 'Analytics'],
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?u=emma',
    icon: <Briefcase size={20} />
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  }
};

const PopularInterns: React.FC = () => {
  return (
    <section className="section interns-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2 className="section-title">Popular <span className="text-gradient">Interns</span></h2>
          <p className="section-subtitle">
            Discover top talent ready to make an impact. These standout students
            have high ratings and verified skills.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="interns-grid"
        >
          {interns.map((intern) => (
            <motion.div key={intern.id} variants={itemVariants} className="intern-card">
              <div className="intern-card-header">
                <img src={intern.image} alt={intern.name} className="intern-avatar" />
                <div className="intern-rating">
                  <Star size={14} fill="currentColor" color="#fbbf24" />
                  <span>{intern.rating}</span>
                </div>
              </div>

              <div className="intern-info">
                <h3>{intern.name}</h3>
                <div className="intern-role">
                  <span className="role-icon">{intern.icon}</span>
                  <span>{intern.role}</span>
                </div>

                <div className="intern-univ">
                  <MapPin size={16} />
                  <span>{intern.university}</span>
                </div>

                <div className="intern-skills">
                  {intern.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="intern-card-footer">
                <button className="btn btn-outline" style={{ width: '100%' }}>View Profile</button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="view-more-container">
          <button className="btn btn-primary">Browse All Interns</button>
        </div>
      </div>

      <style>{`
        .section {
          padding: 6rem 0;
        }
        
        .interns-section {
          background-color: var(--color-surface);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .section-subtitle {
          color: var(--color-text-muted);
          font-size: 1.1rem;
        }
        
        .interns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .intern-card {
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          transition: all var(--transition-bounce);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        
        .intern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          border-color: var(--color-primary);
        }
        
        @media (prefers-color-scheme: dark) {
            .intern-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        }
        
        .intern-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        
        .intern-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--color-surface);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .intern-rating {
          background: var(--color-surface);
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid var(--color-border);
        }
        
        .intern-info h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .intern-role {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        
        .intern-univ {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        
        .intern-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }
        
        .skill-tag {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .intern-card-footer {
          margin-top: auto;
        }
        
        .view-more-container {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
        }
      `}</style>
    </section>
  );
};

export default PopularInterns;
