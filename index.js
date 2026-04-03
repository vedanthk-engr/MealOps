import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";
import { createCanvas, loadImage } from "canvas";
import { bitmaps } from "./bitmaps.js";
import fs from "fs/promises";
import { URLSearchParams } from "url";

const USER="24BRS1302"
const PASS="VITOnTop@123456"

const agent = new https.Agent({ rejectUnauthorized: false });

export const client = axios.create({
    baseURL: "https://vtopcc.vit.ac.in",
    httpsAgent: agent,
    withCredentials: true,
});

const getImageBlocks = (pixelData) => {
    const saturate = new Array(pixelData.length / 4);
    for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i], g = pixelData[i + 1], b = pixelData[i + 2];
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        saturate[i / 4] = max === 0 ? 0 : Math.round(((max - min) * 255) / max);
    }

    const img = [];
    for (let i = 0; i < 40; i++) {
        img[i] = [];
        for (let j = 0; j < 200; j++) {
            img[i][j] = saturate[i * 200 + j];
        }
    }

    const blocks = new Array(6);
    for (let i = 0; i < 6; i++) {
        const x1 = (i + 1) * 25 + 2;
        const y1 = 7 + 5 * (i % 2) + 1;
        const x2 = (i + 2) * 25 + 1;
        const y2 = 35 - 5 * ((i + 1) % 2);
        blocks[i] = img.slice(y1, y2).map(row => row.slice(x1, x2));
    }
    return blocks;
};

const binarizeImage = (charImg) => {
    let avg = 0;
    charImg.forEach(row => row.forEach(pixel => (avg += pixel)));
    avg /= charImg.length * charImg[0].length;
    const bits = new Array(charImg.length);
    for (let i = 0; i < charImg.length; i++) {
        bits[i] = new Array(charImg[0].length);
        for (let j = 0; j < charImg[0].length; j++) {
            bits[i][j] = charImg[i][j] > avg ? 1 : 0;
        }
    }
    return bits;
};

const flatten = (matrix) => [].concat(...matrix);

const matMul = (a, b) => {
    const x = a.length, z = a[0].length, y = b[0].length;
    const product = Array(x).fill(0).map(() => Array(y).fill(0));
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            for (let k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
};

const matAdd = (a, b) => a.map((val, i) => val + b[i]);

const softmax = (vec) => {
    const exps = vec.map(x => Math.exp(x));
    const sumExps = exps.reduce((a, b) => a + b);
    return exps.map(e => e / sumExps);
};

async function solveCaptcha(buffer) {
    const LABEL_TEXT = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    if (!bitmaps || !bitmaps.weights || !bitmaps.biases) {
        throw new Error("bitmaps.js could not be loaded or is missing 'weights' and 'biases'.");
    }

    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const charBlocks = getImageBlocks(pixelData);
    let result = '';

    for (const block of charBlocks) {
        let inputVector = binarizeImage(block);
        inputVector = [flatten(inputVector)];

        let output = matMul(inputVector, bitmaps.weights);
        output = matAdd(output[0], bitmaps.biases);

        const probabilities = softmax(output);
        const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
        result += LABEL_TEXT[maxProbIndex];
    }

    return result;
}

async function getCaptchaType($) {
    return $('input#gResponse').length === 1 ? "GRECAPTCHA" : "DEFAULT";
}

async function getCaptchaImage($, cookies) {
    const imgSrc = $('#captchaBlock img').attr('src');
    if (!imgSrc) throw new Error("Captcha not found!");

    let buffer;
    if (imgSrc.startsWith("data:image")) {
        const base64 = imgSrc.split(",")[1];
        buffer = Buffer.from(base64, "base64");
    } else {
        const res = await client.get(imgSrc, {
            responseType: "arraybuffer",
            headers: { Cookie: cookies.join("; ") },
        });
        buffer = Buffer.from(res.data, "binary");
    }

    return buffer;
}

async function login() {
    const res = await client.get("/vtop/prelogin/setup");
    const cookies = res.headers["set-cookie"];
    const $ = cheerio.load(res.data);

    const csrf = $("#stdForm input[name=_csrf]").val();
    if (!csrf) throw new Error("CSRF token not found");

    await client.post(
        "/vtop/prelogin/setup",
        new URLSearchParams({ _csrf: csrf, flag: "VTOP" }),
        { headers: { Cookie: cookies.join("; "), "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const loginPage = await client.get("/vtop/login", { headers: { Cookie: cookies.join("; ") } });
    const $$ = cheerio.load(loginPage.data);

    const csrfLogin = $$("input[name=_csrf]").val();
    const captchaType = await getCaptchaType($$);
    if (captchaType !== "DEFAULT") throw new Error("GRECAPTCHA not supported");

    const captchaBuffer = await getCaptchaImage($$, cookies);
    const captchaText = await solveCaptcha(captchaBuffer);

    const username = USER;
    const password = PASS;

    const loginRes = await client.post(
        "/vtop/login",
        new URLSearchParams({
            _csrf: csrfLogin,
            username,
            password,
            captchaStr: captchaText,
        }),
        {
            headers: {
                Cookie: cookies.join("; "),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            maxRedirects: 0,
            validateStatus: (s) => s < 400 || s === 302,
        }
    );

    const loginCookies = loginRes.headers["set-cookie"];
    const allCookies = [...(cookies || []), ...(loginCookies || [])].join("; ");

    let dashboardRes;
    if (loginRes.status === 302 && loginRes.headers.location) {
        dashboardRes = await client.get(loginRes.headers.location, {
            headers: { Cookie: allCookies },
        });
    } else {
        dashboardRes = await client.get("/vtop/open/page", {
            headers: { Cookie: allCookies },
        });
    }

    const html = dashboardRes.data.toLowerCase();
    let response = { authorised: false, error_message: null, error_code: 0 };

    if (html.includes("authorizedidx")) {
        response.authorised = true;
    } else if (/invalid\s*captcha/.test(html)) {
        response.error_message = "Invalid Captcha";
        response.error_code = 1;
    } else if (/invalid\s*(user\s*name|login\s*id|user\s*id)\s*\/\s*password/.test(html)) {
        response.error_message = "Invalid Username / Password";
        response.error_code = 2;
    } else if (/account\s*is\s*locked/.test(html)) {
        response.error_message = "Your Account is Locked";
        response.error_code = 3;
    } else if (/maximum\s*fail\s*attempts\s*reached/.test(html)) {
        response.error_message =
            "Maximum login attempts reached, open VTOP in your browser to reset your password";
        response.error_code = 4;
    } else {
        response.error_message = "Unknown error";
        response.error_code = 5;
    }

    console.log("Login result:", response);
    return { cookies: allCookies, dashboardHtml: dashboardRes.data, loginResponse: response };
}

(async () => {
    try {
        const { cookies, dashboardHtml } = await login();
        await fetchdetails(cookies, dashboardHtml);
    } catch (err) {
        console.error(err);
    }
})();

async function fetchdetails(cookies, dashboardHtml) {
    const $ = cheerio.load(dashboardHtml);

    const csrf = $('input[name="_csrf"]').val();
    const authorizedID = $('#authorizedID').val();

    if (!csrf || !authorizedID) throw new Error("Cannot find _csrf or authorizedID");

    const res = await client.post(
        "/vtop/studentsRecord/StudentProfileAllView",
        new URLSearchParams({
            verifyMenu: "true",
            authorizedID,
            _csrf: csrf,
            nocache: Date.now().toString(),
        }).toString(),
        {
            headers: {
                Cookie: cookies,
                "Content-Type": "application/x-www-form-urlencoded",
                Referer: "https://vtopcc.vit.ac.in/vtop/open/page",
            },
        }
    );

    const $profile = cheerio.load(res.data);
    const studentData = {};

    $profile('table tr').each((_, row) => {
        const columns = $profile(row).find('td');
        if (columns.length >= 2) {
            for (let i = 0; i < columns.length; i += 2) {
                let key = $profile(columns[i]).text().trim().split('\n')[0].replace(/:$/, '').trim();
                let value = $profile(columns[i + 1]).text().trim();
                
                if (key && value && key.length < 100) { // Basic sanity check for keys
                    const normalizedKey = key.toLowerCase()
                        .replace(/\s+/g, '_')
                        .replace(/[^a-z0-9_]/g, '');
                    
                    if (normalizedKey) {
                        studentData[normalizedKey] = value;
                    }
                }
            }
        }
    });

    console.log(JSON.stringify(studentData, null, 2));
    await fs.writeFile('profile.json', JSON.stringify(studentData, null, 2));
    console.log("Profile data saved to profile.json");
    return studentData;
}