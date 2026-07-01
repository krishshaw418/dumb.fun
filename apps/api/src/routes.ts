import { Request, Response } from "express";
import { Router } from "express";
import { fetchAllCoins, fetchCoin } from "./services";

const router = Router();

router.get("/fetchAllCoins", async (req: Request, res: Response) => {
    try {
        const tokens = await fetchAllCoins();

        res.status(200).json({ success: true, data: tokens });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: "false", error: "Failed to fetch tokens!" });
    }
});

router.get("/coin/{*splat}", async (req: Request, res: Response) => {
    const mint = req.params.splat[0];

    if (!(/^[1-9A-HJ-NP-Za-km-z]+$/).test(mint)) {
        return res.status(400).json({ success: false, error: "Invalid mint address!" });
    }
    
    try {
        const coinData = await fetchCoin(mint);

        if (!coinData) {
            return res.status(404).json({ success: false, error: "Coin not found!" });
        }

        res.status(200).json({ success: true, data: coinData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch coin!" });
    }  
})

export default router;