import { useNavigate } from 'react-router-dom';
import './BackButton.css';

interface BackButtonProps {
    to?: string;
    label?: string;
}

export default function BackButton({ to, label = 'Back' }: BackButtonProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button className="global-back-btn" onClick={handleBack} aria-label="Go back">
            <span className="back-icon">←</span>
            {label && <span className="back-label">{label}</span>}
        </button>
    );
}
