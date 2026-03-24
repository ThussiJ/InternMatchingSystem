import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';
import { employerService } from '../../services/api';
import { Link } from 'react-router-dom';

const FeaturedCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await employerService.getFeaturedEmployers();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch featured companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!loading && companies.length === 0) return null;

  return (
    <section className="section companies-section" id="companies">
      <div className="container">
        <div className="section-header-centered">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-center">Top <span className="text-secondary-gradient">Partners</span></h2>
            <p className="section-subtitle text-center">Leading companies hiring the next generation of talent.</p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-secondary" size={40} />
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="company-card"
              >
                <div className="company-card-inner">
                  <div className="company-logo-large">
                    <img 
                      src={company.cover_image} 
                      alt={company.company_name} 
                      onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + company.company_name }}
                    />
                  </div>
                  <h3>{company.company_name}</h3>
                  <div className="company-meta">
                    <MapPin size={14} />
                    <span>{company.location || 'Colombo'}</span>
                  </div>
                  <p className="company-industry">{company.industry || 'Technology'}</p>
                  <Link to={`/companies/${company.id}`} className="company-link">
                    View Profile <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .companies-section {
          background-color: var(--color-surface);
          padding: 8rem 0;
        }

        .section-header-centered {
            text-align: center;
            margin-bottom: 4rem;
        }

        .text-secondary-gradient {
            background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .companies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
        }

        .company-card {
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            text-align: center;
            transition: all var(--transition-bounce);
        }

        .company-card:hover {
            transform: translateY(-10px);
            border-color: var(--color-secondary);
            box-shadow: 0 15px 40px rgba(0,0,0,0.06);
        }

        .company-logo-large {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem auto;
            background: var(--color-surface);
            border-radius: 50%;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color-border);
            overflow: hidden;
        }

        .company-logo-large img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .company-card h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }

        .company-meta {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            color: var(--color-text-muted);
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
        }

        .company-industry {
            font-size: 0.9rem;
            color: var(--color-secondary);
            font-weight: 600;
            margin-bottom: 1.5rem;
        }

        .company-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--color-primary);
            text-decoration: none;
            transition: gap 0.2s;
        }

        .company-link:hover {
            gap: 0.8rem;
        }

        .text-center { text-align: center; }
      `}</style>
    </section>
  );
};

export default FeaturedCompanies;
