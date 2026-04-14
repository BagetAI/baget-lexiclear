document.getElementById('waitlist-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('form-feedback');
    const form = document.getElementById('waitlist-form');
    
    try {
        const response = await fetch("https://baget.ai/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                companyId: "052c1371-71e2-4212-831b-24e48639ba58",
                email: email
            })
        });

        if (response.ok) {
            form.classList.add('hidden');
            feedback.classList.remove('hidden');
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error connecting to the server.');
    }
});