const DB_ID = "fa103ceb-6a0a-4045-835e-e19ef7e975c1";
const COMPANY_ID = "052c1371-71e2-4212-831b-24e48639ba58";

document.addEventListener('DOMContentLoaded', () => {
    fetchVaultData();
    initWaitlistForm();
});

/**
 * Fetch and display rows from the LegalVault database
 */
async function fetchVaultData() {
    const container = document.getElementById('vault-display');
    
    try {
        const response = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/rows`);
        if (!response.ok) throw new Error('Failed to fetch vault data');
        
        const rows = await response.json();
        
        if (rows && rows.length > 0) {
            container.innerHTML = ''; // Clear loading
            rows.forEach(row => {
                const card = createVaultCard(row.data);
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<div class="loading">No legal summaries available at this time.</div>';
        }
    } catch (error) {
        console.error('Vault Fetch Error:', error);
        container.innerHTML = '<div class="loading">Error loading legal database. Please refresh.</div>';
    }
}

/**
 * Create a DOM element for a database row
 */
function createVaultCard(data) {
    const card = document.createElement('div');
    card.className = 'vault-card';
    
    // Map data fields (service_name, human_summary, risk_score)
    const name = data.service_name || 'Service';
    const summary = data.human_summary || 'Analysis pending.';
    const risk = data.risk_score || 0;
    
    // Determine risk color class
    let riskClass = 'var(--success)';
    let riskLabel = 'Low Risk';
    
    if (risk >= 7) {
        riskClass = 'var(--danger)';
        riskLabel = 'High Risk';
    } else if (risk >= 4) {
        riskClass = 'var(--warning)';
        riskLabel = 'Moderate';
    }

    card.innerHTML = `
        <div class="service">${name}</div>
        <div class="summary">${summary}</div>
        <div class="risk-badge" style="color: ${riskClass}">${riskLabel} (${risk}/10)</div>
    `;
    
    return card;
}

/**
 * Initialize waitlist form submission
 */
function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const feedback = document.getElementById('form-feedback');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const submitBtn = form.querySelector('button');
        
        // UI Feedback
        submitBtn.disabled = true;
        submitBtn.innerText = 'Joining...';

        try {
            const response = await fetch("https://baget.ai/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    companyId: COMPANY_ID,
                    email: email
                })
            });

            if (response.ok) {
                form.classList.add('hidden');
                feedback.classList.remove('hidden');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Waitlist Error:', error);
            alert('Something went wrong. Please try again or contact us directly.');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Join the Waitlist';
        }
    });
}
