import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Student, MIT',
    content: 'The platform is incredibly intuitive. I found an internship within a week of signing up! The interface is beautiful and easy to navigate.',
    rating: 5,
    type: 'student'
  },
  {
    id: 2,
    name: 'Mark Thompson',
    role: 'HR Manager, Tech Corp',
    content: 'Hiring interns has never been this easy. The quality of candidates on InternTalentConnect is outstanding.',
    rating: 5,
    type: 'employer'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Product Lead, Design Lab',
    content: 'We found three amazing design interns through this platform. The skills verification really helps in shortlisting the best talent.',
    rating: 4.8,
    type: 'employer'
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'CS Student, Stanford',
    content: 'I love the personalized recommendations. It showed me roles I would have otherwise missed. Highly recommended!',
    rating: 5,
    type: 'student'
  }
];

const Testimonials: React.FC = () => {
    return (
        <section className="section testimonials-section" id="testimonials">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header center"
                >
                    <h2 className="section-title">What People <span className="text-gradient">Say</span></h2>
                    <p className="section-subtitle">
                        Don't just take our word for it. Join thousands of satisfied users.
                    </p>
                </motion.div>

                <div className="testimonials-grid">
                    {testimonials.map((test, index) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="testimonial-card"
                        >
                            <div className="testimonial-header">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={14} 
                                            fill={i < Math.floor(test.rating) ? "currentColor" : "none"} 
                                            color="#fbbf24" 
                                        />
                                    ))}
                                </div>
                                <Quote size={24} className="quote-icon-light" />
                            </div>

                            <p className="testimonial-content">"{test.content}"</p>

                            <div className="testimonial-footer">
                                <div className="user-avatar-small">
                                    {test.name.charAt(0)}
                                </div>
                                <div className="user-details">
                                    <h4>{test.name}</h4>
                                    <span>{test.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                .testimonials-section {
                    background-color: var(--color-background);
                    padding: 8rem 0;
                }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .testimonial-card {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    transition: all var(--transition-bounce);
                    position: relative;
                    overflow: hidden;
                }

                .testimonial-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--color-secondary);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }

                .testimonial-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .stars {
                    display: flex;
                    gap: 0.2rem;
                }

                .quote-icon-light {
                    color: var(--color-primary);
                    opacity: 0.2;
                }

                .testimonial-content {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: var(--color-text-main);
                    flex-grow: 1;
                }

                .testimonial-footer {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border-top: 1px solid var(--color-border);
                    padding-top: 1.5rem;
                }

                .user-avatar-small {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1.2rem;
                }

                .user-details h4 {
                    font-size: 1rem;
                    margin-bottom: 0.1rem;
                }

                .user-details span {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
