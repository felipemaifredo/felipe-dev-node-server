import express, { Request, Response } from "express"
import puppeteer from "puppeteer"
require("dotenv").config()

const app = express()

// Página inicial
app.get("/", (req: Request, res: Response) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Servidor NodeJS E-Bordados</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;
                        text-align: center;
                        padding: 30px 20px;
                        background: white;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        border-left-color: #333;
                        animation: spin 1s ease infinite;
                    }
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Servidor NodeJS</h1>
                    <p>O servidor está funcionando corretamente.</p>
                    <div class="spinner"></div>
                </div>
            </body>
        </html>
    `
    res.send(htmlContent)
})

app.post("/api/generate-pdf", async (req: Request, res: Response) => {
    try {
        // Lê o corpo da requisição
        const { html, filename } = req.body
    
        if (!html) {
          return new Response("O conteúdo HTML é obrigatório.", { status: 400 })
        }
    
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
    
        // Define o conteúdo HTML recebido na requisição
        await page.setContent(html)
    
        // Gera o PDF, com quebras de página
        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        })
        await browser.close()
    
        // Define o nome do arquivo PDF
        const safeFilename = filename || "documento.pdf"
    
        // Retorna o PDF como resposta
        return new Response(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment filename="${safeFilename}"`,
          },
        })
      } catch (error) {
        console.error("Erro ao gerar o PDF:", error)
        return new Response("Erro interno ao gerar o PDF.", { status: 500 })
      }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running")
})
