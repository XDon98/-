import React from 'react';

interface PoseSelectorProps {
  selectedPose: string;
  onSelectPose: (pose: string) => void;
}

const poses = ['站立', '行走', '坐姿', '动态', '跳跃', '奔跑', '叉腰', '插兜', '倚靠', '回眸', '双手举起', '单腿站立', '思考', '交叉双臂', '侧身', '双手抚脸', '跪姿', '弯腰', '单手插兜', '舞蹈动作'];

// A wrapper to provide consistent styling for all icons
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-1">
        {children}
    </svg>
);

// A component to render the correct icon based on the pose name
const PoseIcon: React.FC<{ pose: string }> = ({ pose }) => {
    switch (pose) {
        case '站立': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M12 14l-3 5"/><path d="M12 14l3 5"/><path d="M9 11h6"/></IconWrapper>;
        case '行走': return <IconWrapper><circle cx="12" cy="4" r="2"/><path d="M12 6v6"/><path d="M14.5 12l-5 4"/><path d="M9.5 12l-2 5"/><path d="M15 17l2-5"/></IconWrapper>;
        case '坐姿': return <IconWrapper><circle cx="10" cy="5" r="2"/><path d="M10 7v6"/><path d="M10 13l-4 4"/><path d="M10 13h8"/><path d="M18 13l-2 5"/><path d="M6 17h12"/></IconWrapper>;
        case '动态': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7l3 5 4-3"/><path d="M12 7l-3 5-4-3"/><path d="M12 12l-2 6 4-2.5"/><path d="M12 12l2 6-4-2.5"/></IconWrapper>;
        case '跳跃': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-4 4"/><path d="M12 12l4 4"/><path d="M8 9l-2-2"/><path d="M16 9l2-2"/><path d="M7 20h10"/></IconWrapper>;
        case '奔跑': return <IconWrapper><circle cx="10" cy="4" r="2"/><path d="M10 6l-1.5 5"/><path d="M8.5 11l4 4"/><path d="M12.5 15l-3 4"/><path d="M6 14l-2-3 5-1"/><path d="M12.5 15l5-2"/></IconWrapper>;
        case '叉腰': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-3 5"/><path d="M12 12l3 5"/><path d="M9 15l-4-3h0a4 4 0 0 1 4 4v0"/><path d="M15 15l4-3h0a4 4 0 0 0-4 4v0"/></IconWrapper>;
        case '插兜': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-3 5"/><path d="M12 12l3 5"/><path d="M10 11v3l-1.5 2"/><path d="M14 11v3l1.5 2"/></IconWrapper>;
        case '倚靠': return <IconWrapper><path d="M18 20V4"/><circle cx="11" cy="5" r="2"/><path d="M11 7l-2 6"/><path d="M9 13l-3 5"/><path d="M9 13l3 1"/><path d="M12 14l-1 6"/></IconWrapper>;
        case '回眸': return <IconWrapper><circle cx="10" cy="5" r="2"/><path d="M12 7v8"/><path d="M12 15l-3 4"/><path d="M12 15l3 4"/><path d="M10 9l4-1"/><path d="M8 5.5S9 4 10 4s2 1.5 2 1.5"/></IconWrapper>;
        case '双手举起': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-3 5"/><path d="M12 12l3 5"/><path d="M9 12l-3-4"/><path d="M15 12l3-4"/></IconWrapper>;
        case '单腿站立': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M12 14l-2 5"/><path d="M12 14l3-2 2 4"/><path d="M9 11h6"/></IconWrapper>;
        case '思考': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-3 5"/><path d="M12 12l3 5"/><path d="M14.5 9.5 C 13 11, 12 10, 12 10"/></IconWrapper>;
        case '交叉双臂': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><path d="M9 11l6 2"/><path d="M15 11l-6 2"/><path d="M12 13l-3 5"/><path d="M12 13l3 5"/></IconWrapper>;
        case '侧身': return <IconWrapper><circle cx="9" cy="5" r="2"/><path d="M9 7v6"/><path d="M9 13l-2 5"/><path d="M9 13l3 4"/><path d="M10 8h.01"/><path d="M7.5 11h.01"/></IconWrapper>;
        case '双手抚脸': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-3 5"/><path d="M12 12l3 5"/><path d="M9 10 L 11 8"/><path d="M15 10 L 13 8"/></IconWrapper>;
        case '跪姿': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12 L 9 16"/><path d="M9 16 H 15"/><path d="M12 12 L 15 16"/></IconWrapper>;
        case '弯腰': return <IconWrapper><circle cx="9" cy="6" r="2"/><path d="M9 8 A 5 5 0 0 0 14 13"/><path d="M14 13 L 14 18"/><path d="M14 13 L 11 18"/></IconWrapper>;
        case '单手插兜': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M12 12l-3 5"/><path d="M12 12l3 5"/><path d="M10 11v3l-1.5 2"/><path d="M15 12l3-4"/></IconWrapper>;
        case '舞蹈动作': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v5"/><path d="M9 12l-4 3"/><path d="M15 12l4 3"/><path d="M12 12l-2 6"/><path d="M12 12l4 2 1 4"/></IconWrapper>;
        default: return null;
    }
};

export const PoseSelector: React.FC<PoseSelectorProps> = ({ selectedPose, onSelectPose }) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
      {poses.map((pose) => (
        <button
          key={pose}
          onClick={() => onSelectPose(pose)}
          className={`px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 flex flex-col items-center justify-center min-h-[96px]
            ${
              selectedPose === pose
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          <PoseIcon pose={pose} />
          <span>{pose}</span>
        </button>
      ))}
    </div>
  );
};