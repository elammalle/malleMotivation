const SUPABASE_URL = 'https://rlmujswdgcqtxzljmkfw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbXVqc3dkZ2NxdHh6bGpta2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODExMjUsImV4cCI6MjA3NTE1NzEyNX0.-3U9-0a0ARxWrxC4mz4-9UDI-PbFA1IYtHXytShYyS4';

let visitorId = null;

function createFloatingStar() {
    const star = document.createElement('div');
    star.className = 'floating-star';
    const stars = ['⭐', '✨', '🌟', '💫'];
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.left = Math.random() * 100 + '%';
    star.style.fontSize = (20 + Math.random() * 20) + 'px';
    star.style.animationDuration = (4 + Math.random() * 2) + 's';

    document.getElementById('floatingStars').appendChild(star);

    setTimeout(() => {
        star.remove();
    }, 6000);
}

setInterval(createFloatingStar, 1000);

async function getLocationInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            location: `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, ''),
            ip_address: data.ip || 'Unknown'
        };
    } catch (error) {
        console.error('Error fetching location:', error);
        return {
            location: 'Unknown',
            ip_address: 'Unknown'
        };
    }
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let osName = 'Unknown';

    if (ua.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
    } else if (ua.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
    } else if (ua.indexOf('Safari') > -1) {
        browserName = 'Safari';
    } else if (ua.indexOf('Edge') > -1) {
        browserName = 'Edge';
    }

    if (ua.indexOf('Windows') > -1) {
        osName = 'Windows';
    } else if (ua.indexOf('Mac') > -1) {
        osName = 'macOS';
    } else if (ua.indexOf('Linux') > -1) {
        osName = 'Linux';
    } else if (ua.indexOf('Android') > -1) {
        osName = 'Android';
    } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
        osName = 'iOS';
    }

    return {
        device_name: `${browserName} sur ${osName}`,
        user_agent: ua,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language || navigator.userLanguage
    };
}

function generateUsername() {
    const adjectives = ['Rapide', 'Brillant', 'Cosmic', 'Mystique', 'Lumineux', 'Éternel', 'Sage', 'Noble', 'Vaillant', 'Calme'];
    const nouns = ['Étoile', 'Voyageur', 'Explorateur', 'Rêveur', 'Penseur', 'Créateur', 'Aventurier', 'Sage', 'Artiste', 'Visionnaire'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomAdj}${randomNoun}${randomNum}`;
}

async function trackVisitor() {
    try {
        const locationInfo = await getLocationInfo();
        const deviceInfo = getDeviceInfo();
        const username = generateUsername();

        const response = await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                username: username,
                ...locationInfo,
                ...deviceInfo
            })
        });

        const data = await response.json();
        if (data && data.length > 0) {
            visitorId = data[0].id;
            localStorage.setItem('visitorId', visitorId);
            localStorage.setItem('username', username);
            console.log('Visitor tracked:', visitorId, username);
        }
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

async function saveInteraction(action) {
    if (!visitorId) {
        visitorId = localStorage.getItem('visitorId');
    }

    if (!visitorId) {
        console.error('No visitor ID found');
        return;
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/visitors?id=eq.${visitorId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                response: action,
                response_time: new Date().toISOString()
            })
        });

        const data = await response.json();
        console.log('Interaction saved:', data);
    } catch (error) {
        console.error('Error saving interaction:', error);
    }
}

window.addEventListener('load', () => {
    const storedVisitorId = localStorage.getItem('visitorId');
    if (!storedVisitorId) {
        trackVisitor();
    } else {
        visitorId = storedVisitorId;
    }
});

const showMotivationBtn = document.getElementById('showMotivationBtn');
const motivationMessage = document.getElementById('motivationMessage');
const motivationContainer = document.getElementById('motivationContainer');

showMotivationBtn.addEventListener('click', () => {
    motivationContainer.style.display = 'none';
    motivationMessage.style.display = 'block';

    saveInteraction('Message de motivation consulté');

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFloatingStar();
        }, i * 100);
    }

    if (typeof Audio !== 'undefined') {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.frequency.value = 523.25;
            gainNode.gain.value = 0.1;

            oscillator.start();
            setTimeout(() => oscillator.stop(), 200);
        } catch (e) {
            console.log('Audio not available');
        }
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(item);
    });
});
