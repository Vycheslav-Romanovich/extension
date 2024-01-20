import { useRef, useState, useCallback, useEffect } from "react";
import useStorage from "@root/src/shared/hooks/useStorage";
import { extensionStorage } from "@root/src/shared/storages/extensionStorage";
import { CloseButton, PlayPauseButton, SpeachButton } from "./Buttons";

export const App = () => {
  const { extensionEnabled, userInfo, isParsing } =
    useStorage(extensionStorage);
  const [commentURL, setCommentURL] = useState("");
  const documentRef = useRef(document);
  const [hoveredElement, setHoveredElement] = useState<boolean>(false);
  const [elementSizes, setElementSizes] = useState<DOMRect | null>(null);
  const [userData, setUserData] = useState<any>(false);
  const [textComment, setTextComment] = useState("");
  const [textPost, setTextPost] = useState("");
  const [linkAuthorComment, setLinkAuthorComment] = useState("");
  const synth = window.speechSynthesis;
  const clipboard = navigator.clipboard;

  useEffect(() => {
    if (
      userInfo &&
      linkAuthorComment.length > 0 &&
      textComment.length > 0 &&
      textPost.length > 0
    ) {
      console.log({
        textPost: textPost,
        textComment: textComment,
        linkAuthorComment: linkAuthorComment,
        userInfo: userInfo,
      });
    }
  }, [linkAuthorComment, textPost, textComment]);

  function waitForElementToExist(selector, callback) {
    const element = document.getElementsByClassName(selector);
    if (element && element.length > 0) {
      console.log("ready");
      setTimeout(function () {
        callback(element);
      }, 1000);
    } else {
      setTimeout(function () {
        waitForElementToExist(selector, callback);
      }, 1000);
    }
  }

  const getUserData = () => {
    const profileOwnersName = document.querySelector(
      ".text-heading-xlarge"
    ).innerHTML;
    let expirience = document.getElementsByClassName(
      "artdeco-card pv-profile-card break-words mt2"
    );
    let experiencePure;
    for (let i = 0; i < expirience.length; i++) {
      if (expirience[i].querySelector("#experience")) {
        experiencePure =
          expirience[i].getElementsByClassName("pvs-entity--padded");
      }
    }

    let exp = experiencePure[0].getElementsByClassName("visually-hidden");
    // console.log(experiencePure[0])
    /*
      exp[0] - image company
      exp[1] - position
      exp[2] - company
      exp[3] - experiense
      exp[4] - place of work
      exp[5] - about work
      exp[6] - skills
    */
    const lastWord = {
      name: profileOwnersName,
      position: exp[1].textContent,
      company: exp[2]?.textContent,
      expirience: exp[3]?.textContent,
      about: exp[4]?.textContent,
      place: exp[5]?.textContent,
      skills: exp[6] ? exp[6].textContent : exp[5]?.textContent,
      link: window.location.href,
    };
    setUserData(lastWord);
    extensionStorage.setUserInfo(lastWord);

    setTimeout(() => {
      extensionStorage.setIsParsing(false);
    }, 1000);
    setTimeout(() => {
      console.log(userInfo);
      extensionStorage.setIsParsing(false);
      window.close();
    }, 1200);

    return lastWord;
  };

  const onClickElement = useCallback((event: any) => {
    const element = event.target as HTMLElement;
    if (userData) {
      console.log("sdfs");
      clipboard
        .writeText(String(JSON.stringify(userData)))
        .then(() => {
          console.log("Текст скопирован в буфер обмена");
        })
        .catch((err) => {
          console.error("Не удалось скопировать текст в буфер обмена: ", err);
        });
    }
    if (element.tagName === "SPAN" && extensionEnabled) {
      setTextComment(element.innerText);
      const scrollContent = document.getElementsByClassName(
        "scaffold-finite-scroll__content"
      )[0];

      const listOfPost = scrollContent.querySelectorAll(":scope > div");
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
          setTextPost(postContainer.querySelector('span[dir="ltr"]').innerHTML);
          for (let j = 0; j < listOfPost.length - 1; j++) {
            if (
              listOfComment[j] &&
              listOfComment[j].innerHTML &&
              listOfComment[j].innerHTML.includes(
                element.innerHTML.slice(0, 50)
              )
            ) {
              setLinkAuthorComment(listOfComment[j].querySelector("a").href);
              console.log(
                "link to author of comment -",
                listOfComment[j].querySelector("a").href
              );
              // setCloseUselessTab(false);

              setHoveredElement(true);
              setElementSizes(element.getBoundingClientRect());
              setCommentURL(listOfComment[j].querySelector("a").href);
            }
          }
          // console.log("link to author of post -", LINKAUTHOR);
        }
      }
    }
  }, []);

  const onClickSpeech = (event: React.MouseEvent<HTMLElement>) => {
    setHoveredElement(false);
    extensionStorage.setIsParsing(true);
    window.open(commentURL, "_blank");
  };

  const onClickClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setHoveredElement(false);
  };

  useEffect(() => {
    synth.cancel();
    documentRef.current.addEventListener("click", onClickElement);
    documentRef.current.removeEventListener("click", () => {}, false);
    if (window.location.href.includes("linkedin.com/in/") && extensionEnabled) {
      waitForElementToExist(
        "artdeco-card pv-profile-card break-words mt2",
        getUserData
      );
    }
  }, [hoveredElement, extensionEnabled, isParsing]);

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
              <SpeachButton onClickSpeach={onClickSpeech} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
