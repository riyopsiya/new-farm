
import { Client,ID,Databases,Storage,Query } from "appwrite";
import { toast } from "react-toastify";


  

export class Service{
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

  //create a new user

  async createUser(newUser){
      
    try {
        toast.success(newUser.userID,'new user id')
      return this.databases.createDocument(
          process.env.REACT_APP_APPWRITE_DATABASE_ID,
          process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
          ID.unique(),
          newUser,
      )
    } catch (error) {
        console.log("Appwrite serive :: createUser :: error", error)
    }
}

//get existing user

async getUser(userID){
    try {
       return await this.databases.getDocument(
           process.env.REACT_APP_APPWRITE_DATABASE_ID,
           process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
           userID
       )
    } catch (error) {
       console.log("Appwrite serive :: getUser :: error", error)
       return false
    }
}

    //create methods
    async addData(formData){
      
          try {
            return this.databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                ID.unique(),
                formData,
            )
          } catch (error) {
              console.log("Appwrite serive :: addData :: error", error)
          }
    }

    async updateData(documentID,newData){
        try {
            return this.databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                documentID,   //get from from frontend
                newData   //udated data
            )
            
        } catch (error) {
            console.log("Appwrite serive :: updateData :: error", error)
        }
    }


    // async deleteData(documentID){
    //         try {
    //              return this.databases.deleteDocument(
    //                 process.env.REACT_APP_APPWRITE_DATABASE_ID,
    //                 process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
    //                 documentID
    //              )
    //         } catch (error) {
    //             console.log("Appwrite serive :: deleteData :: error", error)
    //             return false
    //         }
    // }


    async getData(documentID){
         try {
            return this.databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                documentID
            )
         } catch (error) {
            console.log("Appwrite serive :: getData :: error", error)
            return false
         }
    }


    async getAllData(category){

        try {
            
           const result=  await this.databases.listDocuments(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                [Query.equal('category',[category]),Query.orderDesc('$createdAt'),],

            ) 
            return result;
        } catch (error) {
            console.log("Appwrite serive :: getAllData :: error", error)
            return false
        }
    }

    async deleteDocument(documentID){
        try {
            return await this.databases.deleteDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID, // databaseId
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID, // collectionId
                documentID // documentId
            );

        } catch (error) {
            console.log(error)
        }
    }



        // file upload service

        async uploadFile(file){
            try {
                
                return await this.storage.createFile(
                    process.env.REACT_APP_APPWRITE_BUCKET_ID,
                    ID.unique(),
                    file
                )
              
            } catch (error) {
                console.log("Appwrite serive :: uploadFile :: error", error);
                return false
            }
        }
    
        async deleteFile(fileId){
            try {
                await this.storage.deleteFile(
                    process.env.REACT_APP_APPWRITE_BUCKET_ID,
                    fileId
                )
                return true
            } catch (error) {
                console.log("Appwrite serive :: deleteFile :: error", error);
                return false
            }
        }


        getFilePreview(fileId){
            return this.storage.getFilePreview(
                process.env.REACT_APP_APPWRITE_BUCKET_ID,
                fileId
            )
        }
}

const service=new Service();

export default service;


