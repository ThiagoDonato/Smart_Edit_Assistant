import React from 'react';

type FocusLevel = 1 | 2 | 3;

interface FocusSliderProps {
  level: FocusLevel;
  onChange: (level: FocusLevel) => void;
}

const FocusSlider: React.FC<FocusSliderProps> = ({ level, onChange }) => {
  const levels: { value: FocusLevel; label: string }[] = [
    { value: 1, label: 'Grammar' },
    { value: 2, label: 'Structure' },
    { value: 3, label: 'Content' },
  ];

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10) as FocusLevel);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Focus Mode</h3>
        <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">
          {levels[level - 1].label}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="3"
        step="1"
        value={level}
        onChange={handleLevelChange}
        className="focus-slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {levels.map(({ label }) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

export default FocusSlider; 