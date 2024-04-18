import Post  from "../model/SOSModel.js";
import 'dotenv/config';

export const locationTracker = async (req, res) => {
    try {
        // Check if the request body contains ObjId field
        if (!req.body.ObjId) {
            return res.status(400).json({ error: "Object ID not provided" });
        }
        
        // Extract the object ID string
        const reqObjectId = req.body.ObjId;

        // Query the database for the post
        const objBody = await Post.findOne({ _id: reqObjectId });

        if (!objBody) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(objBody);
        console.log(objBody);
    } catch (error) {
        return res.status(500).json({ error: "Having issue with tracking post" });
    }
}
