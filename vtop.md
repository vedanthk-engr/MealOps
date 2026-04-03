# VTOP Authentication: The Rooting Manual

Integrating the VIT Chennai VTOP authentication system into MealOps was a multi-day journey involving session reverse-engineering, database migrations, and solving platform-specific build failures. This guide documents every hurdle we cleared and the exact steps to maintain the system.

---

## 1. The Architectural Pivot: Automated to Manual

We started by trying to "outsmart" the CAPTCHA:
- **Failed Approaches**: Tesseract OCR was too inaccurate for the noise-heavy VTOP images, and Gemini Vision was too slow for a real-time login flow.
- **The Solution**: Switched to **Manual Solving**. This required a fundamental redesign of the API to handle persistent sessions across two distinct HTTP calls (Request Captcha -> Submit Login).

---

## 2. Stage 1: The First Breakthrough (Network Tracing)

By performing a live browser trace, we discovered that VTOP's login is actually a complex multi-part handshake.

- **Crucial Discovery**: Authentication goes to `/vtop/doLogin`, not `/vtop/login`.
- **Field Mismatch**: VTOP uses `uname` and `passwd` instead of standard `username`/`password`.
- **The AJAX Trick**: The CAPTCHA image is fetched through a separate `/get/new/captcha` endpoint that only works if the `JSESSIONID` cookie is already active.

---

## 3. Stage 2: The "503 Service Unavailable" War

Even with the correct fields, the login was unstable. This was the most difficult struggle:

- **Cookie Purity**: We initially only kept the `JSESSIONID`. However, VTOP uses multiple cookies (like `cookiesession1`) to detect bots. If any of these were missing, the backend received a `503` or redirect to the error page.
- **The Fix**: We updated the backend to return the **full cookie jar** to the frontend. The frontend (Next.js/Flutter) stores these and re-injects them into the final login request, ensuring a perfect "session clone."

---

## 4. Stage 3: The Database & ORM Hurdles (Prisma)

As we moved to production-grade persistence with NeonDB (PostgreSQL):

- **Missing Fields**: We expanded the scraper to collect `programme` and `proctorEmail`, but the `schema.prisma` wasn't updated. This caused the first round of `500 Internal Server Errors`.
- **The ENOENT Ghost**: On Windows, the Prisma generator (`prisma-client-py`) couldn't find its own helper script because it wasn't on the system path. 
  - **The Solution**: Manually overriding the path and using the absolute location of the executable:
    ```powershell
    $env:PATH += ";...\Scripts"; ...\Scripts\prisma generate
    ```

---

## 5. Stage 4: Platform-Specific Build Failures

Finally, as we moved to testing on real hardware (Flutter):

- **The JVM Heap Crisis**: Flutter builds would crash with `Invalid maximum heap size: -Xmx8G`. 
- **The Struggle**: The developer machine was running **32-bit Java**, which literally cannot handle an 8GB request. 
  - **The Fix**: Lowered the `org.gradle.jvmargs` to `-Xmx1024m` in the Android configuration to fit inside the 32-bit memory boundaries.
- **The Key Mismatch**: A final crash occurred because the backend returned the user object as `{"student": ...}` while the Flutter code was looking for `{"user": ...}`.

---

## 6. The Perfect Configuration (Checklist)

To ensure this auth system continues to work, verify these points:

### The Backend (`vtop_auth.py`)
- [x] Must set `X-Requested-With: XMLHttpRequest` for all AJAX fetches.
- [x] Must re-inject the **entire** cookie dictionary from the handshake phase.
- [x] `captchaCheck` field must be forced to uppercase: `.upper()`.

### The Client (Flutter/Web)
- [x] Must capture the `cookies` object from the setup JSON and pass it back to `/vtop-login`.
- [x] Must use the `student` key for parsing the final user profile.

### The Database
- [x] Ensure `schema.prisma` contains `programme` and `proctorEmail`.
- [x] Always run `db push` after changing the datasource from SQLite to Postgres.

*This guide ensures that the "rooting" of VTOP is preserved and understood for future development phases.*
