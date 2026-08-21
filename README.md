# delplanche.cloud — Sovereign Infrastructure Hub

> **Production Master Specification & Technical Dossier**  
> *Absolute data sovereignty, Swiss jurisdiction (FADP), and 100% renewable infrastructure.*  
> **Live System:** [https://delplanche.cloud](https://delplanche.cloud)

---

## 1. Executive Summary & Mission Scope

`delplanche.cloud` is an elite, high-performance, minimalist cloud infrastructure and advisory hub engineered for businesses, creators, and organizations demanding absolute digital autonomy. The platform curates certified European and Swiss infrastructure stacks (powered by Infomaniak) to eliminate reliance on US-based hyperscalers and mitigate legal exposure to extra-territorial legislation, specifically the US Cloud Act.

---

## 2. Technical Architecture & Tech Stack

The application is structured as a modern, high-speed single-page application (SPA) with declarative client-side routing, built to ensure optimal performance, modular scalability, and strict design integrity.

* **Frontend Framework:** React with Vite (Enabling optimized asset bundling and instant Hot Module Replacement)
* **Styling & Layout Engine:** Tailwind CSS (Utility-first styling adhering strictly to custom design tokens)
* **Iconography & Components:** Lucide React vector icons integrated across modular UI components
* **Routing System:** React Router DOM managing multi-route navigation and dynamic state views
* **Hosting & CDN:** Vercel Global Edge Network ensuring low-latency worldwide content delivery
* **DNS & Domain Infrastructure:** Infomaniak DNS Zone Management (`delplanche.cloud`)

---

## 3. Comprehensive Route & Module Breakdown

The application divides its core capabilities across distinct structural routes, fully integrated with live navigation links:

### 3.1 Executive Homepage ([/](https://delplanche.cloud))
* **Hero Header:** Displays live telemetry status (`● SWISS DC ACTIVE (GENEVA)`) alongside primary calls-to-action directing users to curated stacks or onboarding workflows.
* **Interactive Dataflow Schema:** Visually maps out the end-to-end cryptographic and physical transport path:
  `[Client Browser] -> (TLS 1.3 Encryption) -> [Delplanche Edge] -> [Infomaniak DC (Genève)]`.
* **Curated Stacks Grid:** A 3-column architectural showcase breaking down managed webhosting, bare-metal VPS, and enterprise privacy suites.

### 3.2 Technical Specifications & Deep-Dive ([/stack](https://delplanche.cloud/stack))
* **Comparative Matrix:** An analytical breakdown contrasting US Hyperscalers (AWS, Azure, GCP) against the sovereign European/Swiss stack across multiple operational vectors:
  * *Jurisdiction & Law:* US Cloud Act vulnerability vs. Swiss FADP & EU-GDPR absolute immunity.
  * *Datacenter Power:* Mixed/fossil offsets vs. 100% renewable Swiss hydropower.
  * *Cooling & Thermal Efficiency:* Mechanical AC systems vs. 100% natural outside-air cooling achieving a PUE index < 1.1.
  * *Egress Economics:* Punitive, unpredictable bandwidth billing vs. fixed, transparent pricing tiers.
  * *Corporate Structure:* Traded US mega-corporations vs. an independent European family enterprise.

### 3.3 Client Protocol & Turn-Key Onboarding ([/onboarding](https://delplanche.cloud/onboarding))
* Serves as an intake portal for enterprise infrastructure deployment requests.
* Collects organization identifiers, domain names, stack preferences, and existing account statuses to streamline automated queue validation and managed setup within 24 hours.

### 3.4 Security & Compliance Framework ([/security](https://delplanche.cloud/security))
* **Legal Documentation:** Explores the Swiss Federal Act on Data Protection (FADP / DSG) advantages over foreign jurisdictions.
* **ISO Certifications:** Validates standards including ISO 27001 (Information Security), ISO 14001 (Environmental Management), and ISO 50001 (Energy Efficiency).
* **Cryptography & Transport:** Enforces mandatory TLS 1.3 encryption, DNSSEC validation, and HSTS preloading.

### 3.5 Sovereign Direct Contact Hub ([/contact](https://delplanche.cloud/contact))
* **Encrypted Mail Vector:** `cloud@delplanche.cloud`
* **Decentralized Matrix Protocol:** `@jona:delplanche.cloud`
* **Verified PGP Fingerprint Box:** Includes an integrated copy feature for secure, direct communication channels.

### 3.6 Transparency, Privacy & Legal Impressum ([/privacy](https://delplanche.cloud/privacy) & [/legal](https://delplanche.cloud/legal))
* **Zero-Tracking Policy:** Guarantees zero external marketing cookies, trackers, or telemetry pixels.
* **Affiliate Stewardship Disclosures:** Transparently outlines authorized routing links (`/go/*`) that support infrastructure maintenance without altering end-user pricing.

---

## 4. Curated Sovereign Infrastructure Stacks & Authorized Routing Links

| Stack Module | Core Specifications | Authorized Routing Link |
| :--- | :--- | :--- |
| **01. Managed Webhosting & Mail** | 100 GB NVMe Storage, 20 Professional Mailboxes, Unlimited Bandwidth, Free SSL / Let's Encrypt | [Access Hosting Route ↗](https://delplanche.cloud/go/hosting) |
| **02. Cloud VPS & Bare-Metal** | Dedicated Compute Cores, Scalable RAM & NVMe Arrays, Custom Linux / Docker Support | [Access VPS Route ↗](https://delplanche.cloud/go/vps) |
| **03. kSuite & Privacy Storage** | MS365 & Google Workspace alternative, end-to-end encrypted kDrive, kMail, and Swiss Transfer | [Access kSuite Route ↗](https://delplanche.cloud/go/ksuite) |

---

## 5. Local Development & Setup

To clone, configure, and execute this repository locally on your development workstation:

```bash
# 1. Clone the repository from GitHub
git clone <repository-url>

# 2. Navigate into the project root directory
cd <repository-name>

# 3. Install all required project dependencies via npm
npm install

# 4. Initialize the local Vite development server
npm run dev

6. Deployment & CI/CD Pipeline Architecture
 * Continuous Integration: Every code push directed to the main branch initializes an automated compilation cycle via GitHub.
 * Production Delivery: Vercel automatically compiles the application artifacts and distributes them across its global edge node network, ensuring zero-downtime updates for delplanche.cloud.
Engineered for absolute digital autonomy. Hosted under strict European and Swiss jurisdiction.

