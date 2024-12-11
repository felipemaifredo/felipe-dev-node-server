import type { Request, Response } from "express"

export async function imageConverter(req: Request, res: Response) {
    const format = req.body.format || "png" // Formato de saída (padrão: png)
    //const inputPath = req.file.path
}