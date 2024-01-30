import React from "react";

type PropsType = {
    textPost: string;
    textComment: string;
    textPosition: string;
    setTextPost: (value: string) => void;
    setTextComment: (value: string) => void;
    setTextPosition: (value: string) => void;
  }

const FirstTab: React.FC<PropsType>  = ({textPost, textComment, textPosition, setTextPost, setTextComment, setTextPosition}) => {
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
                  <label className="labelTextArea">Additional info</label>
                  <textarea
                    className="textArea"
                    value={textPosition}
                    placeholder="Will be copied from commentator page"
                    onChange={(e) => setTextPosition(e.target.value)} // Обработка изменений в тексте
                    rows={5} // Начальное количество строк
                    ></textarea>
                </div>
              </div>
  );
};
export default FirstTab;