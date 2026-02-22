import { auth, db, onAuthStateChanged, collection, query, where, getDocs, addDoc, doc, updateDoc, getDoc } from './firebase.js';

let currentUser = null;
let currentTournamentId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('userInfo').innerText = user.email;
        loadMyMatches();
    } else {
        window.location.href = '/login.html'; // Assuming you have a basic login page
    }
});

// Join System
document.getElementById('verifyCodeBtn').addEventListener('click', async () => {
    const code = document.getElementById('joinCode').value.toUpperCase();
    if(!code) return alert("Enter a code!");

    const q = query(collection(db, "tournaments"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        alert("Invalid or inactive code.");
        return;
    }

    const tourney = snapshot.docs[0];
    const data = tourney.data();

    if (data.joined >= data.totalSlots) {
        alert("Tournament is full!");
        return;
    }

    currentTournamentId = tourney.id;
    document.getElementById('regForm').classList.remove('hidden');
});

document.getElementById('submitRegBtn').addEventListener('click', async () => {
    const gameId = document.getElementById('gameId').value;
    const discordUser = document.getElementById('discordUser').value;

    if(!gameId || !discordUser) return alert("Fill all fields");

    try {
        // Prevent duplicate entry logic here (check if user already in 'registrations' for this tourney)
        
        await addDoc(collection(db, "registrations"), {
            tournamentId: currentTournamentId,
            userId: currentUser.uid,
            gameId,
            discordUser,
            timestamp: new Date()
        });

        // Update slot counter
        const tRef = doc(db, "tournaments", currentTournamentId);
        const tSnap = await getDoc(tRef);
        await updateDoc(tRef, { joined: tSnap.data().joined + 1 });

        alert("Slot Confirmed! Please check Discord for match schedules.");
        document.getElementById('regForm').classList.add('hidden');
        loadMyMatches();
    } catch (e) {
        console.error("Error registering:", e);
    }
});

async function loadMyMatches() {
    // Logic to fetch from 'matches' collection where player1 or player2 == currentUser.uid
    // Display in UI
}
