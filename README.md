# slap.

> *The reality check you didn't ask for.*

**slap.** is a minimalist, pastel-aesthetic web application that uses Google's Gemini 3 API to analyze your complaints and return a brutally honest assessment of your cognitive biases.

![Project Screenshot](https://slap-two.vercel.app/opengraph-image.png)

## Features

-   **Brutally Honest AI**: Analyzes user input for cognitive biases (e.g., emotional reasoning, catastrophizing) using a "clinical and unsympathetic" persona.
-   **The Three-Part Slap**:
    1.  **Reality Check**: A harsh call-out of your bias.
    2.  **Philosophical Slap**: A quote from realist philosophers like Nietzsche or Cioran.
    3.  **Prescription**: A book recommendation to fix your mindset.
-   **Minimalist Aesthetic**: Clean, pastel design with sharp typography.
-   **Security & Safety**:
    -   **Authentication**: Integrated via Clerk (Google/Email).
    -   **Rate Limiting**: Limited to 5 requests per 24 hours per user via Upstash Redis.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) (`gemini-3-flash-preview`)
-   **Auth**: [Clerk](https://clerk.com/)
-   **Database/Rate Limit**: [Upstash Redis](https://upstash.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

-   Node.js 18+
-   Google Gemini API Key
-   Clerk Publishable/Secret Keys
-   Upstash Redis URL/Token

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adityachauhan0/slap-app.git
    cd slap-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file with the following keys:
    ```bash
    GEMINI_API_KEY=AIzaSy...
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    UPSTASH_REDIS_REST_URL=https://...
    UPSTASH_REDIS_REST_TOKEN=...
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```

## Rate Limiting

To prevent abuse, the API enforces a strict limit of **5 requests per 24 hours** per user using a sliding window algorithm implemented with `@upstash/ratelimit`.

## License

MIT
