import axios from 'axios'
import { IUserInfo } from '@root/src/constants/types'

export const sendAnalytics = (generatedcomment: string, link: string,
    projectId: string, textPost: string, userInfo: IUserInfo, textComment?: string, linkAuthorComment?: string ) => {
    const data = axios
      .post(
        `https://pleasant-bluejay-next.ngrok-free.app/api/aiExtension/sendEvent`,
        {
          generated_comment: generatedcomment,
          executor: link,
          projectId: projectId,
          textPost: textPost,
          textComment: textComment,
          userInfo: userInfo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        return res
      })
  
    return data
  }

  export const generateComment = (textPost: string, textComment?: string ) => {
    const data = axios
      .post(
        `https://pleasant-bluejay-next.ngrok-free.app/api/aiExtension/generateComment`,
        {
          textPost: textPost,
          textComment: textComment
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        return res
      })
  
    return data
  }