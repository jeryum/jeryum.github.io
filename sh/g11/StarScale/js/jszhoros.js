fetch('../js/descAndimg.json')
    .then(response => response.json())
    .then(zodiacData => {
        // Store zodiacData globally
        window.zodiacData = zodiacData;
        
        // Add event listener for date input
        document.getElementById('date').addEventListener('change', function() {
            // Clear previous results when date changes
            clearResults();
        });
        
        // Initial calculation if date is pre-filled
        calculateZodiac();
    })
    .catch(error => {
        console.error('Error loading zodiac data:', error);
        document.getElementById('zodiacDescription').textContent = 'Error loading zodiac data. Please try again later.';
    });

function clearResults() {
    const resultSpan = document.getElementById('result');
    const zodiacImageDiv = document.getElementById('zodiacImage');
    const zodiacDescription = document.getElementById('zodiacDescription');
    
    resultSpan.textContent = '';
    zodiacImageDiv.innerHTML = '';
    zodiacDescription.innerHTML = '';
}

function calculateZodiac() {
    if (!window.zodiacData) {
        console.error('Zodiac data not loaded yet');
        return;
    }
    
    const date = new Date(document.getElementById('date').value);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    
    if (isNaN(date.getTime())) {
        alert('Please select a valid date');
        return;
    }
    
    const resultSpan = document.getElementById('result');
    const zodiacSign = zodiacFinder(month, day);
    
    // Apply gradient text effect
    resultSpan.textContent = zodiacSign;
    resultSpan.style.backgroundImage = 'linear-gradient(to bottom right, #2080AA, #8020AA)';
    resultSpan.style.fontWeight = 'normal';
    resultSpan.style.fontFamily = 'Almendra, serif';
    resultSpan.style.webkitBackgroundClip = 'text';
    resultSpan.style.webkitTextFillColor = 'transparent';
    
    // Display image and description with animation
    displayZodiacInfo(zodiacSign, window.zodiacData);
}

function zodiacFinder(month, day) {
    if ((month === "March" && day >= 21) || (month === "April" && day <= 19)) {
        return "Aries";
    } else if ((month === "April" && day >= 20) || (month === "May" && day <= 20)) {
        return "Taurus";
    } else if ((month === "May" && day >= 21) || (month === "June" && day <= 21)) {
        return "Gemini";
    } else if ((month === "June" && day >= 22) || (month === "July" && day <= 22)) {
        return "Cancer";
    } else if ((month === "July" && day >= 23) || (month === "August" && day <= 22)) {
        return "Leo";
    } else if ((month === "August" && day >= 23) || (month === "September" && day <= 22)) {
        return "Virgo";
    } else if ((month === "September" && day >= 23) || (month === "October" && day <= 23)) {
        return "Libra";
    } else if ((month === "October" && day >= 24) || (month === "November" && day <= 21)) {
        return "Scorpio";
    } else if ((month === "November" && day >= 22) || (month === "December" && day <= 21)) {
        return "Sagittarius";
    } else if ((month === "December" && day >= 22) || (month === "January" && day <= 19)) {
        return "Capricorn";
    } else if ((month === "January" && day >= 20) || (month === "February" && day <= 18)) {
        return "Aquarius";
    } else if ((month === "February" && day >= 19) || (month === "March" && day <= 20)) {
        return "Pisces";
    }
    return "Invalid Birthday";
}

function displayZodiacInfo(zodiacSign, zodiacData) {
    const zodiacImageDiv = document.getElementById('zodiacImage');
    const zodiacDescription = document.getElementById('zodiacDescription');
    
    // Clear previous content with fade effect
    zodiacImageDiv.style.opacity = '0';
    zodiacDescription.style.opacity = '0';
    
    setTimeout(() => {
        zodiacImageDiv.innerHTML = '';
        zodiacDescription.innerHTML = '';
        
        const signData = zodiacData[zodiacSign.toLowerCase()];
        if (signData) {
            // Create and add image
            const img = new Image();
            img.src = signData.image;
            img.alt = zodiacSign;
            img.onload = () => {
                zodiacImageDiv.appendChild(img);
                zodiacImageDiv.style.opacity = '1';
            };
            
            // Add description with fade in
            zodiacDescription.innerHTML = signData.description;
            zodiacDescription.style.opacity = '1';
        } else {
            zodiacDescription.textContent = 'Invalid zodiac sign';
            zodiacDescription.style.opacity = '1';
        }
    }, 300);
}
