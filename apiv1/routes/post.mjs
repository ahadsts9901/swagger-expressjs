import express from 'express';
import { client } from '../../mongodb.mjs'
import { ObjectId } from 'mongodb';







const db = client.db("cruddb")
const col = db.collection("mongo-posts")
const router = express.Router()








/**
 * @swagger
 * /api/v1/post:
 *   post:
 *     description: |
 *      This api will be used for creating a post
 *
 *      JSON body inputs:
 *         - title: String (optional)
 *         - text: String (optional)
 *
 *      JSON Response body:
 *         - message: String
 *         - Possible error codes:
 *           * REQUIRED_PARAMETER_MISSING,
 *           * SUCCESS,
 *
 *     tags:
 *       - Create a post
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             text:
 *               type: string
 *     responses:
 *       '.':
 *         description: .
 */
router.post('/post', async (req, res, next) => {

    if (!req.body.title ||
        !req.body.text
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }

    const insertResponse = await col.insertOne({
        title: req.body.title,
        text: req.body.text,
        time: new Date()
    })
    console.log(insertResponse)

    res.send('post created');
})







/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     description: |
 *      This api will be used for get all posts
 *
 *      JSON Response body:
 *         - message: String
 *         - posts: Array
 *         - Possible error codes:
 *           * SUCCESS,
 *
 *     tags:
 *       - Get all posts
 *     responses:
 *       '.':
 *         description: .
 */
router.get('/posts', async (req, res, next) => {
    try {
        const cursor = col.find({}).sort({ _id: -1 });
        let results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});







/**
 * @swagger
 * /api/v1/post/{postId}:
 *   get:
 *     description: This API will be used for getting a single post.
 *     tags: [Get a post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 text:
 *                   type: string
 *                 time:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Post not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post not found with id {postId}"
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred while retrieving the post."
 */
router.get('/post/:postId', async (req, res, next) => {
    const postId = new ObjectId(req.params.postId);

    try {
        const post = await col.findOne({ _id: postId });

        if (post) {
            res.send(post);
        } else {
            res.status(404).send('Post not found with id ' + postId);
        }
    } catch (error) {
        console.error(error);
    }
});







/**
 * @swagger
 * /api/v1/posts/all:
 *   delete:
 *     description: Delete all posts in the collection.
 *     tags: [Delete posts]
 *     responses:
 *       200:
 *         description: Number of posts deleted successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "X posts deleted successfully."
 *       404:
 *         description: No posts found to delete.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "No posts found to delete."
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred while deleting the posts."
 */
router.delete('/posts/all', async (req, res, next) => {
    try {

        const deleteResponse = await col.deleteMany({});

        if (deleteResponse.deletedCount > 0) {
            res.send(`${deleteResponse.deletedCount} posts deleted successfully.`);
        } else {
            res.send('No posts found to delete.');
        }
    } catch (error) {
        console.error(error);
    }
});







/**
 * @swagger
 * /api/v1/post/{postId}:
 *   delete:
 *     description: Delete a single post by its ID.
 *     tags: [Delete a post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post with id {postId} deleted successfully."
 *       404:
 *         description: Post not found with the given ID.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post not found with the given id."
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred while deleting the post."
 */
router.delete('/post/:postId', async (req, res, next) => {
    const postId = new ObjectId(req.params.postId);

    try {
        const deleteResponse = await col.deleteOne({ _id: postId });
        if (deleteResponse.deletedCount === 1) {
            res.send(`Post with id ${postId} deleted successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});







/**
 * @swagger
 * /api/v1/post/{postId}:
 *   put:
 *     description: Update a single post by its ID.
 *     tags: [Update a post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *       - in: body
 *         name: post
 *         description: The updated post object
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - text
 *           properties:
 *             title:
 *               type: string
 *             text:
 *               type: string
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post with id {postId} updated successfully."
 *       404:
 *         description: Post not found with the given ID.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post not found with the given id."
 *       403:
 *         description: Required parameters missing.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Required parameters missing. Please provide both 'title' and 'text'."
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred while updating the post."
 */
router.put('/post/:postId', async (req, res, next) => {
    const postId = new ObjectId(req.params.postId);
    const { title, text } = req.body;

    if (!title || !text) {
        res.status(403).send('Required parameters missing. Please provide both "title" and "text".');
        return;
    }

    try {
        const updateResponse = await col.updateOne({ _id: postId }, { $set: { title, text } });

        if (updateResponse.matchedCount === 1) {
            res.send(`Post with id ${postId} updated successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});







// query params

/**
 * @swagger
 * /api/v1/query-posts:
 *   get:
 *     description: Get a list of posts with optional filters.
 *     tags: [Query posts]
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter posts by author name.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter posts by category.
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   text:
 *                     type: string
 *                   author:
 *                     type: string
 *                   category:
 *                     type: string
 *                   time:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred while retrieving the posts."
 */





// form_data

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     description: Upload files along with text inputs.
 *     tags: [File Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file1
 *         type: file
 *         required: true
 *         description: The first file to upload.
 *       - in: formData
 *         name: file2
 *         type: file
 *         required: true
 *         description: The second file to upload.
 *       - in: formData
 *         name: textInput1
 *         type: string
 *         required: true
 *         description: Text input field 1.
 *       - in: formData
 *         name: textInput2
 *         type: string
 *         required: true
 *         description: Text input field 2.
 *       - in: formData
 *         name: textInput3
 *         type: string
 *         required: true
 *         description: Text input field 3.
 *     responses:
 *       200:
 *         description: Files uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Files uploaded successfully."
 *       400:
 *         description: Invalid request format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request format."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while uploading files."
 */




export default router
