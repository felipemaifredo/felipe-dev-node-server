import type { Request, Response } from "express"
import fs from "fs"
import sharp from "sharp"
import path from "path"

// Função para conversão de imagem
export async function imageConverter(req: Request, res: Response) {
    const format = req.body.format || "png" // Formato de saída (padrão: png)
    const outputDir = "converted/" // Diretório para imagens convertidas

    // Certifique-se de que o diretório de saída exista
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
    }

    const inputPath = req.file?.path
    const outputPath = path.join(outputDir, `${path.parse(req.file?.originalname || "output").name}.${format}`)

    try {
        // Converte a imagem usando Sharp
        await sharp(inputPath).toFormat(format).toFile(outputPath)

        if (!inputPath) {
            return res.status(400).send("Caminho do arquivo não encontrado.")
        }

        // Remove o arquivo original após a conversão
        fs.unlinkSync(inputPath)

        res.status(200).send({
            message: "Imagem convertida com sucesso!",
            outputPath,
        })
    } catch (error: any) {
        res.status(500).send(`Erro ao converter a imagem: ${error.message}`)
    }
}
