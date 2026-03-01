import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose?: () => void;
}

const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-primary-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
    };

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 
        glass-card text-white px-6 py-4 rounded-2xl shadow-2xl
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${typeStyles[type]}
      `}
        >
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{icons[type]}</span>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );
};

export default Toast;
