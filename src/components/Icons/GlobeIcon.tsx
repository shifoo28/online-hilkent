import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const GlobeIcon: React.FC<IconProps> = ({
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
    <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth="2" />
    <path d="M2 12h20" stroke={fill} strokeWidth="2" />
    <path
      d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      stroke={fill}
      strokeWidth="2"
    />
  </svg>
);

export default GlobeIcon;
