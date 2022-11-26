import { NFTStorage, File } from "nft.storage";
import axios from "axios";

import FormData from 'form-data'

const API_KEY = process.env.NFT_API_KEY

const uploadFileWithState = async ({ file, setProgress }) => {
  console.log("This is the start for the IPFS process....")
  setProgress != undefined ? setProgress('File parsing started.') : undefined
 
  //const storage: NFTStorage = new NFTStorage({ token: API_KEY })
 
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const newFile = new File([file], fileName, { type: file.type });
  setProgress != undefined ? setProgress('Uploading to IPFS.') : undefined

  //const url = await storage.store({
   // image: newFile,
    //name: fileName,
    //description: "Tris t"
  //})
  //console.log("This is the url :: ", url)
 
  const formData = new FormData()  
  formData.append('file', newFile)
  
  const uploadUrl = `https://demo.storj-ipfs.com/api/v0/add`
  const data = await axios.post(uploadUrl,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData.getBoundary}`,
            },
            // These arguments remove any client-side upload size restrictions
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        },
    ) 
  
  setProgress != undefined ? setProgress("Uploaded") : undefined
  return data.data.Hash
};

const uploadFile = async ({ file }) => {
  console.log("This is the start for the IPFS process....")
  const storage: NFTStorage = new NFTStorage({ token: API_KEY })
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const newFile = new File([file], fileName, { type: file.type });
  console.log("Starting upload")
  const url = await storage.store({
    image: newFile,
    name: fileName,
    description: "Tris"
  })
  console.log("This is the url :: ", url)
  return url.data.image.href
}

const parseUserData = async ({ User, posts }) => {

  //This method is useful only when data is uplaoded using nft.storage else it's useless
  const rawUrl = (User.avatarUrl as string).replace("ipfs://", '')

  const parsedUrl = "https://ipfs.io/ipfs/" + rawUrl

  const parsedData = {
    name: User.name,
    userName: User.userName,
    profileUrl: parsedUrl,
    posts: posts,
    wallUrl: User.wallUrl,
    address: User.userAddress,
    following: User.following,
    followingCount: User.followingCount,
    followers: User.followers,
    followersCount: User.followersCount,
    postCount: User.postCount,
    bio: User.bio,
    email: User.email
  }
  return parsedData
}

export { uploadFileWithState, uploadFile, parseUserData };
