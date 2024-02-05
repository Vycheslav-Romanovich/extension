import { useRef, useState, useCallback, useEffect } from "react";
import useStorage from "@root/src/shared/hooks/useStorage";
import { extensionStorage } from "@root/src/shared/storages/extensionStorage";
import { CloseButton, GenerateButton } from "./Buttons";
import { MessageCopy } from "./Message";
import { generateComment, sendAnalytics } from "../../api/axios";
import FirstTab from "./components/firstTab";
import SecondTab from "./components/secondTab";
import { textPromtReset } from "@root/src/constants/textsPromt";
import { MessageParsing } from "./components/MessageParsing";

export const App = () => {
  const { extensionEnabled, userInfo, isParsing, userWork, textPromt, postLink } =
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
  const [activeTab, setActiveTab] = useState("tab1");
  const [textPromtState, setTextPromtState] = useState(textPromt);
  
  const clipboard = navigator.clipboard;
  const clearUserInfo = {
    name: '-',
    aboutAuthor: '-',
    position: '-',
    company: '-',
    experience: '-',
    about: '-',
    link: '-',
  };

  const onShowData  = async () => {
    setIsLoader(true);

    const data = await generateComment(textPost,textComment, textPromtState)
    .then((res) => {return res.data})
    .catch((e) => console.log(e.err));
    
    clipboard
      .writeText(String(data))
      .then(() => {
        console.log("Текст скопирован в буфер обмена");
        setIsLoader(false);
        setIsShowMessageCopy(true);
      })
      .catch((err) => {
        console.error("Не удалось скопировать текст в буфер обмена: ", err);
      });

      const saveDataForEvent = {
        generateCommentText: String(data),
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
      position: aboutUser,
      company: exp[1]?.textContent ?? '-',
      experience: exp[2]?.textContent ?? '-',
      about: exp[4]?.textContent ?? '-',
      link: window.location.href,
    };
    extensionStorage.setUserInfo(lastWord);
    const saveDataForEvent = {
      generateCommentText: '-',
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
    const element = event.target as HTMLElement;
    console.log(element); 

    //set LinkPost
    if(element.parentElement.parentElement.parentElement.getElementsByClassName('social-details-social-counts__item social-details-social-counts__comments social-details-social-counts__item--right-aligned')?.length >= 1){
      const dataUrn = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement?.getAttribute('data-urn');
      const linkPost = dataUrn ? `https://www.linkedin.com/feed/update/${dataUrn}` : '-';
      extensionStorage.setPostLink(linkPost);  
    };
    
    //set LinkPost
    if(element.className === 'artdeco-button__text' && element.parentElement.getAttribute('aria-label') === 'Comment'){
      const dataUrn = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('data-urn');
      const linkPost = dataUrn ? `https://www.linkedin.com/feed/update/${dataUrn}` : '-';  
      extensionStorage.setPostLink(linkPost);  
    };

    if(element.parentNode.parentElement.matches('a')){
      onClickClose();
    } else{
    if(element.parentElement.className === "comments-comment-box__submit-button mt3 artdeco-button artdeco-button--1 artdeco-button--primary ember-view") {
      //@ts-ignore
      const textCommentedUserExt = element.parentElement.parentElement.parentElement.getElementsByClassName('ql-editor')[0]?.innerText ?? '-';
      
      chrome.storage.sync.get(['dataForSendEvent'], (result) => {
        if(Object.keys(result).length) {
          sendAnalytics(textCommentedUserExt, userWork.link, userWork.projectId, result.dataForSendEvent.textPost, result.dataForSendEvent.userInfo, result.dataForSendEvent.textComment, result.dataForSendEvent.linkAuthorComment, postLink)
          .then((res) => {return res})
          .catch((e) => console.log(e.err))
          .finally(() => {
            setHoveredElement(false);
          });
       }
      });
    }
    else {    
    const ariaHiddenValue = element.getAttribute("aria-hidden");
    if (ariaHiddenValue === "true") {
      console.log("its not a comment");
      onClickClose();
    } else {
      // console.log(element); 
      if (element.tagName === "SPAN" && extensionEnabled && element.className !== "button-content-container display-flex align-items-center") {
        setTextComment(element.innerText);
        // let scrollContent = document.getElementsByClassName(
        //   "scaffold-finite-scroll__content"
        // )[0] != undefined ?  document.getElementsByClassName(
        //   "scaffold-finite-scroll__content"
        // )[0]: document.getElementsByClassName(
        //   "fixed-full"
        // )[0];
        //   console.log('scrollContent', scrollContent);
          const parsingPostElement = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
          const listOfPost = parsingPostElement.querySelectorAll(":scope > div");
        // if (scrollContent === undefined || scrollContent === null){
        // scrollContent = document.getElementsByClassName('search-results-container')[0];
        // }
        
        
      //   if(scrollContent.querySelector("ul").querySelector("li").querySelector('div')!= null || scrollContent.querySelector("ul").querySelector("li").querySelector('div')!= undefined){
      //   const listOfPostUser = scrollContent.querySelector("ul").querySelectorAll(":scope > li");     
      //   console.log('1', listOfPostUser);  
      //   for(let i = 0; i < listOfPostUser.length; i++)
      //   {
      //     if (
      //       listOfPostUser[i] &&
      //       listOfPostUser[i].innerHTML &&
      //       listOfPostUser[i].innerHTML.includes(element.innerHTML.slice(0, 50))
      //     ) {
      //       listOfPost = listOfPostUser[i].querySelectorAll(":scope > div");
      //     }
      //   }
      // } else {
      //    listOfPost = scrollContent.querySelectorAll(":scope > div");       
      // }
      // console.log('listOfPost', listOfPost);
      //   if(listOfPost === undefined){
      //     const listOfPostUser = scrollContent.lastElementChild.querySelector("ul").querySelectorAll(":scope > li");
      //     console.log('2', listOfPostUser);
             
      //     for(let i = 0; i < listOfPostUser.length; i++)
      //   {
      //     if (
      //       listOfPostUser[i] &&
      //       listOfPostUser[i].innerHTML &&
      //       listOfPostUser[i].innerHTML.includes(element.innerHTML.slice(0, 50))
      //     ) {
      //       listOfPost = listOfPostUser[i].querySelectorAll(":scope > div");
      //     }
      //   }
      //   }
      //   console.log('listOfPost', listOfPost);
        
        console.log('TEST',listOfPost);
        for (let i = 0; i < listOfPost.length; i++) {

          if (
            listOfPost[i] &&
            listOfPost[i].innerHTML &&
            listOfPost[i].innerHTML.includes(element.innerHTML.slice(0, 50))
          ) {
            console.log('listOfPost[i]', listOfPost[i]);
            //set LinkPost
            const dataId = listOfPost[i].getAttribute('data-id');
            const linkPost = dataId ? `https://www.linkedin.com/feed/update/${dataId}` : '-';
            extensionStorage.setPostLink(linkPost);  

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

            console.log("start parsing");
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
                } else{ 
                  setIsButtonSeeTranslate(false);
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
                
                const setUserInfoDataClick = {
                  name: listOfComment[j].getElementsByClassName('comments-post-meta__name-text hoverable-link-text mr1')[0]?.querySelector('span[dir="ltr"]')?.querySelector('span')?.innerText ?? '-',
                  //@ts-ignore
                  aboutAuthor: listOfComment[j].getElementsByClassName('comments-post-meta__headline t-12 t-normal t-black--light')[0]?.innerText ?? '-',
                  position: '-',
                  company: '-',
                  experience: '-',
                  about: '-',
                  link: listOfComment[j].querySelector("a").href,
                };
                extensionStorage.setUserInfo(setUserInfoDataClick);

                setHoveredElement(true);
                setActiveTab("tab1");

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
  }
  }, []);

  const onClickCopy = (event: React.MouseEvent<HTMLElement>) => {
    // setHoveredElement(false);
    extensionStorage.setIsParsing(true);
    window.open(commentURL, "_blank");
  };

  const onClickClose = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    setHoveredElement(false);
    setIsButtonSeeTranslate(false);
    setLinkAuthorComment('');
    setActiveTab("tab1");
  };

  const handleTab1 = () => {
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    setActiveTab("tab2");
  };

  const onClickResetPromt = () => {
    setTextPromtState(textPromtReset);
    extensionStorage.setTextPromt(textPromtReset);
  };

  const setTextPromt =(e:string) => {
    setTextPromtState(e);
    extensionStorage.setTextPromt(e);
  }

  useEffect(() => {
    if (extensionEnabled) {
      documentRef.current.addEventListener("click", onClickElement);
      documentRef.current.removeEventListener("click", () => {}, false);
    }
    if (window.location.href.includes("linkedin.com/in/") && isParsing) {
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
              <div className="header">
              <ul className="nav">
                <li
                  className={activeTab === "tab1" ? "active" : ""}
                  onClick={handleTab1}
                >
                  Gathered info
                </li>
                <li
                  className={activeTab === "tab2" ? "active" : ""}
                  onClick={handleTab2}
                >
                  Used prompt
                </li>
            </ul>
              <CloseButton onClickClose={onClickClose} /></div>
                {activeTab === "tab1" ?
                  <FirstTab 
                  textPost={textPost}
                  textComment={textComment}
                  textPosition={textPosition}
                  setTextPost={setTextPost}
                  setTextComment={setTextComment}
                  setTextPosition={setTextPosition}
                  onClickCopy={onClickCopy}
                /> :
                <SecondTab 
                  textPromt={textPromtState}
                  setTextPromt={setTextPromt}
                  onClickReset={onClickResetPromt}
                />}
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
      {isParsing && 
        <div style={{
              position: "fixed",
              bottom: "3%",
              left: "38%",
              zIndex: 999,
        }}>
            <MessageParsing />
        </div>}
    </>
  );
};
