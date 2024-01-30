import React, { ReactElement, useState } from 'react';

type PropsType = {
  children: ReactElement;
  text: string;
};

const ToolTipComponent: React.FC<PropsType> = ({ children, text }) => {
  const [showToolTip, setShowToolTip] = useState(false);

  const onMouseEnterHandler = () => {
    setShowToolTip(true);
  };

  const onMouseLeaveHandler = () => {
    setShowToolTip(false);
  };

  return (
    <div className="container" onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
      {children}
      {showToolTip && <div className="tooltip">{text}</div>}
    </div>
  );
};

export default ToolTipComponent;