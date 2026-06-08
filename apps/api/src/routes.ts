import { Request, Response } from "express";
import { Router } from "express";
import { newTokenSchema } from "./schema";
import { createNewToken } from "./services";

const router = Router();

router.post("/new-token", async (req: Request, res: Response) => {
    const parsed = newTokenSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ success: false, error: JSON.parse(parsed.error.message) });
    }

    try {
        await createNewToken(parsed.data);

        res.status(201).json({ success: true, message: "Created new token!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create new token!" });
    }
});

export default router;