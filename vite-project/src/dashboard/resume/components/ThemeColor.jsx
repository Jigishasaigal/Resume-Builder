import React, { useContext, useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { toast } from 'sonner';

const ThemeColor = () => {
  // Array of theme colors
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
    '#33FFA1', '#FF7133', '#71FF33', '#7133FF', '#FF3371',
    '#33FF71', '#3371FF', '#A1FF33', '#33A1FF', '#FF5733',
    '#5733FF', '#33FF5A', '#5A33FF', '#FF335A', '#335AFF',
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  // Local selected color state synced to context
  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || colors[0]);

  useEffect(() => {
    if (resumeInfo?.themeColor) {
      setSelectedColor(resumeInfo.themeColor);
    }
  }, [resumeInfo?.themeColor]);

  // Handle color selection - updates context and shows toast
  const onColorSelect = (color) => {
    setSelectedColor(color);
    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });
    toast.success(`Theme color updated to ${color}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 items-center">
          <LayoutGrid size={16} /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => onColorSelect(color)}
              className={`h-6 w-6 rounded-full cursor-pointer border transition-transform duration-150
                ${selectedColor === color ? 'border-4 border-black scale-110' : 'border-gray-300'}
                hover:scale-110`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColor;

