import React from "react";

type PropsType = {
    textPost: string;
    textComment: string;
    textPosition: string;
    setTextPost: (value: string) => void;
    setTextComment: (value: string) => void;
    setTextPosition: (value: string) => void;
    onClickCopy: (event: React.MouseEvent<HTMLElement>) => void;
  }

const FirstTab: React.FC<PropsType>  = ({textPost, textComment, textPosition, setTextPost, setTextComment, setTextPosition, onClickCopy}) => {
  return (
    <div className="main">
                <div className="containerTextArea">
                  <label className="labelTextArea">Post text</label>
                  <textarea
                    className="textArea"
                    value={textPost}
                    onChange={(e) => setTextPost(e.target.value)} // Обработка изменений в тексте
                    rows={5} // Начальное количество строк
                  ></textarea>
                </div>
                <div className="containerTextArea">
                  <label className="labelTextArea">Commentary text</label>
                  <textarea
                    className="textArea"
                    value={textComment}
                    onChange={(e) => setTextComment(e.target.value)} // Обработка изменений в тексте
                    rows={5} // Начальное количество строк
                    ></textarea>
                </div>
                <div className="containerTextArea">
                  <div className="ContainerLabelButton">
                    <label className="labelTextArea">Commentator’s info</label> 
                    <button onClick={(event) => onClickCopy(event)} className="ButtonCopy">
                      Copy from profile 
                    </button>
                  </div>
                  <textarea
                    className="textArea"
                    value={textPosition}
                    placeholder="Position, about, etc."
                    onChange={(e) => setTextPosition(e.target.value)} // Обработка изменений в тексте
                    rows={5} // Начальное количество строк
                    ></textarea>
                </div>
              </div>
  );
};
export default FirstTab;