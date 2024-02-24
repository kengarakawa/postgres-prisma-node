import express ,{ Request , Response}  from "express"
import { createUser, getAllUsers , getUserById} from "../controllers/userController"



const router = express.Router()

router.get("/", getAllUsers )
router.get("/:userId", getUserById )
router.post("/", createUser )


export default router 