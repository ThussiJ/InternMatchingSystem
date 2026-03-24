import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, MessageSquare, Zap, BarChart3, ShieldCheck } from 'lucide-react';

const Employers: React.FC = () => {
  const benefits = [
    {
      icon: <Search size={24} />,
      title: "Direct Access to Top Talent",
      description: "Browse through thousands of verified student profiles with ease."
    },
    {
      icon: <Zap size={24} />,
      title: "Streamlined Hiring",
      description: "Post internships and manage applications in a single platform."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Direct Communication",
      description: "Message candidates directly and schedule interviews effortlessly."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Insightful Analytics",
      description: "Track performance and application trends with our dashboard."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Verified Skills",
      description: "Trust candidates with verified skills and academic backgrounds."
    },
    {
      icon: <Briefcase size={24} />,
      title: "Multiple Postings",
      description: "Post as many internships as you need with zero hassle."
    }
  ];

  return (
    <section className="section employers-section" id="employers">
      <div className="container">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header center"
        >
            <h2 className="section-title">For <span className="text-secondary-gradient">Employers</span></h2>
            <p className="section-subtitle">
                Scale your team with the best student talent. Our platform makes 
                finding, interviewing, and hiring interns simpler than ever.
            </p>
        </motion.div>

        <div className="benefits-grid">
            {benefits.map((benefit, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="benefit-card"
                >
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="employer-cta-card"
        >
            <div className="employer-cta-content">
                <h2>Ready to find your next star intern?</h2>
                <p>Join hundreds of forward-thinking companies already using InternTalentConnect.</p>
                <div className="cta-actions">
                    <button className="btn btn-secondary">Post an Internship</button>
                    <button className="btn btn-outline-light">Partner With Us</button>
                </div>
            </div>
        </motion.div>
      </div>

      <style>{`
        .employers-section {
          background-color: var(--color-surface);
          padding: 8rem 0;
        }

        .section-header.center {
            text-align: center;
            max-width: 700px;
            margin: 0 auto 4rem auto;
        }

        .text-secondary-gradient {
            background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2rem;
            margin-bottom: 5rem;
        }

        .benefit-card {
            background: var(--color-background);
            border: 1px solid var(--color-border);
            padding: 2.5rem;
            border-radius: var(--radius-lg);
            transition: all var(--transition-bounce);
        }

        .benefit-card:hover {
            transform: translateY(-8px);
            border-color: var(--color-secondary);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .benefit-icon {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, rgba(var(--color-secondary), 0.1), rgba(var(--color-primary), 0.1));
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-secondary);
            margin-bottom: 1.5rem;
            border: 1px solid var(--color-border);
        }

        .benefit-card h3 {
            font-size: 1.35rem;
            margin-bottom: 1rem;
        }

        .benefit-card p {
            color: var(--color-text-muted);
            line-height: 1.6;
            font-size: 1rem;
        }

        .employer-cta-card {
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            border-radius: var(--radius-lg);
            padding: 4rem;
            text-align: center;
            color: white;
            box-shadow: 0 20px 50px rgba(var(--color-primary), 0.3);
            position: relative;
            overflow: hidden;
        }

        .employer-cta-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            z-index: 0;
        }

        .employer-cta-content {
            position: relative;
            z-index: 1;
        }

        .employer-cta-card h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: white;
        }

        .employer-cta-card p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2.5rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-actions {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
        }

        .btn-secondary {
            background: white;
            color: var(--color-primary);
        }

        .btn-secondary:hover {
            transform: scale(1.05);
            background: #f8fafc;
        }

        .btn-outline-light {
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
        }

        .btn-outline-light:hover {
            border-color: white;
            background: rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
            .employer-cta-card {
                padding: 3rem 1.5rem;
            }
            .employer-cta-card h2 {
                font-size: 2rem;
            }
            .cta-actions {
                flex-direction: column;
                gap: 1rem;
            }
            .btn { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Employers;
