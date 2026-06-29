# 🛡️ Dynamic Web Security Fuzzer (DAST Automation)

![Playwright](https://img.shields.io/badge/Playwright-Automated_Testing-2EAD33?style=for-the-badge&logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)
![Security](https://img.shields.io/badge/Security-DAST_Fuzzer-FF0000?style=for-the-badge)

An automated **Dynamic Application Security Testing (DAST)** tool built on top of the Playwright framework. 

Unlike traditional end-to-end (E2E) functional tests that rely on strict Page Object Models (POM) and hardcoded locators, this fuzzer utilizes a **Dynamic Auto-Discovery** architecture. It acts as an autonomous scanner that blindly navigates to target URLs, crawls the DOM for any interactive input fields, and automatically injects malicious payloads to detect **Cross-Site Scripting (XSS)** and **SQL Injection (SQLi)** vulnerabilities.

## ✨ Key Features

* **Auto-Discovery Engine:** No hardcoded locators (like `#username` or `#search`). The engine uses advanced CSS pseudo-classes (`:not([type="hidden"])`) to discover all input fields dynamically.
* **UI-Agnostic:** Highly resilient to UI changes. Developers can completely redesign the frontend, change IDs, or add new forms, and the fuzzer will still find and attack them without requiring script updates.
* **Smart Payload Injection:** Differentiates between standard text inputs and password fields to avoid false negatives during SQLi authentication bypass attempts.
* **Automated Vulnerability Assertion:** Flips the traditional QA assertion logic. A "Passed" test means the payload was rejected (Secure), while a "Failed" test explicitly flags a successful injection (Vulnerable).
* **CI/CD Ready:** Runs completely headless via CLI, making it perfectly suited for DevSecOps pipelines (GitHub Actions, GitLab CI) to block vulnerable PRs.

## 🏗️ Architecture Overview

The framework is separated into two main layers:
1. **Data Layer (`payloads.json`):** A dictionary containing an array of standard and advanced payload strings (e.g., `' OR 1=1 --`, `<script>alert(1)</script>`).
2. **Logic Layer (`security-fuzz.spec.ts`):** The Playwright runner that maps over the payloads, crawls the target URLs, injects the strings, and validates the DOM/Browser Dialog responses.

## 🚀 Installation

1. Clone this repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## 🎯 Usage & Configuration

To set your targets, open `tests/security-fuzz.spec.ts` and modify the `TARGET_URLS` array. You can add as many URLs as you need to scan.
   ```Typescript
   const TARGET_URLS = [
    'http://localhost:8000/login.php',   // Example Target 1
    'http://localhost:8000/search.php',  // Example Target 2
    // '[https://staging.your-app.com/contact](https://staging.your-app.com/contact)'
   ];
   ```
