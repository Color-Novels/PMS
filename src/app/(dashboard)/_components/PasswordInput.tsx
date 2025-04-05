
import { MdLock, MdLockOpen } from "react-icons/md"; 

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShow: () => void;
}

export const PasswordInput = ({label,value,onChange, showPassword, toggleShow}:PasswordInputProps) => {

    return (
    <div>
    <label className="block text-sm font-medium text-primary-600 mb-1">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full p-2 pr-10 rounded-md border border-background-300 bg-background-100 focus:ring-2 focus:ring-primary-500"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600"
      >
        {showPassword ? (
          <MdLockOpen className="w-5 h-5" />
        ) : (
          <MdLock className="w-5 h-5" />
        )}
      </button>
    </div>
  </div>
);
  
};