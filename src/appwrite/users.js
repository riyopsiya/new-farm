
import { Client,ID,Databases,Storage,Query } from "appwrite";


  

export class UserService{
    client=new Client();
    databases;
    storage;


    constructor(){
        this.client
        .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
        .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

        this.databases=new Databases(this.client);
        this.storage=new Storage(this.client);
    }


    //create methods
    async createUser(userdata){
      
          try {
            return this.databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                ID.unique(),
                userdata,
            )
          } catch (error) {
              console.log("Appwrite serive :: createUser :: error", error)
          }
    }

    async updateData(userID,newData){
        try {
            return this.databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userID,   //get from from frontend
                newData   //udated data
            )
            
        } catch (error) {
            console.log("Appwrite serive :: updateData :: error", error)
        }
    }


  

    async getUser(userID){
         try {
            return await this.databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userID
            )
         } catch (error) {
            console.log("Appwrite serive :: getData :: error", error)
            return false
         }
    }


    // async getAllData(category){

    //     try {
            
    //        const result=  await this.databases.listDocuments(
    //             process.env.REACT_APP_APPWRITE_DATABASE_ID,
    //             process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
    //             [Query.equal('category',[category]),Query.orderDesc('$createdAt'),],

    //         ) 
    //         return result;
    //     } catch (error) {
    //         console.log("Appwrite serive :: getAllData :: error", error)
    //         return false
    //     }
    // }

    // async deleteDocument(documentID){
    //     try {
    //         return await this.databases.deleteDocument(
    //             process.env.REACT_APP_APPWRITE_DATABASE_ID, // databaseId
    //             process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID, // collectionId
    //             documentID // documentId
    //         );

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }



        // file upload service

     

}

const userService=new UserService();

export default userService;


