import { useRef, useState, useCallback, useEffect } from "react";
import useStorage from "@root/src/shared/hooks/useStorage";
import { extensionStorage } from "@root/src/shared/storages/extensionStorage";
import {
  CloseButton,
  PlayPauseButton,
  SaveButton,
  SpeachButton,
  TranslateButton,
} from "./Buttons";

export const getWordAt = (str: string, pos: number) => {
  str = String(str);
  pos = Number(pos) >>> 0;
  const left = str.slice(0, pos + 1).search(/\S+$/),
    right = str.slice(pos).search(/\s/);
  if (right < 0) {
    return str.slice(left);
  }
  return str.slice(left, right + pos);
};

export const App = () => {
  const { extensionEnabled } = useStorage(extensionStorage);
  const [commentURL, setCommentURL] = useState("");
  const documentRef = useRef(document);
  const [hoveredElement, setHoveredElement] = useState<boolean>(
    false
  );
  const [oldElementText, setOldElementText] = useState<string>();
  const [elementSizes, setElementSizes] = useState<DOMRect | null>(null);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);

  const [translated, setTranslated] = useState<{
    text: string;
    translation: string;
  }>(null);
  const synth = window.speechSynthesis;

  const onClickElement = useCallback((event: any) => {
    const element = event.target as HTMLElement;

    if (element.tagName === "SPAN" && extensionEnabled) {
      setHoveredElement(true);
      setElementSizes(element.getBoundingClientRect());
      console.log(element.innerText);
      const scrollContent = document.getElementsByClassName(
        "scaffold-finite-scroll__content"
      )[0];

      const listOfPost = scrollContent.querySelectorAll(":scope > div");
      console.log(listOfPost);
      for (let i = 0; i < listOfPost.length; i++) {
        if (
          listOfPost[i] &&
          listOfPost[i].innerHTML &&
          listOfPost[i].innerHTML.includes(element.innerHTML.slice(0, 50))
        ) {
          console.log("start parsing");
          const listOfComment = listOfPost[i].getElementsByClassName(
            "comments-comment-item comments-comments-list__comment-item"
          );
          // const LINKAUTHOR = listOfPost[i].querySelector("a").href;
          let postContainer = listOfPost[i].getElementsByClassName(
            "feed-shared-inline-show-more-text feed-shared-update-v2__description feed-shared-inline-show-more-text--minimal-padding"
          )[0];
          // console.log(postContainer.querySelector('span[dir="ltr"]').innerHTML);
          for (let j = 0; j < listOfPost.length - 1; j++) {
            if (
              listOfComment[j] &&
              listOfComment[j].innerHTML &&
              listOfComment[j].innerHTML.includes(element.innerText)
            ) {
              console.log(
                "link to author of comment -",
                listOfComment[j].querySelector("a").href,
                "_blank"
              );
              setCommentURL(listOfComment[j].querySelector("a").href);
            }
          }
          // console.log("link to author of post -", LINKAUTHOR);
        }
      }
    }
  }, []);

  const onClickSpeech = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    window.open(commentURL, "_blank");
  };

  const onClickSave = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log("save");
  };

  const onClickTranslate = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const onClickPlayPause = (event: React.MouseEvent<HTMLElement>) => {};

  const onClickClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setHoveredElement(false);
  };

  useEffect(() => {
    synth.cancel();

    documentRef.current.addEventListener("click", onClickElement);

    return () => {
      if (hoveredElement) {
        // hoveredElement.innerHTML = oldElementText;
      }
      setIsPlay(false);
      documentRef.current.removeEventListener("click", () => {}, false);
    };
  }, [hoveredElement, extensionEnabled]);

  return (
    <>
      {hoveredElement && extensionEnabled && (
        <div
          style={{
            position: "absolute",
            width: elementSizes.width + 10,
            height: elementSizes.height + 10,
            top: elementSizes.top - 5 + window.scrollY,
            left: elementSizes.left - 5,
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          <div className="SelectedContainer">
            <CloseButton onClickClose={onClickClose} />
          </div>
          <div className="ButtonsContainer">
            <div className="ButtonsBloc">
              <PlayPauseButton
                isPlay={isPlay}
                pause={pause}
                onClickPlayPause={onClickPlayPause}
              />
              <SpeachButton onClickSpeach={onClickSpeech} />
              {/* <TranslateButton
                isLoadingTranslate={isLoadingTranslate}
                onClickTranslate={onClickTranslate}
              />
              <SaveButton onClickSave={onClickSave} /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
