import { Databases, Storage, ID, Client, Query } from "appwrite";
import config from "../conf/config";

export class Service{
    client = new Client()
    bucket
    databases

    constructor() {
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)

        this.bucket = new Storage(this.client)
        this.databases = new Databases(this.client)

    }

    async createPost({title, slug, content, featuredImage, status, userId}) {
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    userId,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite Service Error :: createPost",error);
        }
    }

    async updatePost(slug,{title, content, featuredImage, status, })
    {
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    status,
                    featuredImage
                }
            )
        } catch (error) {
            console.log("Appwrite Service Error :: UpdatePost",error)
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite Service Error :: deletePost", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Serivce Error :: getPost", error)
            return false
        }
    }

    async getPosts(queries = [Query.equal('status',['active'])]){
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries   
            )
        } catch (error) {
            console.log("getPosts error ::",error);
            return false
        }
    }

    //file upload methods

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log('appwrite service error :: upload file ',error)
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("deleteFile Error ::",error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            config.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service