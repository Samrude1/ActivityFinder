# ADR 001: Hosting Platform Selection

## Status
Accepted

## Date
2025-12-15

## Context
We are deploying a Node.js/Express backend and a React frontend. The application uses a PostgreSQL database. We need a hosting platform that balances ease of use (DevOps overhead), cost, and performance for a "Pro-level" production release.

## Options Considered

### 1. Render (Current Choice)
*   **Pros**: 
    *   Excellent Zero-DevOps experience (Git push deploy).
    *   Free tier available (hibernates after inactivity).
    *   Predictable pricing for upgrade ($7/mo per service).
    *   Native support for Node.js.
*   **Cons**:
    *   Free tier has "cold starts" (delay on first request).
    *   Slower build times compared to Railway.

### 2. Railway
*   **Pros**:
    *   Superior developer experience (DX).
    *   Faster builds and deployments.
    *   Granular billing (pay for usage).
*   **Cons**:
    *   No permanent free tier (Trial only).
    *   Costs can be unpredictable if resources leak.

### 3. Fly.io
*   **Pros**:
    *   Running on the edge (global distribution).
    *   Generous free allowance (3 small VMs).
*   **Cons**:
    *   Higher complexity (Docker knowledge often required).
    *   Operational overhead (networking configuration).

### 4. AWS / GCP / Azure
*   **Pros**:
    *   Infinite scalability.
    *   Industry standard for enterprise.
*   **Cons**:
    *   Extreme complexity for this stage.
    *   High risk of "bill shock" (accidental costs).

## Decision
We will use **Render** for the backend and **Vercel** for the frontend.

### Rationale
1.  **Simplicity**: Render acts as a "PaaS" (Platform as a Service) that abstracts away infrastructure management, allowing us to focus on code.
2.  **Cost Efficiency**: We can launch and verify on the Free tier.
3.  **Scalability**: Upgrading to the $7/mo "Starter" plan removes cold starts and provides sufficient resources for thousands of monthly users.
4.  **Database**: We are coupling this with **Neon.tech** for the database, which is the best-in-class serverless PostgreSQL provider, separating data concerns from compute persistence.

## Consequences
*   **Negative**: Initial free tier testing will experience significant latency on the first request (cold start).
*   **Mitigation**: We will clearly document that for a "Pro" experience, the $7/mo upgrade is necessary.
