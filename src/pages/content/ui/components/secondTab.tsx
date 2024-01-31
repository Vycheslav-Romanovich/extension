import React from "react";
import ToolTipComponent from "./tooltipComponent";
import { InfoSVG } from "@root/src/assets/svg/InfoSVG";

type PropsType = {
    textPromt: string;
    setTextPromt: (value: string) => void;
    onClickReset: () => void;
  }

const SecondTab: React.FC<PropsType>  = ({textPromt, setTextPromt, onClickReset}) => {
  return (
    <div className="main">
                <div className="containerTextArea">
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center'}}>
                    <label className="labelTextAreaSecond">Prompt</label>
                    <ToolTipComponent text="To place gathered information inside your prompt write [Post], [Commentary] or [Author].">
                      <InfoSVG />
                    </ToolTipComponent> 
                  </div>
                  <button className="btnReset" onClick={onClickReset}>Reset</button>
                  </div>
                  <textarea
                    className="textAreaPromt"
                    value={textPromt}
                    onChange={(e) => setTextPromt(e.target.value)} // Обработка изменений в тексте
                    rows={22} // Начальное количество строк
                  ></textarea>
                </div> 
              </div>
  );
};
export default SecondTab;