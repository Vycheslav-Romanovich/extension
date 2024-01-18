import "./SwitchStyle.scss";
import React, { FC, useState } from "react";

type SwitchProps = {
  isChecked: boolean
  toggleSwitch: () => void
};

export const Switch: FC<SwitchProps> = ({isChecked, toggleSwitch}) => {
  const onClickSwitch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSwitch();
  };

  return (
    <>
      <input type="checkbox" id="switch" checked={isChecked} />
      <label onClick={(e) => onClickSwitch(e)} htmlFor="switch"></label>
    </>
  );
};
