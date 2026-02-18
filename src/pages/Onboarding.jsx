import './Onboarding.css';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    const navigate = useNavigate();

    const handleConnect = () => {
        navigate('/dashboard');
    };

    return (
        <div className="onboarding">
            {/* Animated background particles */}
            <div className="onboarding__particles">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="onboarding__particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${Math.random() * 4 + 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="onboarding__card">

                <div className="onboarding__logo">
                    <img src="https://deriverse.io/icon.svg" alt="Deriverse Logo" width="64" height="64" />
                </div>
                <h1 className="onboarding__title" style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: '#fff' }}>Deriverse</span>
                </h1>

                <p className="onboarding__subtitle">Trading Analytics</p>
                <p className="onboarding__tagline">Understand your trading, on-chain.</p>

                <div className="onboarding__actions">
                    <button className="onboarding__btn onboarding__btn--phantom" onClick={handleConnect}>
                        <img
                            src="/phantom-logo.png"
                            alt="Phantom Logo"
                            width="20"
                            height="20"
                            style={{ borderRadius: '50%' }}
                        />
                        Connect Phantom
                    </button>
                    <button className="onboarding__btn onboarding__btn--solflare" onClick={handleConnect}>

                        <img
                            src="/solflare-logo.png"
                            alt="Solflare Logo"
                            width="20"
                            height="20"
                            style={{ borderRadius: '50%' }}
                        />

                        Connect Solflare
                    </button>
                </div>

                <p className="onboarding__footer">
                    Powered by <span className="gradient-text">Solana</span>
                </p>
            </div>
        </div>
    );
}
