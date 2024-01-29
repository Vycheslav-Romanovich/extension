import { useRef, useState, useCallback, useEffect } from "react";
import useStorage from "@root/src/shared/hooks/useStorage";
import { extensionStorage } from "@root/src/shared/storages/extensionStorage";
import { CloseButton, GenerateButton, CopyButton } from "./Buttons";
import { MessageCopy } from "./Message";
import { generateComment, sendAnalytics } from "../../api/axios";

export const App = () => {
  const { extensionEnabled, userInfo, isParsing, userWork } =
    useStorage(extensionStorage);
  const [commentURL, setCommentURL] = useState("");
  const documentRef = useRef(document);
  const [isShowMessageCopy, setIsShowMessageCopy] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isButtonSeeTranslate, setIsButtonSeeTranslate] = useState<boolean>(false);
  const [hoveredElement, setHoveredElement] = useState<boolean>(false);
  const [elementSizes, setElementSizes] = useState<DOMRect | null>(null);
  const [elementSizesWidth, setElementSizesWidth] = useState<DOMRect | null>(null);
  const [textComment, setTextComment] = useState("");
  const [textPost, setTextPost] = useState("");
  const [textPosition, setTextPosition] = useState(userInfo.aboutAuthor);
  const [linkAuthorComment, setLinkAuthorComment] = useState("");
  const [positionTop, setPositionTop] = useState<number>();
  
  const clipboard = navigator.clipboard;
  const clearUserInfo = {
    name: '',
    aboutAuthor: '',
    position: '',
    company: '',
    expirience: '',
    about: '',
    link: '',
  };

  const onShowData  = async () => {
    setIsLoader(true);

    const data = await generateComment(textPost,textComment)
    .then((res) => {return res.data})
    .catch((e) => console.log(e.err));

    clipboard
      .writeText(String(JSON.stringify(data)))
      .then(() => {
        console.log("Текст скопирован в буфер обмена");
        setIsLoader(false);
        setIsShowMessageCopy(true);
      })
      .catch((err) => {
        console.error("Не удалось скопировать текст в буфер обмена: ", err);
      });

      const saveDataForEvent = {
        generateCommentText: JSON.stringify(data),
        textPost: textPost,
        userInfo: userInfo,
        textComment: textComment,
        linkAuthorComment: linkAuthorComment,
      };
      chrome.storage.sync.set({ dataForSendEvent: saveDataForEvent});

      setTimeout(()=>{
        setIsShowMessageCopy(false);
        setHoveredElement(false);
        extensionStorage.setUserInfo(clearUserInfo);
      },1500);
  };

  function waitForElementToExist(selector, callback) {
    const element = document.getElementsByClassName(selector);
    if (element && element.length > 0) {
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
    //@ts-ignore
    const aboutUser = document.getElementsByClassName("text-body-medium break-words")[0]?.innerText ?? '';
    let experiencePure;
    let aboutPure;
    for (let i = 0; i < expirience.length; i++) {
      if (expirience[i].querySelector("#experience")) {
        experiencePure =
          expirience[i].getElementsByClassName("pvs-entity--padded");
      }
      if (expirience[i].querySelector("#about")) {
        aboutPure =
          //@ts-ignore
          expirience[i].getElementsByClassName("visually-hidden")[1]?.innerText;
      }
    }

    let exp = experiencePure != undefined ?
      experiencePure[0]
      ? experiencePure[0].getElementsByClassName("visually-hidden")
      : [] 
      : [];
    // console.log(exp[1].textContent)
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
      aboutAuthor: aboutUser,
      position: exp[1]?.textContent ?? '',
      company: exp[2]?.textContent ?? '',
      expirience: exp[3]?.textContent ?? '',
      about: exp[4]?.textContent ?? '',
      // place: exp[5]?.textContent,
      // skills: exp[6] ? exp[6].textContent : exp[5]?.textContent,
      link: window.location.href,
    };
    extensionStorage.setUserInfo(lastWord);
    const saveDataForEvent = {
      generateCommentText: '',
      textPost: textPost,
      userInfo: userInfo,
      textComment: textComment,
      linkAuthorComment: linkAuthorComment,
    };
    chrome.storage.sync.set({ dataForSendEvent: saveDataForEvent});
    setTimeout(() => {
      extensionStorage.setIsParsing(false);
      if (isParsing) {
        window.close();
      }
    }, 1200);
    return lastWord;
  };

  const onClickElement = useCallback((event: any) => {
    setIsButtonSeeTranslate(false);
    const element = event.target as HTMLElement;
    if(element.parentElement.className === "comments-comment-box__submit-button mt3 artdeco-button artdeco-button--1 artdeco-button--primary ember-view") {
      chrome.storage.sync.get(['dataForSendEvent'], (result) => {
        console.log('result', result);
        if(Object.keys(result).length) {
          sendAnalytics(result.dataForSendEvent.generateCommentText, userWork.link, userWork.projectId, result.dataForSendEvent.textPost, result.dataForSendEvent.userInfo, result.dataForSendEvent.textComment, result.dataForSendEvent.linkAuthorComment)
          .then((res) => {return res})
          .catch((e) => console.log(e.err))
          .finally(() => {
            setHoveredElement(false);
          });
       }
      })
    }
    else {
    const ariaHiddenValue = element.getAttribute("aria-hidden");
    if (ariaHiddenValue === "true") {
      console.log("its not a comment");
    } else {
      // console.log(element); 
      
      if (element.tagName === "SPAN" && extensionEnabled && element.className !== "button-content-container display-flex align-items-center") {
        setTextComment(element.innerText);

        const scrollContent = document.getElementsByClassName(
          "scaffold-finite-scroll__content"
        )[0] != undefined ?  document.getElementsByClassName(
          "scaffold-finite-scroll__content"
        )[0]: document.getElementsByClassName(
          "fixed-full"
        )[0];

        const listOfPost = scrollContent.querySelectorAll(":scope > div");

        for (let i = 0; i < listOfPost.length; i++) {
          if (
            listOfPost[i] &&
            listOfPost[i].innerHTML &&
            listOfPost[i].innerHTML.includes(element.innerHTML.slice(0, 50))
          ) {

            let postContainer = listOfPost[i].getElementsByClassName(
              "feed-shared-inline-show-more-text feed-shared-update-v2__description feed-shared-inline-show-more-text--minimal-padding"
            )[0];

            setTextPost(
              //@ts-ignore
              postContainer
              //@ts-ignore
                ? postContainer.querySelector('span[dir="ltr"]')?.innerText
                : ""
            );

            // console.log("start parsing");
            const listOfComment = listOfPost[i].querySelectorAll("article");
            // const LINKAUTHOR = listOfPost[i].querySelector("a").href;

            for (let j = 0; j < listOfComment.length; j++) {
              if (
                listOfComment[j] &&
                listOfComment[j].innerHTML &&
                listOfComment[j].innerHTML.includes(
                  element.innerHTML.slice(0, 50)
                )
              ) {
                if(listOfComment[j].querySelector("button").classList.contains("see-more")) {
                  listOfComment[j].querySelector("button").click();
                }
                if(listOfComment[j].querySelector("button").classList.contains("comments-see-translation-button__text")){
                  setIsButtonSeeTranslate(true);
                }

                if(listOfComment[j].querySelector("div").getElementsByClassName("comments-post-meta__profile-info-wrapper display-flex").length != 0) {
                  const sizeElement = listOfComment[j].querySelector("div").getElementsByClassName("comments-post-meta__profile-info-wrapper display-flex")[0].getBoundingClientRect();
                  setElementSizesWidth(sizeElement);
                }
                else {
                  setElementSizesWidth(element.getBoundingClientRect());
                }
                setLinkAuthorComment(listOfComment[j].querySelector("a").href);
                // console.log(
                //   "link to author of comment -",
                //   listOfComment[j].querySelector("a").href
                // );
                // setCloseUselessTab(false);
                extensionStorage.setUserInfo(clearUserInfo);

                setHoveredElement(true);
                
                setElementSizes(element.getBoundingClientRect());
                setCommentURL(listOfComment[j].querySelector("a").href);
                setPositionTop(element.getBoundingClientRect()?.top - 55 + window.scrollY);
              }
            }
            // console.log("link to author of post -", LINKAUTHOR);
          }
        }
      }
    }
   }
  }, []);

  const onClickCopy = (event: React.MouseEvent<HTMLElement>) => {
    // setHoveredElement(false);
    extensionStorage.setIsParsing(true);
    window.open(commentURL, "_blank");
  };

  const onClickClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setHoveredElement(false);
    setIsButtonSeeTranslate(false);
    setLinkAuthorComment('');
  };

  useEffect(() => {
    if (extensionEnabled) {
      documentRef.current.addEventListener("click", onClickElement);
      documentRef.current.removeEventListener("click", () => {}, false);
    }
    if (window.location.href.includes("linkedin.com/in/")) {
      waitForElementToExist(
        "artdeco-card pv-profile-card break-words mt2",
        getUserData
      );
    }
  }, [hoveredElement, extensionEnabled, isParsing]);

  useEffect(() => {
    setTextPosition(userInfo.aboutAuthor);
  },[userInfo.aboutAuthor]);

  return (
    <>
      {hoveredElement && extensionEnabled && (
        <>
          <div
            style={{
              position: "absolute",
              width: elementSizesWidth.width,
              height: elementSizes.height + 70 + (isButtonSeeTranslate ? 20 : -2),
              top: positionTop,
              left: elementSizesWidth.left,
              pointerEvents: "none",
              zIndex: 999,
            }}
          >
            <div className="SelectedContainer">
            </div>
            <div className="ButtonsContainer">
                <CopyButton onClickCopy={onClickCopy} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              width: 365,
              height: 560,
              top: positionTop - 245,
              left: elementSizesWidth.left + elementSizesWidth.width + 15,
              zIndex: 999,
            }}
          >
            <div className="SelectedContainerText">
              <div className="header"> <h3 className="headerLabel">Write reply to</h3> <CloseButton onClickClose={onClickClose} /></div>
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
                <GenerateButton onShowData={onShowData} isLoader={isLoader}/>
            </div>
          </div>
          {isShowMessageCopy && 
          <div style={{
              position: "fixed",
              bottom: "2%",
              left: "43%",
              zIndex: 999,
            }}>
              <MessageCopy />
          </div>}
        </>
      )}
    </>
  );
};
