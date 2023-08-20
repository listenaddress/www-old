
import React from "react";

interface CheckboxInputProps {
    label?: string;
    value: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
    label,
    value,
    onChange,
}) => {
    const uniqueId = Math.random().toString(36).substring(7);
    return (
        <div className="flex items-center">
            <input checked={value} id={uniqueId} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" onChange={onChange} />
            <label htmlFor={uniqueId} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">{label}</label>
        </div>
    );
};

export default CheckboxInput;

