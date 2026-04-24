import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from 'axios'
import { v2 as cloudinary } from "cloudinary";
import FormData from 'form-data'
import fs from 'fs'
import pdfParse from "pdf-parse/lib/pdf-parse.js";

// ── API Key Pool ─────────────────────────────────────────────────────────────
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

const buildKeyPool = () => {
    const geminiKeys = [];
    if (process.env.GEMINI_API_KEY)   geminiKeys.push(process.env.GEMINI_API_KEY);
    if (process.env.GEMINI_API_KEY_2) geminiKeys.push(process.env.GEMINI_API_KEY_2);
    if (process.env.GEMINI_API_KEY_3) geminiKeys.push(process.env.GEMINI_API_KEY_3);
    
    const pool = geminiKeys.map(key => ({
        client: new OpenAI({ apiKey: key, baseURL: GEMINI_BASE_URL }),
        model: "gemini-2.0-flash",
        name: "Gemini"
    }));

    if (process.env.GROQ_API_KEY) {
        pool.push({
            client: new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" }),
            model: "llama-3.3-70b-versatile",
            name: "Groq"
        });
    }

    if (pool.length === 0) throw new Error("No AI API keys found in environment.");
    return pool;
};

const aiPool = buildKeyPool();
console.log(`AI pool ready: ${aiPool.length} provider(s) loaded.`);

// ── Smart call helper ─────────────────────────────────────────────────────────
const callAI = async (buildParams) => {
    let lastError;
    // Try every provider in the pool
    for (let i = 0; i < aiPool.length; i++) {
        try {
            const { client, model, name } = aiPool[i];
            const params = buildParams();
            params.model = model; // Override model based on provider
            return await client.chat.completions.create(params);
        } catch (err) {
            const status = err?.status || err?.response?.status;
            if (status === 429) {
                console.log(`${aiPool[i].name} (Key ${i + 1}) rate-limited. Trying next...`);
                lastError = err;
            } else {
                throw err;
            }
        }
    }
    // Final fallback: wait 3s and try the first one again
    console.log("All providers exhausted. Waiting 3s...");
    await new Promise(r => setTimeout(r, 3000));
    const first = aiPool[0];
    const params = buildParams();
    params.model = first.model;
    return await first.client.chat.completions.create(params);
};


export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

        const response = await callAI(() => ({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: parseInt(length) || 800,
        }));

        const content = response.choices[0].message.content

        await sql`INSERT INTO CREATIONS(user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content })

    } catch (error) {
        console.log('generateArticle error:', error.message);
        const status = error?.status || error?.response?.status;
        if (status === 429) {
            return res.json({ success: false, message: "AI service is currently busy. Please wait a moment and try again." });
        }
        res.json({ success: false, message: error.message })
    }
}


export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

        const response = await callAI(() => ({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        }));

        const content = response.choices[0].message.content

        await sql`INSERT INTO CREATIONS(user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content })

    } catch (error) {
        console.log('generateBlogTitle error:', error.message);
        const status = error?.status || error?.response?.status;
        if (status === 429) {
            return res.json({ success: false, message: "AI service is currently busy. Please wait a moment and try again." });
        }
        res.json({ success: false, message: error.message })
    }
}


export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: { ...formData.getHeaders(), 'x-api-key': process.env.CLIPDROP_API_KEY },
            responseType: "arraybuffer",
        })

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            stream.end(Buffer.from(data))
        })

        const secure_url = uploadResult.secure_url

        await sql`INSERT INTO CREATIONS(user_id, prompt, content, type, publish) 
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        await sql`INSERT INTO CREATIONS(user_id, prompt, content, type) 
        VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }

        const { public_id } = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        })

        await sql`INSERT INTO CREATIONS(user_id, prompt, content, type) 
        VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if (plan !== "premium") {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." });
        }

        if (!resume) {
            return res.json({ success: false, message: "No resume uploaded." });
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume file size exceeds allowed size (5MB)." });
        }

        // Use buffer directly — no file path needed
        let extractedText = '';
        try {
            const pdfData = await pdfParse(resume.buffer);
            extractedText = pdfData.text?.trim();
        } catch (pdfError) {
            console.log('PDF parse error:', pdfError.message);
            return res.json({ success: false, message: "Failed to parse PDF. Make sure it's a valid, text-based PDF (not scanned/image-based)." });
        }
        // No unlinkSync needed — memory storage has no temp file

        if (!extractedText || extractedText.length < 50) {
            return res.json({ success: false, message: "Could not extract text from this PDF. It may be a scanned or image-based resume." });
        }

        const prompt = `You are an expert resume reviewer and career coach. Carefully analyze the following resume and provide structured, actionable feedback covering:

1. **Overall Impression** – First look summary
2. **Strengths** – What's working well
3. **Areas for Improvement** – Specific weaknesses with clear suggestions
4. **ATS Optimization** – Keywords, formatting tips for applicant tracking systems
5. **Action Items** – Top 3-5 concrete changes to make immediately

Resume content:
${extractedText}`;

        const response = await callAI(() => ({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1500,
        }));

        const result = response.choices[0].message.content;

        await sql`
            INSERT INTO CREATIONS(user_id, prompt, content, type) 
            VALUES (${userId}, 'Review the uploaded resume', ${result}, 'resume-review')
        `;

        res.json({ success: true, content: result });

    } catch (error) {
        console.log('resumeReview error:', error);
        const status = error?.status || error?.response?.status;
        if (status === 429) {
            return res.json({ success: false, message: "AI service is currently busy. Please wait a moment and try again." });
        }
        res.json({ success: false, message: error.message });
    }
};