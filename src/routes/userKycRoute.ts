import UserKycController from "@controllers/userKycController";
import express from "express";

const router = express.Router();
const userKycController = new UserKycController();

router.post("/response/:userId", userKycController.saveKycVerification);

export default router;
