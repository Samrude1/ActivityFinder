import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Top Section */}
                <div className="footer-top">
                    <h2>ActivityFinder: join the ultimate adventure community</h2>
                    <p>
                        As the premier platform for discovering experiences, ActivityFinder helps you plan better trips. 
                        Join our community today to unlock exclusive rewards and get 10% off your first booking. 
                        Explore curated activities, hidden gems, and iconic places—all backed by authentic reviews from 
                        travelers who have been there.
                    </p>
                </div>

                {/* Links Section */}
                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h3>About ActivityFinder</h3>
                        <ul>
                            <li><Link to="/#">About Us</Link></li>
                            <li><Link to="/#">Press</Link></li>
                            <li><Link to="/#">Resources and Policies</Link></li>
                            <li><Link to="/#">Careers</Link></li>
                            <li><Link to="/#">Trust & Safety</Link></li>
                            <li><Link to="/#">Contact us</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h3>Explore</h3>
                        <ul>
                            <li><Link to="/#">Write a review</Link></li>
                            <li><Link to="/#">Add a Place</Link></li>
                            <li><Link to="/#">Join</Link></li>
                            <li><Link to="/#">Community Choice</Link></li>
                            <li><Link to="/#">Help Center</Link></li>
                            <li><Link to="/#">Travel Stories</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Do Business With Us</h3>
                        <ul>
                            <li><Link to="/#">Owners</Link></li>
                            <li><Link to="/#">Business Advantage</Link></li>
                            <li><Link to="/#">Sponsored Placements</Link></li>
                            <li><Link to="/#">Access our Content API</Link></li>
                            <li><Link to="/#">Become an Affiliate</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Get The App</h3>
                        <ul>
                            <li><Link to="/#">iPhone App</Link></li>
                            <li><Link to="/#">Android App</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <div className="footer-brand">
                            <span className="footer-logo">🦉</span>
                            <div className="footer-legal">
                                <span className="copyright">© 2026 ActivityFinder LLC All rights reserved.</span>
                                <div className="legal-links">
                                    <Link to="/#">Terms of Use</Link>
                                    <Link to="/#">Privacy and Cookies Statement</Link>
                                    <Link to="/#">Cookie consent</Link>
                                    <Link to="/#">How the site works</Link>
                                </div>
                            </div>
                        </div>
                        <p className="footer-disclaimer">
                            This is the version of our website addressed to English speakers in the United States. If you reside in another country or region, please select the appropriate version from the drop-down menu.
                        </p>
                    </div>

                    <div className="footer-bottom-right">
                        <div className="footer-selectors">
                            <select className="footer-select" defaultValue="USD">
                                <option value="USD">$ USD</option>
                                <option value="EUR">€ EUR</option>
                                <option value="GBP">£ GBP</option>
                            </select>
                            <select className="footer-select" defaultValue="US">
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="CA">Canada</option>
                            </select>
                        </div>
                        <div className="footer-socials">
                            <a href="#" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="#" aria-label="TikTok">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-8-8v12a1 1 0 1 1-1-1z"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
