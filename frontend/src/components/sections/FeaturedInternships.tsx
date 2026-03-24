import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, Building2, Loader2 } from 'lucide-react';
import { internshipService } from '../../services/api';
import { Link } from 'react-router-dom';

const FeaturedInternships: React.FC = () => {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await internshipService.getFeaturedInternships();
        setInternships(data);
      } catch (error) {
        console.error('Failed to fetch featured internships:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="section internships-section" id="internships">
      <div className="container">
        <div className="section-header-flex">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Featured <span className="text-gradient">Internships</span></h2>
            <p className="section-subtitle">Handpicked opportunities from top-tier companies.</p>
          </motion.div>
          <Link to="/student/all-internships">
            <motion.button
              whileHover={{ x: 5 }}
              className="btn btn-ghost btn-view-all"
            >
              View All Internships <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : internships.length > 0 ? (
          <div className="internships-list">
            {internships.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="internship-item"
              >
                  <div className="company-logo-container">
                      <img 
                        src={job.cover_image || (job.employers?.cover_image)} 
                        alt={job.employers?.company_name} 
                        onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + (job.employers?.company_name || 'Company') }} 
                      />
                  </div>
                  
                  <div className="internship-content">
                      <div className="internship-main">
                          <h3>{job.title}</h3>
                          <div className="company-info">
                              <Building2 size={16} />
                              <span>{job.employers?.company_name}</span>
                          </div>
                      </div>

                      <div className="internship-meta">
                          <div className="meta-item">
                              <MapPin size={16} />
                              <span>{job.location}</span>
                          </div>
                          <div className="meta-item">
                              <Clock size={16} />
                              <span>{job.mode}</span>
                          </div>
                          <div className="meta-item">
                              <Calendar size={16} />
                              <span>{job.duration_weeks} Weeks</span>
                          </div>
                      </div>
                  </div>

                  <div className="internship-actions">
                      <span className="posted-time">{new Date(job.created_at).toLocaleDateString()}</span>
                      <button className="btn btn-outline-primary">Apply Now</button>
                  </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>No featured internships available at the moment. Check back soon!</p>
          </div>
        )}
      </div>

      <style>{`
        .internships-section {
          background-color: var(--color-background);
          padding: 8rem 0;
        }

        .section-header-flex {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 4rem;
        }

        .btn-view-all {
            color: var(--color-primary);
            font-weight: 700;
            padding: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .internships-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .internship-item {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            display: flex;
            align-items: center;
            gap: 2rem;
            transition: all var(--transition-bounce);
        }

        .internship-item:hover {
            transform: scale(1.02);
            border-color: var(--color-primary);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .company-logo-container {
            width: 70px;
            height: 70px;
            background: var(--color-background);
            border-radius: var(--radius-md);
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color-border);
            flex-shrink: 0;
            overflow: hidden;
        }

        .company-logo-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .internship-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .internship-main h3 {
            font-size: 1.4rem;
            margin: 0 0 0.5rem 0;
        }

        .company-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-text-muted);
            font-weight: 500;
        }

        .internship-meta {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-text-muted);
            font-size: 0.95rem;
        }

        .internship-actions {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 1rem;
            min-width: 150px;
        }

        .posted-time {
            font-size: 0.85rem;
            color: var(--color-text-muted);
        }

        .btn-outline-primary {
            border: 1.5px solid var(--color-primary);
            color: var(--color-primary);
            background: transparent;
            padding: 0.6rem 1.2rem;
            border-radius: var(--radius-md);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-outline-primary:hover {
            background: var(--color-primary);
            color: white;
        }

        .flex { display: flex; }
        .justify-center { justify-content: center; }
        .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 991px) {
            .internship-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 1.5rem;
            }
            .internship-actions {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                border-top: 1px solid var(--color-border);
                padding-top: 1.5rem;
            }
            .internship-meta {
                gap: 1rem;
            }
        }
      `}</style>
    </section>
  );
};

export default FeaturedInternships;
