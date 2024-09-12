interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
}

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({ 
    children, 
    onClick, 
    className = "", 
    variant = "primary", 
    type = "button",
    disabled = false
}: ButtonProps) {
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = variant === "primary" 
        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" 
        : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md";
    const combinedClasses = `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`.trim();

    return (
        <button
            className={combinedClasses}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}