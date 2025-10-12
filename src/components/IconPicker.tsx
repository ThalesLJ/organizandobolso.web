import { memo } from 'react';
import IconRenderer from './IconRenderer';

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
  color?: string;
  className?: string;
}

const ICONS = ['family', 'work', 'leisure', 'housing', 'health', 'savings'];

const IconPicker = memo(function IconPicker({ selected, onSelect, color = '#8b5cf6', className = '' }: IconPickerProps) {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-6 gap-3 ${className}`}>
      {ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onSelect(icon)}
          className={`p-4 rounded-lg border-2 transition-all duration-300 text-center ${
            selected === icon ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 hover:border-white/20 bg-white/5'
          }`}
        >
          <div className="flex justify-center">
            <div className="text-white" style={{ color }}>
              <IconRenderer iconName={icon} />
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-2 capitalize">{icon}</div>
        </button>
      ))}
    </div>
  );
});

export default IconPicker;


