// components/icons/FilterIcon.tsx
import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const FilterIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  fill = "#3C50E0",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 5.25C3 4.83579 3.33579 4.5 3.75 4.5H20.25C20.6642 4.5 21 4.83579 21 5.25C21 5.66421 20.6642 6 20.25 6H3.75C3.33579 6 3 5.66421 3 5.25ZM6 11.25C6 10.8358 6.33579 10.5 6.75 10.5H17.25C17.6642 10.5 18 10.8358 18 11.25C18 11.6642 17.6642 12 17.25 12H6.75C6.33579 12 6 11.6642 6 11.25ZM9 17.25C9 16.8358 9.33579 16.5 9.75 16.5H14.25C14.6642 16.5 15 16.8358 15 17.25C15 17.6642 14.6642 18 14.25 18H9.75C9.33579 18 9 17.6642 9 17.25Z"
      fill={fill}
    />
  </svg>
);

export default FilterIcon;
