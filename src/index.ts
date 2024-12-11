import express, { Request, Response } from "express"
import multer from "multer"
import { imageConverter } from "./image-converter/index"
require("dotenv").config()

const app = express()
const upload = multer({ dest: "uploads/" })

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

// Endpoint para conversão de imagens (API funcional)
app.post("/api/converter-imagem", upload.single("image"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: "Nenhuma imagem enviada." })
        }

        // Chama a função de conversão
        await imageConverter(req, res)
    } catch (error: any) {
        res.status(500).send({ error: `Erro ao processar a imagem: ${error.message}` })
    }
})

app.get("/converter-imagem", async (req: Request, res: Response) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consumir API - Converter Imagem</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f9;
            }

            .container {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            input[type="file"] {
                margin: 10px 0;
            }

            button {
                background-color: #4caf50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
            }

            button:hover {
                background-color: #45a049;
            }

            .response {
                margin-top: 20px;
                padding: 10px;
                border-radius: 5px;
                background-color: #f0f8ff;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Conversor de Imagem</h1>
            <form id="upload-form">
                <input type="file" id="file-input" name="image" accept="image/*" required>
                <button type="submit">Converter e Baixar</button>
            </form>
            <div id="response" class="response" style="display: none;"></div>
        </div>

        <script>
            document.getElementById("upload-form").addEventListener("submit", async (event) => {
                event.preventDefault(); // Evita o recarregamento da página
                const fileInput = document.getElementById("file-input");
                const responseDiv = document.getElementById("response");

                if (!fileInput.files.length) {
                    alert("Selecione uma imagem antes de enviar.");
                    return;
                }

                const formData = new FormData();
                formData.append("image", fileInput.files[0]);

                try {
                    // Faz a requisição para a API com o arquivo enviado
                    const response = await fetch("http://localhost:3000/api/converter-imagem", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Erro ao converter a imagem.");
                    }

                    // Baixar o arquivo convertido
                    const blob = await response.blob();
                    const downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = "imagem-convertida.png"; // Nome sugerido para o arquivo baixado
                    downloadLink.click();

                    responseDiv.style.display = "block";
                    responseDiv.textContent = "Imagem convertida e baixada com sucesso!";
                } catch (error) {
                    responseDiv.style.display = "block";
                    responseDiv.textContent = "Erro ao consumir a API: " + error.message;
                }
            });
        </script>
    </body>
    </html>
    `
    res.send(htmlContent)
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running")
})
