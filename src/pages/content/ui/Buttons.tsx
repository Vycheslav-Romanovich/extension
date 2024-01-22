import { CloseSVG } from "@root/src/assets/svg/CloseSVG";
import { PauseSVG } from "@root/src/assets/svg/PauseSVG";
import { PlaySVG } from "@root/src/assets/svg/PlaySVG";
import { SaveSVG } from "@root/src/assets/svg/SaveSVG";
import { TranslateSVG } from "@root/src/assets/svg/TranslateSVG";

export const SaveButton = ({ onClickSave }) => {
  return (
    <button onClick={(event) => onClickSave(event)} className="SaveButton">
      <SaveSVG />
    </button>
  );
};

export const TranslateButton = ({ isLoadingTranslate, onClickTranslate }) => {
  return (
    <button
      onClick={(event) => onClickTranslate(event)}
      disabled={isLoadingTranslate}
      className="TranslateButton"
    >
      {isLoadingTranslate ? <CircleLoader /> : <TranslateSVG />}
    </button>
  );
};

export const CloseButton = ({ onClickClose }) => {
  return (
    <button onClick={(event) => onClickClose(event)} className="CloseButton">
      <CloseSVG />
    </button>
  );
};

export const CopyButton = ({ onClickCopy }) => {
  return (
    <button onClick={(event) => onClickCopy(event)} className="ButtonCopy">
      Copy info
    </button>
  );
};

export const GenerateButton = ({ onShowData }) => {
  return (
    <>
      <button onClick={(event) => onShowData(event)} className="ButtonGenerate">
        Generate reply
      </button>
    </>
  );
};

export const CircleLoader = () => {
  return <div className="lds-dual-ring"></div>;
};
