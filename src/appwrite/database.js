
import { Client, ID, Databases, Storage, Query } from "appwrite";
import { toast } from "react-toastify";




export class Service {
    client = new Client();
    databases;
    storage;


    constructor() {
        this.client
            .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
            .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }



    //create a new user

    async createUser(newUser) {

        try {
            return this.databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                newUser.userID.toString(),
                newUser,
            )
        } catch (error) {
            toast.success('error from db')
            console.log("Appwrite serive :: createUser :: error", error)
        }
    }

    //get existing user

    async getUserByReferralCode(referralCode) {
        try {
            const result = await this.databases.listDocuments(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID, // Replace with your actual users collection ID
                [Query.equal('referralCode', referralCode)] // Query to find user by referral code
            );
    
            // Check if any documents were found
            if (result.documents.length > 0) {
                return result.documents[0]; // Return the first matching user
            } else {
                return null; // No user found with that referral code
            }
        } catch (error) {
            console.log("Appwrite service :: getUserByReferralCode :: error", error);
            return false; // Return false on error
        }
    }
    

    async getUser(userId) {
        try {
            return await this.databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userId.toString()
            )
        } catch (error) {
            console.log("Appwrite serive :: getUser :: error", error)
            return false
        }
    }

    async updateUserTasks(userId, taskId) {
        try {
            // Logging input types for debugging
      

            // Fetch the user document from Appwrite
            const user = await this.databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userId
            );

            // Destructure necessary fields from user document
            const { tasks, userID, coins } = user;

            // Check if the taskId already exists in the tasks array to avoid duplicates
            const newTasks = tasks.includes(taskId) ? tasks : [...tasks, taskId];

            

            // Update the user document in Appwrite
            return await this.databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userId,   // User ID from frontend
                {
                    userID,  // Keep userID unchanged
                    tasks: newTasks,  // Updated tasks
                    coins     // Assuming no change to coins in this operation
                }
            );
        } catch (error) {
            // Improved error handling
            console.error("Error updating user tasks:", error);
        }
    }


    //update user coins

    // Replace this with your Appwrite service for updating user coins
    async updateUserCoins(userId, newCoins) {
        try {


            const getUser = await this.databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userId.toString()
            )

            const newAmt = getUser.coins + newCoins;
            

            const updatedDocument = await this.databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userId.toString(),
                { coins: newAmt }
            );

            return updatedDocument;
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    };


    async updateUserTaps(userId, taps) {
        try {
            await this.databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
                userId,
                taps
            );
        } catch (error) {
            console.error("Error updating user data in Appwrite:", error);
        }
    };


    // Replace this with your Appwrite service for updating user coins
    async updateUserData(userId, data) {
        try {

            const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
            const collectionId = process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID;

            const updatedDocument = await this.databases.updateDocument(
                databaseId,
                collectionId,
                userId,
                data
            );

            return updatedDocument;
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    };




    //create methods
    async addData(formData) {

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

    // People who have completed the tasks
    async updateCompanyUsers(documentId, newUserData) {
        try {

            // Fetch the company document from Appwrite
            const companyData = await this.databases.getDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                documentId
            );


            // Destructure necessary fields from company document
            let { users } = companyData;


            // Check if users is defined, if not initialize it as an empty array
            // users = users ? JSON.parse(users) : [];


            // Check if the taskId already exists in the users array to avoid duplicates
            const newUsers = users.includes(newUserData) ? users : [...users, JSON.stringify(newUserData)];
           
            // Log updated tasks and user info for debugging
            

            // Update the company document in Appwrite with JSON.stringify
            return await this.databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                documentId, // Document ID from the frontend
                {
                    users: newUsers, // Store users as a JSON string
                }
            );
        } catch (error) {
            // Improved error handling
            console.error("Error updating company users:", error);
        }
    }




    async getData(documentID) {
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


    async getAllData(category) {

        try {

            const result = await this.databases.listDocuments(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_TASKS_COLLECTION_ID,
                [Query.equal('category', [category]), Query.orderDesc('$createdAt'),],

            )
            return result;
        } catch (error) {
            console.log("Appwrite serive :: getAllData :: error", error)
            return false
        }
    }

    async deleteDocument(documentID) {
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


