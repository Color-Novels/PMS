function PrimaryButton({ handleClick, text }: { handleClick: () => void, text: string }) {
    return (
        <button
            onClick={handleClick}
            className={`
          px-4 py-2 
          bg-primary-500 
          text-white 
          rounded-md 
          hover:bg-primary-600
          focus:ring-2
          focus:ring-primary-500/50
          transition-colors
          disabled:opacity-50 
          disabled:cursor-not-allowed
          shadow-md
        `}
        >
            {text}
        </button>
    );
}

export default PrimaryButton;